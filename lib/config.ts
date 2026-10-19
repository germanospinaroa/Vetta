export type CohortStatus = "draft" | "open" | "closed" | "finished";

export type PublicCohort = {
  id: string;
  name: string;
  status: CohortStatus;
  timezone: string;
  tuesdayLabel?: string;
  thursdayLabel?: string;
  tuesdayUrl?: string;
  thursdayUrl?: string;
  groupUrl?: string;
  whatsappNumber?: string;
};

const clean = (value: string | undefined) => value?.trim() || undefined;

export function getPublicConfig() {
  const demoMode = process.env.VETTA_DEMO_MODE === "true";
  const configuredStatus = clean(process.env.VETTA_COHORT_STATUS);
  const status = configuredStatus === "open" || configuredStatus === "closed" || configuredStatus === "finished" || configuredStatus === "draft"
    ? configuredStatus
    : "draft";
  const cohort: PublicCohort = {
    id: clean(process.env.NEXT_PUBLIC_ACTIVE_COHORT_ID) || "demo-cohort",
    name: demoMode ? "Cohorte de prueba" : "Cohorte pendiente de configuración",
    status: demoMode ? "open" : status,
    timezone: "America/Bogota",
    tuesdayLabel: clean(process.env.NEXT_PUBLIC_TUESDAY_LABEL),
    thursdayLabel: clean(process.env.NEXT_PUBLIC_THURSDAY_LABEL),
    tuesdayUrl: clean(process.env.VETTA_TUESDAY_MEETING_URL),
    thursdayUrl: clean(process.env.VETTA_THURSDAY_MEETING_URL),
    groupUrl: clean(process.env.VETTA_GROUP_LINK),
    whatsappNumber: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  };

  return {
    demoMode,
    siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000",
    whatsappNumber: cohort.whatsappNumber,
    cohort,
  };
}

export function getQaPublicConfig() {
  const config = getPublicConfig();
  return { ...config, cohort: { ...config.cohort, status: "open" as const } };
}

export const isProductionReady = () => process.env.VETTA_ENV === "production" && !getPublicConfig().demoMode;
