"use client";

import { useEffect } from "react";
import { trackClarityEvent, trackMetaAssessmentStarted, trackMetaWhatsAppClick } from "@/lib/analytics";

type Props = { confirmed: boolean; registrationCode?: string; whatsappHref?: string };

export function ConfirmationSalesPage({ confirmed, registrationCode, whatsappHref }: Props) {
  useEffect(() => { if (confirmed) trackClarityEvent("registration_confirmed"); }, [confirmed]);

  function recordWhatsAppClick() {
    trackMetaWhatsAppClick();
    trackMetaAssessmentStarted(registrationCode || "");
    trackClarityEvent("whatsapp_clicked");
    if (!registrationCode) return;
    const dbDedupeKey = `vetta-assessment-event:${registrationCode}`;
    if (window.localStorage.getItem(dbDedupeKey) === "sent") return;
    const event = { name: "assessment_started", registrationCode, properties: { destination: "commercial_whatsapp" } };
    const body = JSON.stringify(event);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
    }
    window.localStorage.setItem(dbDedupeKey, "sent");
  }

  return <main className="v7-confirmation-page"><a className="v7-confirmation-skip" href="#confirmation-main">Saltar al contenido</a><div className="v7-confirmation-shell" id="confirmation-main">{confirmed ? <section className="v7-confirmation-card" data-clarity-mask="true" aria-labelledby="confirmation-title"><div className="v7-confirmation-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m6 12.5 4 4L18.5 8" /></svg></div><p className="v7-confirmation-eyebrow">VETTA · MASTERCLASS EN VIVO</p><h1 id="confirmation-title">¡Ya estás casi dentro!</h1><p className="v7-confirmation-lead">Tu registro quedó guardado. Solo falta un último paso para confirmar tu participación.</p><div className="v7-confirmation-action"><h2>Confirma tu lugar por WhatsApp</h2><p>Al enviar el mensaje, recibirás las instrucciones para unirte al grupo privado, donde compartiremos los accesos a las sesiones y el regalo que preparamos para ti.</p>{whatsappHref ? <a className="v7-confirmation-button" href={whatsappHref} target="_blank" rel="noreferrer" onClick={recordWhatsAppClick}>CONFIRMAR MI PARTICIPACIÓN <span aria-hidden="true">→</span></a> : <p className="v7-confirmation-status" role="status">No podemos preparar el mensaje porque falta el número comercial de WhatsApp.</p>}<p className="v7-confirmation-note">Se abrirá WhatsApp con tu mensaje listo. Solo debes pulsar Enviar.</p></div></section> : <section className="v7-confirmation-card v7-confirmation-invalid" aria-labelledby="confirmation-title"><p className="v7-confirmation-eyebrow">VETTA · MASTERCLASS EN VIVO</p><h1 id="confirmation-title">Esta página se abre después de confirmar tu registro.</h1><p className="v7-confirmation-lead">Vuelve a la página de registro y completa el proceso para recibir las instrucciones correctas.</p></section>}</div></main>;
}
