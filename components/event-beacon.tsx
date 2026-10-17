"use client";

import { useEffect } from "react";

export function EventBeacon({ name }: { name: "landing_viewed" | "matrix_opened" }) {
  useEffect(() => { void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) }).catch(() => undefined); }, [name]);
  return null;
}
