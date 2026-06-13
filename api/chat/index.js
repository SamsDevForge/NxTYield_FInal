import { json, methodNotAllowed, publicErrorMessage, readBody, unavailable } from '../../server/apiUtils.js';

function sensorContext(sensor = {}) {
  if (!sensor || sensor.available === false || !sensor.source || sensor.source === 'none') {
    return 'No live sensor data is available.';
  }

  return [
    'Live sensor context:',
    `N: ${sensor.nitrogen ?? 'unavailable'} mg/kg`,
    `P: ${sensor.phosphorus ?? 'unavailable'} mg/kg`,
    `K: ${sensor.potassium ?? 'unavailable'} mg/kg`,
    `Moisture: ${sensor.moisture ?? 'unavailable'}%`,
    `pH: ${sensor.ph ?? 'unavailable'}`,
    `Source: ${sensor.source}`,
  ].join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return json(res, 200, unavailable('groq', 'AI API not available. Set GROQ_API_KEY in Vercel.', {
      reply: 'AI API not available.',
    }));
  }

  try {
    const body = await readBody(req);
    const message = String(body.message || '').trim();
    if (!message) return json(res, 400, { available: false, message: 'Message is required' });

    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    const messages = [
      {
        role: 'system',
        content: `You are NxTYield's farm assistant. Be concise and practical. Do not invent sensor values.\n\n${sensorContext(body.sensor)}`,
      },
      ...history
        .filter((turn) => ['user', 'assistant'].includes(turn.role) && turn.content)
        .map((turn) => ({ role: turn.role, content: String(turn.content) })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 600,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error?.message || `Groq returned ${response.status}`);

    return json(res, 200, {
      available: true,
      reply: payload.choices?.[0]?.message?.content?.trim() || '',
      provider: 'groq',
      message: null,
    });
  } catch (error) {
    return json(res, 200, unavailable('groq', `AI API not available: ${publicErrorMessage(error, [key])}`, {
      reply: 'AI API not available.',
    }));
  }
}
