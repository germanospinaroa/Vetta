import Link from "next/link";
import { RegistrationForm } from "@/components/registration-form";
import type { PublicCohort } from "@/lib/config";

export function RegistrationSalesPage({ cohort }: { cohort: PublicCohort }) {
  const open = cohort.status === "open";
  return <main className="sales-page sales-registration-page"><a className="sales-skip" href="#registration-main">Saltar al contenido</a><div className="sales-shell sales-registration-shell"><Link className="sales-back-link" href="/">← Volver</Link><section id="registration-main" className="sales-registration-card"><p className="sales-eyebrow">MASTERCLASS EN VIVO · 2 ENCUENTROS</p><h1>Reserva tu lugar en <span>NO EMPRENDAS TODAVÍA.</span></h1><p>Completa tus datos para acceder a los dos encuentros en vivo y recibir tu regalo al confirmar tu ingreso por WhatsApp.</p><div className="sales-registration-summary"><span>Martes · Aprende a evaluar</span><span>Jueves · Aprende a decidir</span><span>Regalo · El filtro antes del sí</span></div>{open ? <RegistrationForm redirectOnSuccess /> : <div className="sales-preopen" role="status"><strong>Próxima edición en preparación.</strong><p>El registro se habilitará cuando la próxima edición esté confirmada. No guardaremos tus datos mientras esta edición no esté abierta.</p></div>}</section></div></main>;
}
