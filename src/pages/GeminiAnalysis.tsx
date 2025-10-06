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

  useEffect(() => {
    if (!lat || !lon) {
      navigate("/dashboard");
      return;
    }

    const fetchCropData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCropRecommendations(parseFloat(lat), parseFloat(lon));
        setCropData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch crop recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchCropData();
  }, [lat, lon, navigate]);

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
          <Card className="bg-glass border-glass-border backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Crop Suitability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground">
                {cropData.cropSuitability || cropData.rawText || "No data available"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass border-glass-border backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Optimal Planting Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground">
                {cropData.plantingTime || cropData.rawText || "No data available"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass border-glass-border backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Expected Harvest Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground">
                {cropData.harvestTime || cropData.rawText || "No data available"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass border-glass-border backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Yield Estimates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground">
                {cropData.yieldEstimates || cropData.rawText || "No data available"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass border-glass-border backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Profitability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground">
                {cropData.profitability || cropData.rawText || "No data available"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass border-glass-border backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Soil & Water Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground">
                {cropData.soilWaterRecommendations || cropData.rawText || "No data available"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass border-glass-border backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Crop Rotation Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground">
                {cropData.cropRotation || cropData.rawText || "No data available"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GeminiAnalysis;
