import { NextResponse } from "next/server";
import { getPublicConfig } from "@/lib/config";
import { saveDemoLead } from "@/lib/demo-store";
import { buildGenericWhatsAppHref, buildWhatsAppHref } from "@/lib/whatsapp";
import { persistRegistration } from "@/lib/persistence";
import { normalizeWhatsApp, registrationSchema } from "@/lib/validation";
import { createConfirmationToken } from "@/lib/confirmation";
import { cookies } from "next/headers";
import { hasValidQaSession, qaSessionCookieName } from "@/lib/qa-session";
import { deliverWelcomeForLead } from "@/lib/whatsapp-evolution";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "validation_error", message: "Revisa los campos marcados." }, { status: 400 });
    }

    const config = getPublicConfig();
    const qa = hasValidQaSession((await cookies()).get(qaSessionCookieName)?.value);
    if (config.cohort.status !== "open" && !qa) {
      return NextResponse.json({ ok: false, code: "cohort_not_open", message: "La próxima cohorte todavía no está configurada." }, { status: 409 });
    }

    let normalizedPhone: string;
    try { normalizedPhone = normalizeWhatsApp(parsed.data.whatsapp, parsed.data.country); }
    catch { return NextResponse.json({ ok: false, code: "invalid_phone", message: "Escribe un número de WhatsApp válido para el país seleccionado." }, { status: 400 }); }
    let lead;
    try { lead = config.demoMode ? saveDemoLead(parsed.data, normalizedPhone, config.cohort.id) : await persistRegistration(parsed.data, normalizedPhone, { qa }); }
    catch (error) {
      if (error instanceof Error && error.message === "duplicate_registration") {
        return NextResponse.json({ ok: true, existing: true, newRegistration: false, mode: config.demoMode ? "TEST" : "LIVE", whatsappHref: buildGenericWhatsAppHref(config.whatsappNumber) });
      }
      return NextResponse.json({ ok: false, code: "persistence_error", message: "No pudimos guardar tu registro. Inténtalo de nuevo." }, { status: 503 });
    }
    if (!lead) return NextResponse.json({ ok: false, code: "persistence_not_configured", message: "El registro está pendiente de configuración operativa." }, { status: 503 });
    let operationalDelivery: "accepted" | "pending" | "failed" = "pending";
    if (!config.demoMode && !qa && "id" in lead && "whatsappE164" in lead) {
      try {
        const delivery = await deliverWelcomeForLead({ id: lead.id, name: lead.name, whatsapp_e164: lead.whatsappE164 });
        operationalDelivery = delivery.welcome.sent || delivery.welcome.duplicate ? "accepted" : "pending";
      } catch {
        operationalDelivery = "failed";
      }
    }
    const response = NextResponse.json({
      ok: true,
      existing: false,
      newRegistration: true,
      registrationCode: lead.registrationCode,
      whatsappHref: buildWhatsAppHref(config.whatsappNumber, lead.name, lead.registrationCode),
      mode: config.demoMode ? "TEST" : "LIVE",
      operationalDelivery,
    });
    if (!config.demoMode) response.cookies.set("vetta_registration_confirmation", createConfirmationToken(lead.registrationCode, config.cohort.id), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/confirmacion", maxAge: 1800 });
    return response;
  } catch {
    return NextResponse.json({ ok: false, code: "server_error", message: "No pudimos recibir el registro. Inténtalo de nuevo." }, { status: 500 });
  }
}
