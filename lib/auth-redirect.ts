export function safeInternalPath(value: string | null | undefined, fallback = "/admin") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}

export function loginPath(next: string) {
  return `/auth/login?next=${encodeURIComponent(safeInternalPath(next))}`;
}
