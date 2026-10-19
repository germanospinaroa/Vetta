import { createHash } from "node:crypto";

const INSTANCE = "momentum";

function normalizeEvolutionEventName(value: unknown, fallback = "") {
  return String(value || fallback).trim().toLowerCase().replace(/[_-]+/g, ".");
}

export function normalizeWhatsAppSender(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (/@lid$/i.test(trimmed)) return null;
  const raw = trimmed.replace(/@(?:s\.whatsapp\.net|c\.us)$/i, "").replace(/:[^@-]+$/, "");
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
}

export type EvolutionParticipantIdentity = {
  phoneE164: string | null;
  id: string | null;
  jid: string | null;
};

export function extractEvolutionParticipant(value: unknown): EvolutionParticipantIdentity {
  const item = asRecord(value);
  const id = typeof item.id === "string" ? item.id : null;
  const jid = typeof item.jid === "string" ? item.jid : null;
  const phoneE164 = normalizeWhatsAppSender(item.phoneNumber)
    || normalizeWhatsAppSender(item.number)
    || normalizeWhatsAppSender(item.phone);
  return { phoneE164, id, jid };
}

export function extractEvolutionGroupData(payload: unknown) {
  const root = asRecord(payload);
  const data = asRecord(root.data ?? root.body ?? root);
  const participants = Array.isArray(data.participants) ? data.participants : [];
  const groupJid = data.id ?? data.groupJid ?? data.remoteJid;
  const providerId = data.id && data.timestamp ? `${String(data.id)}:${String(data.timestamp)}` : root.id ?? data.id;
  return {
    eventName: normalizeEvolutionEventName(root.event ?? root.type),
    groupJid: typeof groupJid === "string" ? groupJid : null,
    providerId: typeof providerId === "string" ? providerId : null,
    participants: participants.map(extractEvolutionParticipant),
  };
}

export function matchesConfiguredEvolutionGroup(groupJid: string | null, configuredGroup: string | undefined) {
  return Boolean(groupJid && configuredGroup?.trim() && groupJid === configuredGroup.trim());
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

export function extractEvolutionMessage(payload: unknown) {
  const root = asRecord(payload);
  const data = asRecord(root.data ?? root.body ?? root);
  const key = asRecord(data.key ?? (asRecord(data.message).key));
  const message = asRecord(data.message ?? data);
  const nestedMessage = asRecord(message.ephemeralMessage ?? message.viewOnceMessage ?? message.viewOnceMessageV2);
  const messageBody = asRecord(nestedMessage.message ?? message);
  const remoteJid = key.remoteJid ?? data.remoteJid ?? data.sender;
  const sender = key.participant ?? data.participant ?? remoteJid;
  const phoneCandidates = [
    key.remoteJidAlt,
    key.senderPn,
    key.senderPN,
    data.remoteJidAlt,
    data.senderPn,
    data.senderPN,
    data.phoneNumber,
    sender,
  ];
  const text = messageBody.conversation
    ?? asRecord(messageBody.extendedTextMessage).text
    ?? data.text
    ?? data.body;
  const providerId = key.id ?? data.id ?? root.id;
  const timestamp = key.id ? "" : String(data.messageTimestamp ?? data.timestamp ?? "");
  const fallback = createHash("sha256").update(`${INSTANCE}|${String(sender)}|${timestamp}|${String(text)}`).digest("hex");
  return {
    eventName: normalizeEvolutionEventName(root.event ?? root.type, "messages.upsert"),
    providerMessageId: String(providerId || fallback).slice(0, 240),
    senderJid: typeof sender === "string" ? sender : null,
    senderE164: phoneCandidates.map(normalizeWhatsAppSender).find(Boolean) || null,
    text: typeof text === "string" ? text.trim() : "",
    fromMe: key.fromMe === true || data.fromMe === true,
    remoteJid: typeof remoteJid === "string" ? remoteJid : null,
  };
}
