import Link from "next/link";
import { RegistrationForm } from "@/components/registration-form";
import type { PublicCohort } from "@/lib/config";

export function RegistrationSalesPage({ cohort }: { cohort: PublicCohort }) {
  const open = cohort.status === "open";
  return <main className="sales-page sales-registration-page"><a className="sales-skip" href="#registration-main">Saltar al contenido</a><div className="sales-shell sales-registration-shell"><Link className="sales-back-link" href="/">← Volver</Link><section id="registration-main" className="sales-registration-card"><h1>Reserva tu lugar en <span>NO EMPRENDAS TODAVÍA.</span></h1><p>Aprende a evaluar oportunidades antes de comprometer tu tiempo, tu dinero y tu energía.</p><p className="sales-date"><strong>Martes 20 y jueves 22 · 8:00 p. m.</strong></p><div className="sales-registration-summary"><strong>Al registrarte obtendrás:</strong><span>Acceso a los dos encuentros de la masterclass.</span><span>Herramientas y criterios para evaluar oportunidades.</span><span>Tu regalo especial: El filtro antes del sí.</span></div>{open ? <RegistrationForm redirectOnSuccess /> : <div className="sales-preopen" role="status"><strong>El registro todavía no está habilitado.</strong><p>No guardaremos tus datos hasta que la cohorte, la persistencia y las condiciones necesarias estén confirmadas.</p></div>}</section></div></main>;
}
