import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

type ConfirmationPayload = { code: string; cohortId: string; expiresAt: number };
type RecoveryPayload = { purpose: "registration-recovery"; leadId: string; cohortId: string; expiresAt: number; nonce: string };

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

export function getVerifiedConfirmationCode(token: string | undefined, cohortId: string) {
  if (!token) return undefined;
  const [encoded, provided] = token.split(".");
  if (!encoded || !provided) return undefined;
  let expected: string;
  try { expected = signature(encoded); } catch { return undefined; }
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return undefined;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as ConfirmationPayload;
    return payload.cohortId === cohortId && payload.expiresAt > Date.now() && /^(?:VETTA|QA)-[A-Z0-9]{8}$/i.test(payload.code) ? payload.code : undefined;
  } catch { return undefined; }
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

export function createRecoveryToken(leadId: string, cohortId: string) {
  const payload: RecoveryPayload = { purpose: "registration-recovery", leadId, cohortId, expiresAt: Date.now() + 15 * 60 * 1000, nonce: randomBytes(16).toString("base64url") };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signature(encoded)}`;
}

export function hashRecoveryToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyRecoveryToken(token: string | undefined, cohortId: string) {
  if (!token) return null;
  const [encoded, provided] = token.split(".");
  if (!encoded || !provided) return null;
  let expected: string;
  try { expected = signature(encoded); } catch { return null; }
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as RecoveryPayload;
    if (payload.purpose !== "registration-recovery" || payload.cohortId !== cohortId || payload.expiresAt <= Date.now() || !payload.leadId) return null;
    return payload;
  } catch { return null; }
}
