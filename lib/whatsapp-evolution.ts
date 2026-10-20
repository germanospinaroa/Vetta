import { createHash } from "node:crypto";
import { getPublicConfig } from "@/lib/config";
import { sendEvolutionText } from "@/lib/evolution";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { extractEvolutionGroupData, extractEvolutionMessage, matchesConfiguredEvolutionGroup, validateWhatsAppGroupUrl } from "@/lib/whatsapp-evolution-parser";

const COHORT_ID = process.env.NEXT_PUBLIC_ACTIVE_COHORT_ID;
const INSTANCE = process.env.EVOLUTION_INSTANCE || "momentum";

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

async function getConfiguredGroupLink(client: NonNullable<ReturnType<typeof createSupabaseAdminClient>>) {
  const { data, error } = await client.from("cohorts").select("group_url").eq("id", COHORT_ID).maybeSingle();
  if (error || !data) throw new Error("group_link_configuration_unavailable");
  const groupLink = validateWhatsAppGroupUrl(data.group_url);
  if (!groupLink) throw new Error("group_link_configuration_invalid");
  return groupLink;
}

function matrixLink() {
  return process.env.VETTA_MATRIX_URL || `${getPublicConfig().siteUrl}/matriz`;
}

type EvolutionLead = { id: string; name: string; whatsapp_e164: string; registration_code: string };

async function resolveLeadFromVerifiedJid(client: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, message: ReturnType<typeof extractEvolutionMessage>) {
  if (message.senderE164 || !message.senderJid || !message.registrationCode) return null;
  const { data: candidates, error: candidateError } = await client.from("leads").select("id,name,whatsapp_e164,registration_code").eq("cohort_id", COHORT_ID).eq("registration_code", message.registrationCode).limit(2);
  if (candidateError || !candidates || candidates.length !== 1) return null;
  const candidate = candidates[0] as EvolutionLead;
  const { data: identityRows, error: identityError } = await client.from("whatsapp_inbound_messages").select("lead_id").eq("sender_jid", message.senderJid).eq("lead_id", candidate.id).limit(1);
  if (identityError || !identityRows?.length) return null;
  return candidate;
}

async function recordEvent(client: ReturnType<typeof createSupabaseAdminClient>, leadId: string, name: string, properties: Record<string, string | boolean>) {
  await client?.from("lead_events").insert({ lead_id: leadId, cohort_id: COHORT_ID, name, properties });
}

async function sendOnce(client: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, lead: { id: string; name: string; whatsapp_e164: string }, kind: "welcome" | "matrix", text: string) {
  const { data: existing } = await client.from("whatsapp_outbound_messages").select("id,status,provider_message_id,created_at").eq("lead_id", lead.id).eq("kind", kind).maybeSingle();
  if (existing?.status === "sent") return { sent: false, duplicate: true, providerMessageId: existing.provider_message_id || null };
  if (existing?.status === "pending" && existing.created_at && Date.now() - Date.parse(existing.created_at) < 5 * 60 * 1000) {
    return { sent: false, duplicate: true, pending: true, providerMessageId: existing.provider_message_id || null };
  }
  let row: { id: string; status: string } | null = null;
  if ((existing?.status === "failed" || existing?.status === "pending") && existing.created_at) {
    const { data: claimed, error: claimError } = await client.from("whatsapp_outbound_messages").update({ status: "pending", error_code: null }).eq("id", existing.id).eq("status", existing.status).lt("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString()).select("id,status").maybeSingle();
    if (claimError) throw new Error("outbound_state_failed");
    if (claimed) row = claimed;
  } else if (!existing) {
    const { data: inserted, error: insertError } = await client.from("whatsapp_outbound_messages").upsert({ lead_id: lead.id, kind, recipient_e164: lead.whatsapp_e164, status: "pending", error_code: null }, { onConflict: "lead_id,kind", ignoreDuplicates: true }).select("id,status").maybeSingle();
    if (insertError) throw new Error("outbound_state_failed");
    if (inserted) row = inserted;
  }
  if (!row) return { sent: false, duplicate: true, pending: true, providerMessageId: existing?.provider_message_id || null };
  try {
    const response = await sendEvolutionText(lead.whatsapp_e164, text);
    const providerId = typeof response.key === "object" && response.key ? String((response.key as Record<string, unknown>).id || "") : undefined;
    await client.from("whatsapp_outbound_messages").update({ status: "sent", provider_message_id: providerId || null, sent_at: new Date().toISOString(), error_code: null }).eq("id", row.id);
    return { sent: true, duplicate: false, providerMessageId: providerId || null };
  } catch {
    await client.from("whatsapp_outbound_messages").update({ status: "failed", error_code: "evolution_send_failed" }).eq("id", row.id);
    throw new Error("evolution_send_failed");
  }
}

async function deliverMatrixForLead(client: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, lead: { id: string; name: string; whatsapp_e164: string }) {
  const text = `¡Perfecto, ${firstName(lead.name)}! 🎁\n\nAquí tienes EL FILTRO ANTES DEL SÍ, tu diagnóstico interactivo para descubrir qué revisar antes de comprometerte con una oportunidad:\n\n${matrixLink()}\n\nRespóndelo y recibirás un análisis con tus principales hallazgos, señales de alerta y próximos pasos.\n\nRecuerda: los accesos a nuestros dos encuentros en vivo se compartirán en el grupo privado Antes de Emprender.`;
  const sent = await sendOnce(client, lead, "matrix", text);
  if (sent.sent) {
    await recordEvent(client, lead.id, "matrix_sent", { source: "evolution", automated: true });
    await client.from("whatsapp_inbound_messages").update({ action: "matrix_sent", error_code: null }).eq("lead_id", lead.id).in("action", ["listo_pending_group_verification", "matrix_delivery_failed"]);
  }
  return sent;
}

export async function recoverPendingMatrixDeliveries() {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const { data: pending, error } = await client.from("whatsapp_inbound_messages").select("lead_id").in("action", ["listo_pending_group_verification", "matrix_delivery_failed"]).not("lead_id", "is", null).limit(20);
  if (error) throw new Error("pending_matrix_lookup_failed");
  let delivered = 0;
  let failed = 0;
  for (const row of pending || []) {
    if (!row.lead_id) continue;
    const { data: lead } = await client.from("leads").select("id,name,whatsapp_e164").eq("id", row.lead_id).eq("cohort_id", COHORT_ID).maybeSingle();
    if (!lead) continue;
    try {
      const result = await deliverMatrixForLead(client, lead);
      if (result.sent) delivered += 1;
    } catch {
      failed += 1;
    }
  }
  return { pending: pending?.length || 0, delivered, failed };
}

export async function processEvolutionMessage(payload: unknown) {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const group = extractEvolutionGroupData(payload);
  const configuredGroup = process.env.VETTA_GROUP_JID?.trim();
  if (matchesConfiguredEvolutionGroup(group.groupJid, configuredGroup) && group.participants.length > 0 && group.eventName.includes("group")) {
    let verified = 0;
    for (const participant of group.participants) {
      if (!participant.phoneE164) continue;
      const { data: lead } = await client.from("leads").select("id,name,whatsapp_e164").eq("cohort_id", COHORT_ID).eq("whatsapp_e164", participant.phoneE164).maybeSingle();
      if (!lead) continue;
      const providerId = group.providerId || createHash("sha256").update(`${group.groupJid}|${participant.phoneE164}|${group.eventName}`).digest("hex");
      const { error: inserted } = await client.from("whatsapp_inbound_messages").insert({ provider_message_id: `${providerId}:${participant.phoneE164}`, instance_name: INSTANCE, sender_jid: participant.id || participant.jid, sender_e164: participant.phoneE164, lead_id: lead.id, event_name: group.eventName, message_kind: "group_participant", action: "group_join_verified", processed_at: new Date().toISOString() });
      if (inserted?.code === "23505") continue;
      if (inserted) throw new Error("group_event_persistence_failed");
      await recordEvent(client, lead.id, "group_join_verified", { source: "evolution", automated: true });
      verified += 1;
    }
    return { action: verified ? "group_join_verified" as const : "group_event_unmatched" as const };
  }
  const message = extractEvolutionMessage(payload);
  if (message.eventName !== "messages.upsert") {
    console.info("evolution_message_ignored", { reason: "unsupported_event", eventName: message.eventName });
    return { action: "ignored" as const, reason: "unsupported_event" as const };
  }
  if (message.fromMe) {
    console.info("evolution_message_ignored", { reason: "from_me", hasProviderId: Boolean(message.providerMessageId) });
    return { action: "ignored" as const, reason: "from_me" as const };
  }
  const verifiedJidLead = await resolveLeadFromVerifiedJid(client, message);
  if ((!message.senderE164 && !verifiedJidLead) || !message.text) {
    const pendingSenderResolution = !message.senderE164 && Boolean(message.registrationCode);
    const invalidError = !message.senderE164 ? (pendingSenderResolution ? "sender_not_resolved_code_present" : "sender_not_resolved") : "text_not_resolved";
    const { error: invalidInsertError } = await client.from("whatsapp_inbound_messages").upsert({
      provider_message_id: message.providerMessageId,
      instance_name: INSTANCE,
      sender_jid: message.senderJid,
      sender_e164: message.senderE164,
      lead_id: null,
      event_name: message.eventName,
      message_kind: "text",
      message_hash: message.text ? createHash("sha256").update(message.text).digest("hex") : null,
      action: pendingSenderResolution ? "pending_sender_resolution" : "ignored_invalid_message",
      error_code: invalidError,
      processed_at: new Date().toISOString(),
    }, { onConflict: "provider_message_id" });
    if (invalidInsertError) throw new Error("invalid_message_persistence_failed");
    console.warn("evolution_message_not_processable", {
      eventName: message.eventName,
      hasSenderJid: Boolean(message.senderJid),
      hasRemoteJid: Boolean(message.remoteJid),
      hasPhone: Boolean(message.senderE164),
      hasText: Boolean(message.text),
      reason: invalidError,
    });
    return { action: pendingSenderResolution ? "pending_sender_resolution" as const : "ignored_invalid_message" as const, reason: invalidError };
  }

  const { data: existing } = await client.from("whatsapp_inbound_messages").select("id,action").eq("provider_message_id", message.providerMessageId).maybeSingle();
  if (existing) return { action: "duplicate" as const, reason: "provider_message_id" as const };

  const { data: phoneLead, error: leadError } = message.senderE164
    ? await client.from("leads").select("id,name,whatsapp_e164,registration_code").eq("cohort_id", COHORT_ID).eq("whatsapp_e164", message.senderE164).maybeSingle()
    : { data: null, error: null };
  const lead = (verifiedJidLead || phoneLead) as EvolutionLead | null;
  const listo = /^listo\b/i.test(message.text);
  const { error: inboundError } = await client.from("whatsapp_inbound_messages").insert({ provider_message_id: message.providerMessageId, instance_name: INSTANCE, sender_jid: message.senderJid, sender_e164: message.senderE164 || lead?.whatsapp_e164 || null, lead_id: lead?.id || null, event_name: message.eventName, message_kind: "text", message_hash: createHash("sha256").update(message.text).digest("hex"), action: leadError ? "error" : lead ? (listo ? "listo_pending_group_verification" : "identified") : "unmatched", error_code: leadError ? "lead_lookup_failed" : lead ? null : "lead_not_found", processed_at: new Date().toISOString() });
  if (inboundError) throw new Error("inbound_persistence_failed");
  if (leadError || !lead) return { action: "unmatched" as const };

  const groupLink = await getConfiguredGroupLink(client);
  const welcome = await sendOnce(client, lead, "welcome", `¡${firstName(lead.name)}, bienvenido a NO EMPRENDAS TODAVÍA! 🙌\n\nTu registro está confirmado.\n\nEste es el enlace para ingresar a nuestro grupo privado Antes de Emprender:\n\n${groupLink}\n\n**Es importante que ingreses:** este es nuestro único canal oficial para compartir los accesos, recordatorios e información de la masterclass.\n\nCuando estés dentro, vuelve a esta conversación y escribe **LISTO** para recibir tu regalo: **EL FILTRO ANTES DEL SÍ**. 🎁`);
  await recordEvent(client, lead.id, "conversation_confirmed", { source: "evolution", automated: true });
  await recordEvent(client, lead.id, "whatsapp_clicked", { source: "evolution", automated: true });
  if (listo) {
    await recordEvent(client, lead.id, "group_join_declared", { source: "whatsapp", automated: false });
    try {
      const matrix = await deliverMatrixForLead(client, lead);
      if (matrix.sent || matrix.duplicate) return { action: matrix.sent ? "matrix_sent" as const : "matrix_delivery_pending" as const, welcomeDuplicate: welcome.duplicate };
    } catch {
      await client.from("whatsapp_inbound_messages").update({ action: "matrix_delivery_failed", error_code: "matrix_delivery_failed" }).eq("provider_message_id", message.providerMessageId);
      return { action: "matrix_delivery_failed" as const, welcomeDuplicate: welcome.duplicate };
    }
    return { action: "listo_pending_group_verification" as const, welcomeDuplicate: welcome.duplicate };
  }
  return { action: "welcomed" as const, welcomeDuplicate: welcome.duplicate };
}
