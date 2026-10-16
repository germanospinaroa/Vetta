create extension if not exists pgcrypto;

create type public.cohort_status as enum ('draft', 'open', 'closed', 'finished');
create type public.lead_event_name as enum ('landing_viewed', 'registration_started', 'registration_submitted', 'registration_failed', 'whatsapp_clicked', 'matrix_opened', 'conversation_confirmed', 'group_join_declared', 'group_join_verified', 'matrix_sent', 'tuesday_attended', 'thursday_attended', 'followup_started', 'customer_converted', 'ambassador_converted', 'ambassador_activated');
create type public.attendance_status as enum ('confirmed', 'not_attended', 'unknown');
create type public.outcome_type as enum ('conversation_started', 'customer', 'vip_customer', 'ambassador', 'ambassador_active', 'no_conversion', 'followup_pending');
create type public.lead_stage as enum ('registered', 'whatsapp_clicked', 'conversation_confirmed', 'group_join_declared', 'matrix_sent', 'tuesday_attended', 'thursday_attended', 'followup', 'converted');

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status public.cohort_status not null default 'draft',
  timezone text not null default 'America/Bogota',
  tuesday_at timestamptz,
  thursday_at timestamptz,
  tuesday_url text,
  thursday_url text,
  group_url text,
  whatsapp_number text,
  capacity integer check (capacity is null or capacity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts(id),
  registration_code text not null unique,
  name text not null,
  whatsapp_e164 text not null,
  city text not null,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  current_stage public.lead_stage not null default 'registered',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaign_attribution (
  lead_id uuid primary key references public.leads(id) on delete cascade,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  territory text,
  created_at timestamptz not null default now()
);

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  consent_version text not null,
  consent_type text not null default 'experience_communications',
  accepted_at timestamptz not null default now()
);

create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  cohort_id uuid references public.cohorts(id) on delete set null,
  name public.lead_event_name not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  session_name text not null check (session_name in ('tuesday', 'thursday')),
  status public.attendance_status not null default 'unknown',
  recorded_at timestamptz,
  recorded_by uuid references auth.users(id) on delete set null,
  unique (lead_id, session_name)
);

create table public.commercial_outcomes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  outcome public.outcome_type not null,
  occurred_at timestamptz not null default now(),
  responsible_user uuid references auth.users(id) on delete set null,
  notes text
);

create unique index commercial_outcomes_one_current_idx on public.commercial_outcomes(lead_id)
  where outcome not in ('no_conversion', 'followup_pending');

create table public.admin_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'operator' check (role in ('operator', 'admin')),
  created_at timestamptz not null default now()
);

create index leads_cohort_created_idx on public.leads(cohort_id, created_at desc);
create index lead_events_lead_created_idx on public.lead_events(lead_id, created_at desc);
create index campaign_attribution_campaign_idx on public.campaign_attribution(utm_campaign);

alter table public.cohorts enable row level security;
alter table public.leads enable row level security;
alter table public.campaign_attribution enable row level security;
alter table public.consent_records enable row level security;
alter table public.lead_events enable row level security;
alter table public.attendance enable row level security;
alter table public.commercial_outcomes enable row level security;
alter table public.admin_members enable row level security;

create or replace function public.is_vetta_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_members where user_id = auth.uid());
$$;

create policy "admins manage cohorts" on public.cohorts for all to authenticated using (public.is_vetta_admin()) with check (public.is_vetta_admin());
create policy "admins manage leads" on public.leads for all to authenticated using (public.is_vetta_admin()) with check (public.is_vetta_admin());
create policy "admins manage attribution" on public.campaign_attribution for all to authenticated using (public.is_vetta_admin()) with check (public.is_vetta_admin());
create policy "admins manage consents" on public.consent_records for all to authenticated using (public.is_vetta_admin()) with check (public.is_vetta_admin());
create policy "admins manage events" on public.lead_events for all to authenticated using (public.is_vetta_admin()) with check (public.is_vetta_admin());
create policy "admins manage attendance" on public.attendance for all to authenticated using (public.is_vetta_admin()) with check (public.is_vetta_admin());
create policy "admins manage outcomes" on public.commercial_outcomes for all to authenticated using (public.is_vetta_admin()) with check (public.is_vetta_admin());
create policy "admins read membership" on public.admin_members for select to authenticated using (auth.uid() = user_id or public.is_vetta_admin());
