export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function readAttribution(search: string) {
  const params = new URLSearchParams(search);
  return Object.fromEntries(UTM_KEYS.map((key) => [key, params.get(key) || ""]));
}

export function territoryFromCampaign(campaign: string) {
  if (campaign === "no_emprendas_todavia" || campaign === "tu_proximo_movimiento" || campaign === "estas_saturado") return campaign;
  return undefined;
}
