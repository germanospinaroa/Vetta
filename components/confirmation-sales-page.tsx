"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackClarityEvent, trackMetaWhatsAppClick } from "@/lib/analytics";

type ConfirmationSalesPageProps = {
  confirmed: boolean;
  firstName?: string;
  registrationCode?: string;
  whatsappHref?: string;
};

export function ConfirmationSalesPage({ confirmed, firstName, registrationCode, whatsappHref }: ConfirmationSalesPageProps) {
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
            <span className="sales-confirmation-index">REGISTRO CONFIRMADO</span>
            <h1>{firstName ? `¡${firstName}, tu inscripción está confirmada!` : "¡Tu inscripción está confirmada!"}</h1>
            <p className="sales-confirmation-lead">Reclama tu regalo por WhatsApp y recibe las instrucciones para ingresar al grupo privado <strong>Antes de Emprender</strong>.</p>
            <p className="sales-confirmation-lead">El mensaje se abrirá preparado con tu inscripción. Envíalo para que el equipo pueda responderte.</p>
            {whatsappHref ? (
              <a className="sales-button" href={whatsappHref} target="_blank" rel="noreferrer" onClick={recordWhatsAppClick}>
                RECLAMA TU REGALO POR WHATSAPP <span aria-hidden="true">→</span>
              </a>
            ) : (
              <p className="sales-preopen">No podemos preparar el mensaje porque falta el número comercial de WhatsApp. Solicita ayuda a soporte.</p>
            )}
            <div className="sales-confirmation-gift">
              <h2>🎁 TU PRÓXIMO MOVIMIENTO te espera</h2>
              <p>Después de enviar el mensaje, recibirás la bienvenida, el enlace del grupo y, aproximadamente dos minutos después, el enlace de TU PRÓXIMO MOVIMIENTO.</p>
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
