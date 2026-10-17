import type { Metadata } from "next";
import { ConceptA } from "@/components/concept-a";

export const metadata: Metadata = { title: "Concepto A — VETTA", description: "Exploración visual editorial cinematográfica de VETTA.", robots: { index: false, follow: false } };

export default function ConceptAPage() { return <ConceptA />; }
