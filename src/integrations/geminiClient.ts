import { supabase } from "./supabase/client";

export async function getCropRecommendations(
  lat: number, 
  lon: number, 
  locationName?: string,
  locationType?: string,
  weatherData?: any
) {
  const { summarize, ...cleanWeatherData } = weatherData || {};
  try {
    const { data, error } = await supabase.functions.invoke('analyze-crop-data', {
      body: {
        location: {
          lat,
          lon,
          name: locationName,
          type: locationType,
        },
        weatherData: cleanWeatherData,
        summarize: summarize || false,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to get crop analysis');
    }

    return data;
  } catch (error) {
    console.error('Crop recommendation error:', error);
    throw error;
  }
}
