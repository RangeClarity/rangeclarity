# RangeClarity — Review Pass & Cleaner Phase 1

**Date:** 2026-06-14
**Reviewer:** Claude (in-house pass). **Important:** the intended external Codex review output was **not present** in the project — only `Codex_REVIEW_REQUEST.md` (the prompt) existed. No `CODEX_REVIEW.md` or `CODEX_RECOMMENDED_CHANGES.md` was found. So this review was performed in-house against the same criteria. Nothing below is attributed to Codex.

---

## A. Executive verdict

**Ready for Phase 1 after a few small, optional refinements — none of which block planning.**

The master plan on disk is already strong and disciplined. It is State-led with the score demoted, the MVP is narrowed to the free Starter only, advanced modules (AVWAP, MTF, squeeze/VCP, alerts, Pro, Whop, backend) are explicitly deferred, pivots are non-repainting, pricing is a single $29 Pro Beta deferred until trust exists, and the compliance section is serious. This is not a plan that needs rescuing. The refinements below sharpen clarity and cut a little more, rather than adding anything.

---

## B. Top improvements (ranked)

1. **Hide the numeric Context Score in Starter.** A 0–100 number beside a chart reads as odds/a trade rating regardless of label — the biggest "is this a signal tool?" risk. Compute it internally; surface only State. *(Resolves Open Question 3. Applied as recommendation pending approval.)*
2. **Trim the dashboard from 13 rows to ~7.** Consolidate Support/Resistance to one line and distance%/range-position into a "Location" line; fold Momentum into State/Interpretation. Cleaner 10-second read, consistent with the plan's own "avoid too many rows."
3. **Define concrete 90-day validation targets** so the Pro go/no-go is evidence-based, not a feeling. Added illustrative thresholds for you to confirm.
4. **Make the trial decision decisive: money-back, not free trial** — invite-only TradingView access is awkward to time-box/revoke automatically.
5. **Capture Pine feasibility notes now** (non-repaint, confirmed HTF closes, single-table dashboard, object limits) so the build phase doesn't trip on known traps.
6. **Resolve the brand tension:** meme/internet-native tone (from the handoff) belongs in social content only; product UI/landing/disclosures stay calm and premium.
7. **Name relative strength as an explicit V1 deferral / Pro candidate** rather than leaving it silently absent — it's a Minervini signature, so its absence should be a stated choice.

## C. Critical risks (what could actually hurt the project)

- **Signal-perception creep** — a visible score, action-like labels, or "this will move" language pulls the product into the scam category it's differentiating against. The plan guards this well; keep guarding it.
- **Misleading support/resistance** — bad/overfit levels are worse than none. The edge-case handling is good; hold the line on "say so when levels aren't clean."
- **Building Pro before Starter is validated** — the top scope risk; the plan already gates this, the validation targets now make the gate measurable.
- **TradingView platform risk** — publishing/vendor rules and invite-only mechanics; confirm account tier and rules before Pro.
- **Compliance/advice perception** in Discord and marketing — handled by the operating rules; enforcement is the ongoing job.

## D. Overbuilt / unnecessary — keep deferred or reject

Already correctly deferred in the plan (do not pull forward): Pro build, Whop automation, AVWAP automation, multi-timeframe layers, squeeze/VCP, alerts, backend/DB/Supabase, accounts, AI, paid ads, multi-tier pricing, testimonials. **Reject these if proposed** as "improvements": volume-profile S/R for V1, multi-timeframe S/R confluence for V1, RS/benchmark in V1, AI chart interpretation, an analytics/Sentry stack pre-launch, a numeric score shown in Starter.

## E. Missing items (added in this pass)

- Concrete validation targets / Pro go-no-go gate.
- Pine feasibility/build-readiness notes.
- Explicit brand tone boundary (meme vs product).
- Explicit relative-strength deferral.
- A decisive trial recommendation.

## F. Alternative product strategy (refined, not replaced)

Keep the current strategy. The one sharpening: **lead with State, not score.** The product's promise is "read the chart in seconds and know your location and risk" — that is fully expressible as Bias + State + Location + Extension, with no number. Treating the score as private machinery (not a displayed output) is the cleanest expression of "no signals, just clarity," and it's a differentiator most indicator products won't copy because they rely on a number to look smart.

## G. Alternative indicator spec (cleanest v1)

Starter, Clean Mode only, single dashboard table, ~7 lines:

1. **Bias** — Bullish / Bearish / Neutral (descriptive)
2. **State** — Wait / Watch / Constructive / Strong Trend / Extended (with the plan's hard caps)
3. **Support / Resistance** — nearest zone below / nearest zone above (one line)
4. **Location** — dist-to-support %, dist-to-resistance %, position-in-range %
5. **Range Width %**
6. **Extension + Volume** — ATR-extension state (Normal/Stretched/Extended) + RVOL state (light/normal/elevated)
7. **Interpretation** — one plain-English sentence

On chart: EMA 50 + nearest support zone + nearest resistance zone. Nothing else by default. Score computed internally to set State; not displayed.

## H. Alternative dashboard UX (state model)

A small, honest state vocabulary beats a number:

- **Wait** — unclear / weak / poor location / insufficient data
- **Watch** — improving, not clean yet
- **Constructive** — reasonable trend + location (not a command)
- **Strong Trend** — strong trend *and* acceptable location
- **Extended** — trend may be strong but location carries chase risk

Plus explicit non-states: **Insufficient Data**, **Range Undefined**. Color used only for Bias/State, restrained, no arrows, no animation, stable row positions, "N/A" for missing values.

## I. Alternative go-to-market (first 30 days)

The plan's organic-first motion is right. Concrete first 30 days:

1. Recruit ~10 private feedback users (no public launch yet).
2. Finalize specs (this Phase 1).
3. Prepare the TradingView script description and the one-page landing copy (no build until specs approved).
4. Draft the first 3–5 educational chart-context breakdowns (no predictions) — the content engine, ready to fire at launch.
5. Reserve handles, stand up the Discord skeleton and waitlist form.

Fastest realistic path to 100 users: publish the free Starter → weekly chart-context breakdowns that *show the dashboard doing the work* → route to Discord + waitlist. No ads, no affiliates, no trade calls.

## J. Alternative pricing plan

Keep it. Starter free; **Pro Beta $29/month** when it exists; test $39 after retention is shown; annual deferred. **Trial = 7-day money-back guarantee, not a free trial** (invite-only access is hard to time-box). One paid plan at a time.

## K. Cleaner final Phase 1 plan (consolidated)

The master plan's P1-1…P1-10 is good but long. Consolidated to 7 build-ready steps (planning only, no code):

1. **Approve scope & decisions** — confirm Starter-only first launch and resolve the open questions (esp. score-in-Starter, state labels, EMA 200, RVOL/ATR thresholds).
2. **Finalize the Starter dashboard spec** — the ~7 rows, every label, and the internal score→State logic with hard caps.
3. **Finalize the S/R + distance rules** — pivots, clustering, zone display, formulas, and all edge-case behavior.
4. **Lock the dashboard wireframe** — one compact layout: row order, restrained color, N/A handling.
5. **Build the compliance kit** — banned/approved words, standard disclosure, Discord rules, TradingView description rules.
6. **Prepare launch assets (no build)** — landing copy outline, 20-chart manual test set with expected behavior, Discord structure, waitlist tool, accounts/handles.
7. **Approval gate** — go/no-go for Pine implementation.

## L. Final recommendation — exactly what to change before proceeding

Already applied to `RANGECLARITY_MASTER_PLAN.md` as **recommendations pending your approval** (revision 2): hide the numeric score in Starter, trim to ~7 rows, brand tone boundary, money-back over free trial, RS deferral, Pine feasibility notes, validation targets. **Your decisions needed:** (1) confirm hiding the score in Starter; (2) confirm the ~7-row layout; (3) confirm/adjust the validation targets; (4) confirm money-back vs trial. Once those four are confirmed, the plan is build-ready for Phase 1 and the next step is the detailed Starter spec — still no code until you approve the gate.

---

## Exactly what changed in this pass

All edits are in `RANGECLARITY_MASTER_PLAN.md` (now revision 2). Nothing else was built. Each substantive change is marked "(recommended, pending approval)" in the plan so you can accept or reverse it.

| # | Section | Change |
|---|---|---|
| 1 | Header | Added revision-2 note pointing to this review; flagged Codex output as unavailable |
| 2 | 3. Brand | Added "Tone boundary" — meme/internet-native is social-only; product stays premium |
| 3 | 6. Dashboard Rows | Trimmed 13 → ~7 consolidated rows; score not shown in Starter |
| 4 | 6. Context Score | Recommend computing internally and **not displaying the number** in Starter (resolves OQ3) |
| 5 | 6. Trend | Named relative strength as an explicit V1 deferral / Pro candidate |
| 6 | 8. Information Hierarchy | Updated to match the ~7-row layout; score removed from the top section |
| 7 | 11. Pricing/Trial | Made money-back guarantee the decisive V1 choice over a free trial, with rationale |
| 8 | 13. Technical Architecture | Added "Pine Feasibility Notes" (non-repaint, confirmed HTF closes, single-table, limits) |
| 9 | 14. Roadmap (61–90) | Added concrete validation targets gating the Pro go/no-go |
| 10 | 17. Open Questions | Sharpened Q3 with the score recommendation |
| 11 | 18. Decision Log | Logged the six pending-approval refinements separately from locked decisions |

**Not changed (deliberately):** core positioning, the State labels, the $29 pricing, the deferral list, the compliance section, the 30/60/90 structure. The plan's direction is sound; this pass refines, it does not redirect.

---

*Awaiting your approval. No code will be written until you approve the Phase 1 gate.*
