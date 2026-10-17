import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { ConceptA } from "@/components/concept-a";

export const metadata: Metadata = { title: "Concepto A — VETTA", description: "Exploración visual editorial cinematográfica de VETTA.", robots: { index: false, follow: false } };

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--concept-sans" });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], display: "swap", variable: "--concept-serif" });

export default function ConceptAPage() { return <div className={`${manrope.variable} ${instrumentSerif.variable}`}><ConceptA /></div>; }
