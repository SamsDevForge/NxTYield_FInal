import { json } from '../server/apiUtils.js';

export default function handler(req, res) {
  json(res, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    demo_mode: false,
    sensor_api: {
      available: false,
      configured: Boolean(process.env.SENSOR_API_URL),
      url: process.env.SENSOR_API_URL || null,
      message: process.env.SENSOR_API_URL ? 'Sensor API configured.' : 'Set SENSOR_API_URL in Vercel.',
    },
    weather_api: {
      available: false,
      configured: Boolean(process.env.OPENWEATHER_API_KEY),
      provider: 'openweather',
      city: process.env.WEATHER_CITY || 'Pune,IN',
    },
    crop_model_api: {
      available: false,
      configured: Boolean(process.env.CROP_MODEL_API_URL),
      url: process.env.CROP_MODEL_API_URL || null,
    },
    ai: {
      available: Boolean(process.env.GROQ_API_KEY),
      provider: 'groq',
      message: process.env.GROQ_API_KEY ? null : 'Set GROQ_API_KEY in Vercel.',
    },
  });
}
