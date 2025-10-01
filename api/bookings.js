import { withCors } from './_lib/cors.js';
import { created, badRequest, methodNotAllowed } from './_lib/json.js';
import { query } from './_lib/db.js';

export default withCors(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res);
  const { name, email, service, start, end } = req.body || {};
  if (!name || !email || !service || !start || !end) return badRequest(res, 'Missing fields');

  const id = 'bk_' + Math.random().toString(36).slice(2);
  // TODO: validate conflicts and calendar tentatively
  try {
    if (process.env.DATABASE_URL) {
      await query(
        `insert into bookings (id, client_email, client_name, service, start_time, end_time, status, notes)
         values ($1,$2,$3,$4,$5,$6,'pending',$7)`,
        [id, email, name, service, new Date(start), new Date(end), req.body?.notes || null]
      );
    }
  } catch (e) {
    console.error('DB insert failed', e);
    return badRequest(res, 'Failed to save booking');
  }
  return created(res, { id, status: 'pending', name, email, service, start, end });
});


