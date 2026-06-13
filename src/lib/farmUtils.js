export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const CROP_LABELS = {
  0: 'Apple',
  1: 'Banana',
  2: 'Blackgram',
  3: 'Chickpea',
  4: 'Coconut',
  5: 'Coffee',
  6: 'Cotton',
  7: 'Grapes',
  8: 'Jute',
  9: 'Kidney Beans',
  10: 'Lentil',
  11: 'Maize',
  12: 'Mango',
  13: 'Moth Beans',
  14: 'Mung Bean',
  15: 'Muskmelon',
  16: 'Orange',
  17: 'Papaya',
  18: 'Pigeon Peas',
  19: 'Pomegranate',
  20: 'Rice',
  21: 'Watermelon',
};

export function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function hasSensorData(sensor) {
  return Boolean(sensor && sensor.available !== false && sensor.source && !['none', 'example', 'demo'].includes(sensor.source));
}

export function hasSensorPacket(sensor) {
  return Boolean(sensor && sensor.source && sensor.source !== 'none');
}

export function formatValue(value, options = {}) {
  const number = toNumber(value);
  if (number === null) return 'Unavailable';
  const decimals = options.decimals ?? (Number.isInteger(number) ? 0 : 1);
  return `${number.toFixed(decimals).replace(/\.0$/, '')}${options.unit ? ` ${options.unit}` : ''}`;
}

export function compactValue(value, decimals = 0) {
  const number = toNumber(value);
  if (number === null) return '--';
  return number.toFixed(decimals).replace(/\.0$/, '');
}

export function formatTime(iso) {
  if (!iso) return 'Waiting for data';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatShortTime(iso) {
  if (!iso) return '--';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatUpdated(iso) {
  if (!iso) return 'Not updated yet';
  return `Updated ${formatShortTime(iso)}`;
}

export function getSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  if (month >= 6 && month <= 10) return 'Kharif';
  if (month >= 11 || month <= 3) return 'Rabi';
  return 'Zaid';
}

export function moistureStatus(value) {
  const moisture = toNumber(value);
  if (moisture === null) return { label: 'Waiting', status: 'warning', text: 'No reading' };
  if (moisture < 25) return { label: 'Critical', status: 'warning', text: 'Very dry' };
  if (moisture < 45) return { label: 'Low', status: 'warning', text: 'Dry' };
  if (moisture <= 70) return { label: 'OK', status: 'success', text: 'Optimal' };
  return { label: 'High', status: 'warning', text: 'Wet' };
}

export function phStatus(value) {
  const ph = toNumber(value);
  if (ph === null) return { label: 'Waiting', status: 'warning', text: 'No reading' };
  if (ph < 5.5) return { label: 'Low', status: 'warning', text: 'Acidic' };
  if (ph < 6.0) return { label: 'Low', status: 'warning', text: 'Slightly acidic' };
  if (ph <= 7.5) return { label: 'OK', status: 'success', text: 'Ideal' };
  if (ph <= 8.0) return { label: 'High', status: 'warning', text: 'Slightly alkaline' };
  return { label: 'High', status: 'warning', text: 'Alkaline' };
}

export function humidityStatus(value) {
  const humidity = toNumber(value);
  if (humidity === null) return { label: 'Waiting', status: 'warning' };
  if (humidity < 35) return { label: 'Low', status: 'warning' };
  if (humidity > 90) return { label: 'High', status: 'warning' };
  return { label: 'OK', status: 'success' };
}

export function nutrientStatus(key, value) {
  const number = toNumber(value);
  if (number === null || number < 0) return { label: 'Waiting', status: 'warning' };
  const ranges = {
    nitrogen: [20, 40],
    phosphorus: [12, 35],
    potassium: [150, 250],
  };
  const [low, high] = ranges[key] || [0, Infinity];
  if (number < low) return { label: 'Low', status: 'warning' };
  if (number > high) return { label: 'High', status: 'success' };
  return { label: 'OK', status: 'success' };
}

export function calculateHealthScore(sensor, insights) {
  const insightScore = toNumber(insights?.soil_health?.score);
  if (insightScore !== null) return Math.round(insightScore);

  const hardwareScore = toNumber(sensor?.health_score);
  if (!hasSensorData(sensor)) {
    return sensor?.source === 'example' && hardwareScore !== null ? Math.round(hardwareScore) : null;
  }

  let score = 100;
  const moisture = toNumber(sensor.moisture);
  const soilTemperature = toNumber(sensor.soil_temperature);
  const airTemperature = toNumber(sensor.air_temperature);
  const humidity = toNumber(sensor.humidity);
  const n = toNumber(sensor.nitrogen);
  const p = toNumber(sensor.phosphorus);
  const k = toNumber(sensor.potassium);

  if (moisture === null) score -= 10;
  else if (moisture < 25 || moisture > 80) score -= 25;
  else if (moisture < 40 || moisture > 70) score -= 10;

  if (soilTemperature === null) score -= 5;
  else if (soilTemperature < 10 || soilTemperature > 38) score -= 15;
  else if (soilTemperature < 18 || soilTemperature > 32) score -= 8;

  if (airTemperature === null) score -= 5;
  else if (airTemperature < 10 || airTemperature > 40) score -= 15;
  else if (airTemperature < 18 || airTemperature > 35) score -= 8;

  if (humidity === null) score -= 5;
  else if (humidity < 30 || humidity > 90) score -= 10;

  if (n === null || n < 15) score -= 8;
  if (p === null || p < 10) score -= 6;
  if (k === null || k < 120) score -= 6;

  const derivedScore = Math.max(0, Math.min(100, Math.round(score)));
  if (hardwareScore === null) return derivedScore;

  return Math.round(Math.min(hardwareScore, derivedScore));
}

function trendDelta(history, key) {
  const values = (history || [])
    .map((entry) => toNumber(entry?.[key]))
    .filter((value) => value !== null);
  if (values.length < 2) return null;
  return values[values.length - 1] - values[Math.max(0, values.length - 5)];
}

function trendText(delta, unit = '') {
  if (delta === null || Math.abs(delta) < 0.5) return 'trend stable';
  const direction = delta > 0 ? 'rising' : 'falling';
  return `${direction} ${Math.abs(delta).toFixed(1).replace(/\.0$/, '')}${unit}`;
}

function riskRank(status) {
  return {
    Critical: 5,
    High: 4,
    Elevated: 3,
    Pending: 2,
    Low: 1,
  }[status] || 0;
}

export function buildRiskAssessment(sensor, history = [], weather = null, insights = null, summary = {}) {
  const risks = [];
  const hasSensor = hasSensorData(sensor);
  const currentWeather = weather?.current || {};

  if (!hasSensor) {
    risks.push({
      label: 'Sensor Feed Risk',
      status: summary.connected ? 'Elevated' : 'High',
      desc: 'No live Arduino telemetry has been received yet.',
    });
  }

  const moisture = toNumber(sensor?.moisture);
  if (moisture !== null) {
    let status = 'Low';
    let detail = 'within the target range';
    if (moisture < 25) {
      status = 'Critical';
      detail = 'very dry soil';
    } else if (moisture < 40) {
      status = 'Elevated';
      detail = 'dry soil';
    } else if (moisture > 80) {
      status = 'High';
      detail = 'waterlogging risk';
    } else if (moisture > 70) {
      status = 'Elevated';
      detail = 'wet soil';
    }
    risks.push({
      label: 'Moisture Stress',
      status,
      desc: `${formatValue(moisture, { unit: '%' })}, ${detail}; ${trendText(trendDelta(history, 'moisture'), '%')}.`,
    });
  }

  const ph = toNumber(sensor?.ph);
  if (ph !== null) {
    let status = 'Low';
    let detail = 'ideal for most crops';
    if (ph < 5.5 || ph > 8) {
      status = 'High';
      detail = ph < 5.5 ? 'strongly acidic' : 'strongly alkaline';
    } else if (ph < 6 || ph > 7.5) {
      status = 'Elevated';
      detail = ph < 6 ? 'slightly acidic' : 'slightly alkaline';
    }
    risks.push({
      label: 'pH Imbalance',
      status,
      desc: `pH ${compactValue(ph, 1)} is ${detail}; ${trendText(trendDelta(history, 'ph'))}.`,
    });
  }

  const nutrientRanges = {
    nitrogen: { label: 'N', low: 20, high: 40, unit: 'mg/kg' },
    phosphorus: { label: 'P', low: 12, high: 35, unit: 'mg/kg' },
    potassium: { label: 'K', low: 150, high: 250, unit: 'mg/kg' },
  };
  const nutrientIssues = [];
  const nutrientReadings = [];
  Object.entries(nutrientRanges).forEach(([key, range]) => {
    const value = toNumber(sensor?.[key]);
    if (value === null) return;
    nutrientReadings.push(`${range.label} ${compactValue(value)}`);
    if (value < range.low) nutrientIssues.push(`${range.label} low`);
    if (value > range.high) nutrientIssues.push(`${range.label} high`);
  });
  if (nutrientReadings.length) {
    risks.push({
      label: 'Nutrient Balance',
      status: nutrientIssues.length >= 2 ? 'High' : nutrientIssues.length === 1 ? 'Elevated' : 'Low',
      desc: nutrientIssues.length
        ? `${nutrientIssues.join(', ')} from live NPK readings (${nutrientReadings.join(', ')}).`
        : `Live NPK readings are in range (${nutrientReadings.join(', ')}).`,
    });
  }

  const temperature = toNumber(currentWeather.temperature) ?? toNumber(sensor?.air_temperature);
  if (temperature !== null) {
    let status = 'Low';
    let detail = 'comfortable crop temperature';
    if (temperature >= 38) {
      status = 'High';
      detail = 'heat stress likely';
    } else if (temperature >= 34 || temperature <= 10) {
      status = 'Elevated';
      detail = temperature >= 34 ? 'warm enough for stress monitoring' : 'cold stress possible';
    }
    risks.push({
      label: 'Temperature Stress',
      status,
      desc: `${formatValue(temperature, { unit: 'C' })}, ${detail}.`,
    });
  }

  const rainProbability = toNumber(currentWeather.rain_probability);
  const rainfall = toNumber(currentWeather.rainfall);
  const hasRainSensor = sensor?.rain_detected !== null && sensor?.rain_detected !== undefined;
  if (rainProbability !== null || rainfall !== null || hasRainSensor) {
    const rainDetected = Boolean(sensor?.rain_detected);
    let status = 'Low';
    let detail = 'rain pressure is low';
    if (rainDetected || (rainfall !== null && rainfall >= 10) || (rainProbability !== null && rainProbability >= 70)) {
      status = moisture !== null && moisture > 70 ? 'High' : 'Elevated';
      detail = rainDetected ? 'rain detected by field sensor' : 'rain probability is high';
    }
    risks.push({
      label: 'Rain And Disease Pressure',
      status,
      desc: `${detail}; rain probability ${compactValue(rainProbability)}%, rainfall ${compactValue(rainfall, 1)} mm.`,
    });
  }

  if (hasSensor && sensor?.irrigation_active !== null && sensor?.irrigation_active !== undefined) {
    const irrigationActive = Boolean(sensor.irrigation_active);
    let status = 'Low';
    let detail = irrigationActive ? 'irrigation is active' : 'irrigation is off';
    if (irrigationActive && (moisture === null || moisture > 70 || sensor?.rain_detected)) {
      status = 'High';
      detail = 'irrigation is active while soil or rain conditions suggest caution';
    } else if (!irrigationActive && moisture !== null && moisture < 35) {
      status = 'Elevated';
      detail = 'irrigation is off while soil moisture is low';
    }
    risks.push({
      label: 'Irrigation Decision',
      status,
      desc: detail,
    });
  }

  const fertilizerStatus = insights?.fertilizer?.status;
  if (fertilizerStatus && fertilizerStatus !== 'Pending') {
    const elevated = /needed|low|excess/i.test(fertilizerStatus);
    risks.push({
      label: 'Fertilizer Plan',
      status: elevated ? 'Elevated' : 'Low',
      desc: insights?.fertilizer?.summary || `AI fertilizer status: ${fertilizerStatus}.`,
    });
  }

  const timestamp = sensor?.timestamp ? Date.parse(sensor.timestamp) : null;
  if (hasSensor && Number.isFinite(timestamp)) {
    const ageMinutes = (Date.now() - timestamp) / 60000;
    if (ageMinutes > 10) {
      risks.push({
        label: 'Data Freshness',
        status: ageMinutes > 30 ? 'High' : 'Elevated',
        desc: `Latest sensor packet is ${Math.round(ageMinutes)} minutes old.`,
      });
    }
  }

  if (!risks.length) {
    risks.push({
      label: 'Operational Risk',
      status: 'Pending',
      desc: 'Waiting for live field or weather inputs.',
    });
  }

  return risks
    .sort((a, b) => riskRank(b.status) - riskRank(a.status))
    .slice(0, 6);
}

export function healthLabel(score) {
  if (score === null || score === undefined) return 'WAITING';
  if (score >= 75) return 'OPTIMAL';
  if (score >= 50) return 'WATCH';
  return 'ATTENTION';
}

export function cropName(prediction) {
  if (prediction === null || prediction === undefined || prediction === '') return 'Not selected';
  if (typeof prediction === 'string') {
    return prediction
      .replace(/[_-]+/g, ' ')
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  return CROP_LABELS[prediction] ?? `Crop #${prediction}`;
}

export function buildAlerts(sensor, insights, connected) {
  const alerts = [];
  const now = new Date().toISOString();
  if (!connected) {
    alerts.push({ time: now, code: 'System', tone: 'text-warning', message: 'Live sensor stream is reconnecting.' });
  }
  const moisture = toNumber(sensor?.moisture);
  if (moisture !== null && moisture < 40) {
    alerts.push({ time: sensor.timestamp, code: 'Alert', tone: 'text-warning', message: `Soil moisture is ${compactValue(moisture)}%. Irrigation review recommended.` });
  }
  if (sensor?.rain_detected) {
    alerts.push({ time: sensor.timestamp, code: 'Weather', tone: 'text-primary', message: 'Rain detected by the field sensor.' });
  }
  if (insights?.recommendation?.title) {
    alerts.push({ time: sensor?.timestamp || now, code: 'Insights', tone: 'text-success', message: insights.recommendation.title });
  }
  if (hasSensorData(sensor)) {
    alerts.push({ time: sensor.timestamp, code: 'Sensor', tone: 'text-success', message: `Latest ${sensor.source} telemetry received.` });
  }
  return alerts.slice(0, 4);
}
