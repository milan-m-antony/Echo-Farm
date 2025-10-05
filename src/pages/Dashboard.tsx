import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";
import { Search, LogOut, Map } from "lucide-react";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
      
      if (data.length === 0) {
        toast({
          title: "No results",
          description: "Try a different search term.",
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Could not search location.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleLocationSelect = (location: any) => {
    navigate("/map", { state: { location } });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Globe Background */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <RotatingEarth width={window.innerWidth} height={window.innerHeight} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen pointer-events-none">
        {/* Header */}
        <header className="pointer-events-auto sticky top-0 z-50 bg-glass border-b border-glass-border backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">EchoFarm Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground/80">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 pointer-events-auto">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Welcome Card */}
            <Card className="bg-glass border-glass-border backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  Welcome to EchoFarm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-foreground/90">
                  Search for locations to explore agricultural data and insights
                </p>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search for a location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={searching}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={searching}>
                    <Search className="mr-2 h-4 w-4" />
                    {searching ? "Searching..." : "Search"}
                  </Button>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-foreground/80">
                      Search Results:
                    </h3>
                    <div className="space-y-2">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleLocationSelect(result)}
                          className="w-full p-3 text-left rounded-lg bg-background/50 hover:bg-background/80 border border-glass-border transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {result.display_name}
                              </p>
                              <p className="text-xs text-foreground/60 mt-1">
                                Lat: {parseFloat(result.lat).toFixed(4)}, Lon:{" "}
                                {parseFloat(result.lon).toFixed(4)}
                              </p>
                            </div>
                            <Map className="h-5 w-5 text-primary ml-2 flex-shrink-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
