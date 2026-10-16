import Link from "next/link";

export const metadata = { title: "Términos pendientes | VETTA", robots: { index: false, follow: false } };

export default function TermsPage() { return <main className="legal-page"><div className="container narrow"><Link className="wordmark" href="/"><span className="wordmark-mark">V</span><span>VETTA</span></Link><p className="section-kicker">Documento pendiente de aprobación legal</p><h1>Términos aplicables</h1><p>Esta página es un borrador de estructura. Las condiciones de participación, alcance educativo, relación comercial y responsabilidades deben ser aprobadas antes de Production.</p><Link className="text-link" href="/">Volver a VETTA</Link></div></main>; }
