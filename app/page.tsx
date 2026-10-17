import { Manrope, Inter } from "next/font/google";
import { SalesLanding } from "@/components/sales-landing";
import { getPublicConfig } from "@/lib/config";

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-sales-manrope" });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sales-inter" });

export default function Home() {
  const { cohort } = getPublicConfig();
  return <div className={`${manrope.variable} ${inter.variable}`}><SalesLanding cohort={cohort} /></div>;
}
