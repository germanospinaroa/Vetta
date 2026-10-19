"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Props = { nextPath: string; initialError?: string };

export default function AdminLoginForm({ nextPath, initialError }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState(initialError ? "No pudimos completar el acceso. Solicita un nuevo enlace o revisa tus datos." : "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setMessage("El acceso administrativo no está configurado.");
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    const result = mode === "password"
      ? await supabase.auth.signInWithPassword({ email: cleanEmail, password })
      : await supabase.auth.signInWithOtp({ email: cleanEmail, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` } });
    if (result.error) {
      setStatus("error");
      setMessage("No pudimos completar el acceso. Revisa tus datos o solicita un nuevo enlace.");
      return;
    }
    if (mode === "magic") {
      setStatus("sent");
      setMessage("Si el correo está autorizado, recibirás un enlace seguro para continuar.");
      return;
    }
    setStatus("sent");
    router.replace(nextPath as never);
    router.refresh();
  }

  return <form className="registration-form auth-form" onSubmit={submit}>
    <div className="field"><label htmlFor="admin-email">Correo electrónico</label><input id="admin-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
    {mode === "password" && <div className="field"><label htmlFor="admin-password">Contraseña</label><div className="password-field"><input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} /><button className="text-button" type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Ocultar" : "Mostrar"}</button></div></div>}
    <button className="button button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? "COMPROBANDO…" : mode === "password" ? "ENTRAR" : "ENVIAR ENLACE"}</button>
    {mode === "password" && <a className="text-link auth-link" href={`/auth/forgot-password?next=${encodeURIComponent(nextPath)}`}>¿Olvidaste tu contraseña?</a>}
    <button className="text-button auth-secondary" type="button" onClick={() => { setMode((value) => value === "password" ? "magic" : "password"); setStatus("idle"); setMessage(""); }}>{mode === "password" ? "Usar enlace seguro temporal" : "Volver a entrar con contraseña"}</button>
    {message && <p role={status === "error" ? "alert" : "status"}>{message}</p>}
  </form>;
}
