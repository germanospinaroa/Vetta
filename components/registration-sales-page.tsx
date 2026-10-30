import Link from "next/link";
import { RegistrationForm } from "@/components/registration-form";
import type { PublicCohort } from "@/lib/config";

export function RegistrationSalesPage({ cohort }: { cohort: PublicCohort }) {
  const open = cohort.status === "open";
  return <main className="sales-page sales-registration-page"><a className="sales-skip" href="#registration-main">Saltar al contenido</a><div className="sales-shell sales-registration-shell"><Link className="sales-back-link" href="/">← Volver</Link><section id="registration-main" className="sales-registration-card"><p className="sales-registration-kicker">NO EMPRENDAS TODAVÍA.</p><h1>Reserva tu lugar.</h1><p className="sales-registration-date">3 y 5 de noviembre · 8:00 p. m. (Colombia)</p>{open ? <><p className="sales-registration-microcopy">Después de inscribirte, acepta directamente la invitación al grupo para recibir las instrucciones de acceso.</p><RegistrationForm redirectOnSuccess /></> : <div className="sales-preopen" role="status"><strong>El registro todavía no está habilitado.</strong><p>No guardaremos tus datos hasta que la cohorte, la persistencia y las condiciones necesarias estén confirmadas.</p></div>}</section></div></main>;
}
