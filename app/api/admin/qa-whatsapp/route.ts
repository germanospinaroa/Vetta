import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "@/lib/admin-auth";
import { getPublicConfig } from "@/lib/config";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { persistQaRegistration } from "@/lib/persistence";
import { normalizeWhatsApp, registrationSchema } from "@/lib/validation";
import { getGroupMembershipReport, recordManualGroupConfirmation, recoverMatrixForRegistration, recoverPendingMatrixDeliveries, recoverPendingWelcomeDeliveries, recoverWelcomeForRegistration } from "@/lib/whatsapp-evolution";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body?.action === "recover_pending_matrix") {
      const recoveryToken = process.env.VETTA_RECOVERY_TOKEN;
      if (recoveryToken && request.headers.get("x-vetta-recovery-token") === recoveryToken) {
        const result = await recoverPendingMatrixDeliveries();
        return NextResponse.json({ ok: true, recovery: result }, { headers: { "cache-control": "no-store" } });
      }
    }
    if (body?.action === "recover_pending_welcome") {
      const recoveryToken = process.env.VETTA_RECOVERY_TOKEN;
      if (recoveryToken && request.headers.get("x-vetta-recovery-token") === recoveryToken) {
        const result = await recoverPendingWelcomeDeliveries();
        return NextResponse.json({ ok: true, recovery: result }, { headers: { "cache-control": "no-store" } });
      }
    }
    if (body?.action === "recover_registration_welcome" && typeof body.registrationCode === "string") {
      const recoveryToken = process.env.VETTA_RECOVERY_TOKEN;
      if (recoveryToken && request.headers.get("x-vetta-recovery-token") === recoveryToken) {
        const result = await recoverWelcomeForRegistration(body.registrationCode.trim().toUpperCase());
        return NextResponse.json({ ok: true, recovery: result }, { headers: { "cache-control": "no-store" } });
      }
    }
    if (body?.action === "recover_registration_matrix" && typeof body.registrationCode === "string") {
      const recoveryToken = process.env.VETTA_RECOVERY_TOKEN;
      if (recoveryToken && request.headers.get("x-vetta-recovery-token") === recoveryToken) {
        const result = await recoverMatrixForRegistration(body.registrationCode.trim().toUpperCase());
        return NextResponse.json({ ok: true, recovery: result }, { headers: { "cache-control": "no-store" } });
      }
    }
    const admin = await getAuthorizedAdmin("admin");
    if (!admin) return NextResponse.json({ ok: false, code: "unauthorized" }, { status: 401 });
    if (body?.action === "verify_group_members") {
      const result = await getGroupMembershipReport();
      return NextResponse.json({ ok: true, verification: result }, { headers: { "cache-control": "no-store" } });
    }
    if (body?.action === "confirm_group_membership_manual" && typeof body.leadId === "string") {
      const result = await recordManualGroupConfirmation(body.leadId.trim());
      return NextResponse.json({ ok: true, confirmation: result }, { headers: { "cache-control": "no-store" } });
    }
    if (body?.action === "recover_pending_matrix") {
      const result = await recoverPendingMatrixDeliveries();
      return NextResponse.json({ ok: true, recovery: result });
    }
    if (body?.action === "recover_pending_welcome") {
      const result = await recoverPendingWelcomeDeliveries();
      return NextResponse.json({ ok: true, recovery: result });
    }
    if (body?.action === "recover_registration_welcome" && typeof body.registrationCode === "string") {
      const result = await recoverWelcomeForRegistration(body.registrationCode.trim().toUpperCase());
      return NextResponse.json({ ok: true, recovery: result });
    }
    if (body?.action === "recover_registration_matrix" && typeof body.registrationCode === "string") {
      const result = await recoverMatrixForRegistration(body.registrationCode.trim().toUpperCase());
      return NextResponse.json({ ok: true, recovery: result });
    }
    const parsed = registrationSchema.safeParse({ ...body, consent: "on", consentVersion: "v1", utm_campaign: "vetta_qa_whatsapp" });
    if (!parsed.success) return NextResponse.json({ ok: false, code: "validation_error", message: "Revisa los datos del participante QA." }, { status: 400 });
    let phone: string;
    try { phone = normalizeWhatsApp(parsed.data.whatsapp, parsed.data.country); }
    catch { return NextResponse.json({ ok: false, code: "invalid_phone", message: "El teléfono no es válido para el país seleccionado." }, { status: 400 }); }
    const lead = await persistQaRegistration(parsed.data, phone);
    if (!lead) return NextResponse.json({ ok: false, code: "persistence_not_configured" }, { status: 503 });
    const config = getPublicConfig();
    return NextResponse.json({ ok: true, qa: true, registrationCode: lead.registrationCode, whatsappHref: buildWhatsAppHref(config.whatsappNumber, lead.name, lead.registrationCode) });
  } catch (error) {
    if (error instanceof Error && error.message === "duplicate_registration") return NextResponse.json({ ok: false, code: "duplicate_registration", message: "Ese teléfono ya tiene un registro en esta cohorte." }, { status: 409 });
    return NextResponse.json({ ok: false, code: "persistence_error", message: "No se pudo crear el registro QA." }, { status: 503 });
  }
}
