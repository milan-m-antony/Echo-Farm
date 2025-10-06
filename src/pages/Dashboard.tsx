import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, Loader2, Map } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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

  const handleLocationSelect = (location: any) => {
    setShowSuggestions(false);
    navigate("/map", { state: { location } });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-background/80">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <span className="text-gradient">EchoFarm</span>
          </h1>
          <p className="text-foreground/80 text-lg">
            Search for locations to explore agricultural data, weather patterns, and sustainable farming insights
          </p>
        </div>

        {/* Search Card */}
        <Card className="bg-glass-heavy border-glass-border backdrop-blur-xl shadow-2xl">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Location Search</h2>
              </div>
              <p className="text-foreground/80 mb-6">
                Enter a city, country, or region to get started
              </p>

              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                  <Input
                    type="text"
                    placeholder="Search for a city, country, or region..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() =>
                      searchResults.length > 0 && setShowSuggestions(true)
                    }
                    className="pl-12 pr-12 h-14 text-lg bg-background/60 backdrop-blur-sm border-glass-border focus:bg-background/80 transition-all"
                  />
                  {searching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  )}
                </div>

                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-lg shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
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
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-2xl p-6 hover:bg-glass transition-all hover:scale-105">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-foreground/80">Global Locations</div>
          </div>
          <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-2xl p-6 hover:bg-glass transition-all hover:scale-105">
            <div className="text-3xl font-bold text-primary mb-2">Real-time</div>
            <div className="text-foreground/80">Weather Data</div>
          </div>
          <div className="bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-2xl p-6 hover:bg-glass transition-all hover:scale-105">
            <div className="text-3xl font-bold text-primary mb-2">AI-Powered</div>
            <div className="text-foreground/80">Crop Analysis</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
