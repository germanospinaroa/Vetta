import type { Metadata } from "next";
import { ConfirmationSalesPage } from "@/components/confirmation-sales-page";
import { getPublicConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Confirmación | NO EMPRENDAS TODAVÍA.", robots: { index: false, follow: false } };
export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) { const params = await searchParams; return <ConfirmationSalesPage cohort={getPublicConfig().cohort} code={params.code} />; }
