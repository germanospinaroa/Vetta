import Image from "next/image";
import Link from "next/link";
import { EventBeacon } from "@/components/event-beacon";
import { PrivacyPreferencesButton } from "@/components/privacy-preferences-button";
import { RegistrationForm } from "@/components/registration-form";
import { SalesCta } from "@/components/sales-cta";
import type { PublicCohort } from "@/lib/config";
import teamImage from "../Team.png";

const situations = ["Quiero generar ingresos adicionales.", "Tengo una idea, pero no sé por dónde empezar.", "Me hablaron de un negocio y quiero entenderlo mejor."] as const;
const faqs = [
  ["¿Las dos sesiones son gratuitas?", "Sí. Puedes participar en los encuentros del martes 17 y jueves 19 de noviembre sin costo."],
  ["¿Cómo recibo el enlace para conectarme?", "Al terminar el formulario, pulsa el botón de WhatsApp y envía el mensaje con tu código. Recibirás el enlace del grupo privado, donde compartiremos las instrucciones para conectarte."],
  ["¿Van a presentar un negocio en la masterclass?", "Sí. En el encuentro del jueves analizaremos una alternativa empresarial concreta. Conocerla no te obliga a comprar ni a vincularte."],
] as const;

export function SalesLanding({ cohort }: { cohort: PublicCohort }) {
  const open = cohort.status === "open";
  const cta = (label: string, id?: string, className = "") => <SalesCta label={label} id={id} className={`v6-button ${className}`} />;
  return <main className="v6-page"><EventBeacon name="landing_viewed" /><a className="v6-skip" href="#inscripcion">Saltar al formulario</a>
    <header className="v6-header"><div className="v6-shell v6-header-inner"><Link href="#inscripcion" className="v6-brand"><span className="v6-brand-full">NO EMPRENDAS TODAVÍA.</span><span className="v6-brand-short" aria-hidden="true">NO EMPRENDAS</span></Link>{open ? <SalesCta label="RESERVAR GRATIS" className="v6-header-cta" /> : null}</div></header>

    <section className="v6-hero" aria-labelledby="v6-hero-title"><div className="v6-shell v6-hero-grid"><div className="v6-hero-copy"><p className="v6-eyebrow">MASTERCLASS GRATIS · EN VIVO</p><h1 id="v6-hero-title"><span>NO EMPRENDAS</span> <em>TODAVÍA.</em></h1><p className="v6-question">¿Buscas ingresos adicionales o estás pensando en empezar tu propio negocio?</p><p className="v6-body">Antes de elegir, descubre diferentes formas de emprender, qué tendrías que hacer realmente y qué deberías comprobar para no tomar una decisión a ciegas.</p><p className="v6-transparent">En el segundo encuentro conocerás una alternativa empresarial concreta, sin compromiso.</p><div className="v6-date-band"><strong>MARTES 17 Y JUEVES 19 DE NOVIEMBRE</strong><span>8:00 P. M. · COLOMBIA</span></div>{open ? <div className="v6-mobile-cta">{cta("QUIERO MI LUGAR GRATIS", "v6-hero-cta")}</div> : <span className="v6-status">Las inscripciones se habilitarán cuando la edición esté confirmada.</span>}<p className="v6-microcopy">Inscripción gratuita. Después confirmas tu WhatsApp y entras al grupo.</p></div><section className="v6-form-card" id="inscripcion" aria-labelledby="v6-form-title"><p className="v6-eyebrow">INSCRIPCIÓN GRATUITA</p><h2 id="v6-form-title">Reserva tu lugar para las dos sesiones.</h2><p className="v6-form-intro">Completa tus datos. Al terminar, te mostraremos el mensaje que debes enviar por WhatsApp para recibir el acceso al grupo.</p>{open ? <RegistrationForm redirectOnSuccess /> : <div className="v6-status" role="status">El registro todavía no está habilitado.</div>}</section></div></section>

    <section className="v6-recognition" aria-labelledby="recognition-title"><div className="v6-shell"><h2 id="recognition-title">¿Te suena alguna de estas situaciones?</h2><div className="v6-situation-row">{situations.map((situation) => <p key={situation}><span aria-hidden="true">✓</span>{situation}</p>)}</div><p className="v6-recognition-note">No necesitas llegar con una decisión tomada.</p></div></section>

    <section className="v6-sessions" aria-labelledby="sessions-title"><div className="v6-shell"><h2 id="sessions-title">Dos encuentros. Una decisión mejor informada.</h2><div className="v6-session-grid"><article><p className="v6-session-date">MARTES 17 · 8:00 P. M.</p><h3>Descubre las opciones.</h3><p>Exploraremos distintas formas de emprender y qué pueden exigir en tiempo, recursos y trabajo.</p></article><article><p className="v6-session-date">JUEVES 19 · 8:00 P. M.</p><h3>Mira una alternativa de cerca.</h3><p>Aplicaremos esos criterios a una oportunidad empresarial concreta. Tú decides si quieres conocer más.</p></article></div>{open ? cta("RESERVAR MI LUGAR GRATIS", "v6-sessions-cta") : null}</div></section>

    <section className="v6-human" aria-labelledby="team-title"><div className="v6-shell v6-human-grid"><figure className="v6-team-photo"><Image src={teamImage} alt="Equipo de facilitadores de NO EMPRENDAS TODAVÍA en un evento presencial" sizes="(max-width: 899px) 100vw, 42vw" loading="lazy" /></figure><div className="v6-human-copy"><h2 id="team-title">Conoce a quienes te acompañarán.</h2><p className="v6-names">Germán Ospina · Alejandra Arévalo · Andrés Jaramillo · Marcela Cruz</p><div className="v6-gift-card"><p className="v6-gift-label">REGALO AL CONFIRMAR POR WHATSAPP</p><h3>TU PRÓXIMO MOVIMIENTO.</h3><p>Una herramienta interactiva para explorar seis formas de emprender, tomar decisiones y crear tu primera misión de validación de 48 horas.</p><p className="v6-delivery">Después de enviar tu código por WhatsApp, recibirás el acceso por esa conversación.</p></div></div></div></section>

    <section className="v6-faq" aria-labelledby="faq-title"><div className="v6-shell"><h2 id="faq-title">Preguntas rápidas</h2><div className="v6-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>

    <footer className="v6-footer"><div className="v6-shell v6-footer-inner"><div><strong>NO EMPRENDAS TODAVÍA.</strong><span>17 Y 19 DE NOVIEMBRE · 8:00 P. M. · COLOMBIA</span></div><nav aria-label="Enlaces legales"><Link href="/privacidad">Aviso de privacidad</Link><Link href="/terminos">Términos de participación</Link><PrivacyPreferencesButton /></nav></div></footer>
  </main>;
}
