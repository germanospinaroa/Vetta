import { createHash } from "node:crypto";
import { getPublicConfig } from "@/lib/config";
import { sendEvolutionText } from "@/lib/evolution";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { extractEvolutionGroupData, extractEvolutionMessage, matchesConfiguredEvolutionGroup } from "@/lib/whatsapp-evolution-parser";

const COHORT_ID = process.env.NEXT_PUBLIC_ACTIVE_COHORT_ID;
const INSTANCE = process.env.EVOLUTION_INSTANCE || "momentum";

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

function safeGroupLink() {
  return process.env.VETTA_GROUP_LINK || getPublicConfig().cohort.groupUrl;
}

function matrixLink() {
  return process.env.VETTA_MATRIX_URL || `${getPublicConfig().siteUrl}/matriz`;
}

async function recordEvent(client: ReturnType<typeof createSupabaseAdminClient>, leadId: string, name: string, properties: Record<string, string | boolean>) {
  await client?.from("lead_events").insert({ lead_id: leadId, cohort_id: COHORT_ID, name, properties });
}

async function sendOnce(client: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, lead: { id: string; name: string; whatsapp_e164: string }, kind: "welcome" | "matrix", text: string) {
  const { data: existing } = await client.from("whatsapp_outbound_messages").select("id,status,provider_message_id").eq("lead_id", lead.id).eq("kind", kind).maybeSingle();
  if (existing?.status === "sent") return { sent: false, duplicate: true };
  const { data: row, error: insertError } = await client.from("whatsapp_outbound_messages").upsert({ lead_id: lead.id, kind, recipient_e164: lead.whatsapp_e164, status: "pending", error_code: null }, { onConflict: "lead_id,kind" }).select("id,status").single();
  if (insertError || !row) throw new Error("outbound_state_failed");
  try {
    const response = await sendEvolutionText(lead.whatsapp_e164, text);
    const providerId = typeof response.key === "object" && response.key ? String((response.key as Record<string, unknown>).id || "") : undefined;
    await client.from("whatsapp_outbound_messages").update({ status: "sent", provider_message_id: providerId || null, sent_at: new Date().toISOString(), error_code: null }).eq("id", row.id);
    return { sent: true, duplicate: false };
  } catch {
    await client.from("whatsapp_outbound_messages").update({ status: "failed", error_code: "evolution_send_failed" }).eq("id", row.id);
    throw new Error("evolution_send_failed");
  }
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
      const { data: pendingListo } = await client.from("whatsapp_inbound_messages").select("id").eq("lead_id", lead.id).eq("action", "listo_pending_group_verification").limit(1).maybeSingle();
      if (pendingListo) {
        const sent = await sendOnce(client, lead, "matrix", `¡Perfecto, ${firstName(lead.name)}! Confirmamos tu ingreso al grupo.\n\nAquí tienes EL FILTRO ANTES DEL SÍ:\n${matrixLink()}\n\nGuárdalo para trabajar con él durante la masterclass.`);
        if (sent.sent) {
          await recordEvent(client, lead.id, "matrix_sent", { source: "evolution", automated: true });
          await client.from("whatsapp_inbound_messages").update({ action: "matrix_sent" }).eq("lead_id", lead.id).eq("action", "listo_pending_group_verification");
        }
      }
      verified += 1;
    }
    return { action: verified ? "group_join_verified" as const : "group_event_unmatched" as const };
  }
  const message = extractEvolutionMessage(payload);
  if (message.fromMe || message.eventName !== "messages.upsert") return { action: "ignored" as const };
  if (!message.senderE164 || !message.text) {
    console.warn("evolution_message_not_processable", {
      eventName: message.eventName,
      hasSenderJid: Boolean(message.senderJid),
      hasRemoteJid: Boolean(message.remoteJid),
      hasPhone: Boolean(message.senderE164),
      hasText: Boolean(message.text),
    });
    return { action: "ignored_invalid_message" as const };
  }

  const { data: existing } = await client.from("whatsapp_inbound_messages").select("id,action").eq("provider_message_id", message.providerMessageId).maybeSingle();
  if (existing) return { action: "duplicate" as const };

  const { data: lead, error: leadError } = await client.from("leads").select("id,name,whatsapp_e164,registration_code").eq("cohort_id", COHORT_ID).eq("whatsapp_e164", message.senderE164).maybeSingle();
  const listo = /^listo\b/i.test(message.text);
  const { error: inboundError } = await client.from("whatsapp_inbound_messages").insert({ provider_message_id: message.providerMessageId, instance_name: INSTANCE, sender_jid: message.senderJid, sender_e164: message.senderE164, lead_id: lead?.id || null, event_name: message.eventName, message_kind: "text", message_hash: createHash("sha256").update(message.text).digest("hex"), action: leadError ? "error" : lead ? (listo ? "listo_pending_group_verification" : "identified") : "unmatched", error_code: leadError ? "lead_lookup_failed" : lead ? null : "lead_not_found", processed_at: new Date().toISOString() });
  if (inboundError) throw new Error("inbound_persistence_failed");
  if (leadError || !lead) return { action: "unmatched" as const };

  const welcome = await sendOnce(client, lead, "welcome", `Hola, ${firstName(lead.name)}. Confirmamos que recibimos tu registro para NO EMPRENDAS TODAVÍA.\n\nEste es el grupo privado Antes de Emprender:\n${safeGroupLink()}\n\nCuando estés dentro, responde LISTO por aquí para continuar.`);
  await recordEvent(client, lead.id, "conversation_confirmed", { source: "evolution", automated: true });
  await recordEvent(client, lead.id, "whatsapp_clicked", { source: "evolution", automated: true });
  if (listo) {
    await recordEvent(client, lead.id, "group_join_declared", { source: "whatsapp", automated: false });
    return { action: "listo_pending_group_verification" as const, welcomeDuplicate: welcome.duplicate };
  }
  return { action: "welcomed" as const, welcomeDuplicate: welcome.duplicate };
}
