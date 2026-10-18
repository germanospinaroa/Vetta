"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setMessage("El acceso administrativo todavía no está configurado.");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin` },
    });
    if (error) {
      setStatus("error");
      setMessage("No pudimos enviar el enlace. Verifica el correo autorizado.");
      return;
    }
    setStatus("sent");
    setMessage("Si el correo está autorizado, recibirás un enlace seguro para continuar.");
  }

  return <main className="legal-page"><div className="container narrow"><Link className="wordmark" href="/"><span className="wordmark-mark">V</span><span>VETTA / OPERACIÓN</span></Link><h1>Acceso de operación</h1><p>Solicita un enlace seguro al correo autorizado. No usamos contraseñas dentro de esta aplicación.</p><form className="registration-form" onSubmit={submit}><div className="field"><label htmlFor="admin-email">Correo autorizado</label><input id="admin-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div><button className="button button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? "ENVIANDO…" : "ENVIAR ENLACE SEGURO"}</button>{message && <p role={status === "error" ? "alert" : "status"}>{message}</p>}</form></div></main>;
}
