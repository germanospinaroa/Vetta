"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { FAQ } from "@/components/faq";
import { RegistrationForm } from "@/components/registration-form";
import { EventBeacon } from "@/components/event-beacon";
import type { PublicCohort } from "@/lib/config";

type OpportunityKey = "ecommerce" | "franquicia" | "consultoria";

const opportunities: Record<OpportunityKey, { label: string; kicker: string; questions: string[] }> = {
  ecommerce: {
    label: "Ecommerce",
    kicker: "Demanda antes que inventario",
    questions: ["¿Cómo validarías la demanda antes de invertir?", "¿Qué costos existen aparte del inventario?", "¿Cuánto depende la operación de tu tiempo?", "¿Cómo conseguirías los primeros clientes?"],
  },
  franquicia: {
    label: "Franquicia",
    kicker: "Modelo antes que entusiasmo",
    questions: ["¿Qué inversión total requiere?", "¿Qué soporte operativo recibes?", "¿Qué obligaciones y riesgos asumes?", "¿Cómo puedes verificar el modelo comercial?"],
  },
  consultoria: {
    label: "Consultoría",
    kicker: "Problema antes que propuesta",
    questions: ["¿Qué problema específico resolverías?", "¿Cómo validarías que alguien pagaría por ello?", "¿Cuánto depende de tus horas disponibles?", "¿Cómo podrías crecer sin aumentar proporcionalmente tu trabajo?"],
  },
};

const matrixPreview = [
  ["Capital necesario", "¿Qué debes comprometer antes de validar la oportunidad?"],
  ["Tiempo requerido", "¿Qué ritmo de trabajo exige y qué desplaza de tu vida actual?"],
  ["Riesgo", "¿Qué puede salir mal y qué parte puedes limitar?"],
  ["Demanda verificable", "¿Qué evidencia existe de que alguien necesita o compra esto?"],
  ["Validación previa", "¿Qué puedes comprobar antes de comprometerte de verdad?"],
];

export function VettaLanding({ cohort }: { cohort: PublicCohort }) {
  const [active, setActive] = useState<OpportunityKey>("ecommerce");
  const activeOpportunity = opportunities[active];
  const canRegister = cohort.status === "open" && Boolean(cohort.tuesdayLabel && cohort.thursdayLabel);
  const opportunityKeys = Object.keys(opportunities) as OpportunityKey[];

  function handleOpportunityKey(event: KeyboardEvent<HTMLButtonElement>, key: OpportunityKey) {
    const currentIndex = opportunityKeys.indexOf(key);
    const nextIndex = event.key === "ArrowRight" ? (currentIndex + 1) % opportunityKeys.length : event.key === "ArrowLeft" ? (currentIndex - 1 + opportunityKeys.length) % opportunityKeys.length : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    const nextKey = opportunityKeys[nextIndex];
    setActive(nextKey);
    requestAnimationFrame(() => document.getElementById(`vt-tab-${nextKey}`)?.focus());
  }

  return (
    <main className="vt-landing" id="main-content">
      <EventBeacon name="landing_viewed" />
      <a className="vt-skip" href="#vt-main">Saltar al contenido</a>
      <header className="vt-header">
        <div className="vt-shell vt-header-inner">
          <Link className="vt-brand" href="#vt-top" aria-label="VETTA inicio"><span className="vt-brand-mark">V</span><span>VETTA</span></Link>
          <nav className="vt-nav" aria-label="Navegación principal"><a href="#vt-experience">La experiencia</a><a href="#vt-matrix">La matriz</a><a href="#vt-register">Registro</a></nav>
          {canRegister ? <a className="vt-button vt-button-small" href="#vt-register">Reservar mi lugar <span aria-hidden="true">↗</span></a> : <span className="vt-status">PRÓXIMA EDICIÓN EN PREPARACIÓN</span>}
        </div>
      </header>

      <div id="vt-main">
        <section className="vt-hero vt-shell" id="vt-top" aria-labelledby="vt-hero-title">
          <div className="vt-hero-copy">
            <p className="vt-eyebrow"><span className="vt-eyebrow-dot" /> Una experiencia en vivo de Elite Focus</p>
            <h1 id="vt-hero-title">No emprendas <span>todavía.</span></h1>
            <p className="vt-hero-promise">La próxima oportunidad de negocio que te presenten puede sonar increíble. La pregunta es si realmente merece tu tiempo, tu dinero y tu esfuerzo.</p>
            <p className="vt-hero-support">Dos encuentros virtuales en vivo para aprender a evaluar oportunidades y tomar decisiones con más criterio.</p>
            <div className="vt-hero-actions">
              {canRegister ? <a className="vt-button" href="#vt-register">Reservar mi lugar <span aria-hidden="true">↗</span></a> : <span className="vt-button vt-button-disabled" aria-disabled="true">Próxima edición en preparación</span>}
              <div className="vt-session-chips"><span><b>MARTES</b> Aprende a evaluar</span><span><b>JUEVES</b> Aprende a decidir</span></div>
            </div>
          </div>

          <div className="vt-explorer" aria-labelledby="vt-explorer-title">
            <div className="vt-explorer-glow" aria-hidden="true" />
            <div className="vt-explorer-top"><span className="vt-mono">VETTA / CRITERIO 01</span><span className="vt-live-dot">INTERACTIVO</span></div>
            <div className="vt-explorer-heading"><p className="vt-mono">Antes de decidir,</p><h2 id="vt-explorer-title">evalúa.</h2></div>
            <div className="vt-option-list" role="tablist" aria-label="Oportunidades para evaluar">
              {opportunityKeys.map((key) => <button key={key} id={`vt-tab-${key}`} className={`vt-option ${active === key ? "is-active" : ""}`} type="button" role="tab" aria-selected={active === key} aria-controls="vt-evaluator-panel" aria-labelledby={`vt-tab-${key}`} tabIndex={active === key ? 0 : -1} onKeyDown={(event) => handleOpportunityKey(event, key)} onClick={() => setActive(key)}><span>{opportunities[key].label}</span><span aria-hidden="true">{active === key ? "—" : "↗"}</span></button>)}
            </div>
            <div className="vt-question-panel" id="vt-evaluator-panel" role="tabpanel" aria-live="polite" aria-label={`Preguntas para evaluar ${activeOpportunity.label}`} key={active}>
              <p className="vt-question-kicker">{activeOpportunity.kicker}</p>
              <ul>{activeOpportunity.questions.map((question) => <li key={question}><span aria-hidden="true">+</span>{question}</li>)}</ul>
              <p className="vt-panel-foot">Una oportunidad diferente exige preguntas diferentes.</p>
            </div>
          </div>
        </section>

        <section className="vt-problem" aria-labelledby="vt-problem-title">
          <div className="vt-shell vt-problem-grid"><div className="vt-section-label"><span className="vt-mono">01</span><span>El problema</span></div><div><h2 id="vt-problem-title">El problema no es encontrar oportunidades. <span>Es saber cuáles merecen la pena.</span></h2><p>Cada semana aparece una nueva idea de negocio. Una franquicia, una tienda online, un producto digital, una inversión.</p><p>Todas parecen interesantes cuando alguien te cuenta sus ventajas. Pero antes de comprometerte, hay preguntas que merecen respuestas.</p></div><div className="vt-question-stack" aria-hidden="true"><span>DEMANDA</span><i /><span>CAPITAL</span><i /><span>TIEMPO</span><i /><span>RIESGO</span></div></div>
        </section>

        <section className="vt-experience vt-shell" id="vt-experience" aria-labelledby="vt-experience-title">
          <div className="vt-section-intro"><p className="vt-eyebrow">Una experiencia en dos movimientos</p><h2 id="vt-experience-title">Primero aprende a evaluar.<br /><span>Después, a decidir.</span></h2><p>Dos encuentros conectados para pasar de la intuición a un criterio que puedas utilizar.</p></div>
          <div className="vt-session-rail" aria-label="Recorrido de los dos encuentros"><div className="vt-session-node is-current"><span className="vt-mono">MARTES / 01</span><strong>Aprende a evaluar.</strong><p>Identifica los factores que debes revisar antes de comprometer tiempo, dinero y esfuerzo.</p></div><div className="vt-rail-line" aria-hidden="true"><span /></div><div className="vt-session-node"><span className="vt-mono">JUEVES / 02</span><strong>Aprende a decidir.</strong><p>Aplica esos criterios a oportunidades reales y determina qué merece avanzar, investigarse o descartarse.</p></div></div>
        </section>

        <section className="vt-matrix" id="vt-matrix" aria-labelledby="vt-matrix-title"><div className="vt-shell vt-matrix-grid"><div className="vt-section-intro"><p className="vt-eyebrow">La herramienta</p><h2 id="vt-matrix-title">Lleva mejores preguntas a tu próxima decisión.</h2><p>La Matriz para Evaluar Oportunidades organiza los criterios que muchas personas pasan por alto. La recibirás por WhatsApp y aprenderás a utilizarla durante la experiencia.</p><Link className="vt-text-link" href="/matriz">Conocer la matriz <span aria-hidden="true">↗</span></Link></div><div className="vt-matrix-window" aria-label="Vista previa real de la Matriz para Evaluar Oportunidades"><div className="vt-window-bar"><span className="vt-mono">VETTA / MATRIZ v1</span><span className="vt-mono">GUARDADO LOCAL</span></div><div className="vt-matrix-title"><span>Una oportunidad</span><strong>merece mejores preguntas.</strong></div><div className="vt-matrix-rows">{matrixPreview.map(([criterion, question], index) => <div className="vt-matrix-row" key={criterion}><span className="vt-mono">0{index + 1}</span><div><strong>{criterion}</strong><p>{question}</p></div><span className="vt-row-line" aria-hidden="true" /></div>)}</div><p className="vt-matrix-note">La herramienta organiza preguntas. No decide por ti.</p></div></div></section>

        <section className="vt-register" id="vt-register" aria-labelledby="vt-register-title"><div className="vt-shell vt-register-grid"><div className="vt-section-intro"><p className="vt-eyebrow">Reserva tu lugar</p><h2 id="vt-register-title">Tu próxima decisión merece <span>más criterio.</span></h2><p>Reserva tu lugar en los dos encuentros y aprende a evaluar oportunidades antes de comprometerte con ellas.</p><div className="vt-trust-line"><span>Elite Focus</span><span>Vinculado a Zilis</span><span>Sin promesas de ingresos</span></div></div>{canRegister ? <div className="vt-form-shell"><RegistrationForm /></div> : <div className="vt-preopening"><span className="vt-mono">REGISTRO / PREAPERTURA</span><div className="vt-preopening-mark" aria-hidden="true">+</div><h3>Próxima edición en preparación.</h3><p>Las fechas, condiciones y enlaces de la siguiente experiencia todavía no están confirmados. El registro se abrirá cuando exista información verificable.</p><p className="vt-preopening-note">No mostraremos fechas, cupos ni condiciones hasta que estén configurados.</p></div>}</div></section>

        <section className="vt-faq vt-shell" aria-labelledby="vt-faq-title"><div className="vt-faq-heading"><p className="vt-eyebrow">Preguntas frecuentes</p><h2 id="vt-faq-title">Antes de participar,<br /><span>pregunta mejor.</span></h2></div><FAQ /></section>
        <footer className="vt-footer"><div className="vt-shell vt-footer-grid"><div><Link className="vt-brand" href="#vt-top"><span className="vt-brand-mark">V</span><span>VETTA</span></Link><p>Una experiencia de Elite Focus.</p></div><div><p>Organiza Elite Focus · equipo vinculado a Zilis.</p><p><Link href="/privacidad">Aviso de privacidad (borrador)</Link><span> · </span><Link href="/terminos">Términos (borrador)</Link></p></div></div></footer>
      </div>
    </main>
  );
}
