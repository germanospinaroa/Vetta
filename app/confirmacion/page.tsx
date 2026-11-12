import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { ConfirmationSalesPage } from "@/components/confirmation-sales-page";
import { getPublicConfig } from "@/lib/config";
import { cookies } from "next/headers";
import { verifyConfirmationToken, verifyRecoveryToken } from "@/lib/confirmation";
import { findPersistedRegistration, findPersistedRegistrationById } from "@/lib/persistence";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Confirmación | NO EMPRENDAS TODAVÍA.", robots: { index: false, follow: false } };
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-sales-manrope" });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sales-inter" });
export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ code?: string; recovery?: string }> }) {
  const params = await searchParams;
  const config = getPublicConfig();
  const token = (await cookies()).get("vetta_registration_confirmation")?.value;
  const recovery = verifyRecoveryToken(params.recovery, config.cohort.id);
  const tokenValid = verifyConfirmationToken(token, params.code, config.cohort.id);
  const lead = tokenValid && params.code
    ? await findPersistedRegistration(params.code, config.cohort.id)
    : recovery
      ? await findPersistedRegistrationById(recovery.leadId, config.cohort.id)
      : null;
  const whatsappHref = lead ? buildWhatsAppHref(config.whatsappNumber, lead.name, lead.registrationCode) : undefined;
  return <div className={`${manrope.variable} ${inter.variable}`}><ConfirmationSalesPage confirmed={Boolean(lead)} registrationCode={lead?.registrationCode} whatsappHref={whatsappHref} /></div>;
}
