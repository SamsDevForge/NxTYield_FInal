import { json, methodNotAllowed } from '../../server/apiUtils.js';

export default function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  const available = Boolean(process.env.GROQ_API_KEY);
  return json(res, 200, {
    available,
    llm_enabled: available,
    provider: available ? 'groq' : 'api',
    message: available ? null : 'Set GROQ_API_KEY in Vercel.',
  });
}
