# Payments, Booking, and Emails – Implementation Plan

Pragmatic plan to add a lightweight backend (Node/Express or serverless functions) for payments, bookings, and transactional email. Use managed services to keep ops low.

## Tech Stack
- Runtime: Node.js 18+, Express or serverless functions
- DB: Postgres (Neon/Supabase/RDS) or MySQL (PlanetScale). Redis optional for rate limits.
- Object storage: S3-compatible (Backblaze/S3/Wasabi)
- Email: Postmark or SendGrid (transactional)
- Payments: Stripe (primary), PayPal (alt), Mpesa (regional)
- Calendar: Google Calendar API (2-way sync)
- Auth: Session/JWT, roles: admin, photographer, client

## Environment Variables (.env)
See `.env.example` for required keys.

## Data Model (minimal)
- users: id, role, name, email, hash, created_at
- clients: id, user_id, phone, notes
- bookings: id, client_id, service_type, start, end, status, deposit_amount, calendar_event_id
- galleries: id, client_id, title, is_private, expires_at
- photos: id, gallery_id, url, key, favorite
- orders: id, client_id, total, status, payment_intent_id, provider
- order_items: id, order_id, sku, qty, unit_price

## Endpoints (high-level)
- POST /api/bookings
- GET /api/availability
- POST /api/payments/deposit
- POST /api/payments/webhook
- GET /api/galleries/:id (auth)
- POST /api/galleries/:id/zip (auth)
- POST /api/prints/checkout (auth)
- POST /api/auth/login | /register | /reset

See `api-spec.json` for shapes.

## Booking Flow
1) Client picks date/time → POST /api/bookings
2) Server checks conflicts, creates pending booking, tentative Google Calendar event
3) If deposit required, create Stripe PaymentIntent → webhook confirms → update event
4) Email confirmations (ICS attached)

## Google Calendar (2-way)
- Service account or OAuth
- Sync on create/update/cancel
- Periodic reconciliation job

## Payments
- Stripe PaymentIntent for deposits/orders
- Webhooks: payment_intent.succeeded, charge.refunded
- Mpesa: STK Push + webhook

## Emails
- Postmark templates: booking_confirmation, booking_reminder, order_receipt, gallery_ready
- SPF/DKIM/DMARC on domain

## Security
- Rate limiting, CSRF (if SSR), signed expiring media URLs, watermark proofs

## Deploy
- Serverless functions or small Express app
- CI: lint, test, preview
- Migrations via Prisma/knex

## Phasing
- Phase A: Availability + Booking + Deposit + Emails + Calendar
- Phase B: Private ZIP downloads + Print orders
- Phase C: Admin dashboard (auth + CRUD)
