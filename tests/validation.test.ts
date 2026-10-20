import { describe, expect, it } from "vitest";
import { normalizeWhatsApp, registrationSchema } from "../lib/validation";
import { buildGenericWhatsAppHref, buildWhatsAppHref } from "../lib/whatsapp";
import { territoryFromCampaign } from "../lib/tracking";
import { ADVERTISING_CONSENT_KEY, CLARITY_EVENTS, advertisingConsentGranted, isConfirmedNewRegistration, shouldTrackPageView, trackNewMetaLead } from "../lib/analytics";
import { isDuplicateRegistrationConstraint } from "../lib/registration-dedupe";
import { buildOperationalMatrixText, buildOperationalWelcomeText, extractEvolutionGroupData, extractEvolutionMessage, extractEvolutionParticipant, extractRegistrationCode, matchesConfiguredEvolutionGroup, normalizeWhatsAppSender, validateWhatsAppGroupUrl } from "../lib/whatsapp-evolution-parser";
import { defaultAnswers, diagnoseExploration, diagnoseOpportunity } from "../lib/matrix-diagnostic";

describe("VETTA registration contract", () => {
  function mockStorage(initial: Record<string, string> = {}) {
    const values = new Map(Object.entries(initial));
    return { getItem: (key: string) => values.get(key) || null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key), clear: () => values.clear() } as unknown as Storage;
  }

  it("keeps analytics interaction events free of diagnostic answers", () => {
    expect(CLARITY_EVENTS).toEqual(["cta_clicked", "registration_started", "registration_error", "registration_confirmed", "whatsapp_clicked", "matrix_started", "matrix_completed"]);
  });

  it("only treats an explicit persisted LIVE response as a new registration", () => {
    expect(isConfirmedNewRegistration({ ok: true, newRegistration: true, existing: false, mode: "LIVE", registrationCode: "VETTA-NEW" })).toBe(true);
    expect(isConfirmedNewRegistration({ ok: true, newRegistration: false, existing: true, mode: "LIVE", registrationCode: "VETTA-OLD" })).toBe(false);
    expect(isConfirmedNewRegistration({ ok: true, mode: "LIVE", registrationCode: "VETTA-MISSING-FLAG" })).toBe(false);
    expect(isConfirmedNewRegistration({ ok: true, newRegistration: true, mode: "TEST", registrationCode: "VETTA-TEST" })).toBe(false);
  });

  it("deduplicates PageView by navigation path", () => {
    expect(shouldTrackPageView("/", "")).toBe(true);
    expect(shouldTrackPageView("/", "/")).toBe(false);
    expect(shouldTrackPageView("/matriz", "/")).toBe(true);
  });

  it("translates only the cohort-phone unique conflict into an existing registration", () => {
    expect(isDuplicateRegistrationConstraint({ code: "23505", message: "duplicate key violates unique constraint leads_cohort_whatsapp_unique_idx" })).toBe(true);
    expect(isDuplicateRegistrationConstraint({ code: "23505", message: "duplicate key violates unique constraint leads_registration_code_key" })).toBe(false);
    expect(isDuplicateRegistrationConstraint({ code: "23503", message: "foreign key violation" })).toBe(false);
  });

  it("sends one mocked Meta Lead only with advertising consent", () => {
    const previousWindow = globalThis.window;
    const calls: unknown[][] = [];
    Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: mockStorage({ [ADVERTISING_CONSENT_KEY]: "granted" }), sessionStorage: mockStorage(), fbq: (...args: unknown[]) => calls.push(args) } });
    expect(advertisingConsentGranted()).toBe(true);
    expect(trackNewMetaLead("VETTA-MOCK-1")).toBe(true);
    expect(trackNewMetaLead("VETTA-MOCK-1")).toBe(false);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.[1]).toBe("Lead");
    Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
  });

  it("does not send Meta Lead when advertising consent is denied", () => {
    const previousWindow = globalThis.window;
    const calls: unknown[][] = [];
    Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: mockStorage({ [ADVERTISING_CONSENT_KEY]: "denied" }), sessionStorage: mockStorage(), fbq: (...args: unknown[]) => calls.push(args) } });
    expect(advertisingConsentGranted()).toBe(false);
    expect(trackNewMetaLead("VETTA-MOCK-2")).toBe(false);
    expect(calls).toHaveLength(0);
    Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
  });
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

  it("builds a generic continuation message without exposing an existing code", () => {
    const href = buildGenericWhatsAppHref("573001234567");
    const message = decodeURIComponent((href || "").split("?text=")[1] || "");
    expect(message).toContain("continuando mi registro");
    expect(message).not.toContain("VETTA-");
    expect(message).not.toContain("573001234567");
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
      event: "MESSAGES_UPSERT",
      data: { key: { id: "provider-1", remoteJid: "573001234567@s.whatsapp.net", fromMe: false }, message: { conversation: "LISTO" } },
    });
    expect(message.eventName).toBe("messages.upsert");
    expect(message.providerMessageId).toBe("provider-1");
    expect(message.senderE164).toBe("+573001234567");
    expect(message.text).toBe("LISTO");
    expect(message.fromMe).toBe(false);
    const lidMessage = extractEvolutionMessage({
      event: "MESSAGES_UPSERT",
      data: {
        key: { id: "provider-lid-1", remoteJid: "123456789@lid", remoteJidAlt: "573001234567@s.whatsapp.net", fromMe: false },
        message: { ephemeralMessage: { message: { conversation: "Hola" } } },
      },
    });
    expect(lidMessage.senderE164).toBe("+573001234567");
    expect(lidMessage.text).toBe("Hola");
  });

  it("keeps an unresolved LID with a registration code recoverable without resolving it by code alone", () => {
    const message = extractEvolutionMessage({
      event: "messages.upsert",
      data: { key: { id: "andres-provider-1", remoteJid: "123456789@lid", fromMe: false }, message: { conversation: "Hola, soy Andrés. Mi código es VETTA-96378DDC." } },
    });
    expect(message.senderE164).toBeNull();
    expect(message.senderJid).toBe("123456789@lid");
    expect(message.registrationCode).toBe("VETTA-96378DDC");
    expect(extractRegistrationCode("texto sin código")).toBeNull();
  });

  it("resolves phone identifiers from Evolution alternative fields", () => {
    const senderPn = extractEvolutionMessage({ event: "messages.upsert", data: { key: { id: "pn-1", remoteJid: "123456789@lid", senderPn: "573001234567@s.whatsapp.net", fromMe: false }, message: { conversation: "LISTO" } } });
    const snakeCase = extractEvolutionMessage({ event: "messages.upsert", data: { key: { id: "pn-2", remoteJid: "123456789@lid", sender_pn: "573001234568@s.whatsapp.net", fromMe: false }, message: { conversation: "LISTO" } } });
    expect(senderPn.senderE164).toBe("+573001234567");
    expect(snakeCase.senderE164).toBe("+573001234568");
  });

  it("uses the original conversation JID and extracts a code from a complete message", () => {
    const message = extractEvolutionMessage({
      event: "messages.upsert",
      data: { key: { id: "code-1", remoteJid: "987654321@lid", fromMe: false }, message: { extendedTextMessage: { text: "Hola, me registré y quiero confirmar mi acceso. Mi código es VETTA-96378DDC." } } },
    });
    expect(message.senderJid).toBe("987654321@lid");
    expect(message.senderE164).toBeNull();
    expect(message.registrationCode).toBe("VETTA-96378DDC");
    expect(message.text).toContain("Hola, me registré");
  });

  it("does not treat a group JID as a private conversation", () => {
    const message = extractEvolutionMessage({
      event: "messages.upsert",
      data: { key: { id: "group-1", remoteJid: "120363000000000000@g.us", fromMe: false }, message: { conversation: "VETTA-96378DDC" } },
    });
    expect(message.senderJid).toBe("120363000000000000@g.us");
    expect(message.registrationCode).toBe("VETTA-96378DDC");
  });

  it("keeps the welcome and gift as separate messages with one link each", () => {
    const text = buildOperationalWelcomeText("Genubath Roa", "https://chat.whatsapp.com/example");
    expect(text).toContain("https://chat.whatsapp.com/example");
    expect(text).toContain("20 y 22 de octubre");
    expect(text).not.toContain("accesos operativos");
    expect(text).not.toContain("/matriz");
    const gift = buildOperationalMatrixText("https://noemprendas.gritlab.pro/matriz");
    expect(gift).toContain("https://noemprendas.gritlab.pro/matriz");
    expect(gift).not.toContain("chat.whatsapp.com");
  });

  it("accepts only the configured group and preserves unverifiable LIDs", () => {
    const payload = { event: "GROUP_PARTICIPANTS_UPDATE", data: { id: "120363413717481086@g.us", participants: [{ id: "987654@lid" }, { id: "12345@lid", phoneNumber: "573001234567" }] } };
    const group = extractEvolutionGroupData(payload);
    expect(matchesConfiguredEvolutionGroup(group.groupJid, "120363413717481086@g.us")).toBe(true);
    expect(matchesConfiguredEvolutionGroup(group.groupJid, "120363430193664827@g.us")).toBe(false);
    expect(group.participants[0]?.phoneE164).toBeNull();
    expect(group.participants[1]?.phoneE164).toBe("+573001234567");
  });

  it("only accepts a non-empty WhatsApp invitation URL", () => {
    expect(validateWhatsAppGroupUrl("https://chat.whatsapp.com/Ehwx53ZOXRp1LEkggc3Rh5")).toBe("https://chat.whatsapp.com/Ehwx53ZOXRp1LEkggc3Rh5");
    expect(validateWhatsAppGroupUrl(undefined)).toBeNull();
    expect(validateWhatsAppGroupUrl("undefined")).toBeNull();
    expect(validateWhatsAppGroupUrl("https://example.com/group")).toBeNull();
  });

  it("produces a materially different result when recurring costs are unknown", () => {
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Ecommerce", investmentKnown: "yes", recurringKnown: "unknown", availableHours: "2 horas al día", requiredHours: "known_fit", lossCapacity: "comfortable", demand: "expressed_interest", dependence: "depends_on_me", support: "documented", scale: "unclear", evidence: "claims", fit: "partial", economics: "unknown" });
    expect(result.overlooked.join(" ")).toContain("costos");
    expect(result.nextSteps.join(" ")).toContain("Solicita");
  });

  it("keeps evidence-positive results from hiding personal debt risk", () => {
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Consultoría", investmentKnown: "yes", recurringKnown: "yes", debt: "yes", lossCapacity: "limited", demand: "real_customers", evidence: "documents", support: "documented", fit: "strong", economics: "clear", scale: "clear", requiredHours: "known_fit", dependence: "can_pause" });
    expect(result.overlooked.join(" ")).toContain("Riesgo financiero");
    expect(result.conclusion).toContain("alerta");
  });

  it("prioritizes the economic model when the income mechanism is unclear", () => {
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Oferta atractiva", demand: "claims_only", evidence: "claims", economics: "unknown", investmentKnown: "unknown", recurringKnown: "unknown" });
    expect(result.criteria.find((item) => item.key === "economics")?.question).toContain("Cómo se genera");
    expect(result.overlooked.join(" ")).toContain("Viabilidad económica");
  });

  it("returns a search profile instead of diagnosing an opportunity that does not exist", () => {
    const result = diagnoseExploration({ path: "exploring", time: "low", budget: "limited", risk: "low", goal: "flexibility", support: "structured" });
    expect(result.kind).toBe("exploration");
    expect(result.headline).toContain("flexibilidad");
    expect(result.nextSteps.length).toBe(3);
  });

  it("recognizes favorable evidence without guaranteeing success", () => {
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Modelo documentado", investmentKnown: "yes", recurringKnown: "yes", essentialFunds: "no", lossCapacity: "comfortable", availableHours: "2", demand: "real_customers", dependence: "can_pause", support: "documented", scale: "clear", evidence: "documents", fit: "strong", economics: "clear", requiredHours: "known_fit" });
    expect(result.coverage).toBeGreaterThanOrEqual(8);
    expect(result.conclusion).toContain("sin garantizar");
  });

  it("gives an information-gathering plan when nearly everything is unknown", () => {
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Todavía no sé", investmentKnown: "unknown", recurringKnown: "unknown", essentialFunds: "unknown", debt: "unknown", requiredHours: "unknown", lossCapacity: "unknown", demand: "unknown", dependence: "unknown", support: "unknown", scale: "unknown", evidence: "unknown", fit: "unknown", economics: "unknown" });
    expect(result.coverage).toBe(0);
    expect(result.nextSteps.length).toBe(3);
    expect(result.conclusion).toContain("información pendiente");
  });
});

describe("VETTA matrix diagnostic V3", () => {
  it("integrates a compatible concrete opportunity without inventing certainty", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers("specific"), opportunity: "Consultoría", investmentKnown: "yes", recurringKnown: "yes", essentialFunds: "no", debt: "no", requiredHours: "known_fit", lossCapacity: "comfortable", demand: "real_customers", dependence: "can_pause", support: "documented", evidence: "documents", fit: "strong", economics: "clear" });
    expect(result.diagnosisTitle).toContain("base concreta");
    expect(result.findings.some((item) => item.id === "evidence-with-boundaries")).toBe(true);
    expect(result.synthesis).toContain("garantía independiente");
  });

  it("prioritizes elevated investment with unclear exposure", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Franquicia", investmentKnown: "yes", recurringKnown: "unknown", essentialFunds: "yes", debt: "unknown", lossCapacity: "essential" });
    expect(result.findings[0]?.id).toBe("financial-exposure");
    expect(result.actions[0]?.question).toContain("necesidades básicas");
  });

  it("integrates low availability, operational demand and personal dependence", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Tienda online", availableHours: "2 horas por semana", requiredHours: "known_mismatch", dependence: "depends_on_me", fit: "weak" });
    expect(result.findings.some((item) => item.id === "availability-dependence")).toBe(true);
    expect(result.findings.filter((item) => item.sourceCriteria.includes("time")).length).toBeLessThan(4);
  });

  it("does not convert expressed demand into proven viability", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Curso digital", demand: "expressed_interest", evidence: "claims", economics: "unknown" });
    expect(result.findings.some((item) => item.id === "demand-economics-gap")).toBe(true);
    expect(result.strengths.join(" ")).not.toContain("clientes o compras reales");
  });

  it("integrates apparently low entry cost with unknown recurring commitments", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Membresía", investmentKnown: "yes", recurringKnown: "unknown", lossCapacity: "limited" });
    expect(result.findings.some((item) => item.id === "incomplete-cost-exposure")).toBe(true);
    expect(result.actions.some((item) => item.question.includes("primeros meses"))).toBe(true);
  });

  it("keeps documented support separate from operational dependence", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Agencia", dependence: "depends_on_me", support: "claimed", requiredHours: "unknown" });
    expect(result.findings.some((item) => item.id === "support-dependence")).toBe(true);
    expect(result.findings.some((item) => item.id === "unmeasured-operational-load")).toBe(true);
  });

  it("surfaces a direct contradiction instead of repeating fit and time", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Venta directa", fit: "strong", requiredHours: "known_mismatch" });
    expect(result.findings.some((item) => item.id === "fit-time-contradiction")).toBe(true);
    expect(new Set(result.findings.map((item) => item.id)).size).toBe(result.findings.length);
  });

  it("returns a useful information gap when answers are mostly unknown", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Idea", investmentKnown: "unknown", recurringKnown: "unknown", requiredHours: "unknown", lossCapacity: "unknown", demand: "unknown", dependence: "unknown", support: "unknown", evidence: "unknown", economics: "unknown" });
    expect(result.findings.some((item) => item.id === "decision-information-gap")).toBe(true);
    expect(result.conclusion).toContain("información");
  });

  it("uses a comparison framework and never declares a winner", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers("comparing"), opportunity: "Alternativa A", demand: "real_customers", economics: "clear" });
    expect(result.findings.some((item) => item.id === "comparison-framework")).toBe(true);
    expect(result.diagnosisTitle).toContain("comparables");
    expect(result.conclusion).not.toContain("ganadora");
  });

  it("keeps comparison with insufficient criteria actionable", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers("comparing"), opportunity: "Alternativa B", investmentKnown: "unknown", recurringKnown: "unknown", demand: "unknown", evidence: "unknown", economics: "unknown" });
    expect(result.actions.length).toBeGreaterThan(0);
    expect(result.actions.length).toBeLessThanOrEqual(result.findings.length);
    expect(result.actions.some((item) => item.question.includes("comprobar") || item.question.includes("dato"))).toBe(true);
  });

  it("consolidates comparison uncertainty instead of repeating the same gap", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers("comparing"), opportunity: "Alternativa única", recurringKnown: "unknown", demand: "unknown", evidence: "unknown", economics: "unknown" });
    expect(result.findings.map((item) => item.id)).toEqual(["comparison-framework"]);
    expect(result.actions).toHaveLength(1);
  });

  it("does not treat exploration without an opportunity as a financial risk", async () => {
    const { diagnoseExploration } = await import("../lib/matrix-diagnostic");
    const result = diagnoseExploration({ path: "exploring", time: "low", budget: "limited", risk: "low", goal: "flexibility", support: "structured" });
    expect(result.synthesis).toContain("no es un riesgo financiero confirmado");
    expect(result.findings.some((item) => item.id === "exploration-constraints")).toBe(true);
  });

  it("turns clear exploration preferences and restrictions into filters", async () => {
    const { diagnoseExploration } = await import("../lib/matrix-diagnostic");
    const result = diagnoseExploration({ path: "exploring", time: "medium", budget: "none", risk: "low", goal: "learning", interests: "servicios digitales", support: "structured" });
    expect(result.findings.some((item) => item.id === "exploration-preferences")).toBe(true);
    expect(result.actions.length).toBeGreaterThan(0);
    expect(result.conclusion).toContain("no concluir qué oportunidad conviene");
  });

  it("gives exploration a concrete filter before any financial commitment", async () => {
    const { diagnoseExploration } = await import("../lib/matrix-diagnostic");
    const result = diagnoseExploration({ path: "exploring", time: "low", budget: "limited", risk: "low", goal: "flexibility", interests: "servicios digitales", support: "structured" });
    const filter = result.findings.find((item) => item.id === "exploration-fit-filter");
    expect(filter?.interpretation).toContain("Serían incompatibles");
    expect(filter?.recommendedAction).toContain("sin pagar");
    expect(filter?.verificationQuestion).toContain("límites");
  });

  it("keeps findings, actions and evidence bounded for concise results", async () => {
    const { defaultAnswers, diagnoseOpportunity } = await import("../lib/matrix-diagnostic");
    const result = diagnoseOpportunity({ ...defaultAnswers(), opportunity: "Modelo", debt: "yes", lossCapacity: "limited", requiredHours: "known_mismatch", dependence: "depends_on_me", demand: "claims_only", economics: "unknown", support: "none", evidence: "none", fit: "weak" });
    expect(result.findings.length).toBeLessThanOrEqual(6);
    expect(result.strengths.length).toBeLessThanOrEqual(2);
    expect(result.overlooked.length).toBeLessThanOrEqual(3);
    expect(result.actions.length).toBeGreaterThan(0);
    expect(result.actions.length).toBeLessThanOrEqual(result.findings.length);
    expect(new Set(result.findings.map((item) => item.id)).size).toBe(result.findings.length);
  });
});
