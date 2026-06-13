# NxTYield Frontend

React/Vite dashboard for NxTYield with same-origin Vercel API functions.

## Local Development

```bash
npm install
npm run dev
```

For local development, Vite can still proxy `/api` to the FastAPI backend from `vite.config.js`.

## Deploy On Vercel

1. Import this `final_ui` folder as the Vercel project root.
2. Use the default build command: `npm run build`.
3. Use the output directory: `dist`.
4. Add these Vercel Environment Variables:

```bash
SENSOR_API_URL=https://your-sensor-api.example.com/sensor-data
SENSOR_HISTORY_API_URL=
CROP_MODEL_API_URL=https://your-crop-model-api.example.com/predict
OPENWEATHER_API_KEY=your-openweather-key
WEATHER_CITY=Pune,IN
GROQ_API_KEY=your-groq-key
GROQ_MODEL=llama-3.3-70b-versatile
```

Do not set `VITE_API_BASE_URL` on Vercel unless you intentionally want the browser to call a different backend. The app uses same-origin `/api/*` Vercel functions by default.

## API Behavior

The Vercel API functions never fabricate sensor, weather, crop, or AI results. If an upstream API is missing or unavailable, they return `available: false` and the UI displays an API unavailable state.
