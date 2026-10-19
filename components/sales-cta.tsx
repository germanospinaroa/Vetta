"use client";

export function SalesCta({ label, id, className = "" }: { label: string; id?: string; className?: string }) {
  return <a id={id} className={`sales-button ${className}`} href="/registro">{label} <span aria-hidden="true">→</span></a>;
}
