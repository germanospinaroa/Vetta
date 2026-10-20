-- A declared phone is informational. Repeated registrations create new leads.
drop index if exists public.leads_cohort_whatsapp_unique_idx;

-- One WhatsApp conversation may validate multiple distinct registrations over time.
-- Deliveries remain deduplicated per operational conversation and message kind.
drop index if exists public.whatsapp_conversations_active_jid_idx;

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
