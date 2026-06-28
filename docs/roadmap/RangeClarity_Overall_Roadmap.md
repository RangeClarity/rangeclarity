# RangeClarity — Overall Project Roadmap

**Editable source for `RangeClarity_Overall_Roadmap.pdf`.** Prepared Jun 20, 2026. Horizon: Jun 20 → Oct 10, 2026 (16 weeks; the 12-week core arc reaches a live private beta by Sep 12). Positioning: *Simple chart. Complex engine. No signals. No noise. Just structure.*

> Governing test for every phase: **"Can RangeClarity deliver enough real value to charge the first five customers?"** This roadmap is scored against that question — not feature count. Consistent with approved decisions D-002 (Whop-first), D-003 (direct paid beta), D-006 (Pine-first, canonical core).

---

## 1. Executive summary

RangeClarity already owns its hardest asset: a real, 465-line TradingView Pine indicator (`RangeClarity_Core.pine`). What is missing is not more product — it is **proof of value** and a **way to take money**. The landing page builds but converts nothing (its CTA posts to a dead `action="#"`). There is no payment, no access path, and the indicator is not yet validated on real charts.

**The bet:** sell the indicator *Pine-first* to five paying beta users. The web app stays marketing + access only. Defer auth, billing engines and the "website brain" until paying users prove the loop. Prioritise the one journey that turns a visitor into a verified paid user who immediately understands what they bought.

The 12-week arc: Wk 1 audit & lock → Wk 1–2 paid beta access loop → Wk 3–4 core product value → Wk 5–6 indicator polish → Wk 7–9 website brain foundation → Wk 10–12 private beta launch. Growth (Wk 13–16) extends beyond.

## 2. Product vision

RangeClarity turns a wall of charts into a short, ranked, explained list of the structures worth watching — a clean map on the chart, a clarity radar behind it. It answers four plain questions, per chart and across a watchlist:

- **What is the structure?** (bias: bullish / bearish / sideways / unclear)
- **Where are the levels that matter?** (Local / Key / Strong S/R + channel boundaries)
- **How far is price from them?** (distance to the levels that count)
- **Which charts are interesting now, and why?** (ranked across a watchlist)

For self-directed swing traders and watchlist-driven investors who think in structure, not signals. Philosophy: *simple visual, complex engine, clear context.* The indicator is the lens; the brain is the radar; restraint is the brand.

## 3. What RangeClarity is / is not

**IS:** a market-structure clarity system (chart overlay + clarity radar); a reader of range, bias, S/R, channel state, strength and score; a way to see which of your charts are at a decision point today; educational decision-*support*; deliberately narrow and premium; sold as a TradingView Pine indicator, invite-only, for a paid beta.

**IS NOT:** a buy/sell signal service; a prediction or probability-of-direction engine; a win-rate / target-stop / guaranteed-profit product; financial advice; a noisy RSI+MACD+VWAP+FVG+liquidity pile-up; crypto hype, generic SaaS, or trading-guru marketing.

**Language guardrail (non-negotiable):** no profit / win-rate / buy-sell / guarantee language anywhere — chart, scanner, brief, or marketing. The restraint is the moat.

## 4. Product architecture — one brain, two bodies

A single tested **canonical scoring core** (pivots → zones → score → bias → channel → events) defines the structure math. The Pine indicator and the web scanner are two implementations of it, kept honest by shared golden test vectors (parity by fixtures, not a shared runtime — divergence is the #1 architectural risk).

| Layer | Responsibility | Status |
|---|---|---|
| **TradingView Visual Layer** | On-chart Pine overlay: S/R tiers, soft channel, bias, distances, dashboard, alerts | Built · validating |
| **Website Brain / Canonical Core** | Tested scoring spec + server scanner over many symbols; ranks by clarity; stores history | Core: next (EN-1) · Scanner: Phase 4 |
| **Sync Layer** | TradingView alert webhooks → schema events; auth + dedup; additive | Post-beta |
| **Market Room** | Ranked, explained cards of charts worth watching today + daily clarity brief | Post-beta |
| **Hermes / AI Explanation** | Plain-language "why" from schema rows; templates first; no-advice guard | Post-beta |
| **Growth / Community Layer** | X content engine, demos, educational clarity posts, beta funnel | Phase 6 |

## 5. 12-week roadmap with exact dates

| Phase | Window (2026) | Mission |
|---|---|---|
| **P0 — Project Audit & Lock Direction** | Jun 20 – Jun 23 | Inspect repo, document current state, stop the redesign loop, lock the product promise. |
| **P1 — Paid Beta Access Loop** | Jun 24 – Jul 7 | Build the full journey: landing → register → sandbox payment → verified access → product entry. |
| **P2 — Core Product Value MVP** | Jul 8 – Jul 21 | Make value legible in seconds: clarity dashboard, watchlist sample, score/state explanation, TV onboarding. |
| **P3 — TradingView Indicator Polish** | Jul 22 – Aug 4 | Sharpen the visual layer: S/R tiers, strong zones, weak structure, range position, dashboard clarity. |
| **P4 — Website Brain Foundation** | Aug 5 – Aug 25 | Canonical logic outside Pine: watchlist, stored assets, scoring model, explanations, history, snapshots. |
| **P5 — Private Beta Launch** | Aug 26 – Sep 12 | Onboard the first paying users, collect structured feedback, validate willingness to pay. |
| **P6 — Growth System** | Sep 13 – Oct 10 | X content engine, demos, short videos, educational clarity posts, waitlist → beta conversion. |

## 6. Milestones by phase (exit gates)

A phase does not start until the prior gate is signed off. Gates are evidence, not calendar dates.

- **P0:** Signed-off current-state audit + one locked product promise; no open redesign debates.
- **P1:** A test user completes the loop end-to-end in sandbox and lands inside the beta area.
- **P2:** A new paid user understands what they bought and why it matters without a call.
- **P3:** Indicator passes the test matrix on 1D + 4H/1H; founder verdict "worth charging for".
- **P4:** Scanner reproduces indicator scores via shared fixtures (parity) over a sample universe.
- **P5:** First 5 paying users onboarded; feedback logged; renew/refund signal captured.
- **P6:** Repeatable weekly content + a measured top-of-funnel into the paid beta.

## 7. Dependency map

- **Two hard gates:** RC-6 (indicator validated) and O-002 (offer + price) gate the entire money path. Resolve both in week 1.
- **Critical path:** validate → stand up offer/access (RC-7) → point CTA (RC-8) → core value screen.
- **Convergence:** access loop + core value + indicator polish all converge on Private Beta (P5), the first revenue milestone.
- **Decoupled:** EN-1 (canonical core) seeds the website brain but is off the revenue critical path — start early, finish calmly.

## 8. Risk map

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Indicator isn't worth paying for | High | Critical | Validate (RC-6) before any spend; founder go/no-go gate |
| R2 | Chart/web divergence | Med | High | Shared golden fixtures enforce parity |
| R3 | Redesign loop reopens | Med | High | Direction locked in P0; O-003 stays closed |
| R4 | Price set wrong | Med | Med | Decide O-002 with the offer; revisit after beta feedback |
| R5 | No verified-access proof | High | Med | Explicit access-gate test in QA |
| R6 | Mobile/UX trust gaps | Low | Med | Device pass during polish |
| R9 | Scope creep into the brain | Med | Med | Now/Next/Later discipline; nothing promotes without demand |

Most risk is de-risked by **sequencing** — validate value and avoid building infrastructure before demand is proven.

## 9. Success metrics

| Metric | Baseline | Target (Beta) | Phase |
|---|---|---|---|
| Indicator validation coverage | 0 / 9 | ≥ 6 / 9 | P0–P3 |
| Paid-loop completion (sandbox) | no path | 100% | P1 |
| First paying customers | 0 | 5 | P5 |
| Activation (saw core value) | — | ≥ 80% | P2/P5 |
| Willingness to pay / retain | unknown | ≥ 3/5 renew intent | P5 |
| Top-of-funnel (growth) | 0 | weekly cadence | P6 |
| Time-to-value | — | < 5 min | P3 |

## 10. What not to build yet

Do **not** build (pre-validation): in-app Stripe/auth/entitlements for 5 users; a live-money payment path; the full Market Room / multi-ticker scanner; LLM Hermes explanations; another landing redesign; a licensed market-data feed / charting engine.

Build instead: proof the indicator is worth paying for; the one complete journey (land → register → sandbox pay → access → value); a core value screen a buyer grasps in < 5 minutes; honest docs + disclaimers; the canonical core spec + fixtures (quietly, in parallel).

## 11. Recommended team / freelancers

| Role | When | Load | Scope |
|---|---|---|---|
| Founder (product + GTM) | All | Lead | Offer, price, validation verdict, beta relationships, every go/no-go gate |
| Pine / quant developer | P0, P3, P4 | 0.4–0.6 FTE | Validate & polish indicator; co-author scoring spec + fixtures |
| Full-stack (Next.js/TS) | P1, P2, P4 | 0.5–0.8 FTE | Access loop, core value screen, Whop wiring, later scanner/brain |
| Product designer (contract) | P1–P2 | ~1 wk | Trust/comprehension polish only — no redesign |
| Technical writer (contract) | P2 | 2–3 days | Indicator guide, beta limits, disclaimers, "what this means" |
| Content / motion (contract) | P6 | part-time | X content, short demos, educational posts |

Leanest viable team: founder + one part-time full-stack who can also touch Pine; everything else contracted by the day. Hire the quant dev only after RC-6 confirms the indicator is worth investing in.

## 12. Budget sensitivity

| Tier | Monthly (to private beta) | What it buys |
|---|---|---|
| **Lean** | $0–0.6k | Founder builds, AI-assisted; Whop fees + domain + Vercel free; Discord free. Slower, founder-bound. |
| **Standard (recommended)** | $1.5–3k | Part-time full-stack contractor; day-rate design + writing; analytics/email/hosting paid tiers. Balanced. |
| **Premium** | $5–9k | Dedicated full-stack + quant dev; brand designer + content; brain built in parallel. Fastest, highest pre-revenue burn. |

**Recommendation — Standard.** Enough leverage to ship the access loop and value screen on schedule without burning premium money before five customers prove the bet. Step up to Premium *after* the beta validates willingness to pay.

## 13. Final recommendation — the sprint that matters most now

Run **Sprint 1 — Paid Beta Access Loop + Core Product Value (Jun 20 – Jul 7)**. Prove RangeClarity can be a real product, not a visual idea.

The one outcome: a user can land, understand the offer, register, complete a sandbox payment, receive verified access, and see one clear product-value screen. It needs no heavy infrastructure (Whop sandbox + invite-only access) and forces the two hard decisions (validation + price) to the front. Then, and only then: polish the indicator, build the website brain, and open the private beta — each behind its own evidence gate.

→ Full daily schedule and ship/no-ship checklist in **`RangeClarity_Next_Sprint_Taskbook.pdf`**.
