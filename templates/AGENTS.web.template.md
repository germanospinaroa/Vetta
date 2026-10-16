# Web project guidance

- Read `DESIGN.md` before designing or changing UI; treat it as the visual authority.
- Respect the existing stack and versions; do not migrate without explicit scope.
- Preserve user changes and inspect `git status` before editing.
- Use strict TypeScript when the project supports it.
- Never expose secrets or credentials in client code, logs, tests, or committed files.
- Justify new dependencies and prefer existing project capabilities.
- Maintain semantic HTML, keyboard access, visible focus, contrast, and reduced motion.
- Design mobile-first and test real responsive states.
- Implement loading, empty, success, and error states where the flow can reach them.
- Prefer reusable components with clear responsibilities.
- Run relevant lint, typecheck, tests, build, browser QA, and diff checks before finishing.
- Do not publish or perform real external actions without explicit authorization.
- Do not claim a check passed unless it was actually verified.
