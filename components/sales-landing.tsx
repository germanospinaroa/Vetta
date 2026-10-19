import Image from "next/image";
import Link from "next/link";
import { EventBeacon } from "@/components/event-beacon";
import { StickySalesCta } from "@/components/sticky-sales-cta";
import { SalesCta } from "@/components/sales-cta";
import type { PublicCohort } from "@/lib/config";

const questions = [
  ["Es una gran oportunidad", "¿Qué tendría que comprobar antes de decir que sí?"],
  ["No necesitas invertir mucho", "¿Cuánto dinero requiere realmente comenzar y sostenerlo?"],
  ["Tiene muchísimo potencial", "¿Qué evidencia real existe de que puede funcionar?"],
] as const;
const benefits = [
  ["MÁS CLARIDAD", "Para analizar una oportunidad antes de comprometerte."],
  ["MEJORES PREGUNTAS", "Para identificar riesgos, vacíos de información y señales importantes."],
  ["MÁS CRITERIO", "Para comparar alternativas sin dejarte llevar únicamente por la emoción."],
  ["DECISIONES MÁS CONSCIENTES", "Para reconocer cuándo avanzar, cuándo investigar más y cuándo es mejor decir que no."],
] as const;
const criteria = [
  ["Capital necesario", "¿Qué debes comprometer antes de validar la oportunidad?"],
  ["Demanda verificable", "¿Qué evidencia existe de que alguien necesita o compra esto?"],
  ["Validación previa", "¿Qué puedes comprobar antes de comprometerte de verdad?"],
] as const;

export function SalesLanding({ cohort }: { cohort: PublicCohort }) {
  const cta = (label: string, id?: string, className = "") => <SalesCta label={label} id={id} className={className} />;
  return (
    <main className="sales-page">
      <EventBeacon name="landing_viewed" />
      <a className="sales-skip" href="#sales-main">Saltar al contenido</a>
      <section className="sales-hero" id="sales-main"><div className="sales-shell sales-hero-grid">
        <div className="sales-hero-copy">
          <h1>NO EMPRENDAS <span>TODAVÍA.</span></h1>
          <p className="sales-promise">Que una oportunidad suene increíble no significa que sea una buena decisión para ti.</p>
          <p className="sales-description">Aprende a identificar qué revisar antes de invertir tu tiempo, tu dinero y tu energía en un negocio.</p>
          <p className="sales-date"><strong>Masterclass en vivo</strong><br />Martes 20 y jueves 22 · 8:00 p. m.</p>
          {cta("QUIERO RESERVAR MI LUGAR", "sales-hero-cta")}
          <p className="sales-gift-note"><span aria-hidden="true">✦</span><span>Y además recibirás un regalo especial para ayudarte a evaluar mejor cualquier oportunidad de negocio.</span></p>
          <div className="sales-hero-image sales-hero-image-mobile"><Image src="/images/no-emprendas-hero.png" alt="Profesional revisando notas antes de tomar una decisión" fill priority sizes="(max-width: 700px) 100vw, 1px" /></div>
        </div>
        <div className="sales-hero-image sales-hero-image-desktop"><Image src="/images/no-emprendas-hero.png" alt="Profesional revisando notas antes de tomar una decisión" fill priority sizes="(min-width: 900px) 48vw, 1px" /></div>
      </div></section>

      <section className="sales-identification" aria-labelledby="identification-title"><div className="sales-shell">
        <div className="sales-section-intro"><h2 id="identification-title">Has considerado distintas oportunidades… pero eso no significa que sea fácil elegir bien.</h2><p>Tal vez ya has pensado en una franquicia, un negocio digital, una tienda online o alguna otra oportunidad que parecía prometedora.</p><p>Y mientras más opciones aparecen, más difícil se vuelve tomar una decisión con seguridad.</p><p>Porque una cosa es escuchar una propuesta atractiva.</p><p className="sales-intro-strong">Y otra muy distinta es saber evaluarla de verdad.</p></div>
        <div className="sales-question-list">{questions.map(([promise, question], index) => <article className="sales-question-pair" key={promise}><div><span className="sales-question-label">TE DICEN</span><p className="sales-promise-quote">«{promise}»</p></div><span className="sales-question-connector" aria-hidden="true">→</span><div><span className="sales-question-label sales-question-label-dark">TÚ TE PREGUNTAS</span><p className="sales-smart-question">{question}</p></div><span className="sales-question-index">0{index + 1}</span></article>)}</div>
        <p className="sales-identification-close">No necesitas conocer más oportunidades. Necesitas aprender a distinguir cuáles merecen tu sí.</p>
      </div></section>

      <section className="sales-masterclass" aria-labelledby="masterclass-title"><div className="sales-shell">
        <div className="sales-section-intro sales-masterclass-intro"><h2 id="masterclass-title">Esta masterclass te ayudará a pensar diferente antes de tomar una decisión importante.</h2><p>En lugar de dejarte llevar solo por una buena presentación, aprenderás a mirar con más criterio lo que realmente hay detrás de una oportunidad.</p></div>
        <div className="sales-benefit-grid">{benefits.map(([title, text], index) => <article className="sales-benefit" key={title}><span className="sales-benefit-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <p className="sales-reinforcement">Porque antes de emprender, lo importante no es emocionarte más. Es aprender a decidir mejor.</p>
        {cta("QUIERO APRENDER A ELEGIR MEJOR", undefined, "sales-button-secondary")}
      </div></section>

      <section className="sales-gift" aria-labelledby="gift-title"><div className="sales-shell sales-gift-grid">
        <div className="sales-gift-copy"><h2 id="gift-title">Además, al registrarte recibirás un regalo que te ayudará a llevar todo esto a la práctica.</h2><p className="sales-gift-name">EL FILTRO ANTES DEL SÍ.</p><p>Una herramienta práctica para ayudarte a evaluar oportunidades de negocio antes de comprometerte con ellas.</p><ul><li>Ordenar mejor tus ideas.</li><li>Analizar una oportunidad con más criterio.</li><li>Detectar lo que todavía necesitas investigar.</li><li>Comparar alternativas con una perspectiva más clara.</li></ul><p className="sales-gift-close">No es solo información. Es una herramienta para ayudarte a pensar mejor antes de decidir.</p></div>
        <div className="sales-device-wrap"><Image src="/images/filtro-antes-del-si-device.png" alt="Tablet con la Matriz para Evaluar Oportunidades" fill sizes="(max-width: 700px) 100vw, 48vw" /><div className="sales-matrix-screen"><div className="sales-matrix-screen-head"><span>MATRIZ PARA EVALUAR OPORTUNIDADES</span><b>01 / 10</b></div>{criteria.map(([title, question]) => <div className="sales-matrix-row" key={title}><strong>{title}</strong><span>{question}</span></div>)}</div></div>
        <div className="sales-gift-cta"><h3>Tu próxima decisión merece algo más que entusiasmo.</h3><p>Regístrate en la masterclass y aprende a evaluar oportunidades con más criterio antes de decir que sí.</p><p className="sales-date sales-date-dark">Martes 20 y jueves 22 · 8:00 p. m.</p>{cta("QUIERO MI LUGAR Y EL FILTRO", "sales-final-cta", "sales-button-gold")}<small>Recibirás tu regalo por WhatsApp después de completar el registro, ingresar al grupo privado y confirmar tu ingreso.</small></div>
      </div></section>
      <footer className="sales-footer"><div className="sales-shell"><div><span className="sales-footer-title">NO EMPRENDAS TODAVÍA.</span><span>Masterclass en vivo · dos encuentros</span></div><nav aria-label="Enlaces legales"><Link href="/privacidad">Aviso de privacidad (borrador)</Link><Link href="/terminos">Términos (borrador)</Link></nav></div></footer>
      <StickySalesCta enabled />
    </main>
  );
}
