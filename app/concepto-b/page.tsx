import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { ConceptB } from "@/components/concept-b";

export const metadata: Metadata = { title: "Concepto B — VETTA", description: "Exploración visual arquitectónica contemporánea de VETTA.", robots: { index: false, follow: false } };

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--concept-sans" });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], display: "swap", variable: "--concept-serif" });

export default function ConceptBPage() { return <div className={`${manrope.variable} ${instrumentSerif.variable}`}><ConceptB /></div>; }
