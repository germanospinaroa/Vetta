-- Persistent delayed delivery for the matrix gift. Apply only after the
-- server route and its private token are configured; activate the cron job
-- only after the deployed route is ready.

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

alter table public.whatsapp_outbound_messages
  add column if not exists scheduled_for timestamptz,
  add column if not exists attempt_count integer not null default 0,
  add column if not exists last_attempt_at timestamptz,
  add column if not exists claimed_at timestamptz;

alter table public.whatsapp_outbound_messages
  drop constraint if exists whatsapp_outbound_messages_status_check;

alter table public.whatsapp_outbound_messages
  add constraint whatsapp_outbound_messages_status_check
  check (status in ('pending', 'attempting', 'sent', 'failed'));

create index if not exists whatsapp_outbound_due_idx
  on public.whatsapp_outbound_messages(status, scheduled_for)
  where kind = 'matrix' and status in ('pending', 'attempting');

create or replace function public.claim_due_whatsapp_messages(p_limit integer default 20)
returns setof public.whatsapp_outbound_messages
language sql
security definer
set search_path = public
as $$
  with candidates as (
    select id
    from public.whatsapp_outbound_messages
    where kind = 'matrix'
      and status = 'pending'
      and scheduled_for is not null
      and scheduled_for <= now()
      and attempt_count < 3
    order by scheduled_for, created_at
    for update skip locked
    limit greatest(1, least(coalesce(p_limit, 20), 50))
  )
  update public.whatsapp_outbound_messages target
  set status = 'attempting',
      attempt_count = target.attempt_count + 1,
      last_attempt_at = now(),
      claimed_at = now()
  from candidates
  where target.id = candidates.id
  returning target.*;
$$;

revoke all on function public.claim_due_whatsapp_messages(integer) from public;
grant execute on function public.claim_due_whatsapp_messages(integer) to service_role;

-- The cron job is activated only when both Vault secrets already exist:
-- vetta_delivery_endpoint_url and vetta_delivery_cron_token. This guard keeps
-- a partially configured deployment from creating a silently failing job.
do $$
begin
  if not exists (select 1 from vault.decrypted_secrets where name = 'vetta_delivery_endpoint_url')
     or not exists (select 1 from vault.decrypted_secrets where name = 'vetta_delivery_cron_token') then
    raise exception 'VETTA delivery Vault secrets must be configured before activating cron';
  end if;
  if exists (select 1 from cron.job where jobname = 'vetta-deliver-due-messages') then
    perform cron.unschedule('vetta-deliver-due-messages');
  end if;
  perform cron.schedule(
    'vetta-deliver-due-messages',
    '* * * * *',
    $cron$
      select net.http_post(
        url := (select decrypted_secret from vault.decrypted_secrets where name = 'vetta_delivery_endpoint_url'),
        headers := jsonb_build_object(
          'content-type', 'application/json',
          'x-vetta-cron-token', (select decrypted_secret from vault.decrypted_secrets where name = 'vetta_delivery_cron_token')
        ),
        body := '{"source":"supabase_cron"}'::jsonb
      );
    $cron$
  );
end;
$$;
