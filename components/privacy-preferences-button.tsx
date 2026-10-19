"use client";

import { openPrivacyPreferences } from "@/lib/analytics";

export function PrivacyPreferencesButton() {
  return <button type="button" className="privacy-preferences-button" onClick={openPrivacyPreferences}>Preferencias de privacidad</button>;
}
