import { NextResponse } from "next/server";
import { processEvolutionMessage } from "@/lib/whatsapp-evolution";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = process.env.VETTA_EVOLUTION_WEBHOOK_SECRET;
  if (!expected) return false;
  const token = request.headers.get("x-vetta-evolution-token") || request.headers.get("x-webhook-token");
  const bearer = request.headers.get("authorization");
  return token === expected || bearer === `Bearer ${expected}`;
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 256 * 1024) return NextResponse.json({ ok: false, code: "payload_too_large" }, { status: 413 });
  const raw = await request.text();
  if (raw.length > 256 * 1024) return NextResponse.json({ ok: false, code: "payload_too_large" }, { status: 413 });
  let payload: unknown;
  try { payload = JSON.parse(raw); } catch { return NextResponse.json({ ok: false, code: "invalid_json" }, { status: 400 }); }
  try {
    const result = await processEvolutionMessage(payload);
    console.info("evolution_webhook_processed", { action: result.action, reason: "reason" in result ? result.reason : undefined });
    return NextResponse.json({ ok: true, action: result.action });
  } catch {
    console.error("evolution_webhook_processing_failed");
    return NextResponse.json({ ok: false, code: "processing_failed" }, { status: 503, headers: { "retry-after": "30" } });
  }
}
