import {
  DEFAULT_CROP_MODEL_API_URL,
  json,
  methodNotAllowed,
  normalizeCropPrediction,
  publicErrorMessage,
  readBody,
  unavailable,
} from '../server/apiUtils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const url = process.env.CROP_MODEL_API_URL || DEFAULT_CROP_MODEL_API_URL;
  if (!url) {
    return json(res, 200, unavailable('crop-model', 'Set CROP_MODEL_API_URL in Vercel.', {
      success: false,
      prediction: null,
    }));
  }

  try {
    const body = await readBody(req);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    let payload = {};
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }
    if (!response.ok) throw new Error(payload.detail || payload.error || `Crop model returned ${response.status}`);

    return json(res, 200, {
      available: true,
      success: true,
      provider: 'crop-model',
      weather_used: payload.weather_used,
      prediction: normalizeCropPrediction(payload),
      message: null,
    });
  } catch (error) {
    return json(res, 200, unavailable('crop-model', `Crop model API not available: ${publicErrorMessage(error)}`, {
      success: false,
      prediction: null,
    }));
  }
}
