---
name: visual-qa
description: Audit rendered pages with real browser captures across responsive viewports and accessibility checks.
---

# Visual QA

Test the rendered page at 390, 768 and 1440 px. Capture screenshots and inspect them visually; a successful build is not a visual approval. Check typography hierarchy, legibility, spacing, contrast, component consistency, image proportions, responsive reflow, button states, motion, reduced motion, content errors, accessibility and obvious performance regressions.

Verify every link and button. Ensure the checkout button is disabled or points to a verified Hotmart URL; never accept a fictitious URL. Ensure analytics does not emit `Purchase` before an external, confirmed purchase event. Record evidence in `qa/evidence.json` and list real limitations.
