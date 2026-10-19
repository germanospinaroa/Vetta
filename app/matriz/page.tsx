import Link from "next/link";
import { MatrixTool } from "@/components/matrix-tool";
import { EventBeacon } from "@/components/event-beacon";

export const metadata = { title: "El filtro antes del sí | NO EMPRENDAS TODAVÍA.", description: "Descubre qué juega a tu favor, qué podrías estar pasando por alto y qué necesitas comprobar antes de comprometerte con una oportunidad.", robots: { index: false, follow: true } };

export default function MatrixPage() {
  return <main className="matrix-page"><EventBeacon name="matrix_opened" /><a className="skip-link" href="#matrix-content">Saltar al contenido</a><header className="site-header"><div className="container header-inner"><Link className="wordmark" href="/"><span className="wordmark-mark">N</span><span>NO EMPRENDAS TODAVÍA.</span></Link><span className="header-context">EL FILTRO ANTES DEL SÍ</span><Link className="text-link" href="/">Volver a la experiencia</Link></div></header><section className="section matrix-section" id="matrix-content"><div className="container"><MatrixTool /></div></section></main>;
}
