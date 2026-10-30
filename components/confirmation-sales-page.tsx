"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackClarityEvent, trackMetaWhatsAppClick } from "@/lib/analytics";

type ConfirmationSalesPageProps = {
  confirmed: boolean;
  firstName?: string;
  registrationCode?: string;
  groupInvitationHref?: string;
};

export function ConfirmationSalesPage({ confirmed, firstName, registrationCode, groupInvitationHref }: ConfirmationSalesPageProps) {
  useEffect(() => {
    if (confirmed) trackClarityEvent("registration_confirmed");
  }, [confirmed]);

  function recordGroupInvitationClick() {
    trackMetaWhatsAppClick();
    trackClarityEvent("whatsapp_clicked");
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "whatsapp_clicked",
        registrationCode,
        properties: { destination: "group_invitation" },
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
            <p className="sales-confirmation-lead">Únete directamente al grupo privado <strong>Antes de Emprender</strong> para recibir las instrucciones de la experiencia.</p>
            <p className="sales-confirmation-lead">No necesitas enviar un mensaje previo: acepta la invitación desde WhatsApp.</p>
            {groupInvitationHref ? (
              <a className="sales-button" href={groupInvitationHref} target="_blank" rel="noreferrer" onClick={recordGroupInvitationClick}>
                UNIRME AL GRUPO DE WHATSAPP <span aria-hidden="true">→</span>
              </a>
            ) : (
              <p className="sales-preopen">No podemos preparar la invitación porque el enlace oficial del grupo todavía no está configurado. Solicita ayuda a soporte.</p>
            )}
            <div className="sales-confirmation-gift">
              <h2>🎁 TU PRÓXIMO MOVIMIENTO te espera</h2>
              <p>Después de ingresar al grupo, recibirás la bienvenida y, aproximadamente dos minutos después, el enlace de TU PRÓXIMO MOVIMIENTO.</p>
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
