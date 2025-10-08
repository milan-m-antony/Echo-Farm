import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Thermometer, CloudRain, Droplets, Wind, Sun, TrendingUp, Sparkles } from "lucide-react";
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
      date: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      value: paramData[date]
    }));
  };
  const renderChart = (param: string, title: string, color: string, icon: React.ReactNode) => <Card className="bg-glass border-glass-border backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">
          {getLatestValue(param)}
        </div>
        <div className="h-[100px] sm:h-[120px]">
          <ChartContainer config={{}} className="h-full w-full">
            <AreaChart data={getChartData(param)} margin={{
            top: 5,
            right: 10,
            left: -20,
            bottom: 0
          }}>
              <defs>
                <linearGradient id={`color-${param}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
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
    </Card>;
  const getLatestValue = (param: string) => {
    const chartData = getChartData(param);
    if (chartData.length === 0) return "N/A";
    const latestValue = chartData[chartData.length - 1].value;
    switch (param) {
      case 'T2M':
        return `${latestValue.toFixed(1)}°C`;
      case 'PRECTOT':
        return `${latestValue.toFixed(2)} mm/day`;
      case 'RH2M':
        return `${latestValue.toFixed(1)}%`;
      case 'WS10M':
        return `${latestValue.toFixed(2)} m/s`;
      case 'ALLSKY_SFC_SW_DWN':
        return `${latestValue.toFixed(0)} W/m²`;
      case 'PS':
        return `${latestValue.toFixed(0)} Pa`;
      case 'T2MDEW':
        return `${latestValue.toFixed(1)}°C`;
      case 'SOILM0_10':
        return `${latestValue.toFixed(3)} kg/m²`;
      case 'SOILM10_40':
        return `${latestValue.toFixed(3)} kg/m²`;
      case 'RHMAX':
        return `${latestValue.toFixed(1)}%`;
      case 'RHMIN':
        return `${latestValue.toFixed(1)}%`;
      case 'T2M_MAX':
        return `${latestValue.toFixed(1)}°C`;
      case 'T2M_MIN':
        return `${latestValue.toFixed(1)}°C`;
      default:
        return latestValue;
    }
  };
  if (!mapLocation || !weatherData) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading data or direct access not allowed...</p></div>;
  }

  // Calculate weather summary for AI analysis
  const calculateWeatherSummary = () => {
    const params = weatherData?.properties?.parameter;
    if (!params) return null;

    const calculateAvg = (paramKey: string) => {
      const data = params[paramKey];
      if (!data) return null;
      const values = Object.values(data) as number[];
      return values.reduce((a, b) => a + b, 0) / values.length;
    };

    const calculateSum = (paramKey: string) => {
      const data = params[paramKey];
      if (!data) return null;
      const values = Object.values(data) as number[];
      return values.reduce((a, b) => a + b, 0);
    };

    const calculateMin = (paramKey: string) => {
      const data = params[paramKey];
      if (!data) return null;
      const values = Object.values(data) as number[];
      return Math.min(...values);
    };

    const calculateMax = (paramKey: string) => {
      const data = params[paramKey];
      if (!data) return null;
      const values = Object.values(data) as number[];
      return Math.max(...values);
    };

    return {
      avgTemp: calculateAvg('T2M'),
      minTemp: calculateMin('T2M_MIN'),
      maxTemp: calculateMax('T2M_MAX'),
      totalPrecip: calculateSum('PRECTOTCORR') || calculateSum('PRECTOT'),
      avgHumidity: calculateAvg('RH2M'),
      avgWindSpeed: calculateAvg('WS10M'),
      avgSolar: calculateAvg('ALLSKY_SFC_SW_DWN'),
      avgPressure: calculateAvg('PS'),
    };
  };

  const handleAIAnalysis = () => {
    const weatherSummary = calculateWeatherSummary();
    navigate('/gemini-analysis', {
      state: {
        location: {
          lat: mapLocation.lat,
          lon: mapLocation.lon,
          name: mapLocation.display_name,
          type: mapLocation.type || 'agricultural',
        },
        weatherData: weatherSummary,
      },
    });
  };
  return <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Analysis Dashboard</h1>
                <p className="text-sm sm:text-base text-foreground/80">{mapLocation.display_name}</p>
            </div>
            <Button 
              onClick={handleAIAnalysis}
              className="bg-gradient-eco hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Crop Analysis
            </Button>
        </header>

        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
    </div>;
};
export default Analysis;