# VETTA — Product brief

## Objective

Build the acquisition, conversion, and activation system for Elite Focus around **NO EMPRENDAS TODAVÍA**: two live virtual sessions that teach prospects to evaluate business opportunities before committing time, money, or reputation.

Primary business outcome: qualified registrations that progress through WhatsApp, group participation, attendance, trust, decision, and eventually customer or active ambassador status.

## Audience

Experienced professionals, often 30–50, considering something of their own or an additional project. They are saturated with options and cautious about risk, time, capital, and reputation.

## Primary action

Register for the Tuesday + Thursday experience from the landing, then voluntarily open WhatsApp to confirm access.

## Routes

- `/` — public landing and integrated registration.
- `/matriz` — local-first evaluation tool, no login.
- `/privacidad` and `/terminos` — clearly labelled drafts pending legal approval.
- `/admin` — private operational dashboard shell, configuration-dependent.

## Scope v1

- Editorial conversion landing with approved copy.
- Active cohort configuration with an explicit TEST fallback.
- Server-validated registration with international phone normalization.
- Consent versioning, campaign attribution, first-party events, and WhatsApp link tracking.
- Local matrix with comparison, notes, print, and JSON export.
- Admin shell and data model/migrations prepared for Supabase Auth/Postgres/RLS.
- No WhatsApp API, broadcast automation, payments, ads, production analytics, or deployment.

## Acceptance criteria

- A first-time visitor understands audience, problem, value, two-session structure, and next action quickly.
- Valid registration returns a traceable code and separates registration from WhatsApp click.
- Invalid phone/consent states are actionable and do not persist invalid data.
- The matrix works on a phone without login or server persistence.
- Private admin routes fail closed when external auth is not configured.
- No production-looking dates, links, claims, host identity, capacity, or legal approvals are invented.
