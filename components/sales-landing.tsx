"use client";

import { EventBeacon } from "@/components/event-beacon";
import { PrivacyPreferencesButton } from "@/components/privacy-preferences-button";
import { RegistrationForm } from "@/components/registration-form";
import { VettaLandingV7 } from "@/components/vetta-landing-v7";
import type { PublicCohort } from "@/lib/config";
import { trackClarityEvent } from "@/lib/analytics";

export function SalesLanding({ cohort }: { cohort: PublicCohort }) {
  const registrationForm = cohort.status === "open"
    ? <RegistrationForm redirectOnSuccess />
    : <div className="v7-static-form" role="status">El registro todavía no está habilitado.</div>;

  return (
    <VettaLandingV7
      registrationForm={registrationForm}
      eventBeacon={<EventBeacon name="landing_viewed" />}
      privacyControl={<PrivacyPreferencesButton />}
      onRegistrationIntent={() => trackClarityEvent("cta_clicked")}
    />
  );
}
