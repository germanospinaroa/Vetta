import type { Metadata } from "next";
import { RegistrationSalesPage } from "@/components/registration-sales-page";
import { getPublicConfig, getQaPublicConfig } from "@/lib/config";
import { cookies } from "next/headers";
import { hasValidQaSession, qaSessionCookieName } from "@/lib/qa-session";

const siteUrl = "https://noemprendas.gritlab.pro";
const ogImage = `${siteUrl}/og-no-emprendas.png`;
const ogTitle = "NO EMPRENDAS TODAVÍA | Masterclass gratis 17 y 19 de noviembre";
const ogDescription = "Dos encuentros gratuitos para comparar formas de emprender, entender qué exigen y aprender qué comprobar antes de decidir. 17 y 19 de noviembre, 8 p. m. Colombia.";

export const metadata: Metadata = {
  title: "Reserva tu lugar | NO EMPRENDAS TODAVÍA.",
  description: ogDescription,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: `${siteUrl}/registro` },
  openGraph: {
    title: ogTitle,
    description: ogDescription,
    url: `${siteUrl}/registro`,
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "NO EMPRENDAS TODAVÍA. sobre una imagen cinematográfica de una persona reflexionando frente a un portal luminoso" }],
  },
  twitter: { card: "summary_large_image", title: ogTitle, description: ogDescription, images: [ogImage] },
  robots: { index: false, follow: true },
};
export default async function RegistrationPage() { const qa = hasValidQaSession((await cookies()).get(qaSessionCookieName)?.value); return <RegistrationSalesPage cohort={(qa ? getQaPublicConfig() : getPublicConfig()).cohort} />; }
