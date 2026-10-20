export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export const ATTRIBUTION_KEYS = [...UTM_KEYS, "fbclid"] as const;

export function readAttribution(search: string) {
  const params = new URLSearchParams(search);
  return Object.fromEntries(ATTRIBUTION_KEYS.map((key) => [key, params.get(key) || ""]));
}

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const prefix = `${name}=`;
  return document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix))?.slice(prefix.length) || "";
}

export function readMetaAttribution() {
  return { fbp: readCookie("_fbp"), fbc: readCookie("_fbc") };
}

export function territoryFromCampaign(campaign: string) {
  if (campaign === "no_emprendas_todavia" || campaign === "tu_proximo_movimiento" || campaign === "estas_saturado") return campaign;
  return undefined;
}
