import { NextResponse } from "next/server";
import { authorizeCronRequest } from "@/lib/cron-auth";
import { processDueWhatsAppDeliveries } from "@/lib/whatsapp-evolution";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authorization = authorizeCronRequest(request);
  if (authorization === "not_configured") return NextResponse.json({ ok: false, code: "cron_not_configured" }, { status: 503 });
  if (!authorization) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ ok: true, ...(await processDueWhatsAppDeliveries()) });
  } catch (error) {
    console.error("whatsapp_delivery_cron_failed", { code: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ ok: false, code: "delivery_worker_failed" }, { status: 503, headers: { "retry-after": "30" } });
  }
}
