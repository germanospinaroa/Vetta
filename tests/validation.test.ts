import { describe, expect, it } from "vitest";
import { normalizeWhatsApp, registrationSchema } from "../lib/validation";
import { buildWhatsAppHref } from "../lib/whatsapp";
import { territoryFromCampaign } from "../lib/tracking";

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
});
