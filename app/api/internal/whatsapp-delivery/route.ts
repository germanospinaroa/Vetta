import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { processDueWhatsAppDeliveries } from "@/lib/whatsapp-evolution";

function validToken(candidate: string | null, expected: string | undefined) {
  if (!candidate || !expected) return false;
  const left = Buffer.from(candidate);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  if (!validToken(request.headers.get("x-vetta-cron-token"), process.env.VETTA_WHATSAPP_CRON_TOKEN)) {
    return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await processDueWhatsAppDeliveries();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("whatsapp_delivery_worker_failed", { code: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ ok: false, code: "delivery_worker_failed" }, { status: 500 });
  }
}

