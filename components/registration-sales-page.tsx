import Link from "next/link";
import { RegistrationForm } from "@/components/registration-form";
import type { PublicCohort } from "@/lib/config";

export function RegistrationSalesPage({ cohort }: { cohort: PublicCohort }) {
  const open = cohort.status === "open";
  return <main className="v4-page v4-form-page"><a className="v4-skip" href="#registration-main">Saltar al contenido</a><header className="v4-header"><div className="v4-shell v4-header-inner"><Link href="/" className="v4-brand">NO EMPRENDAS TODAVÍA.</Link><Link href="/" className="v4-header-cta">VOLVER</Link></div></header><div className="v4-shell v4-form-layout"><section id="registration-main" className="v4-form-card"><p className="v4-eyebrow">NO EMPRENDAS TODAVÍA · INSCRIPCIÓN GRATUITA</p><h1>Reserva tu lugar.</h1><p className="v4-form-subtitle">Te esperamos el martes 17 y jueves 19 de noviembre a las 8:00 p. m., hora de Colombia.</p><p className="v4-form-instruction">Completa tus datos. Al terminar, te mostraremos el código que debes enviar por WhatsApp para confirmar tu inscripción.</p>{open ? <RegistrationForm redirectOnSuccess /> : <div className="v4-status" role="status">El registro todavía no está habilitado.</div>}</section><aside className="v4-form-summary"><p className="v4-eyebrow">DOS ENCUENTROS EN VIVO</p><strong>17 Y 19 DE NOVIEMBRE</strong><span>8:00 P. M. · HORA DE COLOMBIA</span><p>Después del registro confirmarás tu inscripción por WhatsApp y podrás entrar al grupo privado.</p></aside></div></main>;
}
