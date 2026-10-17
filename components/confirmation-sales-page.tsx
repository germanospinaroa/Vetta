"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import type { PublicCohort } from "@/lib/config";

export function ConfirmationSalesPage({ cohort, code }: { cohort: PublicCohort; code?: string }) {
  const [valid, setValid] = useState(false);
  const [name, setName] = useState("participante");
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedCode = window.sessionStorage.getItem("vetta-registration-confirmed-v1");
      setName(window.sessionStorage.getItem("vetta-registration-name-v1") || "participante");
      setValid(Boolean(code && storedCode && code === storedCode));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [code]);
  const href = useMemo(() => valid ? buildWhatsAppHref(cohort.whatsappNumber, name, code || "") : undefined, [cohort.whatsappNumber, code, name, valid]);
  return <main className="sales-page sales-confirmation-page"><div className="sales-shell sales-confirmation-shell">{valid ? <><h1>¡Tu registro fue recibido!</h1><p className="sales-confirmation-lead">Ya casi estás dentro.</p><div className="sales-confirmation-instructions"><p>Ahora continúa por WhatsApp para completar tu acceso a la masterclass.</p><p>Te compartiremos el enlace del grupo privado.</p><p>Cuando ingreses, vuelve a nuestra conversación individual y responde <strong>LISTO</strong> para que podamos enviarte tu regalo.</p></div>{href ? <a className="sales-button" href={href} target="_blank" rel="noreferrer">CONTINUAR POR WHATSAPP <span aria-hidden="true">→</span></a> : <p className="sales-preopen">El canal de WhatsApp todavía está pendiente de configuración.</p>}</> : <><h1>Esta página se abre después de confirmar tu registro.</h1><p className="sales-confirmation-lead">Vuelve a la página de registro y completa el proceso para recibir las instrucciones correctas.</p><a className="sales-button" href="/registro">VOLVER AL REGISTRO <span aria-hidden="true">→</span></a></>}</div></main>;
}
