# VETTA — Web architecture

- Project type: public landing + local tool + small private operations console.
- Greenfield: yes.
- Stack: Next.js 16.4.0 App Router, React 19.3.0, TypeScript 5.9.3, npm, CSS tokens, Zod 4.6.5, libphonenumber-js 1.13.14, Supabase adapters prepared but not configured.
- Rendering: server components by default; client components only for form, FAQ, matrix, and lightweight UI state.
- Public routes: `/`, `/matriz`, `/privacidad`, `/terminos`.
- Private routes: `/admin` and future `/admin/*`, fail closed without configured auth.
- Public APIs: `POST /api/register`, `POST /api/events`; demo mode uses an explicit in-memory test store only.
- Data boundary: leads/events/operations belong in Supabase once project credentials and migration approval exist. Matrix data stays local.
- Security: no service role in client; Zod validation; rate-limit hook pending infrastructure; RLS migration included; no global Codex/MCP configuration copied.
- Current production state: public preopening landing on an isolated Vercel project; commercial registration remains disabled until Supabase persistence and cohort configuration are authorized.
- Non-goals: WhatsApp API, mass messaging, payments, ad pixels, physical events, or invented social proof.
- Verification: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, Chrome viewport and interaction checks.
