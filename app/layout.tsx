import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VETTA_ENV === "production" ? "https://vetta-beryl.vercel.app" : "http://localhost:3000");

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
  alternates: { canonical: "/" },
  openGraph: { title: "NO EMPRENDAS TODAVÍA. | Masterclass en vivo", description: "Aprende a evaluar oportunidades de negocio antes de comprometer tu tiempo y tu dinero. Dos encuentros en vivo y una herramienta práctica para tomar mejores decisiones.", type: "website", url: siteUrl },
  robots: { index: process.env.VETTA_ENV === "production", follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
