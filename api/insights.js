import { fetchSensorLatest, json, methodNotAllowed, unavailable } from '../server/apiUtils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  const sensor = await fetchSensorLatest();
  if (sensor?.available === false) {
    return json(res, 200, unavailable('sensor', 'No data from sensors currently.', {
      soil_health: null,
      crop_health: null,
      fertilizer: null,
      recommendation: null,
    }));
  }

  const aiMessage = process.env.GROQ_API_KEY
    ? 'AI insights API not available.'
    : 'AI insights API not available. Set GROQ_API_KEY in Vercel.';

  return json(res, 200, unavailable('groq', aiMessage, {
    soil_health: null,
    crop_health: null,
    fertilizer: null,
    recommendation: null,
  }));
}
