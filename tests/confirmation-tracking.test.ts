import { describe, expect, it } from "vitest";
import { ADVERTISING_CONSENT_KEY, trackMetaAssessmentStarted } from "../lib/analytics";
import { eventSchema } from "../lib/validation";

function mockStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: (key: string) => values.get(key) || null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key), clear: () => values.clear() } as unknown as Storage;
}

describe("final confirmation tracking", () => {
  it("accepts the persisted assessment_started event contract", () => {
    expect(eventSchema.safeParse({ name: "assessment_started", registrationCode: "VETTA-ABC12345", properties: { destination: "commercial_whatsapp" } }).success).toBe(true);
  });

  it("sends AssessmentStarted once per registration code with consent", () => {
    const previousWindow = globalThis.window;
    const calls: unknown[][] = [];
    Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: mockStorage({ [ADVERTISING_CONSENT_KEY]: "granted" }), fbq: (...args: unknown[]) => calls.push(args) } });
    expect(trackMetaAssessmentStarted("VETTA-MOCK-ASSESSMENT")).toBe(true);
    expect(trackMetaAssessmentStarted("VETTA-MOCK-ASSESSMENT")).toBe(false);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.[0]).toBe("trackCustom");
    expect(calls[0]?.[1]).toBe("AssessmentStarted");
    Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
  });

  it("does not send AssessmentStarted without advertising consent", () => {
    const previousWindow = globalThis.window;
    const calls: unknown[][] = [];
    Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: mockStorage({ [ADVERTISING_CONSENT_KEY]: "denied" }), fbq: (...args: unknown[]) => calls.push(args) } });
    expect(trackMetaAssessmentStarted("VETTA-MOCK-DENIED")).toBe(false);
    expect(calls).toHaveLength(0);
    Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
  });
});
