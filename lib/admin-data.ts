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
  return { configured: !error, leads: data || [] };
}

export async function getAdminCohorts() {
  const client = await createSupabaseServerClient();
  if (!client) return { configured: false, cohorts: [] as Array<Record<string, unknown>> };
  const { data, error } = await client.from("cohorts").select("id, name, status, timezone, tuesday_at, thursday_at, capacity").order("created_at", { ascending: false });
  return { configured: !error, cohorts: data || [] };
}
