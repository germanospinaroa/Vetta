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
});
