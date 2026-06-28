# RangeClarity — Project Memory

Canonical, compact project memory. Source of truth for the Command Center (`/command-center`).
Keep it short and current. Repo: `C:\Users\USER\Claude\Projects\RangeClarity` (the ONLY canonical checkout).

## North Star
- **Simple chart. Complex engine.**
- **No signals. No noise. Just structure.**
- **Clarity over noise.**
- **Daily operating question:** does this move RangeClarity closer to 10 qualified beta users without increasing false confidence?
- Pine / TradingView indicator first; the website supports beta access, onboarding, and product clarity.

## Product language
**Allowed:** market structure · clarity · range · location · zones · structure quality · extension · trend · context · visual verdict.
**Forbidden (directive / hype):** buy · sell · entry · exit · wait · avoid chase · pullback zone · breakout watch · conviction · win-rate · profit · prediction · guaranteed · financial advice.
Every pricing / CTA / compliance block carries: *structure & context tools only — no signals, no prediction, not financial advice.*

## Pricing (current)
- **RangeClarity Beta — $29/mo**
- **RangeClarity Pro Beta — $49/mo** (adds Investor Research Lab)
- Checkout: configured via env (payment provider = `manual` default; `LEMONSQUEEZY_*` if enabled — see `.env.example`). **Live links live in env / Vercel, never committed.** Confirm they're set in the canonical repo (see `founder-decision-queue.md`).

## Integrations posture
- Linear / GitHub: **read-only or deferred** until auth / gating exists. Do not write to Linear. Do not expose Linear issue data publicly.

## Do not touch (during web / ops work)
- Pine logic (`pine/rangeclarity_sr_core_v1.pine`)
- Public homepage / beta pages redesign
- Payment / Lemon checkout behavior
- No external APIs · no LangSmith / OpenAI SDK · no Linear writes · no git mutations from UI or automation

## Current operating priority — workspace recovery (2026-06-25) [Hermes update]
- **P0:** Workspace Alignment & Path Reconciliation in the canonical repo: `C:\Users\USER\Claude\Projects\RangeClarity`.
- **Track order:** (1) confirm canonical repo and branch; (2) verify visual review artifacts; (3) verify founder labeling files; (4) founder labels `clean_but_capped` only after paths are verified; (5) only after labels, decide Broken Zone A/B; (6) website QA remains paused until repo/branch drift is resolved; (7) revenue track stays visible daily: content, waitlist, and first 10 beta users.
- **Research signal remains:** Real Baseline v1 (frozen): 19/20 symbols, **1,767 windows, 0 Clear / 0 HighClarity**. Primary culprit appears to be **broken-zone semantics**, not just `agree3`. Detail: `docs/research/rc1-real-data-visual-review-v1.md`.
- **Founder labeling is paused** until visual review paths are verified. After reconciliation is accepted, use `research/reports/visual_review/founder_review_charts.html` and `research/reports/visual_review/founder_review_priority.csv`.
- **Website QA and web commits are paused** until branch/workspace drift is resolved.
- **Blocked:** Broken Zone A/B until founder labels exist; Pine; scoring/cap changes; `agree3` loosening; payment/Lemon; push; external Linear/Hermes sync while local source of truth is unstable.
