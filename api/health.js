import { DEFAULT_CROP_MODEL_API_URL, DEFAULT_SENSOR_API_URL, json } from '../server/apiUtils.js';

export default function handler(req, res) {
  const sensorApiUrl = process.env.SENSOR_API_URL || DEFAULT_SENSOR_API_URL;
  const cropModelApiUrl = process.env.CROP_MODEL_API_URL || DEFAULT_CROP_MODEL_API_URL;

  json(res, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    demo_mode: false,
    sensor_api: {
      available: false,
      configured: Boolean(sensorApiUrl),
      using_default: !process.env.SENSOR_API_URL,
      url: sensorApiUrl || null,
      message: process.env.SENSOR_API_URL ? 'Sensor API configured.' : 'Using default Render sensor API.',
    },
    weather_api: {
      available: false,
      configured: Boolean(process.env.OPENWEATHER_API_KEY),
      provider: 'openweather',
      city: process.env.WEATHER_CITY || 'Pune,IN',
    },
    crop_model_api: {
      available: false,
      configured: Boolean(cropModelApiUrl),
      using_default: !process.env.CROP_MODEL_API_URL,
      url: cropModelApiUrl || null,
    },
    ai: {
      available: Boolean(process.env.GROQ_API_KEY),
      provider: 'groq',
      message: process.env.GROQ_API_KEY ? null : 'Set GROQ_API_KEY in Vercel.',
    },
  });
}
