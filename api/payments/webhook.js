import { withCors } from '../_lib/cors.js';
import { ok, badRequest, methodNotAllowed } from '../_lib/json.js';
import { query } from '../_lib/db.js';

export const config = {
  api: {
    bodyParser: false
  }
};

export default withCors(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res);
  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const rawBody = Buffer.concat(chunks);

  if (!secret) {
    return ok(res, { received: true, demo: true });
  }
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });
    const event = stripe.webhooks.constructEvent(rawBody, sig, secret);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        try {
          if (process.env.DATABASE_URL) {
            const desc = pi.description || '';
            const match = desc.match(/booking\s+(bk_[a-z0-9]+)/i);
            const bookingId = match ? match[1] : null;
            if (bookingId) {
              await query('update bookings set status = $1, deposit_amount_cents = $2 where id = $3', ['confirmed', pi.amount_received || 0, bookingId]);
            }
          }
        } catch (e) {
          console.error('Booking confirm update failed', e);
        }
        break;
      }
      case 'charge.refunded': {
        // TODO: handle refunds if necessary
        break;
      }
      default:
        break;
    }
    return ok(res, { received: true });
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return badRequest(res, 'Invalid signature');
  }
});


