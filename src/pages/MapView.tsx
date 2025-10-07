import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
const MapView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  useEffect(() => {
    if (location.state?.location) {
      setMapLocation(location.state.location);
    } else {
      navigate("/dashboard");
    }
  }, [location, navigate]);
  const validAGParameters = ["T2M", "T2M_MAX", "T2M_MIN", "PRECTOT", "RH2M", "WS10M", "ALLSKY_SFC_SW_DWN", "PS", "T2MDEW"];
  async function fetchAGWeatherData(lat: number, lon: number, startDate: string, endDate: string) {
    try {
      const params = validAGParameters.join(",");
      const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${params}&start=${startDate}&end=${endDate}&latitude=${lat}&longitude=${lon}&community=AG&format=JSON`;
      console.log("Fetching NASA POWER API data from URL:", url);
      const res = await fetch(url);
      console.log("Fetch response status:", res.status);
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`NASA API error: ${res.status} - ${errorText}`);
        throw new Error(`NASA API error: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      console.log("Received data from NASA POWER API:", data);
      if (!data.properties || !data.properties.parameter) {
        throw new Error("Invalid data returned from NASA POWER API");
      }
      return data.properties.parameter;
    } catch (err: any) {
      console.error("Failed to fetch weather data:", err.message);
      return null;
    }
  }
  const handleExplore = async () => {
    if (!mapLocation) return;
    setLoadingWeather(true);
    try {
      const lat = parseFloat(mapLocation.lat);
      const lon = parseFloat(mapLocation.lon);
      const startDate = "20230101";
      const endDate = "20230107";
      const parameters = await fetchAGWeatherData(lat, lon, startDate, endDate);
      if (!parameters) {
        throw new Error("No weather data received");
      }
      const weatherData = {
        properties: {
          parameter: parameters
        }
      };
      navigate("/analysis", {
        state: {
          location: mapLocation,
          weatherData
        }
      });
    } catch (error) {
      console.error("Failed to fetch weather data", error);
      toast({
        title: "Data Fetch Failed",
        description: `Unable to retrieve weather data: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoadingWeather(false);
    }
  };
  if (!mapLocation) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  const lat = parseFloat(mapLocation.lat);
  const lon = parseFloat(mapLocation.lon);
  return <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-glass border-b border-glass-border backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          
          <h1 className="text-xl font-bold text-foreground">Location Details</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden bg-glass border-glass-border backdrop-blur-xl">
              <div className="h-[600px]">
                <MapContainer center={[lat, lon]} zoom={13} scrollWheelZoom={false} style={{
                height: "100%",
                width: "100%",
                backgroundColor: "transparent"
              }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[lat, lon]} icon={icon}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{mapLocation.display_name}</p>
                        <p className="text-xs mt-1">
                          {lat.toFixed(4)}, {lon.toFixed(4)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-glass border-glass-border backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground/60 mb-1">Location</h3>
                  <p className="text-sm">{mapLocation.display_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground/60 mb-1">Coordinates</h3>
                  <p className="text-sm">
                    Latitude: {lat.toFixed(6)}
                    <br />
                    Longitude: {lon.toFixed(6)}
                  </p>
                </div>
                {mapLocation.type && <div>
                    <h3 className="text-sm font-semibold text-foreground/60 mb-1">Type</h3>
                    <p className="text-sm capitalize">{mapLocation.type}</p>
                  </div>}
                <Button className="w-full mt-4" onClick={handleExplore} disabled={loadingWeather}>
                  {loadingWeather ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Explore Data"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default MapView;