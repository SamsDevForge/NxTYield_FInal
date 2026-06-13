import { json, methodNotAllowed } from '../../server/apiUtils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  const url = process.env.SENSOR_HISTORY_API_URL;
  if (!url) return json(res, 200, []);

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Sensor history API returned ${response.status}`);
    const data = await response.json();
    return json(res, 200, Array.isArray(data) ? data : []);
  } catch {
    return json(res, 200, []);
  }
}
