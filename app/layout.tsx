import type { Metadata } from "next";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { AnalyticsRuntime } from "@/components/analytics-runtime";
import "./globals.css";
import "./sales-v2.css";
import "./sales-v4.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noemprendas.gritlab.pro";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "NO EMPRENDAS TODAVÍA. | Masterclass en vivo",
  description: "Aprende a evaluar oportunidades de negocio antes de comprometer tu tiempo y tu dinero. Dos encuentros en vivo y una herramienta práctica para tomar mejores decisiones.",
  applicationName: "NO EMPRENDAS TODAVÍA.",
  metadataBase: new URL(siteUrl),
  robots: { index: process.env.VETTA_ENV === "production", follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}<AnalyticsRuntime /><AnalyticsConsent /></body></html>;
}
