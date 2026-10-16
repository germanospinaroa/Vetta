# VETTA project rules

- Read `DESIGN.md` before changing visual code; it is the authority for the interface.
- Read `PRODUCT.md`, `OPERATIONS.md`, and `TRACKING.md` before changing product flows.
- Preserve approved commercial copy and the funnel defined in the project documents.
- Keep the existing Next.js, React, TypeScript, and npm versions unless a verified need is documented.
- Never expose secrets, service-role keys, personal data, real operational credentials, or global Codex configuration in the project.
- Keep public registration server-validated and separate `registration_submitted` from `whatsapp_clicked`.
- Treat dates, links, hosts, phone numbers, capacity, legal text, and analytics identifiers as configuration; never invent production values.
- Use mobile-first semantic HTML, visible focus, complete loading/empty/success/error states, and reduced-motion support.
- Keep the matrix local-first; do not send its answers to the database by default.
- Keep admin authorization server-side and protect private routes from indexing.
- Do not add WhatsApp API automation, advertising pixels, payment, publishing, or production integrations without explicit authorization.
- Run lint, typecheck, tests, build, and relevant browser checks before claiming completion.
- Do not publish or deploy without explicit authorization.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
