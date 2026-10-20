export type OperationalDeliveryReference = {
  conversation_id?: string | null;
  recipient_jid?: string | null;
};

export function isOperationalDeliveryTarget(row: OperationalDeliveryReference) {
  return Boolean(row.conversation_id?.trim() && row.recipient_jid?.trim());
}

export function matchesOperationalRecipient(conversationJid: string, recipientJid: string | null | undefined) {
  return Boolean(conversationJid && recipientJid && conversationJid === recipientJid);
}

export function canRetryOutbound(status: string | null | undefined, errorCode: string | null | undefined) {
  if (status === "pending") return true;
  return status === "failed" && errorCode !== "evolution_acceptance_uncertain";
}

/** Only the worker that atomically claimed an attempting row may send it. */
export function canSendClaimedOutbound(status: string | null | undefined, rowId: string | null | undefined, claimedRowId: string | null | undefined) {
  return status === "attempting" && Boolean(rowId && claimedRowId && rowId === claimedRowId);
}

export function shouldScheduleMatrix(welcomeStatus: string | null | undefined, matrixExists: boolean) {
  return (welcomeStatus === "sent" || welcomeStatus === "accepted") && !matrixExists;
}
