"use client";

import { useEffect, useState } from "react";
import { ADVERTISING_CONSENT_KEY, ANALYTICS_CONSENT_KEY, advertisingConsentGranted, analyticsConsentGranted, applyVendorConsent, setAnalyticsConsent } from "@/lib/analytics";

export function AnalyticsConsent() {
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    const open = () => { setAnalytics(analyticsConsentGranted()); setAdvertising(advertisingConsentGranted()); setVisible(true); };
    if (!analyticsConsentGranted() && !advertisingConsentGranted()) open();
    window.addEventListener("vetta:open-privacy-preferences", open);
    return () => window.removeEventListener("vetta:open-privacy-preferences", open);
  }, []);

  if (!visible) return null;
  function savePreferences(nextAnalytics = analytics, nextAdvertising = advertising) {
    setAnalyticsConsent(nextAnalytics ? "granted" : "denied");
    window.localStorage.setItem(ADVERTISING_CONSENT_KEY, nextAdvertising ? "granted" : "denied");
    applyVendorConsent();
    window.dispatchEvent(new CustomEvent("vetta:analytics-consent", { detail: { analytics: nextAnalytics, advertising: nextAdvertising } }));
    setVisible(false);
  }
  return <aside className="analytics-consent" aria-label="Preferencias de privacidad">
    <h2>Tu privacidad importa</h2>
    <p>Usamos herramientas de medición para mejorar esta página. Tú decides si <strong>aceptas</strong> o rechazas. ¡Y claro que agradecemos que aceptes!</p>
    <div className="analytics-consent-actions">
      <button type="button" className="analytics-consent-reject" onClick={() => savePreferences(false, false)}>Rechazar</button>
      <button type="button" className="analytics-consent-accept" onClick={() => savePreferences(true, true)}>Aceptar</button>
    </div>
  </aside>;
}
