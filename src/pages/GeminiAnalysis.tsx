import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { getCropRecommendations } from "@/integrations/geminiClient";
import { Progress } from "@/components/ui/progress";

const GeminiAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cropData, setCropData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("Initializing analysis...");
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const lat = location.state?.location?.lat;
  const lon = location.state?.location?.lon;
  const locationName = location.state?.location?.name;
  const locationType = location.state?.location?.type;
  const weatherData = location.state?.weatherData;

  useEffect(() => {
    const fetchCropData = async () => {
      if (!lat || !lon) {
        navigate('/dashboard');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setProgress(10);
        setLoadingStep("Gathering location data...");
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(30);
        setLoadingStep("Analyzing weather patterns...");
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(50);
        setLoadingStep("Processing agricultural data...");
        
        const data = await getCropRecommendations(
          parseFloat(lat),
          parseFloat(lon),
          locationName,
          locationType,
          weatherData
        );
        
        setProgress(80);
        setLoadingStep("Generating recommendations...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCropData(data);
        setProgress(100);
        setLoadingStep("Complete!");
      } catch (err) {
        console.error('Error fetching crop recommendations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchCropData();
  }, [lat, lon, locationName, locationType, weatherData, navigate]);

  const handleSummarize = async () => {
    if (!cropData?.analysis) return;
    
    try {
      setSummarizing(true);
      const summaryData = await getCropRecommendations(
        parseFloat(lat),
        parseFloat(lon),
        locationName,
        locationType,
        { ...weatherData, summarize: true }
      );
      setSummary(summaryData.analysis);
    } catch (err) {
      console.error('Error generating summary:', err);
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Analyzing Agricultural Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{loadingStep}</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${progress >= 30 ? 'bg-primary' : 'bg-muted'}`} />
                <span>Collecting weather data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${progress >= 50 ? 'bg-primary' : 'bg-muted'}`} />
                <span>Processing location information</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${progress >= 80 ? 'bg-primary' : 'bg-muted'}`} />
                <span>Generating AI recommendations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4 w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lat || !lon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Location data is missing or invalid.</p>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              AI-Powered Agricultural Analysis
            </h1>
          </div>
          <Button 
            onClick={handleSummarize} 
            disabled={summarizing || !cropData?.analysis}
            variant="secondary"
          >
            {summarizing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Summarizing...
              </>
            ) : (
              "Generate Summary"
            )}
          </Button>
        </div>

        {cropData?.location && (
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {cropData.location.name || 'Unknown'}</p>
                <p><strong>Coordinates:</strong> {cropData.location.coordinates}</p>
                <p><strong>Type:</strong> {cropData.location.type || 'Agricultural area'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {cropData?.weatherSummary && (
          <Card>
            <CardHeader>
              <CardTitle>Weather Data Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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

        {summary && (
          <Card className="border-primary/50 bg-primary/5 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Key Points Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {summary}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Detailed Agricultural Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {cropData?.analysis || "No analysis available"}
            </div>
            {cropData?.timestamp && (
              <p className="text-sm text-muted-foreground mt-4">
                Generated: {new Date(cropData.timestamp).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeminiAnalysis;
