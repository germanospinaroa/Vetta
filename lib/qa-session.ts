import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "vetta_qa_session";
const secret = () => process.env.VETTA_CONFIRMATION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

function sign(value: string) {
  const key = secret();
  if (!key) throw new Error("qa_secret_not_configured");
  return createHmac("sha256", key).update(value).digest("base64url");
}

export function createQaSessionToken() {
  const payload = Buffer.from(JSON.stringify({ purpose: "qa-funnel", expiresAt: Date.now() + 15 * 60 * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function hasValidQaSession(value: string | undefined) {
  if (!value) return false;
  const [payload, provided] = value.split(".");
  if (!payload || !provided) return false;
  try {
    const expected = sign(payload);
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { purpose?: string; expiresAt?: number };
    return parsed.purpose === "qa-funnel" && typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now();
  } catch { return false; }
}

export const qaSessionCookieName = COOKIE;
