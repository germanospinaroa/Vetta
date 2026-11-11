import Image from "next/image";
import Link from "next/link";
import { EventBeacon } from "@/components/event-beacon";
import { StickySalesCta } from "@/components/sticky-sales-cta";
import { SalesCta } from "@/components/sales-cta";
import { PrivacyPreferencesButton } from "@/components/privacy-preferences-button";
import type { PublicCohort } from "@/lib/config";
import teamImage from "../Team.png";

const valuePoints = [
  ["01", "¿Qué exige realmente?", "Comprende los recursos, responsabilidades y compromisos que pueden existir detrás de una oportunidad empresarial."],
  ["02", "¿Qué vas a tener que construir?", "Explora cuánto depende de tus capacidades, tus relaciones, tu tiempo y tu forma de trabajar."],
  ["03", "¿Qué deberías comprobar primero?", "Aprende a identificar preguntas que pueden ayudarte a evaluar una posibilidad antes de comprometer recursos."],
] as const;

const faqs = [
  ["¿La masterclass tiene algún costo?", "No. Es una masterclass online y gratuita compuesta por dos encuentros en vivo."],
  ["¿Cuándo se realizan los encuentros?", "El martes 17 y el jueves 19 de noviembre de 2026, a las 8:00 p. m., hora de Colombia."],
  ["¿Cómo recibo los enlaces para conectarme?", "Después de registrarte, confirma tu WhatsApp y entra al grupo privado. Allí recibirás los avisos y enlaces de conexión."],
  ["¿Qué debo hacer después de inscribirme?", "Envía tu código VETTA por WhatsApp y únete al grupo privado. El equipo reconocerá tu inscripción y programará el envío de tu regalo digital por esa conversación."],
] as const;

export function SalesLanding({ cohort }: { cohort: PublicCohort }) {
  const canRegister = cohort.status === "open";
  const tuesday = cohort.tuesdayLabel || "17 de noviembre de 2026";
  const thursday = cohort.thursdayLabel || "19 de noviembre de 2026";
  const cta = (label: string, id?: string, extra = "") => <SalesCta label={label} id={id} className={`sales-v2-button ${extra}`} />;

  return (
    <main className="sales-page sales-v2">
      <EventBeacon name="landing_viewed" />
      <a className="sales-skip" href="#sales-main">Saltar al contenido</a>
      <header className="sales-v2-header"><div className="sales-shell sales-v2-header-inner"><Link className="sales-v2-wordmark" href="#sales-main">NO EMPRENDAS <span>TODAVÍA.</span></Link><span className="sales-v2-date-label">ONLINE · GRATUITA</span></div></header>

      <section className="sales-v2-hero" id="sales-main" aria-labelledby="sales-v2-hero-title"><div className="sales-shell sales-v2-hero-grid"><div className="sales-v2-hero-copy"><p className="sales-v2-eyebrow">MASTERCLASS ONLINE GRATUITA · 17 Y 19 DE NOVIEMBRE</p><h1 id="sales-v2-hero-title">NO EMPRENDAS <span>TODAVÍA.</span></h1><p className="sales-v2-promise">Antes de elegir un negocio, descubre qué necesitas saber.</p><p className="sales-v2-support">Existen diferentes maneras de emprender, y cada una exige decisiones distintas. En dos encuentros en vivo vamos a explorar nuevas posibilidades y las preguntas que vale la pena hacerse antes de comenzar.</p><div className="sales-v2-date"><strong>Martes 17 y jueves 19 de noviembre · 8:00 p. m. Colombia</strong><span>Online · gratuita</span></div>{canRegister ? cta("RESERVAR MI LUGAR GRATIS", "sales-hero-cta") : <span className="sales-v2-status">Las inscripciones se habilitarán cuando la edición esté confirmada.</span>}<p className="sales-v2-experience-note">Dos encuentros para mirar las oportunidades con otra perspectiva.</p><div className="sales-v2-hero-mobile-image"><Image src="/images/no-emprendas-hero.png" alt="Persona reflexionando frente a un portal luminoso" fill priority sizes="100vw" /></div></div><div className="sales-v2-hero-desktop-image"><Image src="/images/no-emprendas-hero.png" alt="Persona reflexionando frente a un portal luminoso" fill priority sizes="(min-width: 900px) 48vw, 1px" /></div></div></section>

      <section className="sales-v2-value" aria-labelledby="value-title"><div className="sales-shell"><div className="sales-v2-section-heading sales-v2-value-heading"><p className="sales-v2-section-number">01 / LA PREGUNTA ANTES DE LA RESPUESTA</p><h2 id="value-title">Antes de tomar una decisión, aprende a hacer mejores preguntas.</h2></div><div className="sales-v2-benefits">{valuePoints.map(([number, title, text]) => <article className="sales-v2-benefit" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div><p className="sales-v2-value-close">No se trata de encontrar una respuesta rápida. Se trata de entender mejor qué estás eligiendo.</p>{canRegister ? cta("RESERVAR MI LUGAR GRATIS", undefined, "sales-v2-button-dark") : null}</div></section>

      <section className="sales-v2-experience" aria-labelledby="experience-title"><div className="sales-shell"><div className="sales-v2-section-heading"><p className="sales-v2-section-number">02 / LA EXPERIENCIA</p><h2 id="experience-title">Dos encuentros para mirar las oportunidades con otra perspectiva.</h2></div><div className="sales-v2-session-copy"><article><p className="sales-v2-eyebrow">MARTES 17 DE NOVIEMBRE</p><h3>Explorar antes de comenzar.</h3><p>Una mirada a las diferentes formas de emprender, lo que requieren y las decisiones que conviene comprender antes de comenzar.</p></article><article><p className="sales-v2-eyebrow">JUEVES 19 DE NOVIEMBRE</p><h3>Evaluar el siguiente movimiento.</h3><p>Profundizaremos en las posibilidades, las estructuras empresariales y las preguntas necesarias para evaluar el siguiente movimiento.</p></article></div><div className="sales-v2-experience-footer"><p>Dos encuentros en vivo</p><strong>8:00 p. m. · Hora de Colombia</strong></div></div></section>

      <section className="sales-v2-gift" aria-labelledby="gift-title"><div className="sales-shell sales-v2-gift-grid"><div className="sales-v2-gift-copy"><p className="sales-v2-section-number">03 / DESPUÉS DE REGISTRARTE</p><h2 id="gift-title">Y TENEMOS UN REGALO PARA TI.</h2><p className="sales-v2-gift-promise">TU PRÓXIMO MOVIMIENTO</p><p>Una experiencia interactiva para descubrir diferentes caminos de emprendimiento y aprender cómo ponerlos a prueba.</p><p>Se envía por WhatsApp después de que confirmes tu inscripción en la conversación privada.</p></div><div className="sales-v2-filter-demo" aria-label="Vista previa de TU PRÓXIMO MOVIMIENTO"><div className="sales-v2-filter-head"><span>TU PRÓXIMO MOVIMIENTO</span><b>EXPERIENCIA INTERACTIVA</b></div><p>Antes de comprometer tiempo, dinero o energía.</p><strong>Descubre qué preguntas vale la pena hacerte primero.</strong><div className="sales-v2-filter-rule" /><small>Recibirás el enlace en tu conversación privada de WhatsApp.</small></div><div className="sales-v2-gift-close"><h3>El siguiente paso empieza con una mejor pregunta.</h3><p>{tuesday} · {thursday}<br />8:00 p. m. Colombia</p>{canRegister ? cta("QUIERO RESERVAR MI LUGAR", undefined, "sales-v2-button-gold") : null}</div></div></section>

      <section className="sales-v2-facilitators" aria-labelledby="voices-title"><div className="sales-shell"><div className="sales-v2-section-heading"><p className="sales-v2-section-number">04 / PERSPECTIVAS</p><h2 id="voices-title">Cuatro voces. Más posibilidades.</h2></div><div className="sales-v2-team-image"><Image src={teamImage} alt="Composición visual de Andrés Jaramillo, Marcela Cruz, Alejandra Arévalo y Germán Ospina" sizes="(max-width: 700px) 100vw, 980px" /></div><p className="sales-v2-team-copy">Cuatro perspectivas para compartir experiencias, cuestionar lo que damos por hecho y descubrir nuevas formas de mirar el emprendimiento.</p><p className="sales-v2-team-names">Andrés Jaramillo · Marcela Cruz · Alejandra Arévalo · Germán Ospina</p></div></section>

      <section className="sales-v2-faq" aria-labelledby="faq-title"><div className="sales-shell"><div className="sales-v2-section-heading"><p className="sales-v2-section-number">05 / INFORMACIÓN</p><h2 id="faq-title">Lo que necesitas saber antes de reservar.</h2></div><div className="sales-v2-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="sales-v2-close" aria-labelledby="close-title"><div className="sales-shell"><p className="sales-v2-section-number">UNA DECISIÓN CON MÁS PERSPECTIVA</p><h2 id="close-title">Tu próxima decisión merece una mejor perspectiva.</h2><p>Reserva tu lugar en NO EMPRENDAS TODAVÍA y acompáñanos en dos encuentros gratuitos para explorar nuevas posibilidades empresariales.</p><strong className="sales-v2-close-date">17 y 19 de noviembre · 8:00 p. m. Colombia</strong>{canRegister ? cta("QUIERO RESERVAR MI LUGAR", "sales-final-cta") : null}</div></section>

      <footer className="sales-footer sales-v2-footer"><div className="sales-shell"><div><span className="sales-footer-title">NO EMPRENDAS TODAVÍA.</span><span>Dos encuentros en vivo</span></div><nav aria-label="Enlaces legales"><Link href="/privacidad">Aviso de privacidad (propuesta)</Link><Link href="/terminos">Términos (borrador)</Link><PrivacyPreferencesButton /></nav></div></footer><StickySalesCta enabled={canRegister} />
    </main>
  );
}
