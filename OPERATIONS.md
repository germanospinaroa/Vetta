# VETTA — Operations

## Human WhatsApp flow

1. The confirmation page opens a 1:1 `wa.me` link containing the prospect's first name and unique registration code.
2. Operator locates and verifies the registration in the authenticated panel by code or phone.
3. Operator copies the initial response and group link.
4. Operator records conversation started only when evidence exists.
5. Operator records group join declared only after the person replies `LISTO`.
6. Operator sends the matrix directly in the 1:1 conversation and records `matrix_sent`.
7. Operator records attendance and commercial outcomes manually.

The application never claims a conversation, group membership, matrix delivery, attendance, or conversion from a click alone. Evolution API is not considered integrated until an authorized inbound test links a message from the official instance to the matching VETTA lead.

## Configurable values

The VETTA cohort, dates, timezone, official WhatsApp number and private group link are configured in the authorized environment. The cohort must remain `draft` until legal approval and the controlled WhatsApp runbook below are complete. Retention rules and final legal approval remain pending.

## Controlled opening test

Run only with the cohort closed to public traffic or in an explicitly restricted preview:

1. Use a controlled test identity and a valid test number.
2. Open registration only in the restricted environment and confirm the lead, consent record, UTM attribution, registration event and unique code in Supabase.
3. Confirm that `/confirmacion` rejects a missing or invalid signed confirmation and accepts only the persisted lead.
4. Open the generated 1:1 WhatsApp link and verify that the prefilled text includes the prospect's first name and code.
5. The authorized operator locates the lead by code or phone in `/admin/leads`, verifies the name and records the conversation only after evidence exists.
6. The operator sends the configured group link, confirms the person has entered, and records the step only after the person replies `LISTO` in the 1:1 chat.
7. The operator sends `/matriz` privately, records `matrix_sent`, and confirms that the real matrix opens and exports correctly.
8. Remove only the test lead and its related test attribution, consent and event rows after the run. Never delete legitimate registrations or broad event history.

The click, group entry, `LISTO` response and matrix delivery must not be simulated or inferred from one another.

## Message templates

The operator dashboard will expose copy-ready templates, but will not send mass messages or call WhatsApp APIs in v1.
