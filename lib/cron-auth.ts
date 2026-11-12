import { timingSafeEqual } from "node:crypto";

const MIN_CRON_SECRET_LENGTH = 32;

export function authorizeCronRequest(request: Request, secret = process.env.CRON_SECRET) {
  const expected = secret?.trim();
  if (!expected || expected.length < MIN_CRON_SECRET_LENGTH) return "not_configured" as const;

  const value = request.headers.get("authorization") ?? "";
  const prefix = "Bearer ";
  if (!value.startsWith(prefix)) return false as const;

  const candidate = Buffer.from(value.slice(prefix.length), "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return candidate.length === expectedBuffer.length && timingSafeEqual(candidate, expectedBuffer);
}

export { MIN_CRON_SECRET_LENGTH };
