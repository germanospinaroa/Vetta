"use client";

export function SalesCta({ label, id, className = "" }: { label: string; id?: string; className?: string }) {
  return <a id={id} className={`sales-button ${className}`} href="/registro" onClick={() => { void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "cta_clicked", properties: { label } }) }); }}>{label} <span aria-hidden="true">→</span></a>;
}
