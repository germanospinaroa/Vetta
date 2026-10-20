-- Separate the declared registration phone from the WhatsApp conversation
-- validated by a VETTA code. Do not delete or rewrite historical deliveries.

create table if not exists public.whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  instance_name text not null,
  sender_jid text not null,
  sender_e164 text,
  link_message_id text not null,
  link_method text not null check (link_method = 'registration_code'),
  status text not null default 'active' check (status in ('active', 'disputed', 'revoked')),
  linked_at timestamptz not null default now()
);

create unique index if not exists whatsapp_conversations_active_lead_idx
  on public.whatsapp_conversations(lead_id, instance_name)
  where status = 'active';

create unique index if not exists whatsapp_conversations_active_jid_idx
  on public.whatsapp_conversations(instance_name, sender_jid)
  where status = 'active';

alter table public.whatsapp_conversations enable row level security;
create policy "admins read whatsapp conversations" on public.whatsapp_conversations
  for select to authenticated using (public.is_vetta_admin());

alter table public.whatsapp_outbound_messages
  add column if not exists conversation_id uuid references public.whatsapp_conversations(id) on delete restrict,
  add column if not exists recipient_jid text;

alter table public.whatsapp_outbound_messages
  alter column recipient_e164 drop not null;

alter table public.whatsapp_outbound_messages
  drop constraint if exists whatsapp_outbound_messages_lead_id_kind_key;

create unique index if not exists whatsapp_outbound_conversation_kind_idx
  on public.whatsapp_outbound_messages(conversation_id, kind)
  where conversation_id is not null;

alter table public.whatsapp_outbound_messages
  drop constraint if exists whatsapp_outbound_messages_recipient_check;

alter table public.whatsapp_outbound_messages
  add constraint whatsapp_outbound_messages_recipient_check
  check (
    (conversation_id is null and recipient_jid is null)
    or (conversation_id is not null and recipient_jid is not null and length(trim(recipient_jid)) > 0)
  );

create or replace function public.link_whatsapp_conversation(
  p_cohort_id uuid,
  p_registration_code text,
  p_instance_name text,
  p_sender_jid text,
  p_sender_e164 text,
  p_link_message_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_lead public.leads%rowtype;
  existing_for_lead public.whatsapp_conversations%rowtype;
  existing_for_jid public.whatsapp_conversations%rowtype;
  created_conversation public.whatsapp_conversations%rowtype;
begin
  if nullif(trim(p_sender_jid), '') is null or nullif(trim(p_registration_code), '') is null then
    return jsonb_build_object('status', 'invalid_input');
  end if;

  select * into target_lead
  from public.leads
  where cohort_id = p_cohort_id and registration_code = upper(trim(p_registration_code))
  for update;

  if not found then
    return jsonb_build_object('status', 'code_not_found');
  end if;

  select * into existing_for_lead
  from public.whatsapp_conversations
  where lead_id = target_lead.id and instance_name = p_instance_name and status = 'active'
  for update;

  if found then
    if existing_for_lead.sender_jid = trim(p_sender_jid) then
      return jsonb_build_object('status', 'existing', 'lead_id', target_lead.id, 'conversation_id', existing_for_lead.id);
    end if;
    return jsonb_build_object('status', 'lead_already_linked', 'lead_id', target_lead.id, 'conversation_id', existing_for_lead.id);
  end if;

  select * into existing_for_jid
  from public.whatsapp_conversations
  where instance_name = p_instance_name and sender_jid = trim(p_sender_jid) and status = 'active'
  for update;

  if found then
    return jsonb_build_object('status', 'conversation_already_linked', 'lead_id', existing_for_jid.lead_id, 'conversation_id', existing_for_jid.id);
  end if;

  insert into public.whatsapp_conversations (lead_id, instance_name, sender_jid, sender_e164, link_message_id)
  values (target_lead.id, p_instance_name, trim(p_sender_jid), nullif(trim(p_sender_e164), ''), p_link_message_id)
  returning * into created_conversation;

  return jsonb_build_object('status', 'linked', 'lead_id', target_lead.id, 'conversation_id', created_conversation.id);
exception
  when unique_violation then
    return jsonb_build_object('status', 'concurrent_link_conflict');
end;
$$;

revoke all on function public.link_whatsapp_conversation(uuid, text, text, text, text, text) from public;
grant execute on function public.link_whatsapp_conversation(uuid, text, text, text, text, text) to service_role;

-- Keep the existing Supabase Cron, but make legacy rows ineligible for send.
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
      and conversation_id is not null
      and recipient_jid is not null
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
