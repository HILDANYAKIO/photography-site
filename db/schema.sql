-- Minimal Postgres schema for bookings and payments

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('admin','photographer','client')),
  name text not null,
  email text unique not null,
  password_hash text,
  created_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id text primary key,
  client_email text not null,
  client_name text not null,
  service text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  deposit_amount_cents integer default 0,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists bookings_start_idx on bookings(start_time);
create index if not exists bookings_email_idx on bookings(client_email);


