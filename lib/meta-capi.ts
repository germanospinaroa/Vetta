type MetaLeadServerEvent = {
  eventId: string;
  eventTime: Date;
  sourceUrl: string;
  fbp?: string;
  fbc?: string;
};

type MetaCapiResult = { sent: boolean; reason?: "not_configured" | "rejected" | "transport_error" };

function getConfig() {
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  const pixelId = process.env.META_PIXEL_ID?.trim() || "3337529346452736";
  const version = process.env.META_CAPI_API_VERSION?.trim();
  if (!token || !version) return null;
  return { token, pixelId, version };
}

export async function sendMetaLeadServerEvent(event: MetaLeadServerEvent): Promise<MetaCapiResult> {
  const config = getConfig();
  if (!config) return { sent: false, reason: "not_configured" };
  const userData = {
    ...(event.fbp ? { fbp: event.fbp } : {}),
    ...(event.fbc ? { fbc: event.fbc } : {}),
  };
  try {
    const response = await fetch(`https://graph.facebook.com/${encodeURIComponent(config.version)}/${encodeURIComponent(config.pixelId)}/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        data: ["Lead", "AssessmentStarted"].map((name) => ({
          event_name: name,
          event_time: Math.floor(event.eventTime.getTime() / 1000),
          event_id: event.eventId,
          action_source: "website",
          event_source_url: event.sourceUrl,
          user_data: userData,
          ...(name === "AssessmentStarted" ? { custom_data: { content_name: "NO EMPRENDAS TODAVÍA.", registration_status: "saved" } } : {}),
        })),
        access_token: config.token,
      }),
      cache: "no-store",
    });
    if (!response.ok) return { sent: false, reason: "rejected" };
    return { sent: true };
  } catch {
    return { sent: false, reason: "transport_error" };
  }
}
