import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Map, BarChart2, LogOut, Sparkles, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

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
      {/* Sidebar */}
      <aside className="w-64 bg-glass-heavy backdrop-blur-xl border-r border-glass-border flex flex-col">
        {/* Logo and Theme Toggle */}
        <div className="p-6 border-b border-glass-border">
          <div className="flex items-center justify-between mb-2">
            <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Leaf className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-gradient">EchoFarm</h2>
            </Link>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground truncate">
              {user?.email}
            </p>
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link to={item.href} key={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive 
                      ? "bg-gradient-eco text-white hover:opacity-90" 
                      : "hover:bg-glass"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
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
            className="w-full justify-start border-glass-border hover:bg-destructive hover:text-destructive-foreground" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
