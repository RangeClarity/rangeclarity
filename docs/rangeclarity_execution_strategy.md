# RangeClarity — Execution Strategy (sequence · estimates · risks · next actions)

Status: planning. Consolidates Stages 2–5: the recommended development order (with a challenge to the founder's instinct), resource/time estimates, risk analysis, and the immediate next actions. Pairs with the roadmap and 12-week plan.

---

## Stage 2 — Recommended development sequence

**Founder's instinct (1→8):** stabilize S/R → channel → shared schema → website scanner → Market Room/Radar → TV webhooks → Hermes → closed beta.

**Verdict: the order is right. Two adjustments, no overcomplication.**

1. **Stabilize & verify the S/R indicator** (compile + manual TV). *Keep first.*
2. **Verify the Soft Structure Channel** (it's already implemented; verify/tune, don't rebuild). *Keep.*
3. **Freeze the shared schema AND its golden test vectors — together.** *Adjustment A:* don't treat "shared schema" as docs only; pin it with hand-checked fixtures **before** any scanner code. The schema is the contract that keeps the chart and the website from diverging — the single biggest technical risk. Fixtures are the enforcement.
4. **Build the scanner as a port of a canonical core, parity-gated.** *Adjustment B:* don't write "similar" metrics on the website — re-implement the **same** spec and gate it with the week-3 fixtures. "Similar" silently diverges; "same, tested" stays trustworthy.
5. **Market Room / Watchlist Radar** (ranking + explanations + daily brief).
6. **TradingView webhooks** — *after* the scanner works. The scanner alone powers the MVP; webhooks are enrichment, so they come after Market Room is useful (lower risk if delayed).
7. **Hermes/AI explanations** — last, and constrained. Start with deterministic templates in M6; add LLM phrasing only once the schema/UI are stable.
8. **Closed beta.**

Net: same 8 steps, but **schema+fixtures fused (step 3)** and **scanner defined as a parity-gated port (step 4)**. That's the difference between a system that stays coherent and one that quietly drifts.

Sequencing principles: indicator stays primary; parity before features; one demo per week; cut rather than cram.

---

## Stage 3 — Time & resource estimates

Baseline = quality-first, sustainable pace. "Internal alpha" = scanner + Market Room usable by the founder (≈M6). "Closed beta" = M10. "Public beta" = M11.

### Scenario A — Solo founder + Claude Code/Codex (current)
- Internal alpha: **7–8 weeks** · Closed beta: **11–12 weeks** · Public beta: **15–18 weeks**.
- Biggest bottlenecks: founder time for manual TV testing + decisions; data-provider licensing; design polish; context-switching between Pine and web.
- Outsource: nothing yet (keep the loop in-house until validated).
- Don't outsource: the schema, the canonical core, and ranking logic — they're the product.

### Scenario B — + freelance frontend designer
- Internal alpha: **6–7 weeks** · Closed beta: **9–10 weeks** · Public beta: **12–14 weeks**.
- Bottleneck shifts to backend/data + parity. Design accelerates Market Room/landing and lifts the premium feel.
- Outsource: Market Room visual system, landing page, onboarding UI (RC-050/051/052).
- Don't outsource: schema, core, ranking, explanation guardrail.

### Scenario C — + backend/data freelancer
- Internal alpha: **5–6 weeks** · Closed beta: **8–9 weeks** · Public beta: **11–13 weeks**.
- Bottleneck shifts to parity verification + product judgment (ranking quality).
- Outsource: data adapter, DB/infra, webhook receiver, scanner batch plumbing (RC-031/033/034/039/041).
- Don't outsource: the canonical core itself and the fixtures (founder/Claude own correctness).

### Scenario D — + Pine Script reviewer
- Mostly de-risks M1–M3 quality (doesn't shorten the web build much): Internal alpha ≈ **same**, but **higher confidence** the indicator/schema are correct, fewer reworks later.
- Outsource: Pine code review, edge-case hunting, non-repaint audit (RC-011).
- Don't outsource: product scope decisions (what the indicator must *not* do).

**Most leverage for least money:** a Pine reviewer (correctness insurance now) + a part-time frontend designer (premium feel + speed on Market Room/landing). A backend freelancer helps most once the schema is frozen and parity is proven (after week 4–5).

---

## Stage 4 — Risk analysis (with mitigations)

1. **Pine limitations** (object caps, no imports, confirmed-pivot lag, single-TF). → Keep the indicator scope tight; pooled drawings; accept disclosed lag; push heavy logic to the scanner, not Pine.
2. **Website and Pine logic diverging** *(highest technical risk)*. → One canonical spec + **golden test vectors** that gate both; schema versioned; parity spot-checks every scanner change.
3. **Too much visual clutter.** → Restraint is the brand: boxes rare, channel subtle/off-able, no on-chart channel labels; weekly "is this still clean?" gate.
4. **Scanner data quality** (bad/late/adjusted data, splits, gaps). → Reputable provider with clear terms; handle splits/adjustments; cache; validate inputs; EOD daily first.
5. **False confidence from scoring.** → `rangeClarityScore` is framed as *attention/clarity*, never direction/probability; always show the *reason*; no win-rate claims.
6. **Legal / compliance / investment-advice language.** → No advice anywhere; describe structure only; legal review of public copy; guardrail + eval on AI text; consistent disclaimers.
7. **Overbuilding before validation.** → Milestone gates; "do not build yet" list; validate the M5–M7 loop with real use before SaaS plumbing.
8. **Weak onboarding.** → Treat onboarding as a feature (RC-042/052); cold-run test before invites; first "aha" in <2 min.
9. **No user retention loop.** → The **daily brief** is the retention hypothesis; instrument it; if users don't return, fix the loop before scaling.
10. **Too many features too early.** → WIP ≤ 2; one demo per week; defer MTF/intraday/OB/FVG/liquidity/social explicitly.

Cross-cutting: **founder-time concentration** (solo) → protect deep-work blocks, let Claude Code carry implementation, batch TV testing.

---

## Stage 5 — Immediate next actions

### The next 10 tasks (in order)
1. **Compile-test the indicator in the TradingView Pine Editor**; fix any errors (RC-010).
2. **Run the 10-symbol manual chart test**; log clean/cluttered/empty per symbol.
3. **Tune the Soft Structure Channel** from those screenshots (parallel tol / width cap / min quality).
4. **Codex review** of the channel logic + a no-advice language sweep (RC-011).
5. **Freeze shared schema v0.1** (`rangeclarity_shared_signal_schema.md`) (RC-020).
6. **Map every alert → eventType + define the JSON alert body** (RC-021).
7. **Capture 8–12 golden test vectors** (hand-checked input→expected) (RC-022).
8. **Define rangeClarityScore v1** (clarity score, documented) (RC-023).
9. **Decide the stack + data provider** (DB/hosting/data; licensing + cost) (RC-030).
10. **Scaffold `core/` (canonical spec) + `app/api/` stubs + DB tables** (RC-031/032).

### First 3 tasks for Claude Code
1. Freeze schema v0.1 + alert→event mapping + JSON alert body (RC-020/021) — docs/spec only.
2. Author the golden test-vector fixtures from hand-checked TV readings (RC-022).
3. Scaffold the TS canonical-core module + fixture runner (no scanning yet) (RC-032).

### First 3 tasks for Codex review
1. Review the **Pine channel + S/R logic** for correctness, repaint, and Pine pitfalls (RC-011).
2. Review the **shared schema v0.1** for completeness, enum stability, and any advice-leaning fields (RC-020).
3. Review the **rangeClarityScore definition** — confirm it's clarity/attention, not a disguised direction signal (RC-023).

### First 10 manual chart tests (daily timeframe)
BTCUSD, VRT, INOD, MELI, TSCO, NOW, NVDA, SPY, QQQ, EURUSD. For each: (1) S/R clean and present; (2) Local/Key/Strong sensible; (3) nearest S/R % realistic; (4) "none above"/price-discovery correct; (5) channel only on real structure; (6) wedge/noise → Developing/None; (7) no clutter/giant fills; (8) bias reasonable; (9) alerts fire only on confirmed close/test; (10) channel off = clean S/R.

### First product demo to aim for
**"The Clarity Radar, end-to-end on one watchlist."** A single screen: open the indicator on NVDA (clean S/R + channel + bias), then open the Market Room showing a ~50-name watchlist ranked by clarity, filter "near Key/Strong or testing channel," and read the one-line reason on the top 6 — then click one and confirm the chart matches. That demo proves the indicator↔brain loop and the core value in under two minutes.

---

## Pointers
- Roadmap: `rangeclarity_milestone_roadmap.md` · Weekly: `rangeclarity_12_week_execution_plan.md` · Board: `rangeclarity_kanban_board.md` · Contract: `rangeclarity_shared_signal_schema.md` · Gate: `rangeclarity_launch_readiness_checklist.md`. Decisions log: `decisions.md`.
