import Image from "next/image";
import Link from "next/link";
import { EventBeacon } from "@/components/event-beacon";
import { PrivacyPreferencesButton } from "@/components/privacy-preferences-button";
import { RegistrationForm } from "@/components/registration-form";
import { SalesCta } from "@/components/sales-cta";
import type { PublicCohort } from "@/lib/config";
import teamImage from "../Team.png";

const benefits = [
  "Entender qué exige realmente un negocio.",
  "Saber qué recursos necesitas y cuáles podrías aprovechar.",
  "Aprender qué comprobar antes de invertir.",
] as const;

const faqs = [
  ["¿Tiene algún costo?", "No. Las sesiones del 17 y 19 de noviembre son gratuitas."],
  ["¿Cómo recibo el acceso?", "Después de inscribirte, verás un botón de WhatsApp con tu código preparado. Debes pulsar Enviar. Recibirás el enlace del grupo y, por ese mismo chat, tu regalo digital."],
  ["¿Van a presentar una oportunidad empresarial?", "Sí. En el segundo encuentro conocerás una alternativa empresarial concreta que podrás evaluar libremente. No tienes obligación de comprar ni de vincularte."],
] as const;

export function SalesLanding({ cohort }: { cohort: PublicCohort }) {
  const open = cohort.status === "open";
  const cta = (label: string, id?: string, className = "") => <SalesCta label={label} id={id} className={`v5-button ${className}`} />;

  return <main className="v5-page"><EventBeacon name="landing_viewed" /><a className="v5-skip" href="#inscripcion">Saltar al formulario</a>
    <header className="v5-header"><div className="v5-shell v5-header-inner"><Link href="#inscripcion" className="v5-brand">NO EMPRENDAS TODAVÍA.</Link>{open ? <SalesCta label="INSCRIBIRME GRATIS" className="v5-header-cta" /> : null}</div></header>

    <section className="v5-hero" aria-labelledby="v5-hero-title"><div className="v5-shell v5-hero-grid"><div className="v5-hero-copy"><p className="v5-eyebrow">MASTERCLASS GRATUITA EN VIVO</p><h1 id="v5-hero-title">NO EMPRENDAS TODAVÍA.</h1><p className="v5-subtitle">Antes de invertir, descubre qué exige realmente cada forma de emprender.</p><p className="v5-body">En dos encuentros conocerás diferentes modelos de negocio, aprenderás qué debes evaluar y explorarás una alternativa empresarial concreta.</p><div className="v5-date-band"><strong>MARTES 17 + JUEVES 19 DE NOVIEMBRE</strong><span>8:00 P. M. · HORA COLOMBIA</span></div>{open ? cta("QUIERO INSCRIBIRME GRATIS", "hero-inscripcion") : <span className="v5-status">Las inscripciones se habilitarán cuando la edición esté confirmada.</span>}<p className="v5-microcopy">Es gratis. Después solo confirmarás tu código por WhatsApp.</p></div><section className="v5-form-card" id="inscripcion" aria-labelledby="v5-form-title"><p className="v5-eyebrow">INSCRIPCIÓN GRATUITA</p><h2 id="v5-form-title">Reserva tu lugar ahora.</h2><p className="v5-form-intro">Déjanos tus datos para las dos sesiones. Después enviarás tu código por WhatsApp.</p>{open ? <RegistrationForm redirectOnSuccess /> : <div className="v5-status" role="status">El registro todavía no está habilitado.</div>}</section></div></section>

    <section className="v5-benefits" aria-labelledby="benefits-title"><div className="v5-shell"><h2 id="benefits-title">¿Qué te vas a llevar?</h2><div className="v5-benefit-list">{benefits.map((benefit, index) => <p key={benefit}><span aria-hidden="true">0{index + 1}</span>{benefit}</p>)}</div></div></section>

    <section className="v5-sessions" aria-labelledby="sessions-title"><div className="v5-shell"><h2 id="sessions-title">Dos encuentros. Más claridad para decidir.</h2><div className="v5-session-grid"><article><p className="v5-session-date">MARTES 17 · 8:00 P. M.</p><h3>Conoce tus opciones.</h3><p>Exploraremos distintas formas de emprender y lo que implica ponerlas en marcha.</p></article><article><p className="v5-session-date">JUEVES 19 · 8:00 P. M.</p><h3>Mira una oportunidad de cerca.</h3><p>Aplicaremos esos criterios para conocer y evaluar una alternativa empresarial concreta, sin obligación de participar.</p></article></div>{open ? cta("RESERVAR MI LUGAR GRATIS", "sessions-inscripcion") : null}</div></section>

    <section className="v5-trust-gift" aria-labelledby="team-title"><div className="v5-shell v5-trust-grid"><figure className="v5-team-photo"><Image src={teamImage} alt="Fotografía auténtica del equipo de la masterclass" sizes="(max-width: 899px) 100vw, 40vw" loading="lazy" /></figure><div className="v5-trust-copy"><h2 id="team-title">Conoce a quienes te acompañarán.</h2><p className="v5-names">Germán Ospina · Alejandra Arévalo · Andrés Jaramillo · Marcela Cruz</p><h2 className="v5-gift-title">También recibirás TU PRÓXIMO MOVIMIENTO.</h2><p>Una herramienta interactiva para explorar seis modelos de negocio y preparar una primera prueba de realidad de 48 horas.</p><p className="v5-delivery">Te enviamos el acceso por WhatsApp después de confirmar tu código.</p></div></div></section>

    <section className="v5-faq" aria-labelledby="faq-title"><div className="v5-shell"><h2 id="faq-title">Preguntas rápidas</h2><div className="v5-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>

    <footer className="v5-footer"><div className="v5-shell v5-footer-inner"><div><strong>NO EMPRENDAS TODAVÍA.</strong><span>17 Y 19 DE NOVIEMBRE · 8:00 P. M. COLOMBIA</span></div><nav aria-label="Enlaces legales"><Link href="/privacidad">Aviso de privacidad</Link><Link href="/terminos">Términos de participación</Link><PrivacyPreferencesButton /></nav></div></footer>
  </main>;
}
