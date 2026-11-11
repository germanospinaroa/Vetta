import Link from "next/link";
import { RegistrationForm } from "@/components/registration-form";
import type { PublicCohort } from "@/lib/config";

export function RegistrationSalesPage({ cohort }: { cohort: PublicCohort }) {
  const open = cohort.status === "open";
  return <main className="v6-page v6-compat-page"><a className="v6-skip" href="#registration-main">Saltar al formulario</a><header className="v6-header"><div className="v6-shell v6-header-inner"><Link href="/" className="v6-brand"><span className="v6-brand-full">NO EMPRENDAS TODAVÍA.</span><span className="v6-brand-short" aria-hidden="true">NO EMPRENDAS</span></Link><Link href="/" className="v6-header-cta">VOLVER</Link></div></header><section className="v6-compat-shell" id="registration-main"><div className="v6-compat-card"><p className="v6-eyebrow">INSCRIPCIÓN GRATUITA</p><h1>Reserva tu lugar gratis.</h1><p className="v6-compat-intro">17 y 19 de noviembre · 8:00 p. m. Colombia.</p><p className="v6-compat-note">Al terminar, confirmarás tu inscripción enviando tu código por WhatsApp.</p>{open ? <RegistrationForm redirectOnSuccess /> : <div className="v6-status" role="status">El registro todavía no está habilitado.</div>}</div></section></main>;
}
