export function isDuplicateRegistrationConstraint(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { code?: string; message?: string; details?: string };
  return candidate.code === "23505" && `${candidate.message || ""} ${candidate.details || ""}`.includes("leads_cohort_whatsapp_unique_idx");
}
