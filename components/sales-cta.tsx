"use client";

import { trackClarityEvent } from "@/lib/analytics";

export function SalesCta({ label, id, className = "" }: { label: string; id?: string; className?: string }) {
  function focusForm() {
    trackClarityEvent("cta_clicked");
    window.setTimeout(() => document.querySelector<HTMLInputElement>("#inscripcion input")?.focus(), 300);
  }
  return <a id={id} className={`sales-button ${className}`} href="#inscripcion" onClick={focusForm}>{label} <span aria-hidden="true">→</span></a>;
}
