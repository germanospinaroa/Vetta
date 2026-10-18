create table if not exists public.support_email_events (
  id uuid primary key default gen_random_uuid(),
  event_id text unique,
  email_id text not null unique,
  recipient text not null check (lower(recipient) = 'support@gritlab.pro'),
  status text not null check (status in ('processing', 'forwarded', 'failed')),
  forwarded_email_id text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_email_events enable row level security;
