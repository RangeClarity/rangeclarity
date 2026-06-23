# RangeClarity — Project Memory

Canonical, compact project memory. Source of truth for the Command Center (`/command-center`).
Keep it short and current. Repo: `C:\Users\USER\Claude\Projects\RangeClarity` (the ONLY canonical checkout).

## North Star
- **Simple chart. Complex engine.**
- **No signals. No noise. Just structure.**
- **Clarity over noise.**
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
