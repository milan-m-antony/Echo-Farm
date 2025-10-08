import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getCropRecommendations } from "@/integrations/geminiClient";

const GeminiAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cropData, setCropData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lat = location.state?.location?.lat;
  const lon = location.state?.location?.lon;
  const locationName = location.state?.location?.name;
  const locationType = location.state?.location?.type;
  const weatherData = location.state?.weatherData;

  useEffect(() => {
    if (!lat || !lon) {
      navigate("/dashboard");
      return;
    }

    const fetchCropData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCropRecommendations(
          parseFloat(lat), 
          parseFloat(lon),
          locationName,
          locationType,
          weatherData
        );
        setCropData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch crop recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchCropData();
  }, [lat, lon, locationName, locationType, weatherData, navigate]);

  if (!lat || !lon) {
    return <div className="min-h-screen flex items-center justify-center">Invalid location data.</div>;
  }

  return (
    <div className="min-h-screen bg-background text-white p-6">
      <header className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Gemini Crop Recommendations</h1>
      </header>

      {loading && <p>Loading crop recommendations...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {cropData && (
        <div className="space-y-6">
          {/* Location Info */}
          {cropData.location && (
            <Card className="bg-glass border-glass-border backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-foreground">
                  <p><strong>Name:</strong> {cropData.location.name || 'Unknown'}</p>
                  <p><strong>Coordinates:</strong> {cropData.location.coordinates}</p>
                  <p><strong>Type:</strong> {cropData.location.type || 'Agricultural area'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weather Summary */}
          {cropData.weatherSummary && (
            <Card className="bg-glass border-glass-border backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Weather Data Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-foreground">
                  <div>
                    <p className="text-muted-foreground">Avg Temperature</p>
                    <p className="font-semibold">{cropData.weatherSummary.avgTemp?.toFixed(1) || 'N/A'}°C</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Precipitation</p>
                    <p className="font-semibold">{cropData.weatherSummary.totalPrecip?.toFixed(1) || 'N/A'} mm</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Humidity</p>
                    <p className="font-semibold">{cropData.weatherSummary.avgHumidity?.toFixed(1) || 'N/A'}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Wind Speed</p>
                    <p className="font-semibold">{cropData.weatherSummary.avgWindSpeed?.toFixed(1) || 'N/A'} m/s</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Solar Radiation</p>
                    <p className="font-semibold">{cropData.weatherSummary.avgSolar?.toFixed(1) || 'N/A'} MJ/m²/day</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pressure</p>
                    <p className="font-semibold">{cropData.weatherSummary.avgPressure?.toFixed(1) || 'N/A'} kPa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis */}
          <Card className="bg-glass border-glass-border backdrop-blur-xl">
            <CardHeader>
              <CardTitle>AI-Powered Agricultural Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none text-foreground">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {cropData.analysis || "No analysis available"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamp */}
          {cropData.timestamp && (
            <p className="text-xs text-muted-foreground text-center">
              Analysis generated at {new Date(cropData.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GeminiAnalysis;
