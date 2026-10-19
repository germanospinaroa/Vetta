import Image from "next/image";
import Link from "next/link";
import { EventBeacon } from "@/components/event-beacon";
import { StickySalesCta } from "@/components/sticky-sales-cta";
import { SalesCta } from "@/components/sales-cta";
import { PrivacyPreferencesButton } from "@/components/privacy-preferences-button";
import type { PublicCohort } from "@/lib/config";
import teamImage from "../Team.png";

const questions = [
  ["Es una inversión pequeña", "¿Cuánto dinero necesitarías realmente para comenzar y sostenerlo?"],
  ["Puedes hacerlo en tu tiempo libre", "¿Qué tendrías que hacer cada semana para que funcione?"],
  ["Tiene muchísimo potencial", "¿Qué señales puedes revisar de que hay personas dispuestas a comprar?"],
] as const;

export function SalesLanding({ cohort }: { cohort: PublicCohort }) {
  const canRegister = cohort.status === "open";
  const cta = (label: string, id?: string) => <SalesCta label={label} id={id} className="sales-v2-button" />;

  return (
    <main className="sales-page sales-v2">
      <EventBeacon name="landing_viewed" />
      <a className="sales-skip" href="#sales-main">Saltar al contenido</a>
      <header className="sales-v2-header"><div className="sales-shell sales-v2-header-inner"><Link className="sales-v2-wordmark" href="#sales-main">NO EMPRENDAS <span>TODAVÍA.</span></Link></div></header>

      <section className="sales-v2-hero" id="sales-main" aria-labelledby="sales-v2-hero-title"><div className="sales-shell sales-v2-hero-grid"><div className="sales-v2-hero-copy"><p className="sales-v2-eyebrow">MENTORÍA EN VIVO · DOS ENCUENTROS</p><h1 id="sales-v2-hero-title">NO EMPRENDAS <span>TODAVÍA.</span></h1><p className="sales-v2-promise">¿Y si la oportunidad que buscas no se parece a la que imaginas?</p><p className="sales-v2-support">No necesitas tener un negocio elegido. Ven a ampliar tu perspectiva, hacerte mejores preguntas y explorar nuevas posibilidades de emprender.</p><div className="sales-v2-date"><strong>20 y 22 de octubre de 2026</strong><span>8:00 p. m. · Hora de Colombia</span></div><p className="sales-v2-experience-note">Dos encuentros. Una experiencia para vivir completa.</p>{canRegister ? cta("QUIERO RESERVAR MI LUGAR", "sales-hero-cta") : <span className="sales-v2-status">Las inscripciones se habilitarán cuando la edición esté confirmada.</span>}<div className="sales-v2-hero-mobile-image"><Image src="/images/no-emprendas-hero.png" alt="Profesional revisando notas antes de tomar una decisión" fill priority sizes="100vw" /></div></div><div className="sales-v2-hero-desktop-image"><Image src="/images/no-emprendas-hero.png" alt="Profesional revisando notas antes de tomar una decisión" fill priority sizes="(min-width: 900px) 48vw, 1px" /></div></div></section>

      <section className="sales-v2-identification" aria-labelledby="sales-v2-identification-title"><div className="sales-shell"><div className="sales-v2-section-heading"><h2 id="sales-v2-identification-title">Una buena oportunidad no solo debe sonar bien.</h2></div><div className="sales-v2-question-list">{questions.map(([promise, question]) => <article className="sales-v2-question" key={promise}><div><span>TE DICEN</span><p>«{promise}»</p></div><div className="sales-v2-question-arrow" aria-hidden="true">→</div><div><span>QUÉ REVISAR</span><strong>{question}</strong></div></article>)}</div></div></section>

      <section className="sales-v2-gift" aria-labelledby="sales-v2-gift-title"><div className="sales-shell sales-v2-gift-grid"><div className="sales-v2-gift-copy"><h2 id="sales-v2-gift-title">EL FILTRO ANTES DEL SÍ</h2><p className="sales-v2-gift-promise">¿Ya tienes una oportunidad en mente? Analízala. ¿Todavía estás explorando? Descubre qué buscar.</p><p className="sales-v2-gift-promise-sub">Responde diez criterios y recibe un resultado personalizado con lo que juega a tu favor, lo que necesitas comprobar y tus próximos pasos.</p></div><div className="sales-v2-filter-demo" aria-label="Vista previa del diagnóstico de El filtro antes del sí"><div className="sales-v2-filter-head"><span>VISTA PREVIA DE TU LECTURA</span></div><p>La oportunidad tiene aspectos interesantes, pero todavía necesitas validar dos factores decisivos.</p><strong>SEÑAL DE ALERTA<br /><span>Costos recurrentes todavía no comprobados.</span></strong><div className="sales-v2-filter-rule" /><small><b>PRÓXIMO PASO</b><br />Solicita el desglose de gastos antes de comprometerte.</small></div><div className="sales-v2-gift-close"><p className="sales-v2-gift-delivery">El filtro se recibe por WhatsApp después de registrarte e iniciar la conversación privada.</p>{canRegister && cta("QUIERO RESERVAR MI LUGAR")}</div></div></section>

      <section className="sales-v2-facilitators" aria-labelledby="sales-v2-facilitators-title"><div className="sales-shell"><div className="sales-v2-section-heading"><h2 id="sales-v2-facilitators-title">CUATRO VOCES. MÁS POSIBILIDADES.</h2></div><div className="sales-v2-team-image"><Image src={teamImage} alt="Composición visual de Andrés Jaramillo, Marcela Cruz, Alejandra Arévalo y Germán Ospina" sizes="(max-width: 700px) 100vw, 980px" /></div><p className="sales-v2-team-copy">Cuatro perspectivas para compartir experiencias, cuestionar lo que damos por hecho y descubrir nuevas formas de mirar el emprendimiento.</p><p className="sales-v2-team-names">Andrés Jaramillo · Marcela Cruz · Alejandra Arévalo · Germán Ospina</p><div className="sales-v2-close sales-v2-inline-close"><h3>Hay posibilidades que vale la pena conocer antes de elegir.</h3><p>Te esperamos en los dos encuentros.</p>{canRegister && cta("QUIERO RESERVAR MI LUGAR", "sales-final-cta")}</div></div></section>

      <footer className="sales-footer sales-v2-footer"><div className="sales-shell"><div><span className="sales-footer-title">NO EMPRENDAS TODAVÍA.</span><span>Dos encuentros en vivo</span></div><nav aria-label="Enlaces legales"><Link href="/privacidad">Aviso de privacidad (propuesta)</Link><Link href="/terminos">Términos (borrador)</Link><PrivacyPreferencesButton /></nav></div></footer><StickySalesCta enabled={canRegister} />
    </main>
  );
}
