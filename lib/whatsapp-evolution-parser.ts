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

export function extractRegistrationCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value.match(/\b((?:VETTA|QA)-[A-Z0-9]{8})\b/i);
  return match?.[1]?.toUpperCase() || null;
}

export function buildOperationalWelcomeText(name: string, groupLink: string) {
  const firstName = name.trim().split(/\s+/)[0] || name;
  return `¡Hola, ${firstName}! 👋\n\n¡Bienvenido a *NO EMPRENDAS TODAVÍA*! 🎉\n\nTu inscripción está confirmada.\n\nTenemos dos encuentros preparados para abrir nuevas perspectivas y explorar otras posibilidades de emprender.\n\n📅 *20 y 22 de octubre*\n🕗 *8:00 p. m. · Hora de Colombia*\n\nLo primero es unirte a nuestro grupo privado. Allí compartiremos los accesos a los encuentros y las novedades importantes.\n\n👇 *Ingresa aquí:*\n${groupLink}\n\n¡Nos vemos dentro! 🚀`;
}

export function buildOperationalMatrixText(matrixUrl: string) {
  return `🎁 *¡Y ahora sí, un regalo para ti!*\n\nExplora seis maneras de construir una actividad empresarial, comprende qué hay detrás y compara tus próximos movimientos.\n\nPor eso preparamos *TU PRÓXIMO MOVIMIENTO*, una experiencia para descubrir tu siguiente posibilidad.\n\n✨ Puedes entrar aunque todavía estés explorando.\n\n👇 *Descubre la experiencia:*\n${matrixUrl}`;
}

export function validateWhatsAppGroupUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.hostname !== "chat.whatsapp.com" || !url.pathname.slice(1)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export type EvolutionParticipantIdentity = {
  phoneE164: string | null;
  id: string | null;
  jid: string | null;
};

export function extractEvolutionParticipant(value: unknown): EvolutionParticipantIdentity {
  const item = asRecord(value);
  const id = typeof item.id === "string" ? item.id : null;
  const jid = firstString(item.jid, item.remoteJid, item.remote_jid);
  const phoneE164 = normalizeWhatsAppSender(item.id)
    || normalizeWhatsAppSender(item.jid)
    || normalizeWhatsAppSender(item.remoteJid)
    || normalizeWhatsAppSender(item.phoneNumber)
    || normalizeWhatsAppSender(item.number)
    || normalizeWhatsAppSender(item.phone)
    || normalizeWhatsAppSender(item.pn)
    || normalizeWhatsAppSender(item.senderPn)
    || normalizeWhatsAppSender(item.sender_pn)
    || normalizeWhatsAppSender(item.remoteJidAlt)
    || normalizeWhatsAppSender(item.remote_jid_alt);
  return { phoneE164, id, jid };
}

export function extractEvolutionParticipants(value: unknown): EvolutionParticipantIdentity[] {
  const root = asRecord(value);
  const candidates = Array.isArray(value)
    ? value
    : Array.isArray(root.participants)
      ? root.participants
      : Array.isArray(root.data)
        ? root.data
        : Array.isArray(asRecord(root.data).participants)
          ? asRecord(root.data).participants
          : [];
  const candidateList = candidates as unknown[];
  const seen = new Set<string>();
  return candidateList.map(extractEvolutionParticipant).filter((participant) => {
    const key = participant.id || participant.jid || participant.phoneE164;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
  const remoteJid = key.remoteJid ?? data.remoteJid ?? data.remote_jid ?? data.sender;
  const sender = firstString(key.participant, data.participant, data.senderJid, data.sender_jid, remoteJid);
  const phoneCandidates = [
    key.remoteJid,
    key.remoteJidAlt,
    key.remote_jid_alt,
    key.senderPn,
    key.senderPN,
    key.sender_pn,
    key.phoneNumber,
    key.phone_number,
    data.remoteJidAlt,
    data.remote_jid_alt,
    data.senderPn,
    data.senderPN,
    data.sender_pn,
    data.phoneNumber,
    data.phone_number,
    data.phone,
    data.from,
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
    senderJid: typeof remoteJid === "string" ? remoteJid.trim() : typeof sender === "string" ? sender : null,
    senderE164: phoneCandidates.map(normalizeWhatsAppSender).find(Boolean) || null,
    registrationCode: extractRegistrationCode(text),
    text: typeof text === "string" ? text.trim() : "",
    fromMe: key.fromMe === true || data.fromMe === true,
    remoteJid: typeof remoteJid === "string" ? remoteJid : null,
  };
}

function firstString(...values: unknown[]) {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0)?.trim() || null;
}
