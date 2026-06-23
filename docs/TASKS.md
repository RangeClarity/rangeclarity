# Tasks

Phased task tracker for RangeClarity. We work one phase at a time and do not
jump ahead.

## Phase 0 - Foundation

- [x] Choose app type, stack, and first-step scope
- [x] Tooling config (`package.json`, `tsconfig.json`, `next.config.mjs`,
  ESLint, `.gitignore`, `.env.example`, `.nvmrc`)
- [x] Minimal App Router skeleton (`app/layout.tsx`, `app/page.tsx`,
  `app/globals.css`)
- [x] Core docs (`README.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md`)
- [x] Product brief / master action plan - see
  [rangeclarity-master-action-plan.md](rangeclarity-master-action-plan.md)
- [x] First landing/waitlist slice (`app/page.tsx`, `components/*`,
  `app/api/waitlist`, `lib/waitlist.ts`)
- [x] Basic Terms and Privacy pages for the public waitlist flow
- [ ] Initialize git locally. The current `.git/` folder is partial/corrupt;
  delete it, then run `git init && git add -A && git commit -m "chore: scaffold foundation"`.
- [ ] Verify locally: `npm install`, then `npm run dev` starts and the page
  renders

## Master Action Plan

The central product/strategy/execution source of truth is
[rangeclarity-master-action-plan.md](rangeclarity-master-action-plan.md). Older planning docs are supporting context only.

## Phase 1 - Planning & Foundation Gate

The web landing/waitlist slice now exists, but Pine Script, Pro access, payments,
accounts, Discord automation, and backend automation remain deferred.

**2026-06-23 strategy update:** The new build direction is
**Simple Surface + Complex Engine**. Interpret "most viewed indicator" as the
most useful, calm, screenshot-friendly daily chart-reading companion, not the
loudest or most signal-like indicator. The first feature upgrade remains
Location Context / Distance-to-Key-Zone, but only after the visible product
shape and simple surface are locked. See [kanban.md](kanban.md).

- [x] P1-1 Complete strategic review of Volume / Liquidity Confirmation proposal
- [x] P1-2 Record decision: no volume engine in MVP
- [x] P1-3 Complete product critique and choose Location Context as the first feature upgrade
- [ ] P1-4 Phase 0 Product Shape Lock
- [ ] P1-5 Phase 1 Simple Surface Spec
- [ ] P1-6 Phase 2 Complex Engine Spec
- [ ] P1-7 Phase 3 Location Context First Implementation Spec
- [ ] P1-8 Phase 4 Pine Architecture Gate
- [ ] P1-9 Phase 5 Controlled Pine Build, blocked until founder approval
- [ ] P1-10 Phase 6 Visual Polish + Screenshot QA
- [ ] P1-11 Phase 7 Validation + Beta Readiness

## Current Next 5 Priorities

1. Phase 0 Product Shape Lock
2. Phase 1 Simple Surface Spec
3. Phase 2 Complex Engine Spec
4. Phase 3 Location Context First Implementation Spec
5. Phase 4 Pine Architecture Gate

## Parked / Rejected For MVP

- Full Volume / Liquidity Confirmation Engine
- Volume at 15% of RC Score
- Statistical RVOL
- VWMA conviction
- Absorption/rejection labels
- Breakout participation scoring
- Volume-at-price binning
- Complex MTF dashboard
- AI commentary
- Signal-like dashboard rows
- Extra visible oscillators or overlays
- Price targets
- Prediction copy

## Notes

- Dependencies are installed in the active project folder and `package-lock.json`
  is present. Commit it when the repository is initialized.
- Keep changes minimal and update this file after each meaningful change.
- Do not modify Pine code while this phase remains planning-only unless the
  founder explicitly approves an implementation pass.
