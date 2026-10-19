import Link from "next/link";

export default function QaFunnelPage() {
  return <main><section className="section"><div className="container admin-shell"><p className="section-kicker">QA restringido / Funnel real</p><h1>Probar la landing<br /><em>sin abrirla.</em></h1><p className="admin-lede">Inicia una sesión QA temporal. La landing, el CTA, el formulario y la confirmación utilizarán el mismo flujo real, pero la cohorte seguirá en draft para el público.</p><form action="/api/admin/qa-funnel/session" method="post"><button className="button button-dark" type="submit">ABRIR RECORRIDO QA</button></form><p className="config-note">La sesión expira en 15 minutos y queda limitada a la sesión autenticada del administrador.</p><Link className="text-link" href="/admin/qa-whatsapp">Preparar mensajería WhatsApp</Link></div></section></main>;
}
