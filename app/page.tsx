import { Manrope, Inter } from "next/font/google";
import { SalesLanding } from "@/components/sales-landing";
import { getPublicConfig, getQaPublicConfig } from "@/lib/config";
import { cookies } from "next/headers";
import { hasValidQaSession, qaSessionCookieName } from "@/lib/qa-session";

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-sales-manrope" });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sales-inter" });

export default async function Home() {
  const qa = hasValidQaSession((await cookies()).get(qaSessionCookieName)?.value);
  const { cohort } = qa ? getQaPublicConfig() : getPublicConfig();
  return <div className={`${manrope.variable} ${inter.variable}`}><SalesLanding cohort={cohort} /></div>;
}
