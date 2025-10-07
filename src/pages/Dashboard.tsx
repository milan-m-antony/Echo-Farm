import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, Loader2, Map } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Background Globe - Centered after sidebar */}
      <div className="fixed inset-0 z-0 pointer-events-auto lg:left-64 transition-all duration-300">
        <RotatingEarth 
          width={typeof window !== 'undefined' ? window.innerWidth : 1920} 
          height={typeof window !== 'undefined' ? window.innerHeight : 1080}
          className="w-full h-full"
        />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 pointer-events-none min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full pointer-events-auto animate-fade-in">
          {/* Welcome Card with Search */}
          <Card className="bg-glass-heavy backdrop-blur-xl border border-glass-border shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-[1.02]">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2 animate-fade-in">
                <h1 className="text-3xl sm:text-4xl font-bold transition-all duration-300 hover:scale-105">
                  Welcome to <span className="text-gradient">EchoFarm</span>
                </h1>
                <p className="text-foreground/80 text-base sm:text-lg">
                  Search for locations to explore agricultural data and insights
                </p>
              </div>

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
                    className="pl-12 pr-12 h-12 sm:h-14 text-base sm:text-lg bg-background/60 backdrop-blur-sm border-glass-border focus:bg-background/80 transition-all duration-300 hover:border-primary/50 focus:scale-[1.02]"
                  />
                  {searching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  )}
                </div>

                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-glass-heavy backdrop-blur-xl border border-glass-border rounded-lg shadow-2xl overflow-hidden max-h-80 overflow-y-auto animate-fade-in">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSelect(result)}
                        className="w-full p-3 sm:p-4 text-left hover:bg-background/40 border-b border-glass-border/50 last:border-b-0 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
