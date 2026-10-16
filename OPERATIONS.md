# VETTA — Operations

## Human WhatsApp flow

1. Operator locates the registration by code.
2. Operator opens the configured official WhatsApp link.
3. Operator copies the initial response and group link.
4. Operator records conversation started only when evidence exists.
5. Operator records group join declared only after the person replies `LISTO`.
6. Operator sends the matrix directly in the 1:1 conversation and records `matrix_sent`.
7. Operator records attendance and commercial outcomes manually.

The application never claims a conversation, group membership, matrix delivery, attendance, or conversion from a click alone.

## Configurable values

Dates, times, timezone, cohort links, official WhatsApp number, group link, meeting URLs, host details, capacity, legal identity, and retention rules are not configured yet. The public UI uses an explicit TEST/pre-opening state when values are missing.

## Message templates

The operator dashboard will expose copy-ready templates, but will not send mass messages or call WhatsApp APIs in v1.
