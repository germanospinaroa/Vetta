export const ANALYTICS_CONSENT_KEY = "vetta-analytics-consent-v1";
export const ADVERTISING_CONSENT_KEY = "vetta-advertising-consent-v1";
export const PENDING_META_LEAD_KEY = "vetta-pending-meta-lead-v1";

type MetaFunction = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: (...args: unknown[]) => void };
type ClarityFunction = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    fbq?: MetaFunction;
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

export function analyticsConsentGranted() {
  return typeof window !== "undefined" && window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "granted";
}

export function advertisingConsentGranted() {
  return typeof window !== "undefined" && window.localStorage.getItem(ADVERTISING_CONSENT_KEY) === "granted";
}

export function advertisingConsentUndecided() {
  return typeof window !== "undefined" && window.localStorage.getItem(ADVERTISING_CONSENT_KEY) === null;
}

export function setAnalyticsConsent(value: "granted" | "denied") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("vetta:analytics-consent", { detail: value }));
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
  if (!analyticsConsentGranted()) return;
  ensureMetaQueue()?.("track", "PageView");
}

export function trackNewMetaLead(registrationCode: string) {
  if (!advertisingConsentGranted() || typeof window === "undefined" || !registrationCode) return false;
  const dedupeKey = `vetta-meta-lead:${registrationCode}`;
  if (window.localStorage.getItem(dedupeKey) === "sent") return false;
  ensureMetaQueue()?.("track", "Lead", { content_name: "NO EMPRENDAS TODAVÍA." }, { eventID: dedupeKey });
  window.localStorage.setItem(dedupeKey, "sent");
  return true;
}

export function queueMetaLeadUntilConsent(registrationCode: string) {
  if (typeof window === "undefined" || !registrationCode || !advertisingConsentUndecided()) return;
  window.sessionStorage.setItem(PENDING_META_LEAD_KEY, registrationCode);
}

export function flushPendingMetaLead() {
  if (typeof window === "undefined" || !analyticsConsentGranted()) return;
  const registrationCode = window.sessionStorage.getItem(PENDING_META_LEAD_KEY);
  if (!registrationCode) return;
  if (trackNewMetaLead(registrationCode)) window.sessionStorage.removeItem(PENDING_META_LEAD_KEY);
}

export function trackClarityEvent(name: ClarityEvent) {
  if (!analyticsConsentGranted() || typeof window === "undefined" || !window.clarity) return;
  window.clarity("event", name);
}
