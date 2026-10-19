import type { Metadata } from "next";
import { RegistrationSalesPage } from "@/components/registration-sales-page";
import { getPublicConfig, getQaPublicConfig } from "@/lib/config";
import { cookies } from "next/headers";
import { hasValidQaSession, qaSessionCookieName } from "@/lib/qa-session";

export const metadata: Metadata = { title: "Reserva tu lugar | NO EMPRENDAS TODAVÍA.", robots: { index: false, follow: true } };
export default async function RegistrationPage() { const qa = hasValidQaSession((await cookies()).get(qaSessionCookieName)?.value); return <RegistrationSalesPage cohort={(qa ? getQaPublicConfig() : getPublicConfig()).cohort} />; }
