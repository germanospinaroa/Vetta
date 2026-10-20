"use client";

import { useState } from "react";

export function ManualGroupConfirmation({ leadId, confirmed }: { leadId: string; confirmed: boolean }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">(confirmed ? "saved" : "idle");

  async function confirm() {
    setState("saving");
    try {
      const response = await fetch("/api/admin/qa-whatsapp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "confirm_group_membership_manual", leadId }) });
      setState(response.ok ? "saved" : "error");
    } catch { setState("error"); }
  }

  if (state === "saved") return <span className="admin-status-confirmed">Confirmado manualmente</span>;
  return <button className="text-button" type="button" onClick={confirm} disabled={state === "saving"}>{state === "saving" ? "Guardando…" : state === "error" ? "Reintentar confirmación" : "Confirmar ingreso al grupo"}</button>;
}
