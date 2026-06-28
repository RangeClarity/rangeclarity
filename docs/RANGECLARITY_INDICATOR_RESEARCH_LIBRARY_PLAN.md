# RangeClarity — Indicator Research Library Plan

> **Status: plan / governance doc.** No code changes. Extends the existing
> `indicator_research_library/` (canonical; `tradingview-research/` is archive).
> Purpose: turn the study of strong public indicators into **conservative RC-1
> scoring rules** (`docs/RANGECLARITY_RC_SCORE_MODEL.md`) — concepts only, never
> code/UI/names/proprietary logic. Pairs with `license_ledger.md` (the IP gate).

## 0. IP firewall (non-negotiable — read first)
RangeClarity is a **commercial** product. The library already adopts "re-implement
concepts, copy no code." This plan keeps that and makes it operational.

- **Concepts only.** We study *how* an indicator reasons (plain-English logic, math
  approach, design intent). We never copy code, exact visuals/UI, names, parameter
  sets, or proprietary/secret logic. Ideas and math approaches aren't copyrightable;
  the specific code expression is — and we reuse none of it.
- **License-ledger gate.** No source may influence production until it has a row in
  `indicator_research_library/license_ledger.md` with a clear decision. Unclear
  license, no license, or proprietary/invite-only → **Inspiration only**, never code.
- **Clean-room re-implementation.** Every RC concept is rebuilt from our own model
  (`RANGECLARITY_RC_SCORE_MODEL.md` + `V2_ENGINE_SPEC`), in our structure, with our
  vocabulary. If we can't explain it from first principles, it doesn't ship.
- **Attribution as courtesy.** Author + URL recorded even for inspiration-only
  sources (in `INDICATOR_COMPARISON_REPORT.md` / pattern files).
- **No bulk scraping.** One source at a time, by hand, from public pages.
- **Brand law overrides any source.** Structure not trades; no signals/predictions;
  **volume is 0% of RC Score**; calm state-first surface. A source that violates this
  is studied as a *counter-example* ("what NOT to do"), not a model.

## 1. Research framework (the pipeline)
A source moves left-to-right; it cannot skip a stage:

```
 public source ──▶ license_ledger row ──▶ review note ──▶ pattern (distilled) ──▶
   candidate RC rule ──▶ QA fixture ──▶ founder approval ──▶ RC-1 implementation
        (IP gate)         (notes/)       (patterns/)        (RC_SCORE_MODEL §10)   (qa:rc)
```

1. **Capture** — record the script (name, author, URL, open-source status) in
   `license_ledger.md`. Decide *reuse-allowed* vs *inspiration-only* before anything
   else.
2. **Review** — one note per indicator in `notes/` using the template (§3).
   Plain-English logic only; no code paste.
3. **Distil** — write the transferable idea into the relevant `patterns/` file
   (mapped to a focus area in §2), with attribution and an explicit "what NOT to
   copy."
4. **Convert** — propose how the concept becomes a **candidate RC-1 rule** (a cap,
   gate, penalty, weight, or surface decision) — see §5.
5. **Test** — encode the rule as a QA fixture/rule in the offline harness
   (`data/qa/fixtures/`, `scripts/qa/run-qa.ts`).
6. **Approve & build** — founder approves; only then does it touch Pine.

## 2. Categories + scoring criteria
The eight focus areas are the canonical categories. Each maps onto an existing (or
new) `patterns/` file and onto an RC Score lens.

| # | Focus area | patterns/ home | RC Score lens it feeds |
|---|---|---|---|
| 1 | Trend quality | `structure_patterns.md` | Trend Structure (25) |
| 2 | Support/resistance zones | `support_resistance_patterns.md` | Zone Quality (25) |
| 3 | Range/chop detection | `regime_patterns.md` | Regime (15) + Chop cap |
| 4 | ATR extension | `regime_patterns.md` (+ new `extension_patterns.md`) | Extension (10) + cap |
| 5 | MA structure | `structure_patterns.md` | Trend Structure (MA sub) |
| 6 | Volume **context** | `support_resistance_patterns.md` (context note) | **0% of score** — context/veto only |
| 7 | Score caps / confluence | `confidence_patterns.md` + `scoring_systems` (archive) | the cap/gate/penalty engine |
| 8 | Dashboard surface design | new `surface_patterns.md` | the visible table (Surface Spec) |

**Indicator scoring rubric (rate each source 1–5; high = better unless noted).**
Extends the idea-card ranking line already in `tradingview-research/01_idea_cards/template.md`:

| Criterion | 1 (poor) → 5 (excellent) |
|---|---|
| **Transferable value** | nothing for us → directly feeds an RC lens/rule |
| **Conceptual clarity** | opaque/black-box → cleanly explainable from first principles |
| **Conservatism fit** | hype/over-fires → calm, evidence-gated, structure-first |
| **Visual simplicity** | cluttered → screenshot-clean |
| **Pine v6 feasibility** | needs banned features → scalar math on confirmed bars |
| **Originality headroom** | derivative/me-too → lets us build something distinct |
| **Generic-risk** *(low=good)* | identical to 100 scripts → genuinely differentiated |
| **Repaint/noise-risk** *(low=good)* | repaints/lookahead → confirmed-bar safe |

A source worth converting into an RC rule should score ≥4 on Transferable value,
Conceptual clarity, and Conservatism fit, **and** low repaint-risk.

## 3. Per-indicator template
Use the existing `indicator_research_library/notes/INDICATOR_REVIEW_TEMPLATE.md`
(it already covers identity, fit, what-it-solves, core logic, visual style,
strengths, weaknesses, what-to-learn, what-NOT-to-copy, module relevance). This plan
adds the founder's six required fields explicitly — fold these into each note:

```
## RangeClarity conversion block (add to every note)
1. What it solves        — the problem, in one or two sentences.
2. Formula concepts      — the math/logic approach, plain English. No code, no exact params.
3. Visual approach       — how it draws/communicates (and is it clean or cluttered?).
4. Strengths             — what it does genuinely well.
5. Weaknesses            — where it over-fires, clutters, repaints, or over-fits.
6. What RangeClarity can learn — the transferable concept → which RC lens (§2) + rough weight.
7. What must NOT be copied — code, UI, name, params, proprietary logic, hype wording.

Rubric scores (§2): value · clarity · conservatism · visual · pine · originality · generic-risk · repaint-risk
License decision (ledger row #): Reuse allowed / Inspiration only
Candidate RC rule (§5): (cap / gate / penalty / weight / surface) — one line, or "none yet"
```

## 4. Study list — 20–50 indicators & concepts (grouped by focus area)
**Public / standard / well-documented sources first** (lowest IP risk, highest
conceptual clarity). Named third-party scripts are studied **by their public
*description/concept* only**, logged inspiration-only. The 18 already in the ledger
are cross-referenced where relevant. ~40 entries.

### 1) Trend quality
- **Supertrend** (ATR-trailing trend state) — trend persistence + flip discipline.
- **ADX / DMI** — trend *strength* vs noise; the canonical "is there a trend at all."
- **Ichimoku (Kumo/cloud)** — multi-component trend agreement as a single picture.
- **Linear-regression slope + R²** — trend direction *and* how clean it is (R² = clarity).
- **Vortex Indicator** — directional movement persistence (concept of up/down vigor).
- *(ledger)* Trend Impulse Channels (Zeiierman, inspiration only) — impulse vs drift.

### 2) Support/resistance zones
- **Pivot Points** (Classic / Camarilla / Fibonacci) — deterministic reference levels.
- **Donchian Channels** — highest-high/lowest-low structural envelope.
- **Fractal / swing-pivot S/R** — pivot clustering into zones (our `f_addZone` lineage).
- **Volume Profile / POC / Value Area** *(concept)* — where price spent time = stronger level. *(context only; not a score input)*
- **Round-number / psychological levels** — cheap, robust confluence.
- *(ledger)* Support Resistance Channels (LonesomeTheBlue, MPL → re-implement) · Volumatic S/R (BigBeluga, inspiration).

### 3) Range/chop detection
- **Choppiness Index** — the textbook trend-vs-chop scalar (feeds the Chop cap).
- **Kaufman Efficiency Ratio** — signal-to-noise of price travel (clean trend vs grind).
- **ADX < threshold** — low ADX as a range/chop gate.
- **Bollinger BandWidth** — contraction = compression, expansion = breakout regime.
- **TTM-Squeeze** *(concept: BB inside Keltner)* — compression detection without the signal.

### 4) ATR extension
- **Keltner Channels** (ATR bands around an EMA) — how far is "far."
- **Chandelier Exit** — ATR distance from extreme as an extension/maturity cue.
- **% distance from 200-MA / range mid** — our Extension lens, normalised by ATR.
- **Standard-deviation / Bollinger bands** — statistical stretch vs the mean.
- **ATR percentile / ATR%** — is volatility itself high or low right now (regime context).

### 5) MA structure
- **GMMA / MA ribbon** *(concept)* — alignment & spacing of many MAs = trend health.
- **MA stacking / 20-50-200 alignment** — the order of MAs as a structure state.
- **200-MA anchor + slope** — the single most-watched structural reference.
- **EMA vs SMA vs Hull** *(concept)* — smoothing-vs-lag trade-off (why we pick what we pick).
- **MA slope / spacing normalisation** — turning MA geometry into a 0–100 quality.

### 6) Volume context — *display only; 0% of RC Score*
- **VWAP + bands** — intraday fair-value reference (context, not a score input).
- **Relative volume (RVOL)** — is participation unusual (context flag / veto only).
- **Volume Profile / VPVR** *(concept)* — context for *where* levels matter.
- **OBV / accumulation-distribution** *(concept)* — confirmation-or-divergence *narrative*, never a score term.
- Study goal: **how others surface volume as context without letting it drive a verdict** — and avoid the ones that do.

### 7) Score caps / confluence scoring
- **Multi-factor "confluence" dashboards** *(concept family)* — how factors combine (and how they over-inflate — our counter-example set).
- **Confidence/strength meters** — calibration: are highs rare or constant? (we want rare.)
- **Regime-gated scoring** — using regime to *cap* rather than *add* (our model's core).
- **Weighted-sum vs min-gate scoring** — why we chose `min(base, caps)` + agreement gate.
- *(ledger)* `confidence_patterns.md` + `no_edge_patterns.md` — the "blocker/veto" lineage.

### 8) Dashboard surface design
- **Clean table dashboards** — state-word panels, one headline number, color discipline.
- **Screenshot-friendly minimal overlays** — what reads in 3 seconds vs what clutters.
- **Color-coding & hierarchy** — teal/magenta/slate semantics; size/weight as hierarchy.
- **"One number" headline panels** — premium feel without a scoreboard of `/100`s.
- Study goal: distil into a new `patterns/surface_patterns.md`; feed the Surface Spec.

> Coverage check: areas 1–8 each have ≥4 study entries (~40 total). Prioritise the
> **public/standard** rows; treat ledger/vendor rows as inspiration-only concept reads.

## 5. How insights become RC-1 scoring rules
Every distilled concept must land as one of five concrete artifacts in
`RANGECLARITY_RC_SCORE_MODEL.md` terms — or be explicitly rejected:

| Concept type | Becomes | Example |
|---|---|---|
| A clean trend/regime measure | a **lens weight** or its 0–100 input | Efficiency Ratio → cleaner Regime/Trend input |
| A "this isn't reliable" condition | a **hard cap** | Choppiness high → Chop cap ≤50 |
| A degrading factor | a **penalty** | stale/one-touch zone → −8 |
| A required-agreement condition | a **gate** (`agree3`) | location must be defined for Clear |
| A display idea | a **surface/Advanced** decision | one-number headline; volume → Advanced context |

**Conversion rules:**
- A concept may only **raise** confidence if it strengthens an existing lens *and*
  passes the agreement gate — never a new positive term that lets the score inflate.
- Volume-derived concepts may only become **context or a one-way veto**, never a
  positive score term (brand law).
- Each candidate rule ships with **at least one QA fixture** (positive or negative
  control) before it's proposed for Pine. Reuse the existing rule families
  (`high_with_weak_zones`, `large_jump`, `high_score_in_chop`, …).
- Default bias is **reject**: if a concept doesn't make the read *more conservative or
  clearer*, it stays in `patterns/` as knowledge, not in the score.

## 6. Research workflow for Claude / Codex
A repeatable, low-risk agent loop. **Read-only by default; never edits Pine; never
copies code.**

**Per-source loop (one indicator at a time):**
1. **Intake** — given a public URL/name, record identity + open-source status in
   `license_ledger.md`. If license is unclear/proprietary → mark *Inspiration only*
   and continue (concept study only).
2. **Concept extraction** — read the *public description* and write a plain-English
   logic summary into a `notes/<short-name>.md` from the template (§3). **No code
   paste, ever.** If only code is available under a restrictive license, summarise
   behaviour from the description and stop.
3. **Score it** — apply the §2 rubric; record the eight scores.
4. **Distil** — if it scores ≥4 on value/clarity/conservatism and is repaint-safe,
   write the idea into the matching `patterns/` file with attribution + "what NOT to
   copy."
5. **Propose a rule** — add a one-line **candidate RC rule** (§5) and a draft QA
   fixture. Mark it *proposed*, not implemented.
6. **Stop for review** — list: source, license decision, rubric scores, the distilled
   pattern, the candidate rule, the QA fixture. **Do not touch Pine.**

**Batch cadence (Codex critic / Claude synthesiser):**
- Codex reviews a small batch (3–5 sources), flags weakest reasoning, hype, repaint,
  or generic-risk.
- Claude synthesises survivors into `patterns/` + candidate rules.
- Founder approves which candidate rules enter the RC-1 implementation queue.

**Hard guardrails (every step):**
- Concepts only; no code/UI/name/param/proprietary-logic copying.
- License ledger before influence; unclear = inspiration only.
- Structure not trades; volume 0% of score; calm surface; confirmed-bar logic.
- Nothing influences Pine without a QA fixture + founder approval.
- Keep RangeClarity original — re-implement from our own model, in our own words.

## Deliverables this plan governs (already in repo, extended here)
- `indicator_research_library/` — canonical home (sources, notes, patterns, ledger).
- `docs/RANGECLARITY_RC_SCORE_MODEL.md` — where concepts become caps/gates/weights.
- `data/qa/` + `scripts/qa/` — where every candidate rule earns a test.
- New pattern files to add as study proceeds: `extension_patterns.md`,
  `surface_patterns.md` (areas 4 and 8 currently under-covered).
