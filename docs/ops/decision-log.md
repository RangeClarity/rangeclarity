# RangeClarity Decision Log

> Ops-facing, append-only record of standing decisions. Documentation only.
> **Canonical approved decisions live in `docs/decisions.md`** (per `CLAUDE.md` source-of-truth hierarchy);
> this log mirrors the standing ones for the daily [command-center](./rangeclarity-command-center.md) view.
> Add new entries at the bottom with a date; do not silently rewrite settled ones.

| # | Decision | Why | Status |
|---|---|---|---|
| 1 | **RC Score is permission, not prediction.** | The product reads structure clarity; it does not forecast price. Protects the brand + compliance line. | ✅ Standing |
| 2 | **HighClarity must remain rare.** | High clarity is only for genuinely clean charts; common HighClarity = false confidence. | ✅ Standing |
| 3 | **No buy / sell / prediction language.** | Enforced by the copy guardrail (`npm run test`). "Structure & context, not advice." | ✅ Standing |
| 4 | **Pine is blocked until conviction improves.** | Pine must mirror a validated core, never lead it; avoids a second source of truth. | ⛔ Blocked (until GREEN) |
| 5 | **Broken-Zone A/B is blocked until ≥20 founder labels + baseline comparison.** | The A/B target needs a real truth signal; currently 15/40 labels. | ⛔ Blocked (labels <20) |
| 6 | **Deep Modules direction approved.** | Small stable interfaces, complexity hidden; "don't move mess around." | ✅ Approved |
| 7 | **Core scoring facade approved only if behavior-preserving.** | `score_window_input`→`RcVerdict` must be byte-identical (golden test: 1,767/1,767). | ✅ Approved (conditional) |
| 8 | **Broad refactors are blocked.** | Only small, safe, golden-tested steps; large moves need a PRD + founder approval. | ⛔ Blocked |
| 9 | **Payments / Lemon are isolated and not part of research work.** | Money + access stay behind `lib/payments`; never entangled with scoring/research. | ✅ Standing |

## New decisions (append below)
_(date — decision — why — status)_

## New decisions — 2026-06-27 (Recovery Sprint)
| # | Decision | Why | Status |
|---|---|---|---|
| 10 | **Vercel CTA fix = Route B (drop the `@vercel/analytics` dependency).** `lib/analytics.ts` no longer imports it; `rcTrack` is a browser-safe no-op wrapper. Shipped in `fd6e760`. | Smallest safe fix to green the preview without a package.json/lock change. | ✅ Done (pushed) |
| 11 | **Feedback-loop scripts are safe to commit as one group:** `package.json` + `scripts/test/run-tests.mjs` + `tests/playwright.config.ts` (+ `docs/ops/feedback-loops.md`). | No new dependencies (package-lock unchanged); `vitest`/`playwright` are opt-in, not wired into `health`/`verify`. | ✅ Approved-safe (commit locally) |
| 12 | **Recovery posture: land finished work in small reviewable groups; conviction stays RED.** No broad cleanup commits; no scoring/Pine/payment changes; founder labels to ≥20 before the review agent / A/B. | The bottleneck is order, not output — a ~638-file dirty tree hides shipped work. | ✅ Standing |
