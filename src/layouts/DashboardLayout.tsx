import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Map, BarChart2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/map", label: "Map View", icon: Map },
    { href: "/analysis", label: "Analysis", icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen flex bg-background text-white">
      <aside className="w-64 bg-glass border-r border-glass-border p-4 flex flex-col">
        <h2 className="text-2xl font-bold text-gradient mb-8">EchoFarm</h2>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link to={item.href} key={item.href}>
              <Button
                variant={location.pathname.startsWith(item.href) ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div>
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
