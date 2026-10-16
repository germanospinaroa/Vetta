import { NextResponse } from "next/server";
import { getPublicConfig } from "@/lib/config";
import { saveDemoLead } from "@/lib/demo-store";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { persistRegistration } from "@/lib/persistence";
import { normalizeWhatsApp, registrationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: "validation_error", message: "Revisa los campos marcados." }, { status: 400 });
    }

    const config = getPublicConfig();
    if (config.cohort.status !== "open") {
      return NextResponse.json({ ok: false, code: "cohort_not_open", message: "La próxima cohorte todavía no está configurada." }, { status: 409 });
    }

    let normalizedPhone: string;
    try { normalizedPhone = normalizeWhatsApp(parsed.data.whatsapp, parsed.data.country); }
    catch { return NextResponse.json({ ok: false, code: "invalid_phone", message: "Escribe un número de WhatsApp válido para el país seleccionado." }, { status: 400 }); }
    let lead;
    try { lead = config.demoMode ? saveDemoLead(parsed.data, normalizedPhone, config.cohort.id) : await persistRegistration(parsed.data, normalizedPhone); }
    catch { return NextResponse.json({ ok: false, code: "persistence_error", message: "No pudimos guardar tu registro. Inténtalo de nuevo." }, { status: 503 }); }
    if (!lead) return NextResponse.json({ ok: false, code: "persistence_not_configured", message: "El registro está pendiente de configuración operativa." }, { status: 503 });
    return NextResponse.json({
      ok: true,
      registrationCode: lead.registrationCode,
      whatsappHref: buildWhatsAppHref(config.whatsappNumber, lead.name, lead.registrationCode),
      mode: config.demoMode ? "TEST" : "LIVE",
    });
  } catch {
    return NextResponse.json({ ok: false, code: "server_error", message: "No pudimos recibir el registro. Inténtalo de nuevo." }, { status: 500 });
  }
}
