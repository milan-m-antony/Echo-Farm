import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Thermometer, CloudRain, Droplets, Wind, Sun, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mapLocation, setMapLocation] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    console.log("Analysis page location state:", location.state);
    if (location.state?.location && location.state?.weatherData) {
      setMapLocation(location.state.location);
      setWeatherData(location.state.weatherData);
      console.log("Set mapLocation:", location.state.location);
      console.log("Set weatherData:", location.state.weatherData);
    } else {
      console.log("No location or weatherData in state, redirecting to dashboard");
      // navigate("/dashboard");
    }
  }, [location, navigate]);

  const getChartData = (param: string) => {
    if (!weatherData?.properties?.parameter?.[param]) return [];
    const paramData = weatherData.properties.parameter[param];
    return Object.keys(paramData).map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: paramData[date],
    }));
  };

  const renderChart = (param: string, title: string, color: string, icon: React.ReactNode) => (
    <Card className="bg-glass border-glass-border backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {getLatestValue(param)}
        </div>
        <div className="h-[120px]">
          <ChartContainer config={{}} className="h-full w-full">
            <AreaChart data={getChartData(param)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-${param}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill={`url(#color-${param})`} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );

  const getLatestValue = (param: string) => {
    const chartData = getChartData(param);
    if (chartData.length === 0) return "N/A";
    const latestValue = chartData[chartData.length - 1].value;
    switch(param) {
      case 'T2M': return `${latestValue.toFixed(1)}°C`;
      case 'PRECTOT': return `${latestValue.toFixed(2)} mm/day`;
      case 'RH2M': return `${latestValue.toFixed(1)}%`;
      case 'WS10M': return `${latestValue.toFixed(2)} m/s`;
      case 'ALLSKY_SFC_SW_DWN': return `${latestValue.toFixed(0)} W/m²`;
      case 'PS': return `${latestValue.toFixed(0)} Pa`;
      case 'T2MDEW': return `${latestValue.toFixed(1)}°C`;
      case 'SOILM0_10': return `${latestValue.toFixed(3)} kg/m²`;
      case 'SOILM10_40': return `${latestValue.toFixed(3)} kg/m²`;
      case 'RHMAX': return `${latestValue.toFixed(1)}%`;
      case 'RHMIN': return `${latestValue.toFixed(1)}%`;
      case 'T2M_MAX': return `${latestValue.toFixed(1)}°C`;
      case 'T2M_MIN': return `${latestValue.toFixed(1)}°C`;
      default: return latestValue;
    }
  };

  if (!mapLocation || !weatherData) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading data or direct access not allowed...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-glass border-r border-glass-border p-4 space-y-4">
        <h2 className="text-2xl font-bold text-gradient">EchoFarm</h2>
        <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard")}>Dashboard</Button>
            <Button variant="secondary" className="w-full justify-start">Analysis</Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/gemini-analysis", { state: { location: mapLocation } })}>Gemini Analysis</Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <header className="mb-6 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Analysis Dashboard</h1>
                <p className="text-foreground/80">{mapLocation.display_name}</p>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Map
            </Button>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderChart("T2M", "Temperature", "#FF5733", <Thermometer className="h-4 w-4 text-muted-foreground" />)}
            {renderChart("PRECTOT", "Precipitation", "#33A7FF", <CloudRain className="h-4 w-4 text-muted-foreground" />)}
            {renderChart("RH2M", "Relative Humidity", "#33FFF3", <Droplets className="h-4 w-4 text-muted-foreground" />)}
            {renderChart("WS10M", "Wind Speed", "#B233FF", <Wind className="h-4 w-4 text-muted-foreground" />)}
            {renderChart("ALLSKY_SFC_SW_DWN", "Solar Radiation", "#FFD700", <Sun className="h-4 w-4 text-muted-foreground" />)}
            {renderChart("PS", "Surface Pressure", "#4682B4", <Wind className="h-4 w-4 text-muted-foreground" />)}
            {renderChart("T2MDEW", "Dew Point Temperature", "#00CED1", <Thermometer className="h-4 w-4 text-muted-foreground" />)}
            {renderChart("RH_MAX", "Max Humidity", "#00CED1", <Droplets className="h-4 w-4 text-muted-foreground" />)}
            {renderChart("RH_MIN", "Min Humidity", "#20B2AA", <Droplets className="h-4 w-4 text-muted-foreground" />)}
            {renderChart("T2M_MAX", "Max Temperature", "#FF4500", <Thermometer className="h-4 w-4 text-muted-foreground" />)}
            {renderChart("T2M_MIN", "Min Temperature", "#FF6347", <Thermometer className="h-4 w-4 text-muted-foreground" />)}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analysis;
