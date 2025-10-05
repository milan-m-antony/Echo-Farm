import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";
import { Search, LogOut, Map, Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useDebounce } from "@/hooks/use-debounce";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const searchLocations = async () => {
      setSearching(true);
      setShowSuggestions(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedSearchQuery
          )}&limit=5`
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

    searchLocations();
  }, [debouncedSearchQuery, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  const handleLocationSelect = (location: any) => {
    setShowSuggestions(false);
    navigate("/map", { state: { location } });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <RotatingEarth width={window.innerWidth} height={window.innerHeight} />
      </div>

      <div className="relative z-10 min-h-screen pointer-events-none">
        <header className="pointer-events-auto sticky top-0 z-50 bg-glass border-b border-glass-border backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              EchoFarm Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground/80">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 pointer-events-auto">
          <div className="max-w-2xl mx-auto space-y-8 mt-20">
            <Card className="bg-glass-heavy border-glass-border backdrop-blur-xl shadow-2xl">
              <CardContent className="space-y-6 pt-6">
                <p className="text-center text-foreground/90 text-lg">
                  Search for locations to explore agricultural data and insights
                </p>

                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                    <Input
                      type="text"
                      placeholder="Search for a city, country, or region..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() =>
                        searchResults.length > 0 && setShowSuggestions(true)
                      }
                      className="pl-10 flex-1 bg-background/60 backdrop-blur-sm border-glass-border focus:bg-background/80 transition-all"
                    />
                    {searching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      </div>
                    )}
                  </div>

                  {showSuggestions && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-lg shadow-2xl overflow-hidden">
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <button
                            key={index}
                            onClick={() => handleLocationSelect(result)}
                            className="w-full p-4 text-left hover:bg-background/40 border-b border-glass-border/50 last:border-b-0 transition-all group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-2">
                                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                  {result.display_name}
                                </p>
                                <p className="text-xs text-foreground/60 mt-1">
                                  Lat: {parseFloat(result.lat).toFixed(4)}, Lon:{" "}
                                  {parseFloat(result.lon).toFixed(4)}
                                </p>
                              </div>
                              <Map className="h-5 w-5 text-primary ml-2 flex-shrink-0 group-hover:scale-110 transition-transform" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
