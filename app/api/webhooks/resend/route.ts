import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const SUPPORT_EMAIL = "support@gritlab.pro";
const DESTINATION_EMAIL = "germanospinaroa@gmail.com";

function normalizedRecipients(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim().toLowerCase()) : [];
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!apiKey || !webhookSecret) return NextResponse.json({ ok: false, code: "support_email_not_configured" }, { status: 503 });

  const payload = await request.text();
  const resend = new Resend(apiKey);
  let event: Record<string, unknown>;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") || "",
        timestamp: request.headers.get("svix-timestamp") || "",
        signature: request.headers.get("svix-signature") || "",
      },
      webhookSecret,
    }) as unknown as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_webhook_signature" }, { status: 400 });
  }

  if (event.type !== "email.received") return NextResponse.json({ ok: true, ignored: true });
  const data = event.data && typeof event.data === "object" ? event.data as Record<string, unknown> : {};
  const emailId = typeof data.email_id === "string" ? data.email_id : "";
  if (!emailId || !normalizedRecipients(data.to).includes(SUPPORT_EMAIL)) return NextResponse.json({ ok: true, ignored: true });

  const db = createSupabaseAdminClient();
  if (!db) return NextResponse.json({ ok: false, code: "support_email_db_not_configured" }, { status: 503 });

  const { data: existing, error: lookupError } = await db.from("support_email_events").select("id,status").eq("email_id", emailId).maybeSingle();
  if (lookupError) return NextResponse.json({ ok: false, code: "support_email_db_error" }, { status: 503 });
  if (existing?.status === "forwarded") return NextResponse.json({ ok: true, duplicate: true });

  if (existing) {
    await db.from("support_email_events").update({ status: "processing", last_error: null, updated_at: new Date().toISOString() }).eq("id", existing.id);
  } else {
    const { error: insertError } = await db.from("support_email_events").insert({ email_id: emailId, event_id: request.headers.get("svix-id"), recipient: SUPPORT_EMAIL, status: "processing" });
    if (insertError && insertError.code !== "23505") return NextResponse.json({ ok: false, code: "support_email_db_error" }, { status: 503 });
    if (insertError?.code === "23505") return NextResponse.json({ ok: true, duplicate: true });
  }

  const forwarded = await resend.emails.receiving.forward({ emailId, to: DESTINATION_EMAIL, from: SUPPORT_EMAIL, passthrough: true });
  if (forwarded.error) {
    await db.from("support_email_events").update({ status: "failed", last_error: "resend_forward_failed", updated_at: new Date().toISOString() }).eq("email_id", emailId);
    return NextResponse.json({ ok: false, code: "support_email_forward_failed" }, { status: 502 });
  }
  await db.from("support_email_events").update({ status: "forwarded", forwarded_email_id: forwarded.data?.id || null, updated_at: new Date().toISOString() }).eq("email_id", emailId);
  return NextResponse.json({ ok: true, forwarded: true });
}
