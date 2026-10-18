import { createHmac, timingSafeEqual } from "node:crypto";

type ConfirmationPayload = { code: string; cohortId: string; expiresAt: number };

const secret = () => process.env.VETTA_CONFIRMATION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

function signature(value: string) {
  const key = secret();
  if (!key) throw new Error("confirmation_secret_not_configured");
  return createHmac("sha256", key).update(value).digest("base64url");
}

export function createConfirmationToken(code: string, cohortId: string) {
  const payload: ConfirmationPayload = { code, cohortId, expiresAt: Date.now() + 30 * 60 * 1000 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signature(encoded)}`;
}

export function verifyConfirmationToken(token: string | undefined, code: string | undefined, cohortId: string) {
  if (!token || !code) return false;
  const [encoded, provided] = token.split(".");
  if (!encoded || !provided) return false;
  let expected: string;
  try { expected = signature(encoded); } catch { return false; }
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as ConfirmationPayload;
    return payload.code === code && payload.cohortId === cohortId && payload.expiresAt > Date.now();
  } catch { return false; }
}
