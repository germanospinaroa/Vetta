"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ForgotPasswordForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setStatus("error"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(`/auth/update-password?next=${encodeURIComponent(nextPath)}`)}` });
    setStatus(error ? "error" : "sent");
  }
  return <form className="registration-form auth-form" onSubmit={submit}><div className="field"><label htmlFor="recovery-email">Correo electrónico</label><input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div><button className="button button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? "ENVIANDO…" : "ENVIAR RECUPERACIÓN"}</button>{status === "sent" && <p role="status">Si el correo está autorizado, recibirás instrucciones para establecer una nueva contraseña.</p>}{status === "error" && <p role="alert">No pudimos completar la solicitud. Inténtalo de nuevo.</p>}<Link className="text-link auth-link" href={`/auth/login?next=${encodeURIComponent(nextPath)}`}>Volver al acceso</Link></form>;
}

export function UpdatePasswordForm({ nextPath }: { nextPath: string }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 12 || password !== confirmation) { setStatus("error"); return; }
    setStatus("saving");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setStatus("error"); return; }
    const { error } = await supabase.auth.updateUser({ password });
    setStatus(error ? "error" : "saved");
    if (!error) window.location.assign(nextPath);
  }
  return <form className="registration-form auth-form" onSubmit={submit}><div className="field"><label htmlFor="new-password">Nueva contraseña</label><input id="new-password" type="password" autoComplete="new-password" required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} /><span className="field-help">Usa al menos 12 caracteres.</span></div><div className="field"><label htmlFor="confirm-password">Repite la contraseña</label><input id="confirm-password" type="password" autoComplete="new-password" required minLength={12} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></div><button className="button button-dark" type="submit" disabled={status === "saving"}>{status === "saving" ? "GUARDANDO…" : "ESTABLECER CONTRASEÑA"}</button>{status === "error" && <p role="alert">Las contraseñas deben coincidir y tener al menos 12 caracteres. Si el enlace venció, solicita una nueva recuperación.</p>}{status === "saved" && <p role="status">Contraseña actualizada.</p>}</form>;
}
