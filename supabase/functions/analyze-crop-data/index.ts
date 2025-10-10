import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, weatherData, summarize, chatMode, analysisContext, messages } = await req.json();
    
    console.log('Received analysis request for:', location);
    
    if (!location || !location.lat || !location.lon) {
      return new Response(
        JSON.stringify({ error: 'Location data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format weather data for analysis
    const weatherSummary = weatherData ? `
Recent Weather Data:
- Average Temperature: ${weatherData.avgTemp || 'N/A'}°C
- Temperature Range: ${weatherData.minTemp || 'N/A'}°C to ${weatherData.maxTemp || 'N/A'}°C
- Precipitation: ${weatherData.totalPrecip || 'N/A'} mm
- Average Humidity: ${weatherData.avgHumidity || 'N/A'}%
- Average Wind Speed: ${weatherData.avgWindSpeed || 'N/A'} m/s
- Solar Radiation: ${weatherData.avgSolar || 'N/A'} MJ/m²/day
- Atmospheric Pressure: ${weatherData.avgPressure || 'N/A'} kPa
` : 'No weather data available';

    let prompt: string = "";
    let chatMessages: any[] = [];

    if (chatMode && messages && messages.length > 0) {
      // Chat mode: answer specific questions based on the analysis context
      const systemPrompt = `You are an expert agricultural advisor helping farmers with their crops. 

Location Context:
- Location: ${location.name || 'Unknown'}
- Coordinates: Latitude ${location.lat}, Longitude ${location.lon}
${weatherSummary}

Previous Analysis:
${analysisContext || 'No previous analysis available'}

Provide clear, concise, and practical answers to the farmer's questions based on this data. Keep responses focused and actionable.`;

      chatMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }))
      ];
    } else if (summarize) {
      prompt = `Summarize the following agricultural analysis into 5-7 key bullet points focusing on: best crops, optimal planting times, critical weather considerations, and top actionable recommendations.

Location: ${location.name || 'Unknown'}
Coordinates: Latitude ${location.lat}, Longitude ${location.lon}

${weatherSummary}

Provide only the key points as bullet points.`;
    } else {
      prompt = `You are an expert agricultural advisor. Analyze the following location and weather data to provide comprehensive farming recommendations.

Location: ${location.name || 'Unknown'}
Coordinates: Latitude ${location.lat}, Longitude ${location.lon}
Region Type: ${location.type || 'Agricultural area'}

${weatherSummary}

Based on this data, provide a detailed analysis in the following format:

1. BEST CROPS FOR THIS LOCATION:
List 3-5 crops that are most suitable for this climate and location, considering temperature, rainfall, and soil conditions typical of this region.

2. CROP-SPECIFIC RECOMMENDATIONS:
For each recommended crop, provide:
- Optimal planting season/months
- Expected growth duration
- Water requirements
- Temperature preferences
- Yield estimates per hectare

3. SOIL AND WATER MANAGEMENT:
- Soil type recommendations
- Irrigation strategy based on rainfall patterns
- Fertilizer suggestions
- Drainage requirements

4. CLIMATE CONSIDERATIONS:
- How current weather conditions affect crop selection
- Seasonal planning advice
- Risk factors (drought, flooding, extreme temperatures)
- Climate adaptation strategies

5. CROP ROTATION SUGGESTIONS:
Provide a multi-season rotation plan to maintain soil health and maximize productivity.

6. PROFITABILITY ANALYSIS:
- Market potential for recommended crops
- Expected revenue per hectare
- Cost considerations
- Best crops for small vs large farms

7. ACTIONABLE FEEDBACK:
- Immediate next steps for farmers
- Long-term planning advice
- Resources needed
- Common mistakes to avoid

Provide practical, region-specific advice that farmers can immediately act upon.`;
    }

    console.log('Calling Lovable AI Gateway with Gemini...');

    // Using Gemini via Lovable AI Gateway (free and reliable)
    const requestBody = chatMode 
      ? {
          model: "google/gemini-2.5-flash",
          messages: chatMessages,
        }
      : {
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "user", content: prompt }
          ],
        };

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'AI analysis failed', 
          details: `Status ${response.status}: ${errorText}` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Received response from Lovable AI Gateway');
    
    const analysisText = data.choices?.[0]?.message?.content || 'No analysis generated';

    return new Response(
      JSON.stringify({
        location: {
          name: location.name,
          coordinates: `${location.lat}, ${location.lon}`,
          type: location.type,
        },
        weatherSummary: weatherData || null,
        analysis: analysisText,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-crop-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
