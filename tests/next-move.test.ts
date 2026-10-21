import { describe, expect, it } from "vitest";
import { BUSINESS_MODELS, MODEL_BY_ID } from "../lib/next-move-models";

describe("TU PRÓXIMO MOVIMIENTO editorial model", () => {
  it("contains six distinct worlds with complete first-week sequences", () => {
    expect(BUSINESS_MODELS).toHaveLength(6);
    expect(new Set(BUSINESS_MODELS.map((model) => model.id)).size).toBe(6);
    expect(BUSINESS_MODELS.every((model) => model.firstWeek.length === 4)).toBe(true);
  });

  it("keeps every route specific rather than reusing generic copy", () => {
    expect(new Set(BUSINESS_MODELS.map((model) => model.whatYouBuild)).size).toBe(6);
    expect(new Set(BUSINESS_MODELS.map((model) => model.decisiveQuestion)).size).toBe(6);
    expect(MODEL_BY_ID.direct.conditionsToVerify.join(" ")).toMatch(/compensación|ventas reales/i);
  });

  it("exposes comparison content for every model", () => {
    for (const model of BUSINESS_MODELS) expect(Object.values(model.comparison).every(Boolean)).toBe(true);
  });

  it("gives every world a real decision and a usable 48-hour mission", () => {
    for (const model of BUSINESS_MODELS) {
      expect(model.scenario.options).toHaveLength(3);
      expect(new Set(model.scenario.options.map((option) => option.id)).size).toBe(3);
      expect(model.scenario.options.every((option) => option.revelation && option.blindSpot && option.verification)).toBe(true);
      expect(model.mission.title).toBeTruthy();
      expect(model.mission.movements).toHaveLength(3);
      expect(model.mission.conversation.length).toBeGreaterThan(80);
      expect(model.mission.record.length).toBeGreaterThanOrEqual(3);
      expect(model.mission.evidence).toBeTruthy();
      expect(model.mission.notEvidence).toBeTruthy();
      expect(model.mission.nextDecision).toBeTruthy();
    }
  });

  it("keeps decision consequences materially different inside each world", () => {
    for (const model of BUSINESS_MODELS) {
      expect(new Set(model.scenario.options.map((option) => option.blindSpot)).size).toBe(3);
      expect(new Set(model.scenario.options.map((option) => option.verification)).size).toBe(3);
    }
  });

  it("keeps direct sales focused on consumers, conditions and real sales", () => {
    const direct = MODEL_BY_ID.direct;
    expect(`${direct.mission.hypothesis} ${direct.mission.conversation} ${direct.mission.nextDecision}`).toMatch(/consumidores|necesidad|ventas reales/i);
    expect(direct.mission.notEvidence).toMatch(/inventario|oportunidad/i);
  });
});
