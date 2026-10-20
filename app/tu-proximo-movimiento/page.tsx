import type { Metadata } from "next";
import { NextMoveExperience } from "@/components/next-move-experience";

export const metadata: Metadata = {
  title: "TU PRÓXIMO MOVIMIENTO | NO EMPRENDAS TODAVÍA.",
  description: "Una experiencia para descubrir tu siguiente posibilidad empresarial.",
  alternates: { canonical: "https://noemprendas.gritlab.pro/tu-proximo-movimiento" },
  openGraph: { title: "TU PRÓXIMO MOVIMIENTO", description: "Explora seis modelos de negocio, compara tres caminos y llévate un plan para investigar el tuyo.", url: "https://noemprendas.gritlab.pro/tu-proximo-movimiento", type: "website" },
  robots: { index: true, follow: true },
};

export default function NextMovePage() { return <NextMoveExperience />; }
