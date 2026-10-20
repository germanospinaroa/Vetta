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

function welcomeText(name: string, groupLink: string) {
  return `¡${firstName(name)}, bienvenido a NO EMPRENDAS TODAVÍA! 🙌\n\nTu registro está confirmado.\n\nEste es el enlace para ingresar a nuestro grupo privado Antes de Emprender:\n\n${groupLink}\n\nTambién tienes acceso directo a tu regalo: EL FILTRO ANTES DEL SÍ 🎁\n\n${matrixLink()}\n\nEste mensaje contiene los accesos operativos de tu registro.`;
}

type EvolutionLead = { id: string; name: string; whatsapp_e164: string; registration_code: string };
type ConversationResolution = { lead: EvolutionLead | null; reason: "linked" | "code_linked" | "code_not_found" | "code_already_linked" | "rate_limited" | "conversation_not_found" };
const CODE_ATTEMPT_LIMIT = 10;

async function resolveLeadForConversation(client: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, message: ReturnType<typeof extractEvolutionMessage>): Promise<ConversationResolution> {
  if (!message.senderJid) return { lead: null, reason: "conversation_not_found" };
  const { data: linkedMessage, error: linkedError } = await client.from("whatsapp_inbound_messages").select("lead_id").eq("sender_jid", message.senderJid).not("lead_id", "is", null).order("received_at", { ascending: false }).limit(1).maybeSingle();
  if (linkedError) throw new Error("conversation_lookup_failed");
  if (linkedMessage?.lead_id) {
    const { data: linkedLead, error: leadError } = await client.from("leads").select("id,name,whatsapp_e164,registration_code").eq("id", linkedMessage.lead_id).eq("cohort_id", COHORT_ID).maybeSingle();
    if (leadError) throw new Error("conversation_lead_lookup_failed");
    return { lead: linkedLead as EvolutionLead | null, reason: "linked" };
  }
  if (!message.registrationCode) return { lead: null, reason: "conversation_not_found" };

  const { count: attempts, error: attemptError } = await client.from("whatsapp_inbound_messages").select("id", { count: "exact", head: true }).eq("sender_jid", message.senderJid).gte("received_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());
  if (attemptError) throw new Error("code_attempt_lookup_failed");
  if ((attempts || 0) >= CODE_ATTEMPT_LIMIT) return { lead: null, reason: "rate_limited" };

  const { data: candidate, error: candidateError } = await client.from("leads").select("id,name,whatsapp_e164,registration_code").eq("cohort_id", COHORT_ID).eq("registration_code", message.registrationCode).maybeSingle();
  if (candidateError) throw new Error("registration_code_lookup_failed");
  if (!candidate) return { lead: null, reason: "code_not_found" };
  const { data: otherLinks, error: otherLinkError } = await client.from("whatsapp_inbound_messages").select("sender_jid").eq("lead_id", candidate.id).not("sender_jid", "is", null).limit(20);
  if (otherLinkError) throw new Error("conversation_link_lookup_failed");
  const distinctJids = [...new Set((otherLinks || []).map((row) => row.sender_jid).filter((jid): jid is string => Boolean(jid)))];
  if (distinctJids.some((jid) => jid !== message.senderJid)) return { lead: null, reason: "code_already_linked" };
  return { lead: candidate as EvolutionLead, reason: "code_linked" };
}

async function recordEvent(client: ReturnType<typeof createSupabaseAdminClient>, leadId: string, name: string, properties: Record<string, string | boolean>) {
  await client?.from("lead_events").insert({ lead_id: leadId, cohort_id: COHORT_ID, name, properties });
}

async function sendOnce(client: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, lead: { id: string; name: string }, recipient: string, kind: "welcome" | "matrix", text: string) {
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
    const { data: inserted, error: insertError } = await client.from("whatsapp_outbound_messages").upsert({ lead_id: lead.id, kind, recipient_e164: recipient, status: "pending", error_code: null }, { onConflict: "lead_id,kind", ignoreDuplicates: true }).select("id,status").maybeSingle();
    if (insertError) throw new Error("outbound_state_failed");
    if (inserted) row = inserted;
  }
  if (!row) return { sent: false, duplicate: true, pending: true, providerMessageId: existing?.provider_message_id || null };
  try {
    const response = await sendEvolutionText(recipient, text);
    const responseKey = typeof response.key === "object" && response.key ? response.key as Record<string, unknown> : null;
    const nestedMessage = typeof response.message === "object" && response.message ? response.message as Record<string, unknown> : null;
    const nestedKey = nestedMessage && typeof nestedMessage.key === "object" && nestedMessage.key ? nestedMessage.key as Record<string, unknown> : null;
    const providerId = String(responseKey?.id || nestedKey?.id || response.id || "");
    const providerStatus = String(response.status || response.state || "").toUpperCase();
    if (!providerId || ["ERROR", "FAILED", "REJECTED"].includes(providerStatus)) throw new Error("evolution_message_not_accepted");
    await client.from("whatsapp_outbound_messages").update({ status: "sent", provider_message_id: providerId || null, sent_at: new Date().toISOString(), error_code: null }).eq("id", row.id);
    return { sent: true, duplicate: false, providerMessageId: providerId };
  } catch {
    await client.from("whatsapp_outbound_messages").update({ status: "failed", error_code: "evolution_send_failed" }).eq("id", row.id);
    throw new Error("evolution_send_failed");
  }
}

async function deliverMatrixForLead(client: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, lead: { id: string; name: string }, recipient: string) {
  const text = `¡Perfecto, ${firstName(lead.name)}! 🎁\n\nAquí tienes EL FILTRO ANTES DEL SÍ, tu diagnóstico interactivo para descubrir qué revisar antes de comprometerte con una oportunidad:\n\n${matrixLink()}\n\nRespóndelo y recibirás un análisis con tus principales hallazgos, señales de alerta y próximos pasos.\n\nRecuerda: los accesos a nuestros dos encuentros en vivo se compartirán en el grupo privado Antes de Emprender.`;
  const sent = await sendOnce(client, lead, recipient, "matrix", text);
  if (sent.sent) {
    await recordEvent(client, lead.id, "matrix_sent", { source: "evolution", automated: true });
    await client.from("whatsapp_inbound_messages").update({ action: "matrix_sent", error_code: null }).eq("lead_id", lead.id).in("action", ["listo_pending_group_verification", "matrix_delivery_failed"]);
  }
  return sent;
}

export async function deliverWelcomeForLead(lead: { id: string; name: string; whatsapp_e164: string }) {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const groupLink = await getConfiguredGroupLink(client);
  const welcome = await sendOnce(client, lead, lead.whatsapp_e164, "welcome", welcomeText(lead.name, groupLink));
  if (!welcome.sent && !welcome.duplicate) return { welcome, matrix: null };
  const matrix = await deliverMatrixForLead(client, lead, lead.whatsapp_e164);
  return { welcome, matrix };
}

export async function recoverPendingWelcomeDeliveries() {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const { data: pending, error } = await client.from("whatsapp_outbound_messages").select("lead_id").eq("kind", "welcome").in("status", ["pending", "failed"]).limit(20);
  if (error) throw new Error("pending_welcome_lookup_failed");
  let accepted = 0;
  let failed = 0;
  for (const row of pending || []) {
    const { data: lead } = await client.from("leads").select("id,name,whatsapp_e164").eq("id", row.lead_id).eq("cohort_id", COHORT_ID).maybeSingle();
    if (!lead) continue;
    try {
      const result = await deliverWelcomeForLead(lead);
      if (result.welcome.sent || result.welcome.duplicate) accepted += 1;
    } catch {
      failed += 1;
    }
  }
  return { pending: pending?.length || 0, accepted, failed };
}

export async function recoverWelcomeForRegistration(registrationCode: string) {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const { data: lead, error: leadError } = await client.from("leads").select("id,name,whatsapp_e164").eq("cohort_id", COHORT_ID).eq("registration_code", registrationCode).maybeSingle();
  if (leadError) throw new Error("registration_lookup_failed");
  if (!lead) throw new Error("registration_not_found");
  const { data: consent, error: consentError } = await client.from("consent_records").select("id").eq("lead_id", lead.id).eq("consent_type", "experience_communications").limit(1);
  if (consentError) throw new Error("communication_consent_lookup_failed");
  if (!consent?.length) throw new Error("operational_communication_not_authorized");
  const result = await deliverWelcomeForLead(lead);
  return {
    registrationCode,
    welcome: { sent: result.welcome.sent, duplicate: result.welcome.duplicate, pending: Boolean(result.welcome.pending), providerMessageId: result.welcome.providerMessageId },
    matrix: result.matrix ? { sent: result.matrix.sent, duplicate: result.matrix.duplicate, pending: Boolean(result.matrix.pending), providerMessageId: result.matrix.providerMessageId } : null,
  };
}

export async function recoverMatrixForRegistration(registrationCode: string) {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const { data: lead, error: leadError } = await client.from("leads").select("id,name,whatsapp_e164").eq("cohort_id", COHORT_ID).eq("registration_code", registrationCode).maybeSingle();
  if (leadError) throw new Error("registration_lookup_failed");
  if (!lead) throw new Error("registration_not_found");
  const { data: consent, error: consentError } = await client.from("consent_records").select("id").eq("lead_id", lead.id).eq("consent_type", "experience_communications").limit(1);
  if (consentError) throw new Error("communication_consent_lookup_failed");
  if (!consent?.length) throw new Error("operational_communication_not_authorized");
  const { data: welcome, error: welcomeError } = await client.from("whatsapp_outbound_messages").select("status").eq("lead_id", lead.id).eq("kind", "welcome").maybeSingle();
  if (welcomeError) throw new Error("welcome_state_lookup_failed");
  if (welcome?.status !== "sent") throw new Error("welcome_not_accepted");
  const matrix = await deliverMatrixForLead(client, lead, lead.whatsapp_e164);
  return { registrationCode, matrix: { sent: matrix.sent, duplicate: matrix.duplicate, pending: Boolean(matrix.pending), providerMessageId: matrix.providerMessageId } };
}

export async function recoverPendingMatrixDeliveries() {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const { data: pending, error } = await client.from("whatsapp_inbound_messages").select("lead_id,sender_jid").in("action", ["listo_pending_group_verification", "matrix_delivery_failed"]).not("lead_id", "is", null).limit(20);
  if (error) throw new Error("pending_matrix_lookup_failed");
  let delivered = 0;
  let failed = 0;
  for (const row of pending || []) {
    if (!row.lead_id) continue;
    const { data: lead } = await client.from("leads").select("id,name,whatsapp_e164").eq("id", row.lead_id).eq("cohort_id", COHORT_ID).maybeSingle();
    if (!lead) continue;
    try {
      const result = await deliverMatrixForLead(client, lead, row.sender_jid || lead.whatsapp_e164);
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
  const existing = await client.from("whatsapp_inbound_messages").select("id,action").eq("provider_message_id", message.providerMessageId).maybeSingle();
  if (existing.data) return { action: "duplicate" as const, reason: "provider_message_id" as const };
  if (message.remoteJid?.endsWith("@g.us") || message.senderJid?.endsWith("@g.us")) {
    return { action: "ignored" as const, reason: "group_message" as const };
  }
  const resolution = message.text ? await resolveLeadForConversation(client, message) : { lead: null, reason: "conversation_not_found" as const };
  if (!message.senderJid || !message.text || !resolution.lead) {
    const invalidError = !message.senderJid ? "conversation_not_resolved" : !message.text ? "text_not_resolved" : resolution.reason;
    const { error: invalidInsertError } = await client.from("whatsapp_inbound_messages").upsert({
      provider_message_id: message.providerMessageId,
      instance_name: INSTANCE,
      sender_jid: message.senderJid,
      sender_e164: message.senderE164,
      lead_id: null,
      event_name: message.eventName,
      message_kind: "text",
      message_hash: message.text ? createHash("sha256").update(message.text).digest("hex") : null,
      action: resolution.reason === "rate_limited" ? "rate_limited" : resolution.reason === "code_already_linked" ? "code_already_linked" : message.registrationCode ? "pending_sender_resolution" : "ignored_invalid_message",
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
    return { action: "unmatched" as const, reason: invalidError };
  }
  const lead = resolution.lead;
  const listo = /^listo\b/i.test(message.text);
  const { error: inboundError } = await client.from("whatsapp_inbound_messages").insert({ provider_message_id: message.providerMessageId, instance_name: INSTANCE, sender_jid: message.senderJid, sender_e164: message.senderE164 || null, lead_id: lead.id, event_name: message.eventName, message_kind: "text", message_hash: createHash("sha256").update(message.text).digest("hex"), action: listo ? "listo_pending_group_verification" : "identified", error_code: null, processed_at: new Date().toISOString() });
  if (inboundError) throw new Error("inbound_persistence_failed");

  const groupLink = await getConfiguredGroupLink(client);
  const welcome = await sendOnce(client, lead, message.senderJid, "welcome", welcomeText(lead.name, groupLink));
  await recordEvent(client, lead.id, "conversation_confirmed", { source: "evolution", automated: true });
  await recordEvent(client, lead.id, "whatsapp_clicked", { source: "evolution", automated: true });
  if (listo) {
    await recordEvent(client, lead.id, "group_join_declared", { source: "whatsapp", automated: false });
    try {
      const matrix = await deliverMatrixForLead(client, lead, message.senderJid);
      if (matrix.sent || matrix.duplicate) return { action: matrix.sent ? "matrix_sent" as const : "matrix_delivery_pending" as const, welcomeDuplicate: welcome.duplicate };
    } catch {
      await client.from("whatsapp_inbound_messages").update({ action: "matrix_delivery_failed", error_code: "matrix_delivery_failed" }).eq("provider_message_id", message.providerMessageId);
      return { action: "matrix_delivery_failed" as const, welcomeDuplicate: welcome.duplicate };
    }
    return { action: "listo_pending_group_verification" as const, welcomeDuplicate: welcome.duplicate };
  }
  if (welcome.sent || welcome.duplicate) {
    try { await deliverMatrixForLead(client, lead, message.senderJid); } catch { return { action: "matrix_delivery_failed" as const, welcomeDuplicate: welcome.duplicate }; }
  }
  return { action: "welcomed" as const, welcomeDuplicate: welcome.duplicate };
}
