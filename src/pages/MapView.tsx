import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mapLocation, setMapLocation] = useState<any>(null);

  useEffect(() => {
    if (location.state?.location) {
      setMapLocation(location.state.location);
    } else {
      navigate("/dashboard");
    }
  }, [location, navigate]);

  if (!mapLocation) {
    return null;
  }

  const lat = parseFloat(mapLocation.lat);
  const lon = parseFloat(mapLocation.lon);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-glass border-b border-glass-border backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold text-foreground">Location Map</h1>
        </div>
      </header>

      {/* Map Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="h-[600px]">
                <MapContainer
                  center={[lat, lon]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
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

          {/* Location Info */}
          <div>
            <Card className="bg-glass border-glass-border backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground/60 mb-1">
                    Location
                  </h3>
                  <p className="text-sm">{mapLocation.display_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground/60 mb-1">
                    Coordinates
                  </h3>
                  <p className="text-sm">
                    Latitude: {lat.toFixed(6)}
                    <br />
                    Longitude: {lon.toFixed(6)}
                  </p>
                </div>
                {mapLocation.type && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/60 mb-1">
                      Type
                    </h3>
                    <p className="text-sm capitalize">{mapLocation.type}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
