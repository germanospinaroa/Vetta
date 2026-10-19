"use client";

import { useEffect, useState } from "react";
import { ADVERTISING_CONSENT_KEY, ANALYTICS_CONSENT_KEY, advertisingConsentGranted, analyticsConsentGranted, setAnalyticsConsent } from "@/lib/analytics";

export function AnalyticsConsent() {
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnalytics(analyticsConsentGranted());
      setAdvertising(advertisingConsentGranted());
      setVisible(window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === null || window.localStorage.getItem(ADVERTISING_CONSENT_KEY) === null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;
  function savePreferences(nextAnalytics = analytics, nextAdvertising = advertising) {
    setAnalyticsConsent(nextAnalytics ? "granted" : "denied");
    window.localStorage.setItem(ADVERTISING_CONSENT_KEY, nextAdvertising ? "granted" : "denied");
    window.dispatchEvent(new CustomEvent("vetta:analytics-consent", { detail: { analytics: nextAnalytics, advertising: nextAdvertising } }));
    setVisible(false);
  }
  return <aside className="analytics-consent" aria-label="Preferencias de analítica">
    <p>Elige por separado las tecnologías opcionales. No enviamos las respuestas de la matriz.</p>
    <label><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /> Analítica de uso (Clarity)</label>
    <label><input type="checkbox" checked={advertising} onChange={(event) => setAdvertising(event.target.checked)} /> Medición publicitaria y conversiones (Meta)</label>
    <div className="analytics-consent-actions">
      <button type="button" className="analytics-consent-reject" onClick={() => savePreferences()}>Guardar preferencias</button>
      <button type="button" className="analytics-consent-accept" onClick={() => savePreferences(true, true)}>Aceptar ambas</button>
    </div>
  </aside>;
}
