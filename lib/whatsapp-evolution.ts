import { createHash } from "node:crypto";
import { getPublicConfig } from "@/lib/config";
import { fetchEvolutionGroupParticipants, sendEvolutionText } from "@/lib/evolution";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { canRetryOutbound, isOperationalDeliveryTarget, matchesOperationalRecipient, shouldScheduleMatrix } from "@/lib/whatsapp-operational";
import { buildOperationalMatrixText, buildOperationalWelcomeText, extractEvolutionGroupData, extractEvolutionMessage, extractEvolutionParticipants, matchesConfiguredEvolutionGroup, validateWhatsAppGroupUrl } from "@/lib/whatsapp-evolution-parser";

const COHORT_ID = process.env.NEXT_PUBLIC_ACTIVE_COHORT_ID;
const INSTANCE = process.env.EVOLUTION_INSTANCE || "momentum";
const CODE_ATTEMPT_LIMIT = 10;
type AdminClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;
type OperationalLead = { id: string; name: string; registration_code: string };
export type OperationalConversation = { id: string; lead_id: string; instance_name: string; sender_jid: string; sender_e164: string | null };
type ConversationResolution = { conversation: OperationalConversation | null; lead: OperationalLead | null; reason: "linked" | "code_linked" | "code_not_found" | "code_already_linked" | "rate_limited" | "conversation_not_found" };
export type GroupMembershipStatus = "CONFIRMADO" | "NO ENCONTRADO" | "NO VERIFICABLE";

function matrixLink() { return process.env.VETTA_MATRIX_URL || `${getPublicConfig().siteUrl}/matriz`; }

async function getConfiguredGroupLink(client: AdminClient) {
  const { data, error } = await client.from("cohorts").select("group_url").eq("id", COHORT_ID).maybeSingle();
  if (error || !data) throw new Error("group_link_configuration_unavailable");
  const groupLink = validateWhatsAppGroupUrl(data.group_url);
  if (!groupLink) throw new Error("group_link_configuration_invalid");
  return groupLink;
}

async function getLeadForConversation(client: AdminClient, leadId: string) {
  const { data, error } = await client.from("leads").select("id,name,registration_code").eq("id", leadId).maybeSingle();
  if (error || !data) throw new Error("conversation_lead_lookup_failed");
  return data as OperationalLead;
}

async function getConversationByJid(client: AdminClient, senderJid: string) {
  const { data, error } = await client.from("whatsapp_conversations").select("id,lead_id,instance_name,sender_jid,sender_e164").eq("instance_name", INSTANCE).eq("sender_jid", senderJid).eq("status", "active").order("linked_at", { ascending: false }).limit(1).maybeSingle();
  if (error) throw new Error("conversation_lookup_failed");
  return data as OperationalConversation | null;
}

async function getConversationById(client: AdminClient, conversationId: string) {
  const { data, error } = await client.from("whatsapp_conversations").select("id,lead_id,instance_name,sender_jid,sender_e164").eq("id", conversationId).eq("status", "active").maybeSingle();
  if (error) throw new Error("conversation_lookup_failed");
  return data as OperationalConversation | null;
}

async function resolveConversation(client: AdminClient, message: ReturnType<typeof extractEvolutionMessage>): Promise<ConversationResolution> {
  if (!message.senderJid) return { conversation: null, lead: null, reason: "conversation_not_found" };
  if (message.registrationCode) {
    const { count: attempts, error: attemptError } = await client.from("whatsapp_inbound_messages").select("id", { count: "exact", head: true }).eq("sender_jid", message.senderJid).gte("received_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());
    if (attemptError) throw new Error("code_attempt_lookup_failed");
    if ((attempts || 0) >= CODE_ATTEMPT_LIMIT) return { conversation: null, lead: null, reason: "rate_limited" };
    const { data, error } = await client.rpc("link_whatsapp_conversation", { p_cohort_id: COHORT_ID, p_registration_code: message.registrationCode, p_instance_name: INSTANCE, p_sender_jid: message.senderJid, p_sender_e164: message.senderE164, p_link_message_id: message.providerMessageId });
    if (error) throw new Error("conversation_link_failed");
    const result = data as { status?: string; lead_id?: string; conversation_id?: string } | null;
    if (!result?.lead_id || !result.conversation_id || ["lead_already_linked", "conversation_already_linked", "concurrent_link_conflict"].includes(result.status || "")) return { conversation: null, lead: null, reason: result?.status === "code_not_found" ? "code_not_found" : "code_already_linked" };
    return { conversation: await getConversationById(client, result.conversation_id), lead: await getLeadForConversation(client, result.lead_id), reason: result.status === "linked" ? "code_linked" : "linked" };
  }
  const existingConversation = await getConversationByJid(client, message.senderJid);
  if (existingConversation) return { conversation: existingConversation, lead: await getLeadForConversation(client, existingConversation.lead_id), reason: "linked" };
  return { conversation: null, lead: null, reason: "conversation_not_found" };
}

async function recordEvent(client: AdminClient, leadId: string, name: string, properties: Record<string, string | boolean>) { await client.from("lead_events").insert({ lead_id: leadId, cohort_id: COHORT_ID, name, properties }); }

async function sendOnce(client: AdminClient, conversation: OperationalConversation, lead: OperationalLead, kind: "welcome" | "matrix", text: string) {
  const { data: existing, error: lookupError } = await client.from("whatsapp_outbound_messages").select("id,status,provider_message_id,created_at,error_code").eq("conversation_id", conversation.id).eq("kind", kind).maybeSingle();
  if (lookupError) throw new Error("outbound_lookup_failed");
  if (existing?.status === "sent") return { sent: false, duplicate: true, providerMessageId: existing.provider_message_id || null };
  if (existing?.status === "attempting") return { sent: false, duplicate: true, pending: true, providerMessageId: existing.provider_message_id || null };
  if (existing?.status === "failed" && existing.error_code === "evolution_acceptance_uncertain") return { sent: false, duplicate: true, uncertain: true, providerMessageId: existing.provider_message_id || null };
  if (existing?.status === "pending" && existing.created_at && Date.now() - Date.parse(existing.created_at) < 5 * 60 * 1000) return { sent: false, duplicate: true, pending: true, providerMessageId: existing.provider_message_id || null };
  let row: { id: string } | null = null;
  if (existing && canRetryOutbound(existing.status, existing.error_code)) {
    const { data: claimed, error } = await client.from("whatsapp_outbound_messages").update({ status: "pending", error_code: null, claimed_at: null }).eq("id", existing.id).eq("status", existing.status).select("id").maybeSingle();
    if (error) throw new Error("outbound_claim_failed");
    row = claimed;
  } else if (!existing) {
    const { data: inserted, error } = await client.from("whatsapp_outbound_messages").insert({ lead_id: lead.id, conversation_id: conversation.id, kind, recipient_jid: conversation.sender_jid, recipient_e164: null, status: "pending", error_code: null }).select("id").maybeSingle();
    if (!error && inserted) row = inserted;
    else if (error?.code === "23505") {
      const { data: concurrent } = await client.from("whatsapp_outbound_messages").select("status,provider_message_id").eq("conversation_id", conversation.id).eq("kind", kind).maybeSingle();
      return { sent: false, duplicate: true, pending: concurrent?.status !== "failed", providerMessageId: concurrent?.provider_message_id || null };
    } else if (error) throw new Error("outbound_insert_failed");
  }
  if (!row) return { sent: false, duplicate: true, pending: true, providerMessageId: existing?.provider_message_id || null };
  try {
    const response = await sendEvolutionText(conversation.sender_jid, text);
    const responseKey = typeof response.key === "object" && response.key ? response.key as Record<string, unknown> : null;
    const nestedMessage = typeof response.message === "object" && response.message ? response.message as Record<string, unknown> : null;
    const nestedKey = nestedMessage && typeof nestedMessage.key === "object" && nestedMessage.key ? nestedMessage.key as Record<string, unknown> : null;
    const providerId = String(responseKey?.id || nestedKey?.id || response.id || "");
    const providerStatus = String(response.status || response.state || "").toUpperCase();
    if (!providerId || ["ERROR", "FAILED", "REJECTED"].includes(providerStatus)) throw new Error("evolution_message_not_accepted");
    const { error } = await client.from("whatsapp_outbound_messages").update({ status: "sent", provider_message_id: providerId, sent_at: new Date().toISOString(), error_code: null }).eq("id", row.id).eq("conversation_id", conversation.id);
    if (error) throw new Error("outbound_state_failed");
    return { sent: true, duplicate: false, providerMessageId: providerId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    const knownRejected = /^evolution_http_4\d\d$/.test(message) || message === "evolution_message_not_accepted";
    await client.from("whatsapp_outbound_messages").update({ status: "failed", error_code: knownRejected ? "evolution_rejected" : "evolution_acceptance_uncertain" }).eq("id", row.id).eq("conversation_id", conversation.id);
    throw new Error("evolution_send_failed");
  }
}

async function scheduleMatrixForConversation(client: AdminClient, conversation: OperationalConversation, lead: OperationalLead) {
  const scheduledFor = new Date(Date.now() + 2 * 60 * 1000).toISOString();
  const { data: existing, error: lookupError } = await client.from("whatsapp_outbound_messages").select("id,scheduled_for").eq("conversation_id", conversation.id).eq("kind", "matrix").maybeSingle();
  if (lookupError) throw new Error("matrix_schedule_lookup_failed");
  if (existing) return { scheduled: false, duplicate: true, scheduledFor: existing.scheduled_for || null };
  const { data: inserted, error } = await client.from("whatsapp_outbound_messages").insert({ lead_id: lead.id, conversation_id: conversation.id, kind: "matrix", recipient_jid: conversation.sender_jid, recipient_e164: null, status: "pending", scheduled_for: scheduledFor, attempt_count: 0, error_code: null }).select("id,scheduled_for").maybeSingle();
  if (error?.code === "23505") return { scheduled: false, duplicate: true, scheduledFor };
  if (error) throw new Error("matrix_schedule_failed");
  return { scheduled: Boolean(inserted), duplicate: false, scheduledFor: inserted?.scheduled_for || scheduledFor };
}

async function deliverWelcomeForConversation(client: AdminClient, conversation: OperationalConversation, lead: OperationalLead, scheduleMatrix: boolean) {
  const welcome = await sendOnce(client, conversation, lead, "welcome", buildOperationalWelcomeText(lead.name, await getConfiguredGroupLink(client)));
  const matrix = shouldScheduleMatrix(welcome.sent ? "sent" : welcome.duplicate ? "accepted" : null, false) && scheduleMatrix ? await scheduleMatrixForConversation(client, conversation, lead) : null;
  return { welcome, matrix };
}

async function deliverMatrixForConversation(client: AdminClient, conversation: OperationalConversation, lead: OperationalLead) {
  const result = await sendOnce(client, conversation, lead, "matrix", buildOperationalMatrixText(matrixLink()));
  if (result.sent) await recordEvent(client, lead.id, "matrix_sent", { source: "evolution", automated: true });
  return result;
}

export async function processDueWhatsAppDeliveries() {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const staleClaimCutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { count: staleAttempting, error: staleError } = await client.from("whatsapp_outbound_messages").select("id", { count: "exact", head: true }).eq("kind", "matrix").eq("status", "attempting").lt("claimed_at", staleClaimCutoff);
  if (staleError) throw new Error("stale_attempt_lookup_failed");
  if ((staleAttempting || 0) > 0) {
    await client.from("whatsapp_outbound_messages").update({ status: "failed", error_code: "evolution_acceptance_uncertain", claimed_at: null }).eq("kind", "matrix").eq("status", "attempting").lt("claimed_at", staleClaimCutoff);
  }
  const { data: rows, error } = await client.rpc("claim_due_whatsapp_messages", { p_limit: 20 });
  if (error) throw new Error("due_message_claim_failed");
  const results = [];
  for (const row of rows || []) {
    const conversation = row.conversation_id ? await getConversationById(client, row.conversation_id) : null;
    const lead = conversation ? await getLeadForConversation(client, conversation.lead_id) : null;
    if (!conversation || !lead || !isOperationalDeliveryTarget(row) || !matchesOperationalRecipient(conversation.sender_jid, row.recipient_jid)) {
      await client.from("whatsapp_outbound_messages").update({ status: "failed", error_code: "operational_conversation_missing", claimed_at: null }).eq("id", row.id).eq("status", "attempting");
      results.push({ status: "failed", reason: "operational_conversation_missing" });
      continue;
    }
    try { results.push({ ...(await deliverMatrixForConversation(client, conversation, lead)), status: "processed" }); } catch { results.push({ status: "failed", reason: "evolution_send_failed" }); }
  }
  return { claimed: rows?.length || 0, staleAttempting: staleAttempting || 0, results };
}

export async function processEvolutionMessage(payload: unknown) {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const group = extractEvolutionGroupData(payload);
  const configuredGroup = process.env.VETTA_GROUP_JID?.trim();
  if (matchesConfiguredEvolutionGroup(group.groupJid, configuredGroup) && group.participants.length > 0 && group.eventName.includes("group")) {
    const { data: conversations } = await client.from("whatsapp_conversations").select("id,lead_id,sender_jid,sender_e164").eq("instance_name", INSTANCE).eq("status", "active");
    let verified = 0;
    for (const participant of group.participants) {
      const conversation = (conversations || []).find((item) => item.sender_jid === (participant.id || participant.jid) || Boolean(item.sender_e164 && participant.phoneE164 && item.sender_e164 === participant.phoneE164));
      if (!conversation) continue;
      const providerId = group.providerId || createHash("sha256").update(`${group.groupJid}|${conversation.id}|${group.eventName}`).digest("hex");
      const { error: inserted } = await client.from("whatsapp_inbound_messages").insert({ provider_message_id: `${providerId}:${conversation.id}`, instance_name: INSTANCE, sender_jid: participant.id || participant.jid, sender_e164: participant.phoneE164, lead_id: conversation.lead_id, event_name: group.eventName, message_kind: "group_participant", action: "group_join_verified", processed_at: new Date().toISOString() });
      if (inserted?.code === "23505") continue;
      if (inserted) throw new Error("group_event_persistence_failed");
      await recordEvent(client, conversation.lead_id, "group_join_verified", { source: "evolution", automated: true, verification_method: "automatic" });
      verified += 1;
    }
    return { action: verified ? "group_join_verified" as const : "group_event_unmatched" as const };
  }
  const message = extractEvolutionMessage(payload);
  if (message.eventName !== "messages.upsert") return { action: "ignored" as const, reason: "unsupported_event" as const };
  if (message.fromMe) return { action: "ignored" as const, reason: "from_me" as const };
  const { data: duplicate } = await client.from("whatsapp_inbound_messages").select("id").eq("provider_message_id", message.providerMessageId).maybeSingle();
  if (duplicate) return { action: "duplicate" as const, reason: "provider_message_id" as const };
  if (message.remoteJid?.endsWith("@g.us") || message.senderJid?.endsWith("@g.us")) return { action: "ignored" as const, reason: "group_message" as const };
  const resolution = await resolveConversation(client, message);
  if (!resolution.conversation || !resolution.lead) {
    const action = resolution.reason === "rate_limited" ? "rate_limited" : resolution.reason === "code_already_linked" ? "code_already_linked" : message.registrationCode ? "pending_sender_resolution" : "ignored_invalid_message";
    await client.from("whatsapp_inbound_messages").insert({ provider_message_id: message.providerMessageId, instance_name: INSTANCE, sender_jid: message.senderJid, sender_e164: message.senderE164, lead_id: null, event_name: message.eventName, message_kind: "text", message_hash: message.text ? createHash("sha256").update(message.text).digest("hex") : null, action, error_code: resolution.reason, processed_at: new Date().toISOString() });
    return { action: "unmatched" as const, reason: resolution.reason };
  }
  const listo = /^listo\b/i.test(message.text);
  const { error: inboundError } = await client.from("whatsapp_inbound_messages").insert({ provider_message_id: message.providerMessageId, instance_name: INSTANCE, sender_jid: message.senderJid, sender_e164: message.senderE164 || null, lead_id: resolution.lead.id, event_name: message.eventName, message_kind: "text", message_hash: createHash("sha256").update(message.text).digest("hex"), action: listo ? "listo_received" : "identified", error_code: null, processed_at: new Date().toISOString() });
  if (inboundError) throw new Error("inbound_persistence_failed");
  await recordEvent(client, resolution.lead.id, "conversation_confirmed", { source: "evolution", automated: true });
  await recordEvent(client, resolution.lead.id, "whatsapp_clicked", { source: "evolution", automated: true });
  if (listo) await recordEvent(client, resolution.lead.id, "group_join_declared", { source: "whatsapp", automated: false });
  const delivery = message.registrationCode ? await deliverWelcomeForConversation(client, resolution.conversation, resolution.lead, true) : null;
  return { action: delivery?.welcome.sent ? "welcomed" as const : "identified" as const, welcomeDuplicate: Boolean(delivery?.welcome.duplicate) };
}

export async function getGroupMembershipReport() {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const configuredGroup = process.env.VETTA_GROUP_JID?.trim();
  if (!configuredGroup) throw new Error("group_jid_configuration_unavailable");
  const [{ data: leads, error: leadsError }, { data: conversations, error: conversationError }, { data: events, error: eventsError }] = await Promise.all([
    client.from("leads").select("id,name,registration_code").eq("cohort_id", COHORT_ID).order("created_at", { ascending: true }),
    client.from("whatsapp_conversations").select("id,lead_id,sender_jid,sender_e164,status").eq("instance_name", INSTANCE).eq("status", "active"),
    client.from("lead_events").select("lead_id,properties").eq("cohort_id", COHORT_ID).eq("name", "group_join_verified"),
  ]);
  if (leadsError || conversationError || eventsError) throw new Error("group_membership_lookup_failed");
  let participants: ReturnType<typeof extractEvolutionParticipants> = [];
  let providerReachable = true;
  try { participants = extractEvolutionParticipants(await fetchEvolutionGroupParticipants(configuredGroup)); } catch { providerReachable = false; }
  const manual = new Set((events || []).filter((event) => (event.properties as Record<string, unknown> | null)?.verification_method === "manual").map((event) => String(event.lead_id)));
  const unresolvedIdentifiers = participants.some((participant) => !participant.phoneE164 && /@lid$/i.test(`${participant.id || ""} ${participant.jid || ""}`));
  const rows = (leads || []).map((lead) => {
    const conversation = (conversations || []).find((item) => String(item.lead_id) === String(lead.id));
    const automaticMatch = Boolean(conversation && participants.some((participant) => participant.id === conversation.sender_jid || participant.jid === conversation.sender_jid || Boolean(conversation.sender_e164 && participant.phoneE164 && conversation.sender_e164 === participant.phoneE164)));
    const manuallyConfirmed = manual.has(String(lead.id));
    const status: GroupMembershipStatus = manuallyConfirmed || automaticMatch ? "CONFIRMADO" : !providerReachable || unresolvedIdentifiers || !conversation ? "NO VERIFICABLE" : "NO ENCONTRADO";
    return { id: String(lead.id), name: lead.name, registrationCode: lead.registration_code, status, method: manuallyConfirmed ? "manual" as const : automaticMatch ? "evolution_conversation" as const : null };
  });
  return { groupJid: configuredGroup, providerReachable, participantCount: participants.length, unresolvedIdentifiers, rows };
}

export async function recordManualGroupConfirmation(leadId: string, operatorId: string) {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const { data: lead, error: leadError } = await client.from("leads").select("id").eq("id", leadId).eq("cohort_id", COHORT_ID).maybeSingle();
  if (leadError) throw new Error("lead_lookup_failed");
  if (!lead) throw new Error("lead_not_found");
  const { data: existing, error: existingError } = await client.from("lead_events").select("id").eq("lead_id", leadId).eq("cohort_id", COHORT_ID).eq("name", "group_join_verified").contains("properties", { verification_method: "manual" }).limit(1);
  if (existingError) throw new Error("manual_confirmation_lookup_failed");
  if (existing?.length) return { recorded: false, duplicate: true };
  const { error } = await client.from("lead_events").insert({ lead_id: leadId, cohort_id: COHORT_ID, name: "group_join_verified", properties: { source: "operator", automated: false, verification_method: "manual" }, created_by: operatorId });
  if (error) throw new Error("manual_confirmation_failed");
  return { recorded: true, duplicate: false };
}

export async function recoverPendingWelcomeDeliveries() { return { pending: 0, accepted: 0, failed: 0, reason: "legacy_phone_delivery_disabled" }; }

export async function recoverWelcomeForRegistration(registrationCode: string) {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const { data: lead, error } = await client.from("leads").select("id,name,registration_code").eq("cohort_id", COHORT_ID).eq("registration_code", registrationCode).maybeSingle();
  if (error) throw new Error("registration_lookup_failed");
  if (!lead) throw new Error("registration_not_found");
  const { data: conversation } = await client.from("whatsapp_conversations").select("id,lead_id,instance_name,sender_jid,sender_e164").eq("lead_id", lead.id).eq("instance_name", INSTANCE).eq("status", "active").maybeSingle();
  if (!conversation) throw new Error("conversation_not_validated");
  const result = await deliverWelcomeForConversation(client, conversation as OperationalConversation, lead as OperationalLead, true);
  return { registrationCode, welcome: result.welcome, matrix: result.matrix };
}

export async function recoverMatrixForRegistration(registrationCode: string) {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const { data: lead, error } = await client.from("leads").select("id,name,registration_code").eq("cohort_id", COHORT_ID).eq("registration_code", registrationCode).maybeSingle();
  if (error) throw new Error("registration_lookup_failed");
  if (!lead) throw new Error("registration_not_found");
  const { data: conversation } = await client.from("whatsapp_conversations").select("id,lead_id,instance_name,sender_jid,sender_e164").eq("lead_id", lead.id).eq("instance_name", INSTANCE).eq("status", "active").maybeSingle();
  if (!conversation) throw new Error("conversation_not_validated");
  const { data: welcome } = await client.from("whatsapp_outbound_messages").select("status").eq("conversation_id", conversation.id).eq("kind", "welcome").maybeSingle();
  if (welcome?.status !== "sent") throw new Error("welcome_not_accepted");
  const result = await deliverMatrixForConversation(client, conversation as OperationalConversation, lead as OperationalLead);
  return { registrationCode, matrix: result, reason: "manual_recovery" as const };
}

export async function recoverPendingMatrixDeliveries() {
  const client = createSupabaseAdminClient();
  if (!client || !COHORT_ID) throw new Error("supabase_not_configured");
  const { data: pending, error } = await client.from("whatsapp_outbound_messages").select("id,conversation_id,recipient_jid,error_code").eq("kind", "matrix").in("status", ["pending", "failed"]).neq("error_code", "evolution_acceptance_uncertain").not("conversation_id", "is", null).limit(20);
  if (error) throw new Error("pending_matrix_lookup_failed");
  let delivered = 0;
  let failed = 0;
  for (const row of pending || []) {
    const conversation = row.conversation_id ? await getConversationById(client, row.conversation_id) : null;
    const lead = conversation ? await getLeadForConversation(client, conversation.lead_id) : null;
    if (!conversation || !lead || !isOperationalDeliveryTarget(row) || !matchesOperationalRecipient(conversation.sender_jid, row.recipient_jid)) { failed += 1; continue; }
    try { const result = await deliverMatrixForConversation(client, conversation, lead); if (result.sent || result.duplicate) delivered += 1; } catch { failed += 1; }
  }
  return { pending: pending?.length || 0, delivered, failed };
}
