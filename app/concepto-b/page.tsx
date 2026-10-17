import type { Metadata } from "next";
import { ConceptB } from "@/components/concept-b";

export const metadata: Metadata = { title: "Concepto B — VETTA", description: "Exploración visual arquitectónica contemporánea de VETTA.", robots: { index: false, follow: false } };

export default function ConceptBPage() { return <ConceptB />; }
