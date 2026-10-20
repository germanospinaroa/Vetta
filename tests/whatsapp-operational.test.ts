import { describe, expect, it } from "vitest";
import { canRetryOutbound, canSendClaimedOutbound, isOperationalDeliveryTarget, matchesOperationalRecipient, shouldScheduleMatrix } from "../lib/whatsapp-operational";

describe("operational WhatsApp identity contract", () => {
  it("rejects an outbound row without a conversation", () => expect(isOperationalDeliveryTarget({ recipient_jid: "123@lid" })).toBe(false));
  it("rejects an outbound row without its original JID", () => expect(isOperationalDeliveryTarget({ conversation_id: "conversation-1" })).toBe(false));
  it("accepts a conversation-linked JID delivery", () => expect(isOperationalDeliveryTarget({ conversation_id: "conversation-1", recipient_jid: "123@lid" })).toBe(true));
  it("matches only the exact operational conversation identifier", () => {
    expect(matchesOperationalRecipient("123@lid", "123@lid")).toBe(true);
    expect(matchesOperationalRecipient("123@lid", "573001234567@s.whatsapp.net")).toBe(false);
  });
  it("does not match a missing recipient", () => expect(matchesOperationalRecipient("123@lid", null)).toBe(false));
  it("allows a pending delivery to be attempted", () => expect(canRetryOutbound("pending", null)).toBe(true));
  it("allows a known rejected provider response to be recovered", () => expect(canRetryOutbound("failed", "evolution_rejected")).toBe(true));
  it("does not blindly retry an uncertain provider response", () => expect(canRetryOutbound("failed", "evolution_acceptance_uncertain")).toBe(false));
  it("does not retry an accepted delivery", () => expect(canRetryOutbound("sent", null)).toBe(false));
  it("allows only the worker that claimed a row to send it", () => {
    expect(canSendClaimedOutbound("attempting", "row-1", "row-1")).toBe(true);
    expect(canSendClaimedOutbound("attempting", "row-1", "row-2")).toBe(false);
    expect(canSendClaimedOutbound("attempting", "row-1", null)).toBe(false);
    expect(canSendClaimedOutbound("pending", "row-1", "row-1")).toBe(false);
  });
  it("schedules the gift only after welcome acceptance", () => {
    expect(shouldScheduleMatrix("sent", false)).toBe(true);
    expect(shouldScheduleMatrix("pending", false)).toBe(false);
    expect(shouldScheduleMatrix("sent", true)).toBe(false);
  });
});
