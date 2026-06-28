# RC Continuous Improvement Loop — Current Status

> Single source of truth for *where the loop is right now*. Update this at the end of every pass
> (phase 8). Keep it short. Full process: `docs/ops/continuous-improvement-loop.md`.

_Last updated: 2026-06-23 — loop system installed (first pass not yet run by Dean)._

---

## Current loop phase
**Phase 0 → ready for first daily pass.** The loop (docs + prompts + `npm run health` with build) is in
place. Next action is Dean's first run of `docs/ops/daily-routine.md`.

## Last health result
⚠️ **Not validly runnable in this build environment — must be confirmed on your machine.**
The agent sandbox mount was intermittently serving **truncated/corrupted copies** of source files
(`package.json` arrived truncated to 935 bytes; `scripts/qa/run-qa.ts` and `app/designs/previous-pro/data.ts`
were flagged with phantom syntax errors but verified complete and clean via the host file view). The
`health` script itself is correct and Node-parseable. **Run `npm run health` on your machine for the real
baseline** (after `npm install`, which provides `tsx` for `qa:rc`).
- Indicator QA (`qa:rc`) logic was verified separately: real-output fixtures are finding-free; only
  intentional `sentinel-*` fixtures fire. See `docs/qa/live-qa-report.md`.

## Current top issue
**Confirm a green `npm run health` baseline on the host.** The whole loop depends on a trustworthy
green/red signal, so this comes before any cosmetic fix.

## Next Claude task
_To be set from the first Codex critique (section F) — exactly one issue._
Suggested first issue once health is confirmed green: a **landing first-viewport tightening** on
`app/designs/rangeclarity-fox-brand-v1/page.tsx` (reduce copy / strengthen the opener) — smallest useful
change, no redesign. Let Codex confirm before starting.

## Next Codex review task
Run `prompts/codex-daily-critic.md` for the first full A–G critique. Feed it `git status`, the planning
docs, `docs/qa/live-qa-report.md`, the Fox homepage, and the beta/free-access flow.

## Founder decision needed
1. Run `npm install` then `npm run health` on your machine — is the baseline **green**? If red, that red is issue #1.
2. After the first Codex critique, **pick the one issue** (section F) to hand Claude.

---

## Candidate issues (top 3 only — replace each pass)
_Populate from the Website check + Codex critique. Keep to three; the rest wait._
1. _(tbd)_
2. _(tbd)_
3. _(tbd)_

## WIP guard
**In flight: 0 / 1.** Do not start a second fix until the current one is approved and logged.
