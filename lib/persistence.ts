import { getPublicConfig } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { territoryFromCampaign } from "@/lib/tracking";
import type { RegistrationInput } from "@/lib/validation";

export async function persistRegistration(input: RegistrationInput, normalizedPhone: string) {
  const client = createSupabaseAdminClient();
  if (!client) return null;
  const cohort = getPublicConfig().cohort;
  const { data: lead, error } = await client.from("leads").insert({
    cohort_id: cohort.id,
    registration_code: `VETTA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    name: input.name,
    whatsapp_e164: normalizedPhone,
    city: input.city,
    country_code: input.country,
  }).select("id, registration_code, name").single();
  if (error || !lead) throw new Error("registration_persistence_failed");
  const { error: attributionError } = await client.from("campaign_attribution").insert({ lead_id: lead.id, utm_source: input.utm_source || null, utm_medium: input.utm_medium || null, utm_campaign: input.utm_campaign || null, utm_content: input.utm_content || null, utm_term: input.utm_term || null, territory: territoryFromCampaign(input.utm_campaign) });
  if (attributionError) throw new Error("attribution_persistence_failed");
  const { error: consentError } = await client.from("consent_records").insert({ lead_id: lead.id, consent_version: input.consentVersion });
  if (consentError) throw new Error("consent_persistence_failed");
  const { error: eventError } = await client.from("lead_events").insert({ lead_id: lead.id, cohort_id: cohort.id, name: "registration_submitted", properties: { form_version: "v1" } });
  if (eventError) throw new Error("event_persistence_failed");
  return { registrationCode: lead.registration_code, name: lead.name };
}

export async function persistPublicEvent(event: { name: string; registrationCode?: string; cohortId?: string; properties?: Record<string, string | number | boolean> }) {
  const client = createSupabaseAdminClient();
  if (!client) return false;
  const { error } = await client.from("lead_events").insert({ name: event.name, cohort_id: event.cohortId || getPublicConfig().cohort.id, properties: event.properties || {} });
  return !error;
}
