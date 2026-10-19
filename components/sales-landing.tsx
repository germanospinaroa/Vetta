import Image from "next/image";
import Link from "next/link";
import { EventBeacon } from "@/components/event-beacon";
import { StickySalesCta } from "@/components/sticky-sales-cta";
import { SalesCta } from "@/components/sales-cta";
import type { PublicCohort } from "@/lib/config";
import teamImage from "../Team.png";

const questions = [
  ["Es una inversión pequeña", "¿Cuánto dinero necesitarías realmente para comenzar y sostenerlo?"],
  ["Puedes hacerlo en tu tiempo libre", "¿Qué tendrías que hacer cada semana para que funcione?"],
  ["Tiene muchísimo potencial", "¿Qué evidencia demuestra que existe una demanda real?"],
] as const;

export function SalesLanding({ cohort }: { cohort: PublicCohort }) {
  const canRegister = cohort.status === "open";
  const cta = (label: string, id?: string) => <SalesCta label={label} id={id} className="sales-v2-button" />;

  return (
    <main className="sales-page sales-v2">
      <EventBeacon name="landing_viewed" />
      <a className="sales-skip" href="#sales-main">Saltar al contenido</a>
      <header className="sales-v2-header"><div className="sales-shell sales-v2-header-inner"><Link className="sales-v2-wordmark" href="#sales-main">NO EMPRENDAS <span>TODAVÍA.</span></Link></div></header>

      <section className="sales-v2-hero" id="sales-main" aria-labelledby="sales-v2-hero-title"><div className="sales-shell sales-v2-hero-grid"><div className="sales-v2-hero-copy"><h1 id="sales-v2-hero-title">NO EMPRENDAS <span>TODAVÍA.</span></h1><p className="sales-v2-promise">La próxima oportunidad podría ser buena. ¿Sabrías reconocerla?</p><p className="sales-v2-support">Antes de comprometer tu tiempo, energía o dinero, descubre qué vale la pena mirar más allá de una buena presentación.</p><div className="sales-v2-date"><strong>20 y 22 de octubre de 2026</strong><span>8:00 p. m. · Hora de Colombia</span></div><p className="sales-v2-experience-note">Dos encuentros conectados. Una experiencia para vivir completa.</p>{canRegister ? cta("QUIERO RESERVAR MI LUGAR", "sales-hero-cta") : <span className="sales-v2-status">Las inscripciones se habilitarán cuando la edición esté confirmada.</span>}<div className="sales-v2-hero-mobile-image"><Image src="/images/no-emprendas-hero.png" alt="Profesional revisando notas antes de tomar una decisión" fill priority sizes="100vw" /></div></div><div className="sales-v2-hero-desktop-image"><Image src="/images/no-emprendas-hero.png" alt="Profesional revisando notas antes de tomar una decisión" fill priority sizes="(min-width: 900px) 48vw, 1px" /></div></div></section>

      <section className="sales-v2-identification" aria-labelledby="sales-v2-identification-title"><div className="sales-shell"><div className="sales-v2-section-heading"><h2 id="sales-v2-identification-title">Todo suena bien en la presentación. ¿Y después?</h2></div><div className="sales-v2-question-list">{questions.map(([promise, question]) => <article className="sales-v2-question" key={promise}><div><span>TE DICEN</span><p>«{promise}»</p></div><div className="sales-v2-question-arrow" aria-hidden="true">→</div><div><span>QUÉ REVISAR</span><strong>{question}</strong></div></article>)}</div></div></section>

      <section className="sales-v2-gift" aria-labelledby="sales-v2-gift-title"><div className="sales-shell sales-v2-gift-grid"><div className="sales-v2-gift-copy"><h2 id="sales-v2-gift-title">EL FILTRO ANTES DEL SÍ</h2><p className="sales-v2-gift-promise">Descubre qué juega a tu favor, qué podrías estar pasando por alto y qué necesitas comprobar antes de comprometerte con una oportunidad.</p><p className="sales-v2-gift-promise-sub">Un diagnóstico personalizado y tus próximos pasos.</p></div><div className="sales-v2-filter-demo" aria-label="Demostración de El filtro antes del sí"><div className="sales-v2-filter-head"><span>EL FILTRO ANTES DEL SÍ</span></div><p>«La inversión es baja».</p><strong>¿Cuánto dinero necesitarías antes de conseguir tus primeros clientes?</strong><div className="sales-v2-filter-rule" /><small>Una buena pregunta puede cambiar por completo cómo ves una oportunidad.</small></div><div className="sales-v2-gift-close"><p className="sales-v2-gift-delivery">Después de registrarte, continúa por WhatsApp, ingresa al grupo privado y responde LISTO en el chat individual para recibir tu filtro.</p>{canRegister && cta("QUIERO RESERVAR MI LUGAR")}</div></div></section>

      <section className="sales-v2-facilitators" aria-labelledby="sales-v2-facilitators-title"><div className="sales-shell"><div className="sales-v2-section-heading"><h2 id="sales-v2-facilitators-title">CUATRO VOCES. UNA EXPERIENCIA QUE PUEDE CAMBIAR TU PERSPECTIVA.</h2></div><div className="sales-v2-team-image"><Image src={teamImage} alt="Andrés Jaramillo, Marcela Cruz, Alejandra Arévalo y Germán Ospina" sizes="(max-width: 700px) 100vw, 1200px" /></div><p className="sales-v2-team-copy">No venimos a darte otra charla motivacional. Venimos a compartir experiencias reales, cuestionar lo que muchos dan por sentado y mostrarte que, cuando se trata de emprender, hay cosas que vale la pena descubrir antes de decidir.</p><p className="sales-v2-team-names">Andrés Jaramillo · Marcela Cruz · Alejandra Arévalo · Germán Ospina</p><div className="sales-v2-close sales-v2-inline-close"><h3>Tu próxima oportunidad merece algo más que entusiasmo.</h3><p>Reserva tu lugar y acompáñanos en los dos encuentros.</p><p className="sales-v2-close-date">20 y 22 de octubre de 2026 · 8:00 p. m. · Hora de Colombia</p>{canRegister && cta("QUIERO RESERVAR MI LUGAR", "sales-final-cta")}</div></div></section>

      <footer className="sales-footer sales-v2-footer"><div className="sales-shell"><div><span className="sales-footer-title">NO EMPRENDAS TODAVÍA.</span><span>Dos encuentros en vivo</span></div><nav aria-label="Enlaces legales"><Link href="/privacidad">Aviso de privacidad (borrador)</Link><Link href="/terminos">Términos (borrador)</Link></nav></div></footer><StickySalesCta enabled={canRegister} />
    </main>
  );
}
