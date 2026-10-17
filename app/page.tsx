import { Geist, Geist_Mono } from "next/font/google";
import { VettaLanding } from "@/components/vetta-landing";
import { getPublicConfig } from "@/lib/config";

const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-geist-mono" });

export default function Home() {
  const { cohort } = getPublicConfig();
  return <div className={`${geist.variable} ${geistMono.variable}`}><VettaLanding cohort={cohort} /></div>;
}
