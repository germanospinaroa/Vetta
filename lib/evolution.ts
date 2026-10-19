type EvolutionConfig = {
  baseUrl: string;
  instance: string;
  apiKey: string;
};

function getEvolutionConfig(): EvolutionConfig | null {
  const baseUrl = process.env.EVOLUTION_API_URL?.trim().replace(/\/$/, "");
  const instance = process.env.EVOLUTION_INSTANCE?.trim();
  const apiKey = process.env.EVOLUTION_API_KEY?.trim();
  if (!baseUrl || !instance || !apiKey) return null;
  return { baseUrl, instance, apiKey };
}

async function evolutionRequest(path: string, init?: RequestInit) {
  const config = getEvolutionConfig();
  if (!config) throw new Error("evolution_not_configured");
  const response = await fetch(`${config.baseUrl}${path.replace("{instance}", encodeURIComponent(config.instance))}`, {
    ...init,
    headers: { apikey: config.apiKey, "content-type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`evolution_http_${response.status}`);
  return body as Record<string, unknown>;
}

export async function sendEvolutionText(number: string, text: string) {
  return evolutionRequest("/message/sendText/{instance}", {
    method: "POST",
    body: JSON.stringify({ number, text, delay: 0, linkPreview: true }),
  });
}

export async function fetchEvolutionGroupParticipants(groupJid: string) {
  return evolutionRequest(`/group/participants/{instance}?groupJid=${encodeURIComponent(groupJid)}`);
}
