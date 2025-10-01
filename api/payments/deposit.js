import { withCors } from '../_lib/cors.js';
import { ok, badRequest, methodNotAllowed } from '../_lib/json.js';

export default withCors(async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res);
  const { bookingId, amount } = req.body || {};
  if (!bookingId || !amount) return badRequest(res, 'bookingId and amount required');

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  try {
    if (!stripeSecret) {
      // Fallback demo behavior if Stripe is not configured
      const clientSecret = 'pi_demo_secret_' + Math.random().toString(36).slice(2);
      return ok(res, { bookingId, clientSecret, demo: true });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' });

    const intent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency: 'usd',
      description: `Deposit for booking ${bookingId}`,
      automatic_payment_methods: { enabled: true }
    });

    return ok(res, { bookingId, clientSecret: intent.client_secret });
  } catch (err) {
    console.error('Stripe error', err);
    return badRequest(res, 'Unable to create payment intent');
  }
});


