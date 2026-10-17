import Image from "next/image";
import Link from "next/link";
import { EventBeacon } from "@/components/event-beacon";
import { StickySalesCta } from "@/components/sticky-sales-cta";
import type { PublicCohort } from "@/lib/config";

const questions = [
  ["Es un negocio con muchísimo potencial", "¿Qué evidencia real respalda ese potencial?"],
  ["No necesitas invertir mucho", "¿Cuánto dinero requiere realmente comenzar y mantenerlo?"],
  ["Puedes hacerlo crecer", "¿Cuánto dependerá de mi tiempo para conseguirlo?"],
] as const;

const criteria = [
  ["Capital necesario", "¿Qué debes comprometer antes de validar la oportunidad?"],
  ["Demanda verificable", "¿Qué evidencia existe de que alguien necesita o compra esto?"],
  ["Validación previa", "¿Qué puedes comprobar antes de comprometerte de verdad?"],
] as const;

export function SalesLanding({ cohort }: { cohort: PublicCohort }) {
  const registrationOpen = cohort.status === "open";
  const cta = (label: string, id?: string, className = "") => registrationOpen
    ? <a id={id} className={`sales-button ${className}`} href="/registro">{label} <span aria-hidden="true">→</span></a>
    : <span id={id} className={`sales-button sales-button-disabled ${className}`} role="status">Próxima edición en preparación.</span>;
  return (
    <main className="sales-page">
      <EventBeacon name="landing_viewed" />
      <a className="sales-skip" href="#sales-main">Saltar al contenido</a>
      <section className="sales-hero" id="sales-main">
        <div className="sales-shell sales-hero-grid">
          <div className="sales-hero-copy">
            <p className="sales-eyebrow">MASTERCLASS EN VIVO · 2 ENCUENTROS</p>
            <h1>NO EMPRENDAS <span>TODAVÍA.</span></h1>
            <p className="sales-promise">Que un negocio suene increíble<span className="sales-mobile-break"><br /></span> no significa que sea una buena<span className="sales-mobile-break"><br /></span> decisión para ti.</p>
            <div className="sales-hero-image sales-hero-image-mobile">
              <Image src="/images/no-emprendas-hero.png" alt="Profesional revisando notas antes de tomar una decisión" fill priority sizes="(max-width: 700px) 100vw, 1px" />
            </div>
            <p className="sales-description">Aprende qué preguntar, qué comprobar<span className="sales-mobile-break"><br /></span> y cómo comparar oportunidades<span className="sales-mobile-break"><br /></span> antes de comprometer tu tiempo y tu dinero.</p>
            <div className="sales-session-line" aria-label="Dos encuentros en vivo"><span>MARTES <b>·</b> Aprende a evaluar</span><span>JUEVES <b>·</b> Aprende a decidir</span></div>
            {cta("QUIERO ASISTIR A LA MASTERCLASS", "sales-hero-cta")}
            <p className="sales-gift-note"><span aria-hidden="true">✦</span> Y además, recibirás una herramienta práctica para evaluar tu próxima oportunidad antes de decir que sí.</p>
            {!registrationOpen && <p className="sales-status">Próxima edición en preparación.</p>}
          </div>
          <div className="sales-hero-image sales-hero-image-desktop">
            <Image src="/images/no-emprendas-hero.png" alt="Profesional revisando notas antes de tomar una decisión" fill priority sizes="(min-width: 900px) 48vw, 1px" />
            <span className="sales-image-caption">Antes de decir sí, mira de nuevo.</span>
          </div>
        </div>
      </section>

      <section className="sales-identification" aria-labelledby="identification-title">
        <div className="sales-shell">
          <div className="sales-section-intro"><p className="sales-eyebrow">EL MOMENTO ANTES DE ELEGIR</p><h2 id="identification-title">¿Mientras más oportunidades conoces, más difícil te resulta elegir?</h2><p>Una franquicia. Un negocio digital. Una idea que alguien te recomienda.</p><p>Todas parecen interesantes cuando te cuentan sus ventajas.</p><p>Pero hay una diferencia enorme entre escuchar una buena propuesta y saber evaluarla.</p><p className="sales-intro-strong">Mira cómo cambia una oportunidad cuando empiezas a hacer las preguntas correctas.</p></div>
          <div className="sales-question-list">{questions.map(([promise, question], index) => <article className="sales-question-pair" key={promise}><div><span className="sales-question-label">TE DICEN</span><p className="sales-promise-quote">“{promise}”.</p></div><span className="sales-question-connector" aria-hidden="true">→</span><div><span className="sales-question-label sales-question-label-dark">TÚ PREGUNTAS</span><p className="sales-smart-question">{question}</p></div><span className="sales-question-index">0{index + 1}</span></article>)}</div>
          <p className="sales-identification-close">No se trata de encontrar más oportunidades. Se trata de saber cuáles merecen tu sí.</p>
        </div>
      </section>

      <section className="sales-masterclass" aria-labelledby="masterclass-title">
        <div className="sales-shell">
          <div className="sales-section-intro sales-masterclass-intro"><p className="sales-eyebrow">LA EXPERIENCIA</p><h2 id="masterclass-title">La próxima vez que te presenten una oportunidad, no te quedes solo con lo que te cuentan.</h2><p>En dos encuentros en vivo aprenderás a mirar más allá de una buena presentación y tomar decisiones con más criterio.</p></div>
          <div className="sales-timeline">
            <div className="sales-timeline-progress" aria-hidden="true"><span>01</span><i></i><span>02</span></div>
            <article className="sales-stage"><div className="sales-stage-meta">MARTES · PRIMER ENCUENTRO</div><h3>Aprende a evaluar.</h3><p>Descubre qué revisar detrás de una propuesta atractiva, qué preguntas hacer y cómo reconocer señales de riesgo antes de comprometerte.</p><strong>Dejarás de mirar únicamente las ventajas y empezarás a analizar lo que realmente importa.</strong></article>
            <article className="sales-stage sales-stage-second"><div className="sales-stage-meta">JUEVES · SEGUNDO ENCUENTRO</div><h3>Aprende a decidir.</h3><p>Lleva esos criterios a oportunidades concretas, aprende a comparar alternativas y reconoce cuándo avanzar, cuándo investigar más y cuándo decir que no.</p><strong>Tendrás una forma más clara de evaluar qué oportunidad merece tu siguiente paso.</strong></article>
          </div>
          <div className="sales-reinforcement"><span aria-hidden="true">✦</span><p>No necesitas tener experiencia emprendiendo ni haber elegido ya un negocio.</p></div>
          {cta("QUIERO ASISTIR A LA MASTERCLASS", undefined, "sales-button-secondary")}
        </div>
      </section>

      <section className="sales-gift" aria-labelledby="gift-title">
        <div className="sales-shell sales-gift-grid">
          <div className="sales-gift-copy"><p className="sales-gift-eyebrow">Y ADEMÁS, TE LLEVAS ESTE REGALO.</p><h2 id="gift-title">EL FILTRO<br />ANTES DEL SÍ.</h2><p className="sales-gift-promise">Que la próxima oportunidad no te encuentre sin las preguntas correctas.</p><p>Recibirás nuestra Matriz para Evaluar Oportunidades, una herramienta práctica que podrás utilizar cada vez que estés considerando un negocio.</p><ul><li>Identifica qué información necesitas comprobar antes de comprometerte.</li><li>Compara diferentes oportunidades con criterios claros.</li><li>Reconoce preguntas y riesgos que merecen una revisión más profunda.</li></ul><p className="sales-gift-close">La masterclass te enseña a evaluar. Tu regalo te ayuda a seguir haciéndolo después.</p></div>
          <div className="sales-device-wrap"><Image src="/images/filtro-antes-del-si-device.png" alt="Tablet con la Matriz para Evaluar Oportunidades" fill sizes="(max-width: 700px) 100vw, 48vw" /><div className="sales-matrix-screen"><div className="sales-matrix-screen-head"><span>MATRIZ PARA EVALUAR OPORTUNIDADES</span><b>01 / 10</b></div>{criteria.map(([title, question]) => <div className="sales-matrix-row" key={title}><strong>{title}</strong><span>{question}</span></div>)}</div></div>
          <div className="sales-gift-cta"><h3>Tu próxima oportunidad merece algo más que una buena presentación.</h3><p>Reserva tu acceso a los dos encuentros y recibe la herramienta que te ayudará a evaluar con más criterio.</p>{cta("QUIERO ASISTIR Y RECIBIR MI REGALO", "sales-final-cta", "sales-button-gold")}<small>Recibirás la herramienta por WhatsApp después de confirmar tu ingreso al grupo privado.</small></div>
        </div>
      </section>

      <footer className="sales-footer"><div className="sales-shell"><div><span className="sales-footer-title">NO EMPRENDAS TODAVÍA.</span><span>Masterclass en vivo · dos encuentros</span></div><nav aria-label="Enlaces legales"><Link href="/privacidad">Aviso de privacidad (borrador)</Link><Link href="/terminos">Términos (borrador)</Link></nav></div></footer>
      <StickySalesCta enabled={registrationOpen} />
    </main>
  );
}
