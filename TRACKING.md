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

Persist the supported UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) and, when present, Meta attribution values `fbclid`, `_fbp` and `_fbc`. Preserve the three territories: `no_emprendas_todavia`, `tu_proximo_movimiento`, `estas_saturado`. Missing parameters remain unknown; the system does not infer campaign attribution.

## Consent-managed external measurement

Meta Pixel (`3337529346452736`) and Microsoft Clarity (`z0c14ujntu`) are loaded only after separate optional consent decisions. Meta uses the advertising/conversion preference; Clarity uses the analytics preference. Rejecting either preference does not block registration.

Meta `Lead` is sent only after the server response explicitly reports `newRegistration: true`, `mode: "LIVE"`, and a persisted registration code. The browser uses a stable event identifier from the server when advertising consent is granted. Optional CAPI uses the same identifier and is disabled unless `META_CAPI_ACCESS_TOKEN` and `META_CAPI_API_VERSION` are configured; it never blocks persistence. The database also enforces one lead per `(cohort_id, whatsapp_e164)`.

Clarity receives allowlisted interaction names only. Registration, confirmation, matrix, admin, and other personal-data surfaces are masked; matrix answers remain local-first and are never sent as event properties.
