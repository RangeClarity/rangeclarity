# Prompt — Website / Mobile QA (RangeClarity)

Audit-only pass over the marketing surface. **Propose one safe fix batch; do not edit until Dean approves.**
No redesign, no new features, no Pine, no commit. Companion lens: `prompts/landing-page-qa.md`.

**In scope:** homepage `app/designs/rangeclarity-fox-brand-v1/page.tsx` (+ `foxBrandHero.module.css`),
beta `app/beta/page.tsx`, `app/beta/free-access/page.tsx` + `FreeAccessForm.tsx`, shared `app/beta/beta.module.css`, `app/globals.css`.

```
Run a Website/Mobile QA audit. Check at 390px, 430px, and desktop:
- too much text / weak first viewport
- unclear or competing CTAs
- spacing / overflow / broken responsive layout
- design mismatch (off-palette, inconsistent type scale)
- premium feel (does it look paid + invite-only?)
- heading outline (exactly one <h1> per page) and obvious a11y gaps
- likely console-error sources (missing keys, bad image props, client/server boundary)

Attempt `npm run health` and `npm run build`; if the environment can't run them, say so and tell Dean what to run locally.

Return:
A. Top 10 website/mobile issues (ranked, with file + line, honest severity)
B. Critical blockers (things that break render/build) — or "none found"
C. First safe fix batch ONLY (smallest useful changes; no redesign)
D. Exact files to edit
E. Acceptance criteria (incl. "npm run health green on host", no layout shift)
F. Ask approval before editing — make zero edits until Dean says go
```
