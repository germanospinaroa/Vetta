import type { RegistrationInput } from "./validation";

export type DemoLead = RegistrationInput & {
  registrationCode: string;
  normalizedPhone: string;
  cohortId: string;
  createdAt: string;
};

const leads = new Map<string, DemoLead>();

export function saveDemoLead(input: RegistrationInput, normalizedPhone: string, cohortId: string) {
  const registrationCode = `VETTA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const lead: DemoLead = { ...input, normalizedPhone, cohortId, registrationCode, createdAt: new Date().toISOString() };
  leads.set(registrationCode, lead);
  return lead;
}

export function demoLeadCount() {
  return leads.size;
}
