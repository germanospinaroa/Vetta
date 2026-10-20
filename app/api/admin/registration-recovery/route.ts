import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";
import { createRecoveryToken, hashRecoveryToken } from "@/lib/confirmation";
import { getPublicConfig } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await getAuthorizedAdmin("admin");
  if (!admin) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { leadId?: unknown } | null;
  if (!body || typeof body.leadId !== "string" || !/^[0-9a-f-]{20,}$/i.test(body.leadId.trim())) {
    return NextResponse.json({ ok: false, code: "invalid_lead" }, { status: 400 });
  }
  const client = createSupabaseAdminClient();
  const config = getPublicConfig();
  if (!client) return NextResponse.json({ ok: false, code: "persistence_not_configured" }, { status: 503 });
  const { data: lead, error: leadError } = await client.from("leads").select("id").eq("id", body.leadId.trim()).eq("cohort_id", config.cohort.id).maybeSingle();
  if (leadError || !lead) return NextResponse.json({ ok: false, code: "recovery_unavailable" }, { status: 404 });
  const token = createRecoveryToken(String(lead.id), config.cohort.id);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const { error: auditError } = await client.from("lead_events").insert({
    lead_id: lead.id,
    cohort_id: config.cohort.id,
    name: "registration_recovery_issued",
    properties: { source: "admin", expires_at: expiresAt, token_hash: hashRecoveryToken(token) },
    created_by: admin.id,
  });
  if (auditError) return NextResponse.json({ ok: false, code: "recovery_audit_failed" }, { status: 503 });
  const url = new URL("/confirmacion", config.siteUrl);
  url.searchParams.set("recovery", token);
  return NextResponse.json({ ok: true, confirmationUrl: url.toString(), expiresAt }, { headers: { "cache-control": "no-store" } });
}
