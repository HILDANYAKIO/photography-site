import { withCors } from './_lib/cors.js';
import { ok, badRequest, methodNotAllowed } from './_lib/json.js';

export default withCors(async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res);
  const { from, to } = req.query || {};
  if (!from || !to) return badRequest(res, 'from/to required');

  // Demo static slots; replace with DB + Google Calendar lookup
  const slots = [
    { start: '2025-10-01T10:00:00Z', end: '2025-10-01T12:00:00Z' },
    { start: '2025-10-01T14:00:00Z', end: '2025-10-01T16:00:00Z' }
  ];
  return ok(res, { slots });
});


