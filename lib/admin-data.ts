import { createSupabaseServerClient } from "@/lib/supabase/server";

type Count = { count: number; error: string | null };

function maskOperationalJid(value: unknown) {
  if (typeof value !== "string" || value.length < 7) return value ? "identificador enmascarado" : null;
  return `${value.slice(0, 3)}…${value.slice(-7)}`;
}

async function countTable(table: string): Promise<Count> {
  const client = await createSupabaseServerClient();
  if (!client) return { count: 0, error: "supabase_not_configured" };
  const { count, error } = await client.from(table).select("id", { count: "exact", head: true });
  return { count: count || 0, error: error?.message || null };
}

export async function getDashboardCounts() {
  const [leads, events, outcomes] = await Promise.all([countTable("leads"), countTable("lead_events"), countTable("commercial_outcomes")]);
  return { configured: ![leads, events, outcomes].some((item) => item.error === "supabase_not_configured"), cards: [{ label: "Registros recibidos", value: leads.count }, { label: "Eventos registrados", value: events.count }, { label: "Resultados comerciales", value: outcomes.count }] };
}

export async function getAdminLeads(search = "") {
  const client = await createSupabaseServerClient();
  if (!client) return { configured: false, leads: [] as Array<Record<string, unknown>> };
  const safeSearch = search.trim().slice(0, 80).replace(/[,%()]/g, "");
  let query = client.from("leads").select("id, registration_code, name, whatsapp_e164, city, country_code, current_stage, created_at, cohorts(name)").order("created_at", { ascending: false }).limit(100);
  if (safeSearch) query = query.or(`name.ilike.%${safeSearch}%,registration_code.ilike.%${safeSearch}%,whatsapp_e164.ilike.%${safeSearch}%`);
  const { data, error } = await query;
  if (error || !data) return { configured: false, leads: [] as Array<Record<string, unknown>> };
  const ids = data.map((lead) => String(lead.id));
  if (ids.length === 0) return { configured: true, leads: [] };
  const [{ data: events }, { data: inbound }, { data: outbound }, { data: conversations }] = await Promise.all([
    client.from("lead_events").select("lead_id,name,properties,created_at,created_by").in("lead_id", ids),
    client.from("whatsapp_inbound_messages").select("lead_id,action").in("lead_id", ids),
    client.from("whatsapp_outbound_messages").select("lead_id,conversation_id,kind,status,error_code,scheduled_for,attempt_count,last_attempt_at,provider_message_id,recipient_jid").in("lead_id", ids),
    client.from("whatsapp_conversations").select("id,lead_id,instance_name,sender_jid,status,linked_at").in("lead_id", ids),
  ]);
  const eventMap = new Map<string, Set<string>>();
  const manualGroupMap = new Map<string, { confirmedAt: string; confirmedBy: string | null }>();
  for (const event of events || []) {
    const leadEvents = eventMap.get(String(event.lead_id)) || new Set<string>();
    leadEvents.add(String(event.name));
    eventMap.set(String(event.lead_id), leadEvents);
    const properties = event.properties && typeof event.properties === "object" ? event.properties as Record<string, unknown> : {};
    if (event.name === "group_join_verified" && properties.verification_method === "manual" && !manualGroupMap.has(String(event.lead_id))) {
      manualGroupMap.set(String(event.lead_id), { confirmedAt: String(event.created_at), confirmedBy: event.created_by ? String(event.created_by) : null });
    }
  }
  const inboundMap = new Map<string, Set<string>>();
  for (const message of inbound || []) {
    const actions = inboundMap.get(String(message.lead_id)) || new Set<string>();
    actions.add(String(message.action));
    inboundMap.set(String(message.lead_id), actions);
  }
  const outboundMap = new Map<string, Map<string, Record<string, unknown>>>();
  for (const message of outbound || []) {
    const statuses = outboundMap.get(String(message.lead_id)) || new Map<string, Record<string, unknown>>();
    statuses.set(String(message.kind), message as Record<string, unknown>);
    outboundMap.set(String(message.lead_id), statuses);
  }
  const conversationMap = new Map<string, Record<string, unknown>>();
  for (const conversation of conversations || []) conversationMap.set(String(conversation.lead_id), conversation as Record<string, unknown>);
  const leads = data.map((lead) => {
    const id = String(lead.id);
    const leadEvents = eventMap.get(id) || new Set<string>();
    const actions = inboundMap.get(id) || new Set<string>();
    const outboundStatus = outboundMap.get(id) || new Map<string, Record<string, unknown>>();
    const welcome = outboundStatus.get("welcome");
    const matrix = outboundStatus.get("matrix");
    const welcomeStatus = String(welcome?.status || "");
    const matrixStatus = String(matrix?.status || "");
    const conversation = conversationMap.get(id);
    const manualGroup = manualGroupMap.get(id);
    const inboundPending = actions.has("listo_pending_group_verification") || actions.has("matrix_delivery_failed");
    return {
      ...lead,
      whatsapp_status: [
        leadEvents.has("conversation_confirmed") ? "conversación" : null,
        welcomeStatus === "sent" ? "bienvenida aceptada" : welcomeStatus === "failed" ? "bienvenida fallida" : welcomeStatus === "pending" || welcomeStatus === "attempting" ? "bienvenida pendiente" : null,
        leadEvents.has("group_join_verified") ? "grupo verificado" : actions.has("group_join_declared") ? "LISTO pendiente" : null,
        matrixStatus === "sent" ? "matriz enviada" : matrixStatus === "pending" || inboundPending ? "matriz pendiente" : matrixStatus === "failed" ? "matriz fallida" : null,
      ].filter(Boolean).join(" · ") || "pendiente",
      whatsapp_validation_status: conversation ? "WhatsApp validado mediante código" : "WhatsApp todavía no vinculado",
      operational_jid: maskOperationalJid(conversation?.sender_jid),
      welcome_delivery_status: welcomeStatus || "sin entrega",
      matrix_delivery_status: matrixStatus || "sin programar",
      matrix_scheduled_for: matrix?.scheduled_for || null,
      last_operational_error: String(matrix?.error_code || welcome?.error_code || "") || null,
      group_membership_status: manualGroup ? "Confirmado manualmente" : leadEvents.has("group_join_verified") ? "Confirmado automáticamente" : "Sin confirmar",
      group_membership_method: manualGroup ? "manual" : leadEvents.has("group_join_verified") ? "automatic" : null,
      group_membership_confirmed_at: manualGroup?.confirmedAt || null,
      group_membership_confirmed_by: manualGroup?.confirmedBy || null,
    };
  });
  return { configured: true, leads };
}

export async function getAdminCohorts() {
  const client = await createSupabaseServerClient();
  if (!client) return { configured: false, cohorts: [] as Array<Record<string, unknown>> };
  const { data, error } = await client.from("cohorts").select("id, name, status, timezone, tuesday_at, thursday_at, capacity").order("created_at", { ascending: false });
  return { configured: !error, cohorts: data || [] };
}
