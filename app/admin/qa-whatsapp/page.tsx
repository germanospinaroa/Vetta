"use client";

import { FormEvent, useState } from "react";

export default function QaWhatsAppPage() {
  const [result, setResult] = useState<{ code?: string; href?: string; error?: string }>({});
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setResult({});
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/admin/qa-whatsapp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) { setResult({ error: body.message || "No se pudo crear el registro QA." }); return; }
    setResult({ code: body.registrationCode, href: body.whatsappHref });
    event.currentTarget.reset();
  }
  return <main><section className="section"><div className="container admin-shell"><p className="section-kicker">QA restringido / WhatsApp</p><h1>Preparar una<br /><em>prueba real.</em></h1><p className="admin-lede">Crea un único registro QA en la cohorte actual sin abrir inscripciones públicas. El participante debe iniciar voluntariamente la conversación desde su teléfono.</p><form className="registration-form" onSubmit={submit}><div className="form-fields"><div className="field"><label htmlFor="qa-name">Nombre</label><input id="qa-name" name="name" required autoComplete="name" /></div><div className="field"><label htmlFor="qa-whatsapp">WhatsApp del teléfono autorizado</label><input id="qa-whatsapp" name="whatsapp" required type="tel" autoComplete="tel" /></div><div className="field-row"><div className="field"><label htmlFor="qa-city">Ciudad</label><input id="qa-city" name="city" required /></div><div className="field"><label htmlFor="qa-country">País (ISO)</label><input id="qa-country" name="country" required defaultValue="CO" maxLength={2} /></div></div><label className="consent"><input name="qa_authorized" type="checkbox" required /> Confirmo que el titular autorizó esta prueba controlada y el tratamiento necesario para ejecutarla.</label><button className="button button-dark form-submit" disabled={busy} type="submit">{busy ? "Creando…" : "Crear registro QA"}</button></div></form>{result.error && <p className="form-error">{result.error}</p>}{result.code && <div className="success-panel"><p className="success-index">REGISTRO QA CREADO</p><h2>{result.code}</h2><p>Entrega este enlace únicamente al titular del teléfono autorizado. No inicia ningún mensaje automáticamente.</p>{result.href && <a className="button button-dark" href={result.href}>Abrir enlace de WhatsApp</a>}</div>}</div></section></main>;
}
