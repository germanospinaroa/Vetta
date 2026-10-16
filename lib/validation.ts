import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { z } from "zod";

const isoCountry = z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/, "Selecciona un país válido.");

export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre.").max(100),
  whatsapp: z.string().trim().min(6, "Escribe tu número de WhatsApp.").max(40),
  city: z.string().trim().min(2, "Escribe tu ciudad.").max(100),
  country: isoCountry,
  consent: z.literal("on", "Debes aceptar el aviso de privacidad para continuar."),
  consentVersion: z.literal("v1"),
  utm_source: z.string().trim().max(100).optional().default(""),
  utm_medium: z.string().trim().max(100).optional().default(""),
  utm_campaign: z.string().trim().max(100).optional().default(""),
  utm_content: z.string().trim().max(100).optional().default(""),
  utm_term: z.string().trim().max(100).optional().default(""),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export function normalizeWhatsApp(value: string, country: string) {
  const parsed = parsePhoneNumberFromString(value, country as CountryCode);
  if (!parsed || !parsed.isValid()) throw new Error("Escribe un número de WhatsApp válido para el país seleccionado.");
  return parsed.number;
}

export const eventSchema = z.object({
  name: z.enum([
    "landing_viewed",
    "registration_started",
    "registration_submitted",
    "registration_failed",
    "whatsapp_clicked",
    "matrix_opened",
    "conversation_confirmed",
    "group_join_declared",
    "group_join_verified",
    "matrix_sent",
    "tuesday_attended",
    "thursday_attended",
    "followup_started",
    "customer_converted",
    "ambassador_converted",
    "ambassador_activated",
  ]),
  registrationCode: z.string().trim().max(40).optional(),
  cohortId: z.string().trim().max(80).optional(),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});
