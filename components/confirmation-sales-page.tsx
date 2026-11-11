"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackClarityEvent, trackMetaWhatsAppClick } from "@/lib/analytics";

type ConfirmationSalesPageProps = {
  confirmed: boolean;
  firstName?: string;
  registrationCode?: string;
  whatsappHref?: string;
  groupInvitationHref?: string;
  tuesdayLabel?: string;
  thursdayLabel?: string;
};

export function ConfirmationSalesPage({ confirmed, firstName, registrationCode, whatsappHref, groupInvitationHref, tuesdayLabel, thursdayLabel }: ConfirmationSalesPageProps) {
  useEffect(() => {
    if (confirmed) trackClarityEvent("registration_confirmed");
  }, [confirmed]);

  function recordWhatsAppClick() {
    trackMetaWhatsAppClick();
    trackClarityEvent("whatsapp_clicked");
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "whatsapp_clicked",
        registrationCode,
        properties: { destination: "commercial_whatsapp" },
      }),
    });
  }

  return (
    <main className="sales-page sales-confirmation-page">
      <div className="sales-shell sales-confirmation-shell" data-clarity-mask="true">
        {confirmed ? (
          <>
            <span className="sales-confirmation-index">INSCRIPCIÓN REGISTRADA</span>
            <h1>¡YA ESTÁS CASI ADENTRO!</h1>
            <p className="sales-confirmation-lead">Tu inscripción está registrada. Ahora solo faltan dos pasos para asegurar que recibas toda la información de la masterclass.</p>
            <p className="sales-confirmation-date">{tuesdayLabel || "17 de noviembre de 2026"} y {thursdayLabel || "19 de noviembre de 2026"} · 8:00 p. m. (Colombia)</p>
            <section className="sales-confirmation-step"><span className="sales-confirmation-index">PASO 1</span><h2>1. CONFIRMA TU WHATSAPP</h2><p>Toca el botón y envía el mensaje que ya preparamos para ti. Así podremos reconocer tu inscripción y enviarte tu regalo.</p>{registrationCode ? <p>Tu código: <strong>{registrationCode}</strong></p> : null}
            {whatsappHref ? (
              <a className="sales-button" href={whatsappHref} target="_blank" rel="noreferrer" onClick={recordWhatsAppClick}>
                ENVIAR MI CÓDIGO POR WHATSAPP <span aria-hidden="true">→</span>
              </a>
            ) : (
              <p className="sales-preopen">No podemos preparar el mensaje porque falta el número comercial de WhatsApp. Solicita ayuda a soporte.</p>
            )}<p>Es importante que pulses Enviar dentro de WhatsApp. Abrir la conversación no confirma tu registro.</p></section>
            <section className="sales-confirmation-step"><span className="sales-confirmation-index">PASO 2</span><h2>2. ENTRA AL GRUPO PRIVADO</h2><p>En el grupo recibirás los avisos importantes y los enlaces para conectarte a las dos sesiones.</p>{groupInvitationHref ? <a className="sales-button sales-button-secondary" href={groupInvitationHref} target="_blank" rel="noreferrer">UNIRME AL GRUPO DE LA MASTERCLASS <span aria-hidden="true">→</span></a> : <p className="sales-preopen">El enlace del grupo no está disponible temporalmente.</p>}<p>No podemos confirmar la membresía solo por pulsar este botón.</p></section>
            <div className="sales-confirmation-gift">
              <h2>Y TENEMOS UN REGALO PARA TI</h2>
              <p>Al confirmar tu WhatsApp, te enviaremos TU PRÓXIMO MOVIMIENTO, una experiencia interactiva para descubrir diferentes caminos de emprendimiento y aprender cómo ponerlos a prueba.</p><p>Te llegará por WhatsApp en unos minutos.</p>
            </div>
          </>
        ) : (
          <>
            <h1>Esta página se abre después de confirmar tu registro.</h1>
            <p className="sales-confirmation-lead">Vuelve a la página de registro y completa el proceso para recibir las instrucciones correctas.</p>
            <Link className="sales-button" href="/registro" onClick={() => trackClarityEvent("cta_clicked")}>
              VOLVER AL REGISTRO <span aria-hidden="true">→</span>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
