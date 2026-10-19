import { createSupabaseServerClient } from "@/lib/supabase/server";

type Count = { count: number; error: string | null };

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
  const [{ data: events }, { data: inbound }, { data: outbound }] = await Promise.all([
    client.from("lead_events").select("lead_id,name").in("lead_id", ids),
    client.from("whatsapp_inbound_messages").select("lead_id,action").in("lead_id", ids),
    client.from("whatsapp_outbound_messages").select("lead_id,kind,status,error_code").in("lead_id", ids),
  ]);
  const eventMap = new Map<string, Set<string>>();
  for (const event of events || []) {
    const leadEvents = eventMap.get(String(event.lead_id)) || new Set<string>();
    leadEvents.add(String(event.name));
    eventMap.set(String(event.lead_id), leadEvents);
  }
  const inboundMap = new Map<string, Set<string>>();
  for (const message of inbound || []) {
    const actions = inboundMap.get(String(message.lead_id)) || new Set<string>();
    actions.add(String(message.action));
    inboundMap.set(String(message.lead_id), actions);
  }
  const outboundMap = new Map<string, Set<string>>();
  for (const message of outbound || []) {
    if (message.status !== "sent") continue;
    const sent = outboundMap.get(String(message.lead_id)) || new Set<string>();
    sent.add(String(message.kind));
    outboundMap.set(String(message.lead_id), sent);
  }
  const leads = data.map((lead) => {
    const id = String(lead.id);
    const leadEvents = eventMap.get(id) || new Set<string>();
    const actions = inboundMap.get(id) || new Set<string>();
    const sent = outboundMap.get(id) || new Set<string>();
    return {
      ...lead,
      whatsapp_status: [
        leadEvents.has("conversation_confirmed") ? "conversación" : null,
        sent.has("welcome") ? "bienvenida" : null,
        leadEvents.has("group_join_verified") ? "grupo verificado" : actions.has("group_join_declared") ? "LISTO pendiente" : null,
        sent.has("matrix") ? "matriz enviada" : null,
      ].filter(Boolean).join(" · ") || "pendiente",
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
