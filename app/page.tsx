import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { SalesLanding } from "@/components/sales-landing";
import { getPublicConfig, getQaPublicConfig } from "@/lib/config";
import { cookies } from "next/headers";
import { hasValidQaSession, qaSessionCookieName } from "@/lib/qa-session";

const siteUrl = "https://noemprendas.gritlab.pro";
const ogImage = `${siteUrl}/og-no-emprendas.png`;
const ogTitle = "NO EMPRENDAS TODAVÍA. ¿Y si hay más de lo que imaginas?";
const ogDescription = "Dos encuentros en vivo para ampliar tu perspectiva y explorar nuevas posibilidades de emprender. 3 y 5 de noviembre · 8:00 p. m. Colombia. Reserva tu lugar.";

export const metadata: Metadata = {
  title: ogTitle,
  description: ogDescription,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  openGraph: {
    title: ogTitle,
    description: ogDescription,
    url: `${siteUrl}/`,
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "NO EMPRENDAS TODAVÍA. sobre una imagen cinematográfica de una persona reflexionando frente a un portal luminoso" }],
  },
  twitter: { card: "summary_large_image", title: ogTitle, description: ogDescription, images: [ogImage] },
};

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-sales-manrope" });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sales-inter" });

export default async function Home() {
  const qa = hasValidQaSession((await cookies()).get(qaSessionCookieName)?.value);
  const { cohort } = qa ? getQaPublicConfig() : getPublicConfig();
  return <div className={`${manrope.variable} ${inter.variable}`}><SalesLanding cohort={cohort} /></div>;
}
