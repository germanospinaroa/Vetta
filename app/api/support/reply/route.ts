import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getAuthorizedAdmin } from "@/lib/admin-auth";

const replySchema = z.object({
  to: z.string().email().max(320),
  subject: z.string().trim().min(1).max(200),
  text: z.string().trim().min(1).max(50000),
});

export async function POST(request: Request) {
  const admin = await getAuthorizedAdmin("admin");
  if (!admin) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: false, code: "support_email_not_configured" }, { status: 503 });
  const parsed = replySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, code: "invalid_reply" }, { status: 400 });
  const result = await new Resend(key).emails.send({ from: "support@gritlab.pro", to: parsed.data.to, subject: parsed.data.subject, text: parsed.data.text });
  if (result.error) return NextResponse.json({ ok: false, code: "support_reply_failed" }, { status: 502 });
  return NextResponse.json({ ok: true, messageId: result.data?.id });
}
