import { NextResponse } from "next/server";
import { getPublicConfig } from "@/lib/config";
import { sendEvolutionText } from "@/lib/evolution";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { validateWhatsAppGroupUrl } from "@/lib/whatsapp-evolution-parser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = process.env.VETTA_WELCOME_REPAIR_TOKEN;
  return Boolean(expected && request.headers.get("x-vetta-welcome-repair-token") === expected);
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  const client = createSupabaseAdminClient();
  const cohortId = getPublicConfig().cohort.id;
  if (!client || !cohortId) return NextResponse.json({ ok: false, code: "configuration_unavailable" }, { status: 503 });

  const { data: cohort, error: cohortError } = await client.from("cohorts").select("group_url").eq("id", cohortId).maybeSingle();
  const groupLink = validateWhatsAppGroupUrl(cohort?.group_url);
  if (cohortError || !groupLink) return NextResponse.json({ ok: false, code: "group_link_invalid" }, { status: 409 });

  const { data: leads, error: leadError } = await client.from("leads").select("id,name,whatsapp_e164").eq("cohort_id", cohortId).limit(2);
  if (leadError || !leads || leads.length !== 1) return NextResponse.json({ ok: false, code: "repair_requires_exactly_one_lead" }, { status: 409 });
  const lead = leads[0];
  const { data: welcome } = await client.from("whatsapp_outbound_messages").select("id,status").eq("lead_id", lead.id).eq("kind", "welcome").maybeSingle();
  if (!welcome || welcome.status !== "sent") return NextResponse.json({ ok: false, code: "welcome_not_previously_sent" }, { status: 409 });

  const { data: existingCorrection } = await client.from("lead_events").select("id").eq("lead_id", lead.id).eq("name", "whatsapp_clicked").contains("properties", { subtype: "welcome_link_correction_sent" }).limit(1).maybeSingle();
  if (existingCorrection) return NextResponse.json({ ok: true, duplicate: true });

  const first = String(lead.name).trim().split(/\s+/)[0] || String(lead.name);
  const requestBody = await request.json().catch(() => ({})) as { action?: string };
  if (requestBody.action === "status") {
    const { data: outbound } = await client.from("whatsapp_outbound_messages").select("status,provider_message_id,sent_at,error_code").eq("id", welcome.id).maybeSingle();
    return NextResponse.json({ ok: true, status: outbound?.status || null, providerIdSuffix: outbound?.provider_message_id ? String(outbound.provider_message_id).slice(-8) : null, sentAt: outbound?.sent_at || null, errorCode: outbound?.error_code || null, correctionEvent: false });
  }
  if (requestBody.action === "finalize") {
    if (welcome.status !== "sent") return NextResponse.json({ ok: false, code: "outbound_not_sent" }, { status: 409 });
    const { data: outbound } = await client.from("whatsapp_outbound_messages").select("provider_message_id").eq("id", welcome.id).maybeSingle();
    const { error: eventError } = await client.from("lead_events").insert({ lead_id: lead.id, cohort_id: cohortId, name: "whatsapp_clicked", properties: { source: "controlled_repair", subtype: "welcome_link_correction_sent", recipient_name: first, provider_message_id_suffix: outbound?.provider_message_id ? String(outbound.provider_message_id).slice(-8) : null, audit_recovered: true } });
    if (eventError) return NextResponse.json({ ok: false, code: "repair_audit_persistence_failed" }, { status: 503 });
    return NextResponse.json({ ok: true, duplicate: false, finalized: true, providerIdSuffix: outbound?.provider_message_id ? String(outbound.provider_message_id).slice(-8) : null, recipientName: first });
  }

  const text = `Corrección importante: este es el enlace correcto para ingresar al grupo privado Antes de Emprender:\n\n${groupLink}\n\nCuando estés dentro, vuelve a esta conversación y escribe **LISTO** para recibir tu regalo: **EL FILTRO ANTES DEL SÍ**. 🎁`;
  try {
    const response = await sendEvolutionText(lead.whatsapp_e164, text);
    const providerId = response.key && typeof response.key === "object" ? String((response.key as Record<string, unknown>).id || "") : "";
    await client.from("whatsapp_outbound_messages").update({ status: "sent", provider_message_id: providerId || null, sent_at: new Date().toISOString(), error_code: null }).eq("id", welcome.id);
    const { error: eventError } = await client.from("lead_events").insert({ lead_id: lead.id, cohort_id: cohortId, name: "whatsapp_clicked", properties: { source: "controlled_repair", subtype: "welcome_link_correction_sent", recipient_name: first, provider_message_id_suffix: providerId.slice(-8) } });
    if (eventError) return NextResponse.json({ ok: false, code: "repair_audit_persistence_failed" }, { status: 503 });
    return NextResponse.json({ ok: true, duplicate: false, providerIdSuffix: providerId.slice(-8), recipientName: first });
  } catch {
    return NextResponse.json({ ok: false, code: "repair_send_failed" }, { status: 502 });
  }
}
