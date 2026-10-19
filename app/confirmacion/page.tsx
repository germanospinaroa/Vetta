import type { Metadata } from "next";
import { ConfirmationSalesPage } from "@/components/confirmation-sales-page";
import { getPublicConfig } from "@/lib/config";
import { cookies } from "next/headers";
import { verifyConfirmationToken } from "@/lib/confirmation";
import { findPersistedRegistration } from "@/lib/persistence";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Confirmación | NO EMPRENDAS TODAVÍA.", robots: { index: false, follow: false } };
export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const params = await searchParams;
  const config = getPublicConfig();
  const token = (await cookies()).get("vetta_registration_confirmation")?.value;
  const tokenValid = verifyConfirmationToken(token, params.code, config.cohort.id);
  const lead = tokenValid && params.code ? await findPersistedRegistration(params.code, config.cohort.id) : null;
  const whatsappHref = lead ? buildWhatsAppHref(config.whatsappNumber, lead.name, lead.registrationCode) : undefined;
  const firstName = lead?.name.trim().split(/\s+/)[0];
  return <ConfirmationSalesPage confirmed={Boolean(lead)} firstName={firstName} whatsappHref={whatsappHref} />;
}
