import { describe, expect, it } from "vitest";
import { normalizeWhatsApp, registrationSchema } from "../lib/validation";
import { buildWhatsAppHref } from "../lib/whatsapp";
import { territoryFromCampaign } from "../lib/tracking";
import { extractEvolutionGroupData, extractEvolutionMessage, extractEvolutionParticipant, matchesConfiguredEvolutionGroup, normalizeWhatsAppSender } from "../lib/whatsapp-evolution-parser";

describe("VETTA registration contract", () => {
  it("normalizes an international WhatsApp number to E.164", () => {
    expect(normalizeWhatsApp("300 123 4567", "CO")).toBe("+573001234567");
  });

  it("rejects missing consent version and accepts supported input", () => {
    expect(registrationSchema.safeParse({ name: "Ana", whatsapp: "3001234567", city: "Bogotá", country: "CO" }).success).toBe(false);
    expect(registrationSchema.safeParse({ name: "Ana", whatsapp: "3001234567", city: "Bogotá", country: "CO", consent: "on", consentVersion: "v1" }).success).toBe(true);
  });

  it("keeps WhatsApp click separate and does not include the phone", () => {
    const href = buildWhatsAppHref("573001234567", "Ana", "VETTA-ABC123");
    expect(href).toContain("wa.me/573001234567");
    expect(decodeURIComponent(href || "")).toContain("Mi código es VETTA-ABC123");
    expect(decodeURIComponent((href || "").split("?text=")[1] || "")).not.toContain("3001234567");
  });

  it("only accepts the three defined campaign territories", () => {
    expect(territoryFromCampaign("no_emprendas_todavia")).toBe("no_emprendas_todavia");
    expect(territoryFromCampaign("unknown")).toBeUndefined();
  });

  it("normalizes Evolution JIDs and extracts inbound text without storing payloads", () => {
    expect(normalizeWhatsAppSender("573001234567@s.whatsapp.net")).toBe("+573001234567");
    expect(normalizeWhatsAppSender("573001234567@lid")).toBeNull();
    expect(extractEvolutionParticipant({ id: "12345@lid", phoneNumber: "573001234567" })).toEqual({ phoneE164: "+573001234567", id: "12345@lid", jid: null });
    expect(extractEvolutionParticipant({ id: "12345@lid", number: "573001234567" }).phoneE164).toBe("+573001234567");
    expect(extractEvolutionParticipant({ id: "12345@lid" }).phoneE164).toBeNull();
    const message = extractEvolutionMessage({
      event: "messages.upsert",
      data: { key: { id: "provider-1", remoteJid: "573001234567@s.whatsapp.net", fromMe: false }, message: { conversation: "LISTO" } },
    });
    expect(message.providerMessageId).toBe("provider-1");
    expect(message.senderE164).toBe("+573001234567");
    expect(message.text).toBe("LISTO");
    expect(message.fromMe).toBe(false);
  });

  it("accepts only the configured group and preserves unverifiable LIDs", () => {
    const payload = { event: "GROUP_PARTICIPANTS_UPDATE", data: { id: "120363413717481086@g.us", participants: [{ id: "987654@lid" }, { id: "12345@lid", phoneNumber: "573001234567" }] } };
    const group = extractEvolutionGroupData(payload);
    expect(matchesConfiguredEvolutionGroup(group.groupJid, "120363413717481086@g.us")).toBe(true);
    expect(matchesConfiguredEvolutionGroup(group.groupJid, "120363430193664827@g.us")).toBe(false);
    expect(group.participants[0]?.phoneE164).toBeNull();
    expect(group.participants[1]?.phoneE164).toBe("+573001234567");
  });
});
