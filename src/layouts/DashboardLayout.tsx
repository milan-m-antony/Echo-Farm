import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Map, BarChart2, LogOut, Sparkles, Leaf, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMenuButton, setShowMenuButton] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowMenuButton(true);
      } else if (currentScrollY < 10) {
        setShowMenuButton(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/map", label: "Map View", icon: Map },
    { href: "/analysis", label: "Analysis", icon: BarChart2 },
    { href: "/gemini-analysis", label: "AI Analysis", icon: Sparkles },
  ];

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Mobile Menu Button - Fixed position outside sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`
          fixed top-4 right-4 z-50 lg:hidden p-2 rounded-lg 
          bg-glass-heavy backdrop-blur-xl border border-glass-border 
          hover:bg-glass transition-all duration-300 hover:scale-110 shadow-lg
          ${showMenuButton ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-glass-heavy backdrop-blur-xl border-r border-glass-border 
          flex flex-col transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo and Theme Toggle */}
        <div className="p-6 border-b border-glass-border">
          <div className="flex items-center justify-between mb-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 hover:scale-105"
              onClick={() => setSidebarOpen(false)}
            >
              <Leaf className="w-6 h-6 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold text-gradient">EchoFarm</h2>
            </Link>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground truncate max-w-[140px]">
              {user?.email}
            </p>
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link to={item.href} key={item.href} onClick={() => setSidebarOpen(false)}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`
                    w-full justify-start transition-all duration-300
                    ${isActive
                      ? "bg-gradient-eco text-white shadow-lg scale-105"
                      : "hover:bg-glass hover:scale-105 hover:translate-x-1"
                    }
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-glass-border">
          <Button
            variant="outline"
            className="w-full justify-start border-glass-border hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 hover:scale-105"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full lg:ml-0">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
