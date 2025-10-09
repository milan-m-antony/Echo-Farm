# Agricultural Analysis Platform

An AI-powered agricultural analysis platform that provides crop recommendations, weather insights, and farming suggestions based on real-time NASA POWER weather data and location information.

## Features

- 🌍 **Interactive Map**: Search and select any location worldwide
- 🌤️ **Real-time Weather Data**: Integration with NASA POWER API for accurate agricultural weather data
- 🤖 **AI-Powered Analysis**: Smart crop recommendations using Lovable AI Gateway with Gemini
- 📊 **Weather Visualization**: Interactive charts showing temperature, precipitation, humidity, wind speed, and more
- 🌱 **Crop Recommendations**: Detailed agricultural advice including:
  - Best crops for your location and climate
  - Optimal planting seasons
  - Soil and water management strategies
  - Climate adaptation recommendations
  - Crop rotation suggestions
  - Profitability analysis
- 📝 **Smart Summaries**: Generate concise key points from detailed analysis

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Lovable Cloud (Supabase)
- **AI**: Lovable AI Gateway (Google Gemini 2.5 Flash)
- **Maps**: Leaflet & React Leaflet
- **Charts**: Recharts
- **Weather Data**: NASA POWER API
- **Location Search**: Nominatim (OpenStreetMap)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Lovable account (for deployment and AI features)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <project-folder>
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:8080`

## Environment Variables

This project uses Lovable Cloud, which automatically configures the following environment variables:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase publishable key
- `VITE_SUPABASE_PROJECT_ID` - Supabase project ID
- `LOVABLE_API_KEY` - Automatically provisioned for AI features (server-side only)

**Note**: These variables are auto-generated and managed by Lovable Cloud. You don't need to configure them manually.

### Local Development

For local development, the `.env` file is automatically created and populated when you connect to Lovable Cloud. The `LOVABLE_API_KEY` is securely stored as a Supabase secret and only accessible by backend edge functions.

## Usage

1. **Search Location**: Use the search bar on the dashboard to find any location worldwide
2. **View Weather Data**: Navigate to the Analysis page to see detailed weather charts
3. **Get AI Recommendations**: Click "AI Crop Analysis" to receive comprehensive agricultural recommendations
4. **Generate Summary**: Use the "Generate Summary" button to get key points from the detailed analysis

## Project Structure

```
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Main application pages
│   │   ├── Dashboard.tsx # Main dashboard with map
│   │   ├── Analysis.tsx  # Weather data visualization
│   │   └── GeminiAnalysis.tsx # AI-powered recommendations
│   ├── integrations/     # API integrations
│   │   ├── supabase/     # Supabase client (auto-generated)
│   │   └── geminiClient.ts # AI analysis client
│   └── layouts/          # Layout components
├── supabase/
│   └── functions/
│       └── analyze-crop-data/ # Edge function for AI analysis
└── public/              # Static assets
```

## Edge Functions

The project includes a backend edge function that handles AI analysis:

- **analyze-crop-data**: Processes location and weather data, calls the Lovable AI Gateway, and returns comprehensive agricultural recommendations

Edge functions are automatically deployed when you push changes through Lovable.

## API Integrations

### NASA POWER API
Provides historical and real-time weather data for agricultural analysis:
- Temperature (min, max, average)
- Precipitation
- Humidity
- Wind Speed
- Solar Radiation
- Atmospheric Pressure

### Nominatim (OpenStreetMap)
Used for location search and geocoding.

### Lovable AI Gateway
Provides access to Google Gemini 2.5 Flash for generating intelligent crop recommendations without requiring API key configuration.

## Deployment

This project is designed to be deployed on Lovable:

1. Click the "Publish" button in the Lovable editor
2. Your app will be deployed with a custom Lovable URL
3. Optionally connect a custom domain in Project Settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check the [Lovable documentation](https://docs.lovable.dev/)
- Join the [Lovable Discord community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- Contact support through the Lovable platform

## Acknowledgments

- Weather data provided by [NASA POWER](https://power.larc.nasa.gov/)
- Location services by [OpenStreetMap](https://www.openstreetmap.org/)
- AI capabilities powered by Lovable AI Gateway and Google Gemini
