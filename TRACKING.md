# VETTA — Tracking contract

## Public events

| Event | Definition | Required properties |
|---|---|---|
| `landing_viewed` | Landing rendered in the browser | path, session id, UTMs |
| `registration_started` | User focuses or begins the form | form version, UTMs |
| `registration_submitted` | Server accepts a registration | registration code, cohort, consent version, UTMs |
| `registration_failed` | Server rejects a submission | safe error code, form version |
| `whatsapp_clicked` | User activates the configured WhatsApp link | registration code, cohort |
| `matrix_opened` | Matrix route loaded | no personal matrix data |

## Operational events

`conversation_confirmed`, `group_join_declared`, `group_join_verified`, `matrix_sent`, `tuesday_attended`, `thursday_attended`, `followup_started`, `customer_converted`, `ambassador_converted`, and `ambassador_activated` require human/operator evidence or a verified integration. The system must not infer them from clicks.

## Attribution

Persist only the supported UTMs: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`. Preserve the three territories: `no_emprendas_todavia`, `tu_proximo_movimiento`, `estas_saturado`.

No ad pixels or external analytics are enabled in this build.
