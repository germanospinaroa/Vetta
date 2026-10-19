import Link from "next/link";
import { MatrixTool } from "@/components/matrix-tool";
import { EventBeacon } from "@/components/event-beacon";

export const metadata = { title: "El filtro antes del sí | NO EMPRENDAS TODAVÍA.", robots: { index: false, follow: true } };

export default function MatrixPage() {
  return <main className="matrix-page"><EventBeacon name="matrix_opened" /><a className="skip-link" href="#matrix-content">Saltar al contenido</a><header className="site-header"><div className="container header-inner"><Link className="wordmark" href="/"><span className="wordmark-mark">N</span><span>NO EMPRENDAS TODAVÍA.</span></Link><span className="header-context">EL FILTRO ANTES DEL SÍ</span><Link className="text-link" href="/">Volver a la experiencia</Link></div></header><section className="matrix-hero section" id="matrix-content"><div className="container narrow"><p className="section-kicker">Una herramienta de criterio</p><h1>Preguntas antes<br /><em>de avanzar.</em></h1><p>Utiliza esta matriz para organizar lo que sabes, separar lo que estás suponiendo y detectar qué necesitas investigar antes de comprometerte.</p><p className="config-note">Tu evaluación se guarda únicamente en este dispositivo. No requiere cuenta y no se envía a NO EMPRENDAS TODAVÍA.</p></div></section><section className="section matrix-section"><div className="container"><MatrixTool /></div></section></main>;
}
