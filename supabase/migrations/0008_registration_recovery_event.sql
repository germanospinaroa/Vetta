-- Adds the auditable event used when an authenticated administrator issues
-- a short-lived registration recovery link. This is additive and idempotent.
alter type public.lead_event_name
  add value if not exists 'registration_recovery_issued';
