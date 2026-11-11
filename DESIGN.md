# VETTA — DESIGN.md

## Current public landing system — premium editorial reconstruction

The current public landing is a restrained cinematic editorial system for NO EMPRENDAS TODAVÍA., not SAVORA and not a generic SaaS template. It uses the existing photography, a cool mineral background, midnight ink, signal blue and a controlled gold accent for the gift. The narrative has five clear movements: immediate promise, better questions, two-session experience, WhatsApp-delivered gift, and decisive closing CTA.

- Display/UI: Manrope and Inter already loaded by Next font; no new dependency.
- Layout: 1200px shell, 52/48 hero composition, large editorial section headings, asymmetric value rows, two-session split, dark gift chapter, FAQ disclosure and strong closing panel.
- Components: `SalesLanding`, `SalesCta`, `StickySalesCta`, existing registration form and existing confirmation page. The public landing has no form; all registration CTAs go to `/registro`.
- Motion: only opacity/transform and native details disclosure; no scrolljacking, autoplay, parallax or invented interactions. Reduced motion removes transitions.
- Responsive contract: mobile-first reflow; hero CTA stays in the first view; session columns stack; FAQ remains keyboard accessible; controls target at least 44px.
- Content contract: use `COPY_APPROVED.md` and `PRODUCT_CONTEXT.md`; never invent proof, scarcity, financial outcomes, hosts or operational URLs.

This file is the visual authority for VETTA v1. Other skills may suggest improvements, but may not override these decisions without an explicit project decision.

## 1. Brand personality

- Sophisticated, intelligent, contemporary, selective, warm without being casual.
- Observable behavior: short copy blocks, editorial hierarchy, generous space, precise labels, calm interactions, no hype.
- Avoid: network-marketing clichés, coaching language, wealth imagery, fake authority, urgency theatre, glossy “luxury” effects.

## 2. Product and primary action

- Ecosystem: VETTA, organised by Elite Focus and transparently linked to Zilis.
- Experience: `NO EMPRENDAS TODAVÍA`.
- Primary action: `Reservar mi lugar` in the integrated registration flow.
- Success action: `Confirmar mi acceso por WhatsApp`, only when a real configured number exists.
- Desired feeling: the visitor feels respected as a thoughtful decision-maker, not pressured as a lead.

## 3. Visual thesis and signature move

Use an editorial “decision line”: a thin warm line and paired markers connect **evaluar** to **decidir** across the hero and two-session section. It creates continuity without scrolljacking, and it collapses into a readable vertical sequence on mobile.

## 4. References and boundaries

| Reference direction | May inform | Must not copy |
|---|---|---|
| Contemporary editorial magazines | asymmetric rhythm, large type, margin notes | logos, layouts, copy, photography, or brand identity |
| Premium consulting reports | restraint, evidence language, useful structure | claims, client marks, testimonials, or proprietary charts |
| Swiss-inspired information design | alignment, precise dividers, hierarchy | generic corporate template treatment |

## 5. Tokens

### Color

| Token | Value | Use | Contrast rule |
|---|---|---|---|
| `--ink` | `#111318` | primary text and dark surfaces | body text on Ivory: AAA |
| `--ivory` | `#F5F2EB` | page background | base surface |
| `--surface` | `#FCFAF6` | cards and form surfaces | body text on surface: AAA |
| `--soft-gray` | `#D9D6CF` | rules and quiet structure | never use as text |
| `--slate` | `#777C80` | secondary text | only at large text or with darker alternative |
| `--warm` | `#B87950` | marks, rules, decorative accent | not for small text on Ivory |
| `--warm-text` | `#7C4B31` | accent text, errors requiring warm tone | AA on Ivory |
| `--moss` | `#294B3A` | success and quiet positive state | AA on Ivory |
| `--danger` | `#9B3027` | validation errors | AA on Ivory |
| `--focus` | `#7C4B31` | focus ring | 3px visible ring |

### Typography

- Display: `Manrope`, fallback `Arial`, `system-ui`; use for the monumental H1 and structured labels.
- Editorial accent: `Instrument Serif`, fallback `Georgia`, serif; use only for selected words and pull quotes.
- Body: Manrope/system, 16px minimum, line-height 1.55–1.7.
- H1: `clamp(3.25rem, 11vw, 9.5rem)`, line-height .86–.94, max measure 8 words per visual block.
- H2: `clamp(2.4rem, 6vw, 5.5rem)`, line-height .94–1.02.
- Labels: 11–13px, letter spacing .12em, uppercase only for metadata.
- Never use small muted text for essential meaning.

### Layout

- Container: max 1240px; padding 22px mobile, 36px tablet, 52px desktop.
- Grid: 12 columns desktop; 6 tablet; single-column mobile.
- Section spacing: 88px mobile, 128px tablet, 168px desktop.
- Rules: 1px solid `--soft-gray`; avoid boxed card grids unless grouping has a clear task.
- Radii: 0px for editorial panels, 2px inputs, 999px only for compact status/CTA pills.
- Shadows: avoid by default; use `0 18px 50px rgba(17,19,24,.08)` only for the registration panel if needed.
- Breakpoints: 640px, 900px, 1200px.

## 6. Components and states

- Header: VETTA wordmark, two anchor links, one CTA; no mega-navigation.
- Hero: eyebrow, H1, precise copy, session markers, form anchor.
- Section headings: eyebrow + title + short explanatory paragraph.
- Session path: paired Tuesday/Thursday blocks joined by the decision line.
- Matrix preview: real structure from the matrix data model, not a fake screenshot.
- FAQ: native button/region accordion with keyboard and reduced-motion behavior.
- Registration: labelled Name, WhatsApp, City, Country, consent checkbox; loading, validation, success, unavailable-cohort, and server-error states.
- Admin: dense and practical, no decorative dashboard chrome.

## 7. Forms and microcopy

- Labels remain visible; placeholders are examples only.
- Phone input uses country selection and E.164 normalization on the server.
- Consent for experience communications is required when collecting registration; future marketing is separate and optional.
- Success copy: `Tu registro está recibido.`
- Missing operational configuration must say `Configuración TEST pendiente`, never imply confirmed availability.
- Error messages name the fix and never blame the user.

## 8. Motion

- Purpose: guide attention between evaluating and deciding, acknowledge state changes, and make the form feel responsive.
- Allowed properties: `transform`, `opacity`; color changes may be immediate for semantic feedback.
- Timing: 180ms microinteraction, 360ms reveal, ease-out; no looping decorative animation.
- Trigger: load/viewport entry and direct interaction; never hide essential copy behind motion.
- Reduced motion: remove travel, stagger, and scroll-linked effects; preserve content and state feedback.
- Prohibited: scrolljacking, aggressive parallax, autoplay media, layout animation, or dependency-heavy effects.

## 9. Responsive and accessibility

- Mobile-first; preserve H1 readability and CTA visibility at 320px, 375px, 390px.
- Interactive targets aim for 44px; visible focus uses a 3px warm-text ring.
- Use landmarks, one H1, logical heading order, labelled controls, `aria-live` status, and error association.
- Check WCAG 2.2 AA contrast for every text pairing; use `--warm-text` instead of `--warm` for small text.
- Never communicate meaning through color alone.
- Admin and legal routes are noindex unless explicitly approved.

## 10. Voice and prohibited patterns

- Voice: direct, calm, specific, honest about uncertainty.
- Preferred verbs: evaluar, entender, comparar, decidir, reservar, confirmar.
- Prohibited claims: guaranteed income, ideal business, scarcity, fake capacity, invented proof, unverified credentials.
- Prohibited visuals: stock success imagery, cars, money, blue/purple SaaS gradients, generic icon-card grids, chatbots, fake counters.

## 11. Approved examples

- Hero: monumental H1 aligned left with an offset decision line and a visible integrated registration panel.
- Sessions: Tuesday and Thursday as two distinct editorial chapters joined by one line, not a calendar widget.
- Matrix: actual criteria labels and blank evaluation cells, with no invented scores.

## 12. Decisions pending

- [ ] Confirm first cohort dates, times, duration, and timezone owner.
- [ ] Confirm official WhatsApp number, group link, and meeting URLs.
- [ ] Confirm host identity, photo, and biography.
- [ ] Approve legal identity, privacy notice, terms, and retention period.
- [ ] Decide whether to self-host Manrope and Instrument Serif before production.
- [ ] Approve analytics destination and consent policy.

## 13. Current approved direction — Dark premium technology

This section supersedes the v1 editorial direction for the public landing. The previous decisions remain in this file as history and continue to govern `/matriz`, legal pages, and operational surfaces until explicitly updated.

### Visual thesis

VETTA presents a calm, high-precision decision environment: a dark product interface that lets a visitor experience the act of evaluating an opportunity before asking them to register. The signature move is the interactive opportunity evaluator in the hero, not decorative geometry.

### Tokens

| Token | Value | Use |
|---|---|---|
| `--vt-bg` | `#080B12` | page background |
| `--vt-surface` | `#121824` | raised sections and panels |
| `--vt-surface-2` | `#1A2230` | controls and form fields |
| `--vt-ink` | `#F8FAFC` | primary text |
| `--vt-muted` | `#A6B2C3` | secondary text and supporting copy |
| `--vt-accent` | `#5271FF` | primary CTA and active states |
| `--vt-cyan` | `#75D8E7` | emphasis, focus, status and progression |

### Typography

- Geist Sans is the only interface and display family.
- Geist Mono is reserved for compact technical labels and status metadata.
- No Instrument Serif, cursive display type, or decorative italic treatment.
- Hero display range: `clamp(3.45rem, 7.5vw, 7.3rem)` desktop and `clamp(3.45rem, 16vw, 5.4rem)` mobile.

### Layout and components

- Maximum content width: 1240px; desktop hero uses a 52/48 two-column grid.
- Mobile is intentionally recomposed into a short readable hero followed by the evaluator.
- The evaluator uses native tab buttons, local-only state, no score, no personal data, and no lead qualification.
- The matrix preview uses the same criteria and questions as `/matriz`; it is not a fabricated dashboard.
- The registration panel renders only when a configured open cohort and persistence-ready path exist. Otherwise it shows `Próxima edición en preparación.` without a false action.

### Motion

- Page entry and evaluator panel changes use opacity and transform only.
- Selection feedback is immediate in state and transitions over 220–300ms.
- No looping ambient animation, scrolljacking, parallax, or layout animation.
- `prefers-reduced-motion` removes travel and panel animation while preserving all content and state feedback.
## 14. Current public sales landing — approved execution direction

The public landing at `/` uses the approved `NO EMPRENDAS TODAVÍA.` sales direction. VETTA is an internal project name and must not appear in public landing copy, metadata or shareable content.

### Concrete visual system

- Background: `#F5F6F8`; white surfaces: `#FFFFFF`; ink: `#142238`; body text: `#35435A`; secondary text: `#617086`; action blue: `#2758E9`; hover: `#1746CD`; soft blue: `#EAF0FF`; gift dark: `#142238`; gift accent: `#F5C879`; border: `#E2E7EF`.
- Manrope is used for headings, CTAs and labels. Inter is used for paragraphs and form copy. No serif or decorative italic type.
- Rounded corners are 12–18px. Interactive controls are at least 54px high. Shadows are broad, soft and restrained.
- Desktop uses a 1200px content shell and a 52/48 hero split. Mobile is designed at 390px and 360px first, with the CTA inside the first viewport.

### Commercial architecture

The landing has exactly four commercial zones: hero, identification, the two-session masterclass, and the gift/closing. It contains no form. Every CTA points to `/registro`; `/registro` blocks honestly while the cohort is not open. `/confirmacion` is only unlocked after a successful persisted registration in the browser session.

### Visual assets and motion

The hero uses the original editorial photograph documented in `VETTA-IMAGE-SOURCES.md`. The gift uses a real-criteria HTML rendering of `/matriz` over an original tablet backdrop. Motion is limited to opacity/transform reveals, CTA feedback and sticky CTA visibility; content remains readable without animation and all transitions are disabled under `prefers-reduced-motion`.

### Rejected history

The former beige/terracotta editorial system, dark-tech prototype, and concept A/B pages remain historical or temporary references only. They are not to be reused for the public landing without explicit approval.
