export const ANALYTICS_CONSENT_KEY = "vetta-analytics-consent-v1";
export const ADVERTISING_CONSENT_KEY = "vetta-advertising-consent-v1";
export const PENDING_META_LEAD_KEY = "vetta-pending-meta-lead-v1";
export const META_PIXEL_ID = "3337529346452736";

type MetaFunction = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: (...args: unknown[]) => void; getState?: () => unknown };
type ClarityFunction = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    fbq?: MetaFunction;
    __vettaMetaPixelScriptReady?: boolean;
    __vettaMetaPixelInitialized?: boolean;
    clarity?: ClarityFunction;
  }
}

export const CLARITY_EVENTS = [
  "cta_clicked",
  "registration_started",
  "registration_error",
  "registration_confirmed",
  "whatsapp_clicked",
  "matrix_started",
  "matrix_completed",
] as const;

export type ClarityEvent = (typeof CLARITY_EVENTS)[number];

export function isConfirmedNewRegistration(result: { ok?: boolean; newRegistration?: boolean; existing?: boolean; mode?: string; registrationCode?: string }) {
  return result.ok === true && result.newRegistration === true && result.existing !== true && result.mode === "LIVE" && Boolean(result.registrationCode);
}

export function shouldTrackPageView(path: string, previousPath: string) {
  return path !== previousPath;
}

export function analyticsConsentGranted() {
  return typeof window !== "undefined" && window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "granted";
}

export function advertisingConsentGranted() {
  return typeof window !== "undefined" && window.localStorage.getItem(ADVERTISING_CONSENT_KEY) !== "denied";
}

export function advertisingConsentUndecided() {
  return typeof window !== "undefined" && window.localStorage.getItem(ADVERTISING_CONSENT_KEY) === null;
}

export function setAnalyticsConsent(value: "granted" | "denied") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("vetta:analytics-consent", { detail: value }));
}

export function setAdvertisingConsent(value: "granted" | "denied") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADVERTISING_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("vetta:analytics-consent", { detail: value }));
}

export function applyVendorConsent() {
  if (typeof window === "undefined") return;
  if (window.fbq && window.__vettaMetaPixelScriptReady) {
    const advertisingGranted = advertisingConsentGranted();
    window.fbq("consent", advertisingGranted ? "grant" : "revoke");
    if (!window.__vettaMetaPixelInitialized) {
      window.fbq("init", META_PIXEL_ID);
      window.__vettaMetaPixelInitialized = true;
    }
  }
  if (window.clarity) window.clarity("consentv2", { ad_Storage: advertisingConsentGranted() ? "granted" : "denied", analytics_Storage: analyticsConsentGranted() ? "granted" : "denied" });
}

export function markMetaPixelScriptReady() {
  if (typeof window === "undefined") return;
  window.__vettaMetaPixelScriptReady = true;
  applyVendorConsent();
}

export function openPrivacyPreferences() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("vetta:open-privacy-preferences"));
}

function ensureMetaQueue() {
  if (typeof window === "undefined" || window.fbq) return window.fbq;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  } as MetaFunction;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  return fbq;
}

export function trackMetaPageView() {
  if (!advertisingConsentGranted()) return;
  ensureMetaQueue()?.("track", "PageView");
}

export function trackNewMetaLead(registrationCode: string, eventId?: string) {
  if (!advertisingConsentGranted() || typeof window === "undefined" || !registrationCode) return false;
  const dedupeKey = `vetta-meta-lead:${registrationCode}`;
  const id = eventId || dedupeKey;
  const fbq = ensureMetaQueue();
  if (window.localStorage.getItem(dedupeKey) === "sent") return false;
  fbq?.("track", "Lead", { content_name: "NO EMPRENDAS TODAVÍA." }, { eventID: id });
  window.localStorage.setItem(dedupeKey, "sent");
  return true;
}

export function trackMetaWhatsAppClick() {
  if (!advertisingConsentGranted() || typeof window === "undefined") return false;
  ensureMetaQueue()?.("trackCustom", "WhatsAppClick");
  return true;
}

export function trackMetaAssessmentStarted(registrationCode: string) {
  if (!advertisingConsentGranted() || typeof window === "undefined" || !registrationCode) return false;
  const dedupeKey = `vetta-meta-assessment-started:${registrationCode}`;
  if (window.localStorage.getItem(dedupeKey) === "sent") return false;
  ensureMetaQueue()?.("trackCustom", "AssessmentStarted", { content_name: "NO EMPRENDAS TODAVÍA." }, { eventID: dedupeKey });
  window.localStorage.setItem(dedupeKey, "sent");
  return true;
}

export function queueMetaLeadUntilConsent(registrationCode: string, eventId?: string) {
  if (typeof window === "undefined" || !registrationCode || !advertisingConsentUndecided()) return;
  window.sessionStorage.setItem(PENDING_META_LEAD_KEY, JSON.stringify({ registrationCode, eventId: eventId || null }));
}

export function flushPendingMetaLead() {
  if (typeof window === "undefined" || !advertisingConsentGranted()) return;
  const pending = window.sessionStorage.getItem(PENDING_META_LEAD_KEY);
  if (!pending) return;
  let registrationCode = pending;
  let eventId: string | undefined;
  try {
    const parsed = JSON.parse(pending) as { registrationCode?: string; eventId?: string | null };
    registrationCode = parsed.registrationCode || pending;
    eventId = parsed.eventId || undefined;
  } catch {
    // Compatibility with the previous plain-code session value.
  }
  if (trackNewMetaLead(registrationCode, eventId) || window.localStorage.getItem(`vetta-meta-lead:${registrationCode}`) === "sent") window.sessionStorage.removeItem(PENDING_META_LEAD_KEY);
}

export function trackClarityEvent(name: ClarityEvent) {
  if (!analyticsConsentGranted() || typeof window === "undefined" || !window.clarity) return;
  window.clarity("event", name);
}
