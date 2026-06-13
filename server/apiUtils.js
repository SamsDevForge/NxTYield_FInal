export function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export function methodNotAllowed(res, methods) {
  res.setHeader('Allow', methods.join(', '));
  json(res, 405, { available: false, message: `Use ${methods.join(' or ')}` });
}

export function publicErrorMessage(error, secrets = []) {
  let message = error?.message || String(error || 'Unknown error');
  secrets.filter(Boolean).forEach((secret) => {
    message = message.replaceAll(secret, '[redacted]');
  });
  return message;
}

export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export function unavailable(provider, message, extra = {}) {
  return {
    available: false,
    provider,
    message,
    ...extra,
  };
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function toBoolean(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return Boolean(value);
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n', 'off'].includes(normalized)) return false;
  return null;
}

function hasMeaningfulSensorValues(reading) {
  return [
    'nitrogen',
    'phosphorus',
    'potassium',
    'moisture',
    'ph',
    'soil_temperature',
    'air_temperature',
    'humidity',
    'pressure',
    'health_score',
  ].some((key) => {
    const value = toNumber(reading[key]);
    return value !== null && value !== 0;
  }) || reading.rain_detected === true || reading.irrigation_active === true;
}

export function normalizeSensorPayload(payload) {
  const data = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
  const reading = {
    nitrogen: toNumber(data?.nitrogen ?? data?.N),
    phosphorus: toNumber(data?.phosphorus ?? data?.P),
    potassium: toNumber(data?.potassium ?? data?.K),
    moisture: toNumber(data?.moisture ?? data?.soil_moisture),
    ph: toNumber(data?.ph ?? data?.pH),
    soil_temperature: toNumber(data?.soil_temperature ?? data?.soilTemperature),
    air_temperature: toNumber(data?.air_temperature ?? data?.airTemperature ?? data?.temperature),
    humidity: toNumber(data?.humidity),
    pressure: toNumber(data?.pressure),
    rain_detected: toBoolean(data?.rain_detected ?? data?.rainDetected),
    irrigation_active: toBoolean(data?.irrigation_active ?? data?.irrigationActive),
    health_score: toNumber(data?.health_score ?? data?.healthScore),
    timestamp: payload?.received_at || data?.timestamp || null,
    source: 'hardware',
  };

  if (!hasMeaningfulSensorValues(reading)) {
    return unavailable('sensor', 'Sensor API not available. No usable telemetry returned.', {
      ...reading,
      source: 'none',
    });
  }

  return {
    ...reading,
    available: true,
    provider: 'sensor',
    message: null,
  };
}

export async function fetchSensorLatest() {
  const url = process.env.SENSOR_API_URL;
  if (!url) {
    return unavailable('sensor', 'Set SENSOR_API_URL in Vercel environment variables.', {
      source: 'none',
    });
  }

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Sensor API returned ${response.status}`);
    return normalizeSensorPayload(await response.json());
  } catch (error) {
    return unavailable('sensor', `Sensor API not available: ${publicErrorMessage(error)}`, {
      source: 'none',
    });
  }
}

export function normalizeCropPrediction(value) {
  if (value && typeof value === 'object') {
    return value.prediction ?? value.crop ?? value.result ?? value.recommended_crop ?? value;
  }
  return typeof value === 'string' ? value.trim().replace(/^['"]|['"]$/g, '') : value;
}
