const apiKey = "";

export async function getCropRecommendations(lat: number, lon: number) {
  const prompt = `
  You are an agriculture assistant. Given the location coordinates (latitude: ${lat}, longitude: ${lon}), provide the following crop-related intelligence:
  - Crop Suitability: Which crops grow best at this location.
  - Optimal Planting Time: Best months/dates to plant each crop.
  - Expected Harvest Time: Approximate duration for crops to mature.
  - Yield Estimates: Predicted productivity per hectare/plot.
  - Profitability: Estimated revenue for each crop.
  - Soil & Water Recommendations: How to optimize irrigation/fertilizer.
  - Crop Rotation Suggestions: Best crop sequence for long-term soil health.
  Provide the response in JSON format with keys: cropSuitability, plantingTime, harvestTime, yieldEstimates, profitability, soilWaterRecommendations, cropRotation.
  `;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/distilgpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 512,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data[0]?.generated_text || "No response generated";

    // Parse JSON from the response text
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }
    return { rawText: text };
  } catch (error) {
    console.error("Hugging Face API error:", error);
    throw error;
  }
}
