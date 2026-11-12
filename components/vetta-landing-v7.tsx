"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
  The existing VETTA RegistrationForm MUST be passed as registrationForm.
  This component does not implement registrations, webhooks, cohort selection or messages.
  That remains exclusively owned by the existing backend and form.
*/

type Props = {
  registrationForm: ReactNode;
  privacyControl?: ReactNode;
  eventBeacon?: ReactNode;
  onRegistrationIntent?: (placement: "header" | "hero" | "footer") => void;
};

type IconName = "calendar" | "play" | "group" | "gift" | "bulb" | "coins" | "target" | "binoculars" | "question" | "chart" | "arrow";
function Icon({ name, size=26 }: { name: IconName; size?: number }) {
  const common = { width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.9,strokeLinecap:"round" as const,strokeLinejoin:"round" as const, "aria-hidden":true as const };
  switch(name){
    case "calendar": return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18M8 15h3M8 18h6"/></svg>;
    case "play": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/></svg>;
    case "group": return <svg {...common}><circle cx="9" cy="8" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v1"/></svg>;
    case "gift": return <svg {...common}><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M2 10h20M12 10v11M12 10c-6 0-7-4-4-6s5 3 4 6Zm0 0c6 0 7-4 4-6s-5 3-4 6Z"/></svg>;
    case "bulb": return <svg {...common}><path d="M9 18h6m-5 3h4M8 15c-5-3-5-10 1-12a8 8 0 0 1 9 12c-2 1-3 3-3 4H9c0-2-1-3-1-4Z"/></svg>;
    case "coins": return <svg {...common}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v5c0 2 4 3 8 3s8-1 8-3V5M4 10v5c0 2 4 3 8 3s8-1 8-3v-5M4 15v4c0 2 4 3 8 3s8-1 8-3v-4"/></svg>;
    case "target": return <svg {...common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/><path d="m12 12 8-8M18 4h2v2"/></svg>;
    case "binoculars": return <svg {...common}><path d="m4 17 3-11h3l2 8 2-8h3l3 11"/><circle cx="6" cy="17" r="4"/><circle cx="18" cy="17" r="4"/></svg>;
    case "question": return <svg {...common}><path d="M5 3h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7l-5 3v-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M9 9a3 3 0 1 1 5 2c-1 1-2 1-2 3M12 16h.01"/></svg>;
    case "chart": return <svg {...common}><path d="M3 21h18M5 17v-5h4v5M11 17V9h4v8M17 17V5h4v12M5 7l5-3 4 2 6-4"/></svg>;
    case "arrow": return <svg {...common}><path d="M4 12h16m-6-6 6 6-6 6"/></svg>;
  }
}

function InfoCard({name,title,description}: {name:IconName;title:string;description:string}){
  return <article className="v7-card"><span className="v7-card-icon"><Icon name={name}/></span><div><h3>{title}</h3><p>{description}</p></div></article>;
}

export function VettaLandingV7({registrationForm,privacyControl,eventBeacon,onRegistrationIntent}:Props){
  const [open,setOpen]=useState(false);
  const closeRef=useRef<HTMLButtonElement|null>(null);
  const buttonRef=useRef<HTMLButtonElement|null>(null);
  useEffect(()=>{const check=()=>{if(window.location.hash==="#inscripcion")setOpen(true)};check();window.addEventListener("hashchange",check);return()=>window.removeEventListener("hashchange",check)},[]);
  const start=(placement:"header"|"hero"|"footer")=>{onRegistrationIntent?.(placement);setOpen(true)};
  useEffect(()=>{if(!open)return;let prev=document.body.style.overflow;document.body.style.overflow="hidden";closeRef.current?.focus();const esc=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};document.addEventListener("keydown",esc);return()=>{document.body.style.overflow=prev;document.removeEventListener("keydown",esc);buttonRef.current?.focus()}},[open]);
  const register=(placement:"hero"|"footer")=><button type="button" className="v7-cta" onClick={()=>start(placement)}>RESERVAR MI LUGAR GRATIS <Icon name="arrow" size={19}/></button>;
  return <main className="v7">
    {eventBeacon}
    <span id="inscripcion" aria-hidden="true" style={{position:"absolute",width:0,height:0,overflow:"hidden"}}/>
    <header className="v7-bar"><div className="v7-shell v7-barinner"><a className="v7-brand" href="#inicio">NO EMPRENDAS TODAVÍA<span>.</span></a><button ref={buttonRef} className="v7-cta" onClick={()=>start("header")}>RESERVAR MI LUGAR <Icon name="arrow" size={16}/></button></div></header>
    <section className="v7-hero" id="inicio" aria-labelledby="v7-title">
      <div className="v7-hero-visual" aria-hidden="true"><img src="/v7/hero-camino.webp" width={1365} height={1197} alt="" fetchPriority="high"/></div>
      <div className="v7-shell"><div className="v7-hero-copy">
        <p className="v7-eyebrow">MASTERCLASS GRATIS · EN VIVO</p>
        <h1 id="v7-title">NO EMPRENDAS<br/>TODAVÍA<span>.</span></h1>
        <p className="v7-lead">Antes de invertir tu tiempo, tu dinero o tu energía, aprende qué revisar para tomar mejores decisiones.</p>
        <p className="v7-hero-sub">Una experiencia en vivo para ampliar tu perspectiva, explorar opciones de emprendimiento y entender qué señales deberías evaluar antes de comprometerte con una oportunidad.</p>
        <div className="v7-date"><Icon name="calendar" size={27}/><div><strong>17 y 19 de noviembre de 2026</strong><small>8:00 p. m. · Hora de Colombia</small></div></div>
        <div className="v7-facts"><div className="v7-fact"><Icon name="play"/>2 encuentros<br/>en vivo</div><div className="v7-fact"><Icon name="group"/>Grupo<br/>privado</div><div className="v7-fact"><Icon name="gift"/>Regalo digital<br/>incluido</div></div>
        {register("hero")}
        <p className="v7-hero-note">Inscripción gratuita. Confirmas tu acceso por WhatsApp.</p>
      </div></div>
    </section>
    <section className="v7-section v7-recognition"><div className="v7-shell"><div className="v7-accent"/><h2 className="v7-title-center">Si hoy quieres emprender, pero no tienes claro<br className="v7-wide"/> por dónde empezar, este espacio es para ti.</h2><div className="v7-cards">
      <InfoCard name="bulb" title="Tienes interés, pero no suficiente claridad" description="Quieres avanzar, pero no sabes qué opción encaja contigo."/>
      <InfoCard name="coins" title="No quieres perder tiempo ni dinero" description="Necesitas mirar mejor antes de comprometerte con una oportunidad."/>
      <InfoCard name="target" title="Buscas una decisión con más criterio" description="Aquí vas a descubrir qué revisar antes de decir que sí."/>
    </div></div></section>
    <section className="v7-section v7-benefits"><div className="v7-shell"><div className="v7-accent"/><h2 className="v7-title-center">Lo que te llevarás de esta masterclass</h2><div className="v7-cards">
      <InfoCard name="binoculars" title="Más perspectiva" description="Verás diferentes caminos para emprender sin quedarte atrapado en una sola narrativa."/>
      <InfoCard name="question" title="Mejores preguntas" description="Aprenderás qué señales revisar antes de invertir tiempo, dinero o energía."/>
      <InfoCard name="chart" title="Más criterio para decidir" description="Tendrás más claridad sobre lo que vale la pena explorar y lo que conviene cuestionar."/>
    </div></div></section>
    <section className="v7-sessions"><div className="v7-shell"><div className="v7-accent"/><h2 className="v7-title-center">Dos encuentros. Una experiencia completa.</h2><div className="v7-timeline"><div className="v7-date-pill"><Icon name="calendar"/>Martes 17 de noviembre · 8:00 p. m.</div><div className="v7-line"/><div className="v7-date-pill"><Icon name="calendar"/>Jueves 19 de noviembre · 8:00 p. m.</div></div><p className="v7-timeline-note">El martes exploramos las opciones. El jueves analizamos una alternativa empresarial concreta, sin compromiso.</p></div></section>
    <section className="v7-gift"><div className="v7-shell v7-gift-grid"><h2>Además recibirás<br/>un regalo digital</h2><img className="v7-gift-art" src="/v7/regalo-movimiento.webp" width={1083} height={552} loading="lazy" alt="Vista ilustrativa del regalo TU PRÓXIMO MOVIMIENTO"/><div className="v7-gift-copy"><span className="v7-gift-mark">REGALO AL CONFIRMAR POR WHATSAPP</span><h3>TU PRÓXIMO<br/>MOVIMIENTO.</h3><p>Una herramienta interactiva para ayudarte a explorar seis formas de emprender, comparar opciones y preparar tu siguiente paso con una misión práctica de 48 horas.</p></div></div></section>
    <section className="v7-team"><div className="v7-shell v7-team-grid"><div className="v7-photo-wrap"><img className="v7-team-img" src="/v7/equipo-real.webp" width={1448} height={1086} loading="lazy" alt="Fotografía real de los cuatro facilitadores en un evento presencial"/><div className="v7-names"><span>Germán Ospina</span><span>Alejandra Arévalo</span><span>Andrés Jaramillo</span><span>Marcela Cruz</span></div></div><div className="v7-team-copy"><div className="v7-accent"/><h2>Los facilitadores de esta experiencia</h2><p>Un equipo que te acompañará a mirar con más criterio, más perspectiva y más honestidad las oportunidades que estás considerando.</p></div></div></section>
    <section className="v7-faq"><div className="v7-shell"><div className="v7-accent"/><h2 className="v7-title-center">Preguntas frecuentes</h2><div className="v7-faq-grid">
      <details open><summary>¿Tiene algún costo?</summary><p>No. Las dos sesiones de la masterclass son gratuitas.</p></details>
      <details open><summary>¿Necesito tener un negocio elegido?</summary><p>No. Puedes asistir aunque todavía estés explorando opciones.</p></details>
      <details open><summary>¿Cómo recibo el acceso?</summary><p>Te registras, confirmas tu código por WhatsApp y recibes las instrucciones para ingresar al grupo privado.</p></details>
    </div></div></section>
    <section className="v7-final"><div className="v7-shell"><h2>Si quieres mirar mejor antes de decidir,<br/><span>reserva tu lugar ahora.</span></h2><p>Tu acceso es gratuito. Solo asegúrate de completar tu registro y entrar al grupo privado.</p>{register("footer")}</div></section>
    <footer className="v7-footer"><div className="v7-shell v7-footer-inner"><span>NO EMPRENDAS TODAVÍA. · 17 Y 19 DE NOVIEMBRE · 8:00 P. M. COLOMBIA</span><nav><a href="/privacidad">Aviso de privacidad</a><a href="/terminos">Términos de participación</a>{privacyControl}</nav></div></footer>
    {open&&<div className="v7-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div className="v7-modal" role="dialog" aria-modal="true" aria-labelledby="v7-modal-title"><div className="v7-modalhead"><div><h2 id="v7-modal-title">Reserva tu lugar gratis.</h2><p>Completa tus datos y después confirma por WhatsApp.</p></div><button ref={closeRef} className="v7-close" type="button" aria-label="Cerrar inscripción" onClick={()=>setOpen(false)}>×</button></div>{registrationForm}</div></div>}
  </main>;
}
