import { fetchSensorLatest, json, methodNotAllowed } from '../../server/apiUtils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  return json(res, 200, await fetchSensorLatest());
}
