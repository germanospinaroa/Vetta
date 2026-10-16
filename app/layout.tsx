import type { Metadata } from "next";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "NO EMPRENDAS TODAVÍA. | VETTA",
  description: "Aprende a evaluar oportunidades de negocio antes de comprometer tu tiempo, tu dinero o tu reputación.",
  applicationName: "VETTA",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: { canonical: "/" },
  openGraph: { title: "NO EMPRENDAS TODAVÍA. | VETTA", description: "Aprende a evaluar oportunidades de negocio antes de comprometer tu tiempo, tu dinero o tu reputación.", type: "website" },
  robots: { index: process.env.VETTA_ENV === "production", follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
