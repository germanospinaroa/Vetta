"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { readAttribution } from "@/lib/tracking";

type FormState = "idle" | "loading" | "success" | "error";

const regionNames = new Intl.DisplayNames(["es"], { type: "region" });
const countries = getCountries()
  .map((code) => [code, regionNames.of(code) || code] as const)
  .sort((a, b) => a[1].localeCompare(b[1], "es"));

type Result = { ok: true; registrationCode?: string; whatsappHref?: string; mode: "TEST" | "LIVE"; existing?: boolean } | { ok: false; message: string };

export function RegistrationForm({ redirectOnSuccess = false }: { redirectOnSuccess?: boolean }) {
  const [state, setState] = useState<FormState>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [country, setCountry] = useState("CO");
  const started = useRef(false);

  useEffect(() => {
    const attribution = readAttribution(window.location.search);
    if (Object.values(attribution).some(Boolean)) window.localStorage.setItem("vetta-attribution-v1", JSON.stringify(attribution));
  }, []);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "registration_started" }) });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setErrors({});
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const queryAttribution = readAttribution(window.location.search);
    let storedAttribution: Record<string, string> = {};
    try {
      const stored = JSON.parse(window.localStorage.getItem("vetta-attribution-v1") || "{}") as Record<string, unknown>;
      storedAttribution = Object.fromEntries(Object.entries(stored).filter(([key, value]) => key.startsWith("utm_") && typeof value === "string")) as Record<string, string>;
    } catch {
      storedAttribution = {};
    }
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) payload[key] = queryAttribution[key as keyof typeof queryAttribution] || storedAttribution[key] || "";
    payload.consentVersion = "v1";

    try {
      const response = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await response.json()) as Result & { code?: string };
      if (!response.ok || !data.ok) {
        setState("error");
        setResult({ ok: false, message: data.ok ? "No pudimos completar el registro." : data.message });
        void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "registration_failed", properties: { code: data.ok ? "unknown" : data.code || "request_failed" } }) });
        return;
      }
      if (redirectOnSuccess && !data.existing && data.registrationCode) {
        // Use a document navigation so the HttpOnly confirmation cookie, scoped
        // to /confirmacion, is included in the first server-rendered request.
        window.location.assign(`/confirmacion?code=${encodeURIComponent(data.registrationCode)}`);
        return;
      }
      setState("success");
      setResult(data);
    } catch {
      setState("error");
      setResult({ ok: false, message: "No pudimos conectar con el registro. Revisa tu conexión e inténtalo de nuevo." });
      void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "registration_failed", properties: { code: "network_error" } }) });
    }
  }

  if (state === "success" && result?.ok) {
    return (
      <div className="success-panel" role="status" aria-live="polite">
        <span className="success-index">{result.existing ? "CONTINUAR REGISTRO" : "REGISTRO RECIBIDO"}</span>
        <h2>{result.existing ? "Puedes continuar por WhatsApp." : "Tu registro está recibido."}</h2>
        <p>{result.existing ? "Abre la conversación privada para continuar con tu inscripción." : "Ahora confirma tu acceso por WhatsApp para recibir las indicaciones de los encuentros."}</p>
        {result.registrationCode && <div className="registration-code"><span>Código</span><strong>{result.registrationCode}</strong></div>}
        {result.whatsappHref ? (
          <a className="button button-dark" href={result.whatsappHref} target="_blank" rel="noreferrer" onClick={() => { const event = result.registrationCode ? { name: "whatsapp_clicked", registrationCode: result.registrationCode } : { name: "whatsapp_clicked", properties: { continuation: "existing_registration" } }; void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(event) }); }}>
            CONTINUAR POR WHATSAPP <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <p className="config-note">Configuración TEST pendiente: el número oficial de WhatsApp todavía no está configurado.</p>
        )}
        <button className="text-button" type="button" onClick={() => { setState("idle"); setResult(null); }}>Registrar otra persona</button>
      </div>
    );
  }

  return (
    <form id="demo-form" className="registration-form" onSubmit={submit} onFocus={markStarted}>
      <div className="form-fields">
        <div className="field"><label htmlFor="country">País</label><select id="country" name="country" value={country} onChange={(event) => setCountry(event.target.value)} required>{countries.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></div>
        <div className="field"><label htmlFor="name">Nombre</label><input id="name" name="name" autoComplete="name" required placeholder="Tu nombre" /></div>
        <div className="field"><label htmlFor="whatsapp">WhatsApp</label><div className="phone-input"><span aria-hidden="true">+{getCountryCallingCode(country as Parameters<typeof getCountryCallingCode>[0])}</span><input id="whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel-national" required placeholder="300 000 0000" aria-label={`Número de WhatsApp sin prefijo para +${getCountryCallingCode(country as Parameters<typeof getCountryCallingCode>[0])}`} /></div></div>
        <div className="field"><label htmlFor="city">Ciudad</label><input id="city" name="city" autoComplete="address-level2" required placeholder="Tu ciudad" /></div>
        <label className="consent"><input type="checkbox" name="consent" required /><span>Acepto que se gestione mi inscripción y las comunicaciones directamente relacionadas con esta experiencia. <a href="/privacidad">Ver aviso de privacidad</a>.</span></label>
        {state === "error" && <p className="form-error" role="alert">{result && !result.ok ? result.message : "Revisa los campos y vuelve a intentarlo."}</p>}
        <button className="button button-warm form-submit" type="submit" disabled={state === "loading"}>{state === "loading" ? "Guardando tu registro…" : "CONFIRMAR MI REGISTRO"}<span aria-hidden="true">↗</span></button>
        <p className="form-footnote">Recibirás el regalo después de ingresar al grupo privado.</p>
      </div>
    </form>
  );
}
