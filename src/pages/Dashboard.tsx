import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  const handleSearchInput = async (value: string) => {
    setSearchQuery(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setSearching(true);
    setShowSuggestions(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleSearchInput(searchQuery);
  };

  const handleLocationSelect = (location: any) => {
    setShowSuggestions(false);
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
            <Card className="bg-glass-heavy border-glass-border backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl text-center bg-gradient-eco bg-clip-text text-transparent">
                  Welcome to EchoFarm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-foreground/90 text-lg">
                  Search for locations to explore agricultural data and insights
                </p>

                {/* Search Form */}
                <div className="relative">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder="Search for a location..."
                        value={searchQuery}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        onFocus={() => searchResults.length > 0 && setShowSuggestions(true)}
                        disabled={searching}
                        className="flex-1 bg-background/60 backdrop-blur-sm border-glass-border focus:bg-background/80 transition-all"
                      />
                      {searching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <Button type="submit" disabled={searching} className="bg-gradient-eco hover:opacity-90">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </form>

                  {/* Auto-suggest Dropdown */}
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
