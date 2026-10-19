create table if not exists public.whatsapp_inbound_messages (
  id uuid primary key default gen_random_uuid(),
  provider_message_id text not null unique,
  instance_name text not null,
  sender_jid text,
  sender_e164 text,
  lead_id uuid references public.leads(id) on delete set null,
  event_name text not null,
  message_kind text,
  message_hash text,
  action text not null default 'ignored',
  error_code text,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists whatsapp_inbound_sender_idx
  on public.whatsapp_inbound_messages(sender_e164, received_at desc);
create index if not exists whatsapp_inbound_lead_idx
  on public.whatsapp_inbound_messages(lead_id, received_at desc);

create table if not exists public.whatsapp_outbound_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  kind text not null check (kind in ('welcome', 'matrix')),
  recipient_e164 text not null,
  provider_message_id text,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  error_code text,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (lead_id, kind)
);

create index if not exists whatsapp_outbound_lead_idx
  on public.whatsapp_outbound_messages(lead_id, created_at desc);

alter table public.whatsapp_inbound_messages enable row level security;
alter table public.whatsapp_outbound_messages enable row level security;

create policy "admins read inbound whatsapp" on public.whatsapp_inbound_messages
  for select to authenticated using (public.is_vetta_admin());
create policy "admins read outbound whatsapp" on public.whatsapp_outbound_messages
  for select to authenticated using (public.is_vetta_admin());
