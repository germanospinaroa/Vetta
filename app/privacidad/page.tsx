import Link from "next/link";

export const metadata = { title: "Aviso de privacidad pendiente | VETTA", robots: { index: false, follow: false } };

export default function PrivacyPage() { return <main className="legal-page"><div className="container narrow"><Link className="wordmark" href="/"><span className="wordmark-mark">V</span><span>VETTA</span></Link><p className="section-kicker">Documento pendiente de aprobación legal</p><h1>Aviso de privacidad</h1><p>Esta página es un borrador de estructura. La identidad legal del responsable, finalidades, derechos, canales de atención, retención y mecanismos de consentimiento deben ser aprobados antes de Production.</p><Link className="text-link" href="/">Volver a VETTA</Link></div></main>; }
