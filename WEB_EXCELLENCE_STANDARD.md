# Web Excellence Standard for Codex

Version: 1.2.0 · audited 2026-10-16 · scope: personal Codex skills, native ECC plugin, reusable project templates, and controlled fixture verification

## Purpose

This standard coordinates business understanding, proportional architecture, visual direction, `DESIGN.md`, implementation, purposeful motion, UX/accessibility/performance/SEO audits, browser QA, and production gates. It is a routing system, not a requirement to activate every skill for every request.

## Initial audit

Codex is running on Linux with Node `v22.22.2`, npm `10.9.7`, Python `3.12.3`, Google Chrome, and no pnpm. The workspace was empty and had no user files to preserve. Codex skills are discoverable from `/config/.codex/skills`; the environment also exposes `/config/.agents/skills` and installed plugin caches. The official OpenAI skill format is a folder with `SKILL.md` frontmatter (`name`, `description`), optional `agents/openai.yaml`, references, scripts, and assets. `AGENTS.md` is project-scoped guidance and should remain concise.

## Capability decisions

| Capability | Tool chosen | Alternatives discarded | Reason |
|---|---|---|---|
| Coordinator | `web-excellence` | one giant prompt | Selective routing and explicit gates |
| Visual intelligence | adapted `ui-ux-pro-max` | Claude plugin install | Official repo has a Codex initializer, but local adaptation avoids global npm and rewrites Claude paths |
| UI audit | Vercel `web-design-guidelines` | duplicate accessibility skills | Official, focused, framework-agnostic guidance |
| React/Next performance | Vercel `react-best-practices` | generic frontend rules | Official Vercel rules with references; only for React/Next |
| Motion | `web-motion-quality` | GSAP by default; copied Claude skill | CSS/Motion first, reduced motion and source attribution |
| Architecture | `web-product-architecture` | full The Architect plugin | Compact Codex workflow, proportional to project size |
| SEO/AEO/GEO | `web-seo-aeo-audit` | `claude-seo-ai` plugin | Audit-only adaptation avoids Claude hooks, credentials, adapters, and publishing |
| Browser QA | existing Codex Playwright/browser skills + Chrome | global Playwright; Agent Browser | Existing capability; avoid redundant global installs |
| External crawl check | Is Agentic, optional post-deploy | local-only QA | Requires a public URL; complementary only |
| Prototyping workspace | OpenDesign, optional | core installation | Apache-2.0 but Node ~24, pnpm 10, large multi-app workspace and persistent services |
| Component libraries | per project | global install | shadcn/ui/Motion/etc. are project decisions, not global runtime dependencies |

## ECC integration

ECC is already installed natively and reused; no second installation was performed.

| Field | Verified value |
|---|---|
| Repository | `https://github.com/affaan-m/ECC.git` |
| License | MIT |
| Version | `2.2.3` |
| Source revision | `76aaa77df6adc5b889e689007bf99b9a4f74af34` |
| Plugin id | `ecc@ecc` |
| Installed path | `/config/.codex/plugins/cache/ecc/ecc/2.2.3` |
| Marketplace snapshot | `/config/.codex/.tmp/marketplaces/ecc` |
| Marketplace source | `https://github.com/affaan-m/ECC.git` |
| Codex | `codex-cli 0.161.0` |
| Native plugin state | installed and enabled |
| Legacy sync | not used |
| Native hook | one `SessionStart` bootstrap, inspected and already trusted |
| Codex roles | `explorer`, `reviewer`, `docs_researcher` |
| Personal concurrency baseline | `multi_agent = true`, `max_threads = 2`, `max_depth = 1` |
| Config backup | `/config/.codex/config.toml.bak-20261016` |

The ECC plugin manifest declares skills, an MCP configuration, and a Codex-specific hook projection. Its cache check passed. ECC's repository currently exposes a large catalog and specialized agents; `web-excellence` routes only the web-relevant lanes documented in [ecc-integration.md](</config/.codex/skills/web-excellence/references/ecc-integration.md>). ECC does not override `DESIGN.md`, approved commercial content, or architecture decisions.

### Coordinated workflow

`DEFINITION → ARCHITECTURE → DIRECCIÓN VISUAL → IMPLEMENTACIÓN → REVIEW INDEPENDIENTE → QA → CORRECCIÓN → VERIFICACIÓN FINAL`

Use one agent for simple tasks. Use at most two concurrent subagents by default for independent work. Review agents are read-only by default. No concurrent writers may touch the same files. Use worktrees only when separate code writers are justified. The coordinator owns integration and the final diff.

### ECC lanes selected

- Architecture/data: registered role `explorer` with `code-explorer` first, then `architect`, `code-architect`, `backend-patterns`, `architecture-decision-records` guidance.
- Visual engineering: registered role `explorer`/`reviewer` with `frontend-design-direction`, `frontend-a11y`; `web-excellence` remains authoritative for visual identity.
- React/Next implementation: `react-patterns`, `frontend-patterns`, `tdd-workflow` when proportional.
- Review: registered role `reviewer` with `react-reviewer`, `typescript-reviewer`, `code-reviewer`.
- Security/performance: `security-reviewer`, `security-review`, `performance-optimizer`.
- Research/docs: registered role `docs_researcher` with `docs-lookup`, `documentation-lookup`, `deep-research`.
- Browser QA: registered role `reviewer` with `browser-qa`, `e2e-testing`, `e2e-runner`, using existing Codex/Playwright/Chrome fallback.
- Final verification: `verification-loop`.

Duplications are intentionally resolved in favor of the narrower owner: Vercel's skills remain primary for general UI and React performance; ECC fills React-specific review, security, testing, architecture, and verification gaps.

## Installed as core

Global Codex skills:

- `/config/.codex/skills/web-excellence`
- `/config/.codex/skills/ui-ux-pro-max`
- `/config/.codex/skills/web-design-guidelines`
- `/config/.codex/skills/react-best-practices`
- `/config/.codex/skills/web-motion-quality`
- `/config/.codex/skills/web-seo-aeo-audit`
- `/config/.codex/skills/web-product-architecture`

The Vercel skills were installed from `vercel-labs/agent-skills` commit `063bee94c3f4df8453406c830b0a7df0f2860278` (shallow audit clone on 2026-10-16). UI/UX Pro Max was adapted from `nextlevelbuilder/ui-ux-pro-max-skill` commit `56ea9cf174ed86786187daa9de0e6247cb0747e4`, retaining its MIT license and local data/scripts. The custom skills contain original Codex routing guidance and source attribution, not copied Claude commands.

## Optional and per-project

- Use the existing Playwright/browser skills when a project has them. If a project needs E2E and has none, add Playwright to that project only after inspecting its package manager and scripts.
- Use Motion only when a real interaction benefits from it; choose the project's existing CSS/Motion capability.
- Use shadcn/ui as a structural base only when the project chooses it. Choose at most one expressive component library and adapt it to `DESIGN.md`; review license, accessibility, responsive behavior, and bundle cost.
- Keep Magic UI, Motion Primitives, 21st.dev, Aceternity UI, Uiverse, and 3dicons as documented project options, not global dependencies.
- Use Is Agentic only after deployment and only as a secondary crawler/agent signal.

## Not installed

`claude-webkit` was not installed because it is a Claude-oriented bundle; only its motion principles and attribution were inspected. `claude-seo-ai` was not installed because it includes Claude hooks/adapters and optional credentials/write paths; its audit ideas were adapted safely. `the-architect` was not installed because its plugin, `CLAUDE.md`, commands, agents, and large knowledge tree are more than Codex needs; useful discovery/scope/risk/verification concepts are in `web-product-architecture`. `open-design` was not installed: inspected version `0.25.1` declares Node `~24`, pnpm `>=10.33.2 <11`, and a large local-first application; the environment has Node 22 and no pnpm, so installation would require a toolchain change and add a persistent application. Vercel Agent Browser was not installed because browser capability already exists. ECC was not newly installed because native `ecc@ecc` 2.2.3 was already present and enabled; the legacy `scripts/sync-ecc-to-codex.sh` path was deliberately not used. No global npm packages were added.

## Workflow

1. Recover repository context and classify the project.
2. Define brief, routes, content, constraints, non-goals, metrics, and acceptance criteria.
3. Create/review concrete `DESIGN.md`; it overrides generic recommendations.
4. Prototype the highest-risk page/flow at mobile and desktop sizes.
5. Implement semantic, reusable, accessible UI and complete states.
6. Run only relevant audits: UI/UX, design guidelines, React/Next, motion, SEO.
7. Run lint/typecheck/tests/build, browser QA, responsive and keyboard checks, console/link/overflow checks, diff and secret review.
8. Apply production gates and obtain explicit authorization before publishing.

For ECC-enabled work, insert an independent review and QA phase after implementation. Do not activate all ECC skills automatically.

## Quality gates

### Visual

The UI follows `DESIGN.md`, has clear hierarchy, coherent typography/spacing, an identifiable primary CTA, intentional imagery, and real responsive behavior.

### Experience

Navigation is understandable; forms have labels, help, validation, and recovery; feedback is clear; loading/empty/success/error states exist; keyboard and visible focus work; reduced motion remains usable.

### Technical

Lint, typecheck, tests, and build pass; console has no unexpected errors; client code has no secrets; links/routes work; no accidental overflow or hidden content; images/fonts are reasonably optimized; performance findings are evidence-based.

### Commercial

Value proposition and CTA are specific and congruent; claims are supportable; conversion events are defined only when authorized.

### Production

Correct URL and variables are verified without exposing values; migrations/security/build/critical flows are checked; metadata, favicon, robots, sitemap, canonical and legal pages are coherent; analytics is authorized; rollback is understood.

## ECC audit and test evidence

Security note: the audit found a pre-existing `API_KEY` setting in `/config/.codex/config.toml` under an existing MCP configuration. Its value was not disclosed or changed. The integration is installed and technically verified, but the personal environment is not security-clean until its owner rotates/revokes that credential and moves it to a supported secret mechanism. This standard did not create or expose the value.

- `codex-cli 0.161.0` verified.
- `codex plugin list --json` reports `ecc@ecc` version `2.2.3`, installed and enabled.
- `codex plugin marketplace list` reports marketplace `ecc` at `/config/.codex/.tmp/marketplaces/ecc`.
- ECC `node scripts/codex/check-plugin-cache.js` passed: skills, MCP manifest, icon, and logo resolve.
- ECC catalog, install profiles, component metadata, selected skills, agents, manifest, license, and Codex hook were inspected.
- Native plugin registration was not duplicated; no legacy sync was run.
- Two independent read-only native subagents were spawned to map ECC roles and detect web-excellence conflicts. A third read-only subagent reviewed the resulting integration and its findings were corrected before completion.
- The role roster and routing policy were updated from that evidence; the reviewer findings about a missing local `frontend-design` route were rejected because `/config/.codex/skills/frontend-design` exists and passed the prior audit.
- A controlled temporary landing fixture was implemented by one scoped subagent and reviewed independently by another. The fixture passed lint, typecheck, contract tests, build, Chrome loading at desktop/mobile sizes, no-overflow checks, invalid/valid form-flow checks through Chrome DevTools Protocol, and reduced-motion emulation. The fixture was removed after verification; no VETTA files were touched.
- The independent review found and the coordinator corrected missing `aria-describedby` on the name field, small-text contrast, motion-contract drift, and a prohibited decorative gradient. The review also recorded that the fixture's lightweight tests are contract tests rather than a substitute for a full browser test runner.
- Hook execution was not re-enabled or modified. The existing `SessionStart` hook was inspected and remains classified as installed with a recorded trust hash; this setup did not perform a fresh approval.

## Update procedure

1. Read current upstream docs and repository history.
2. Inspect license, diff, dependencies, scripts, and Claude-specific assumptions.
3. Clone to a temporary directory and pin a commit.
4. Back up any existing skill before changing it; merge rather than overwrite.
5. Run each skill's validator, the offline smoke test, and a fixture audit.
6. Record commit, date, behavioral changes, and risks here.
7. Restart Codex after adding/updating skills so discovery refreshes.
8. For ECC, run `codex plugin marketplace upgrade ecc` followed by `codex plugin add ecc@ecc` only after reviewing the new diff and release notes. Never combine native installation with legacy sync.

## Uninstall procedure

Remove only the listed skill directories after confirming they were created by this standard: `/config/.codex/skills/web-excellence`, `ui-ux-pro-max`, `web-design-guidelines`, `react-best-practices`, `web-motion-quality`, `web-seo-aeo-audit`, and `web-product-architecture`. To remove ECC, first disable/remove `ecc@ecc` through Codex's native plugin commands and only then remove its marketplace if no other plugin uses it; do not delete cache directories manually. Do not remove the system skills, project files, or user changes. The original audit repositories remain outside the workspace.

## Licenses and attribution

The Vercel skills identify Vercel and include their upstream license metadata; UI/UX Pro Max retains its upstream MIT `LICENSE`. The custom skills are original adaptations and cite inspected upstream sources in their bodies and this document. The Architect is MIT; OpenDesign is Apache-2.0. Always re-check upstream notices before redistributing a copied asset or rule file.

## Limitations

Skills cannot prove subjective visual quality from source alone, cannot guarantee rankings or AI citations, cannot replace human brand/legal review, and cannot verify production state without an authorized URL/environment. Browser QA in this environment has Chrome but no project-specific fixture yet. The initial fixture tests skill discovery and artifacts offline; it is not a substitute for a real app's lint/build/E2E suite.

## Short prompts

- Create: `Aplica web-excellence a este proyecto nuevo. Define brief y arquitectura proporcional, crea DESIGN.md, prototipa el flujo de mayor riesgo y construye con gates verificables.`
- Redesign: `Aplica web-excellence a esta web existente. Preserva cambios y stack, audita primero, revisa DESIGN.md y rediseña solo el alcance acordado.`
- Audit: `Audita esta web con web-design-guidelines y las skills pertinentes. No cambies nada hasta mostrar hallazgos con severidad, archivo, ubicación, impacto y corrección.`
- Performance: `Detecta el framework/versión real y revisa React/Next con react-best-practices. Separa críticos de opcionales y verifica cada cambio con typecheck, tests y build.`
- QA: `Haz browser QA como usuario real en móvil y escritorio: rutas críticas, teclado, formularios, estados, consola, enlaces, overflow y evidencia. No uses credenciales ni acciones reales.`
- Launch: `Ejecuta los gates técnicos, SEO y producción. No publiques; informa qué falta y pide autorización explícita si todo está listo.`
