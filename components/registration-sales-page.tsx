import Link from "next/link";
import { RegistrationForm } from "@/components/registration-form";
import type { PublicCohort } from "@/lib/config";

export function RegistrationSalesPage({ cohort }: { cohort: PublicCohort }) {
  const open = cohort.status === "open";
  return <main className="v5-page v5-compat-page"><a className="v5-skip" href="#registration-main">Saltar al formulario</a><header className="v5-header"><div className="v5-shell v5-header-inner"><Link href="/" className="v5-brand">NO EMPRENDAS TODAVÍA.</Link><Link href="/" className="v5-header-cta">VOLVER</Link></div></header><section className="v5-compat-shell" id="registration-main"><div className="v5-compat-card"><p className="v5-eyebrow">INSCRIPCIÓN GRATUITA</p><h1>Reserva tu lugar gratis.</h1><p className="v5-compat-intro">17 y 19 de noviembre · 8:00 p. m. Colombia.</p><p className="v5-compat-note">Al terminar, confirmarás tu inscripción enviando tu código por WhatsApp.</p>{open ? <RegistrationForm redirectOnSuccess /> : <div className="v5-status" role="status">El registro todavía no está habilitado.</div>}</div></section></main>;
}
