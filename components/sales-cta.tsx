"use client";

import { trackClarityEvent } from "@/lib/analytics";

export function SalesCta({ label, id, className = "" }: { label: string; id?: string; className?: string }) {
  return <a id={id} className={`sales-button ${className}`} href="/registro" onClick={() => trackClarityEvent("cta_clicked")}>{label} <span aria-hidden="true">→</span></a>;
}
