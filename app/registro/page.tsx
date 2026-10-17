import type { Metadata } from "next";
import { RegistrationSalesPage } from "@/components/registration-sales-page";
import { getPublicConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Reserva tu lugar | NO EMPRENDAS TODAVÍA.", robots: { index: false, follow: true } };
export default function RegistrationPage() { return <RegistrationSalesPage cohort={getPublicConfig().cohort} />; }
