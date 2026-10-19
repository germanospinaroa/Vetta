import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPublicConfig } from "@/lib/config";
import { processEvolutionMessage } from "@/lib/whatsapp-evolution";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = process.env.VETTA_EVOLUTION_DIAGNOSTIC_TOKEN;
  return Boolean(expected && request.headers.get("x-vetta-diagnostic-token") === expected);
}

function shapeMessage(value: unknown) {
  const item = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const key = item.key && typeof item.key === "object" ? item.key as Record<string, unknown> : {};
  const message = item.message && typeof item.message === "object" ? item.message as Record<string, unknown> : {};
  const remoteJid = typeof key.remoteJid === "string" ? key.remoteJid : null;
  return {
    idSuffix: typeof key.id === "string" ? key.id.slice(-8) : null,
    remoteJidType: remoteJid?.endsWith("@lid") ? "lid" : remoteJid?.endsWith("@s.whatsapp.net") ? "phone" : remoteJid?.includes("@") ? "other" : null,
    hasRemoteJidAlt: Boolean(key.remoteJidAlt),
    hasSenderPn: Boolean(key.senderPn || key.senderPN),
    participantType: typeof key.participant === "string" ? (key.participant.endsWith("@lid") ? "lid" : key.participant.includes("@") ? "jid" : "bare") : null,
    fromMe: key.fromMe === true,
    messageKeys: Object.keys(message).slice(0, 12),
    messageTimestamp: item.messageTimestamp || null,
  };
}

function messageList(value: unknown) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const body = value as Record<string, unknown>;
    if (Array.isArray(body.messages)) return body.messages;
    if (Array.isArray(body.data)) return body.data;
  }
  return [];
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  const client = createSupabaseAdminClient();
  const config = getPublicConfig();
  if (!client) return NextResponse.json({ ok: false, code: "supabase_unavailable" }, { status: 503 });

  const { data: leads, error: leadError } = await client.from("leads").select("id,name,whatsapp_e164,registration_code").eq("cohort_id", config.cohort.id).limit(2);
  if (leadError) return NextResponse.json({ ok: false, code: "lead_lookup_failed" }, { status: 503 });
  if (!leads || leads.length !== 1) return NextResponse.json({ ok: false, code: "diagnostic_requires_exactly_one_lead", count: leads?.length || 0 }, { status: 409 });
  const lead = leads[0];
  const evolutionUrl = process.env.EVOLUTION_API_URL?.trim().replace(/\/$/, "");
  const instance = process.env.EVOLUTION_INSTANCE?.trim() || "momentum";
  const apiKey = process.env.EVOLUTION_API_KEY?.trim();
  if (!evolutionUrl || !apiKey) return NextResponse.json({ ok: false, code: "evolution_runtime_config_unavailable" }, { status: 503 });

  const digits = lead.whatsapp_e164.replace(/\D/g, "");
  const remoteJids = [`${digits}@s.whatsapp.net`, `${digits}@c.us`, digits];
  let responseStatus = 0;
  let responseShape: string[] = [];
  let body: unknown = null;
  let matchedJidType: string | null = null;
  let messages: unknown[] = [];
  for (const remoteJid of remoteJids) {
    const response = await fetch(`${evolutionUrl}/chat/findMessages/${encodeURIComponent(instance)}`, {
      method: "POST",
      headers: { apikey: apiKey, "content-type": "application/json" },
      body: JSON.stringify({ where: { key: { remoteJid } } }),
      cache: "no-store",
    });
    responseStatus = response.status;
    const raw = await response.text();
    try { body = JSON.parse(raw); } catch { body = null; }
    responseShape = Array.isArray(body) ? ["array"] : body && typeof body === "object" ? Object.keys(body).slice(0, 8) : [typeof body];
    if (!response.ok) return NextResponse.json({ ok: false, code: "evolution_query_failed", status: response.status }, { status: 502 });
    messages = messageList(body);
    if (messages.length) {
      matchedJidType = remoteJid.endsWith("@s.whatsapp.net") ? "phone" : remoteJid.endsWith("@c.us") ? "c_us" : "bare";
      break;
    }
  }
  const parsedBody = await request.json().catch(() => ({})) as { action?: string };
  let reprocessed = 0;
  if (parsedBody.action === "reprocess") {
    for (const message of messages) {
      const item = message && typeof message === "object" ? message as Record<string, unknown> : {};
      const key = item.key && typeof item.key === "object" ? item.key as Record<string, unknown> : {};
      if (key.fromMe === true) continue;
      const result = await processEvolutionMessage(message);
      if (result.action !== "ignored" && result.action !== "ignored_invalid_message") reprocessed += 1;
    }
  }
  const { data: inbound } = await client.from("whatsapp_inbound_messages").select("id,action,error_code,provider_message_id,processed_at").eq("lead_id", lead.id).order("processed_at", { ascending: false }).limit(10);
  const { data: outbound } = await client.from("whatsapp_outbound_messages").select("kind,status,error_code,provider_message_id,sent_at").eq("lead_id", lead.id).order("sent_at", { ascending: false }).limit(10);
  return NextResponse.json({ ok: true, lead: { idSuffix: String(lead.id).slice(-8), firstName: String(lead.name).trim().split(/\s+/)[0], phoneSuffix: String(lead.whatsapp_e164).slice(-4) }, status: responseStatus, responseShape, matchedJidType, messageCount: messages.length, messages: messages.map(shapeMessage), reprocessed, persisted: { inbound: inbound || [], outbound: outbound || [] } });
}
