import { NextResponse } from "next/server";
import { eventSchema } from "@/lib/validation";
import { persistPublicEvent } from "@/lib/persistence";

const publicEvents = new Set(["landing_viewed", "registration_started", "registration_failed", "whatsapp_clicked", "assessment_started", "matrix_opened"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false, code: "invalid_event" }, { status: 400 });
    if (!publicEvents.has(parsed.data.name)) return NextResponse.json({ ok: false, code: "operator_event_requires_auth" }, { status: 403 });

    if (process.env.VETTA_DEMO_MODE === "true") return NextResponse.json({ ok: true, mode: "TEST" });
    const persisted = await persistPublicEvent(parsed.data);
    return persisted ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, code: "tracking_not_configured" }, { status: 503 });
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_request" }, { status: 400 });
  }
}
