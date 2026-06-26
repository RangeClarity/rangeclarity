# RangeClarity Deep-Module Architecture (language + audit)

> **Documentation / architecture audit only.** No behavior, scoring, caps, `agree3`, Pine, or
> payment change; no refactor; no commit/push. This doc defines the shared module language and the
> *target* boundaries, and lists refactor candidates that are **not yet approved**.
>
> **Principle:** good codebases are easy to test. A **deep module** hides a lot of logic behind a
> **small, stable, boring interface**. The outside should not know how the inside works. Complexity
> lives *inside* a module; it does not leak across boundaries.

---

## Task 1 — Current module shape (audit)

| Area | Currently owns | Should own | Should NOT know about | Where complexity leaks | Shallow/Deep | Target interface |
|---|---|---|---|---|---|---|
| **1. Web / landing / UI** (`app/**`, `lib/analytics`, CSS modules) | Public pages, mobile hero + fox band, CTAs, copy, beta funnel | Same | Scoring internals, research, raw labels, Pine logic | Verdict wording is re-authored in copy/Pine with no shared schema; experiments live under `app/designs/*` (gated) | **Deep-ish** (good: no Python scoring import) | `displayVerdict(verdict)` + static marketing pages |
| **2. Research scripts** (`research/rc1_ultimate_offline_indicator`, `research/rc1_autonomous_model`) | Engines, scorer, ablation, optimizer, **plus data loaders + reports** | Offline experiments + A/B over a stable core API | Production UI, Pine, payment | **Two parallel packages** with duplicated module names (`negative_first_scorer.py`, `data_loader.py`, `ablation.py`… in both) → no single source of truth | **Shallow boundary, deep guts** | `runExperiment(config) -> ExperimentReport` |
| **3. RC scoring / model** (`negative_first_scorer.score_window` + the 6 lens engines) | caps, gates, lenses, final verdict | Same | Where data came from, file paths, UI, Pine | **Leaky interface:** `score_window(df, num, highs, lows, t, params, caps_cfg, …)` — caller must pre-load data + pre-compute the feature frame + pivots; `data_loader.py` is **colocated inside** the scoring package | **Deep logic, leaky API** | `scoreWindow(window) -> RcVerdict` (one boring call) |
| **4. Data loading / normalization** (`data_loader.py` ×2, `fetch_tiingo.py`, `fetch_yfinance.py`, `check_data.py`) | yfinance/Tiingo/CSV load, schema, split-adjust | Same | Clarity decisions, caps, UI | Lives *inside* the scoring package; duplicated across both research packages | **Shallow** (scattered) | `loadCandles(symbol, source, range) -> NormalizedCandles` |
| **5. Founder review / visual review** (`research/rc1_review_agent/*`, `research/reports/visual_review/*`) | Charts HTML, priority/template/agent CSVs, agreement/confusion | Same | Scoring implementation, web pages, Pine | Agent imports engine **internals** (`data_loader`, `zones_asof`, `score_window`) instead of a stable scoring API | **Deep-ish** (label loader already has precedence logic) | `loadFounderLabels() -> FounderLabelSet`; `compareAgentToFounder(labels) -> ReviewReport` |
| **6. Reports / docs** (`docs/**`) | Specs, research notes, decisions, ops, this doc | Same | — | Many overlapping/legacy docs at repo root + `docs/`; some drift (reconciled separately) | n/a | Markdown; one owner file per topic (`CLAUDE.md` map) |
| **7. Ops / health / scripts** (`package.json` scripts, `scripts/test/run-tests.mjs`, `tests/`, `scripts/*`) | typecheck, lint, test (copy + label guardrails), e2e/unit (opt-in) | Same | Product internals | `health`/`verify` were inverted vs intended meaning (now fixed: health=fast, verify=full) | **Deep** (good) | `npm run health` (fast), `npm run verify` (full) |
| **8. Pine / TradingView layer** (`RangeClarity_Core.pine`, `pine/**`) | TradingView display, calm dashboard, structural overlays | Visual companion **only** | Canonical scoring research, unvalidated logic, buy/sell/prediction | Risk of becoming a **second source of truth** — Pine re-encodes scoring concepts independently of the Python core | **Shallow boundary, heavy guts** | Render a verdict; never originate one |
| **9. Payment / Lemon / access** (`lib/payments/**`, `app/beta/**`, Supabase admin) | Checkout providers, beta signup/grant, access state | Same | Scoring, research, Pine | Provider files are broad but isolated under `lib/payments` (good) | **Deep-ish** | Provider-agnostic checkout + manual grant flow |

**Headline problems:** (a) the scoring core has deep logic but a **leaky, caller-heavy interface** and **owns data loading**; (b) **two parallel research packages** mean there is no single canonical scoring module; (c) the review agent and experiments depend on **engine internals**, not a stable API; (d) **Pine** risks being a second source of truth. The web↔scoring boundary and the ops/test boundary are already healthy.

---

## Task 2 — Target Deep-Module architecture

### 1. Core Scoring Module
- **Purpose:** own all RangeClarity scoring logic. **Interface:** `scoreWindow(input) -> RcVerdict`.
- **Owns:** caps · gates · zone semantics · trend quality · chop/regime · ATR extension · final verdict.
- **Does NOT own:** web UI · chart rendering · CSV file paths · yfinance/Tiingo details · Pine display rules · marketing copy.

### 2. Data Adapter Module
- **Purpose:** load + normalize market data. **Interface:** `loadCandles(symbol, source, range) -> NormalizedCandles`.
- **Owns:** yfinance/Tiingo/CSV loaders · schema normalization · missing-data handling · split-adjust consistency checks.
- **Does NOT own:** clarity decisions · caps · UI rendering.

### 3. Research / Experiment Module
- **Purpose:** run offline experiments + A/B. **Interface:** `runExperiment(config) -> ExperimentReport`.
- **Owns:** frozen baselines · A/B runs · metrics · comparison reports · `suspicious_high` checks.
- **Does NOT own:** production UI · Pine code · payment/access.

### 4. Founder Review Module
- **Purpose:** human labeling + visual review. **Interface:** `loadFounderLabels() -> FounderLabelSet`; `compareAgentToFounder(labels) -> ReviewReport`.
- **Owns:** `founder_labels_template.csv` · `founder_review_priority.csv` · visual_review reports · label distribution · agreement/confusion.
- **Does NOT own:** scoring implementation · web product pages · Pine behavior.

### 5. Web UI Module
- **Purpose:** explain + sell RangeClarity clearly. **Interface:** `displayVerdict(verdict)` / marketing pages / free-access flow.
- **Owns:** landing page · mobile UI · CTA · product copy · public pages.
- **Does NOT own:** scoring internals · research experiments · raw labels · Pine logic.

### 6. Pine / TradingView Layer
- **Purpose:** visual companion **only**.
- **Owns:** TradingView display · minimal visual verdict · calm dashboard · structural overlays (when validated).
- **Does NOT own:** canonical scoring research · future unvalidated logic · buy/sell/prediction language.

### 7. Ops / Feedback-Loop Module
- **Purpose:** make the project easy to test. **Interface:** `npm run health` (fast) · `npm run verify` (full).
- **Owns:** typecheck · lint · unit tests · browser smoke tests · banned-language guardrails · daily validation commands.

**Dependency direction (one-way):** Data Adapter → Core Scoring → (Research, Founder Review) → reports. Web and Pine are **consumers** of a verdict, never producers. Ops wraps everything. No module imports a module "above" it.

---

## Task 3 — Shared vocabulary

- **lens** — one structural read (trend, zone, location, chop/regime, extension, agreement). Lenses are inputs to the verdict, never the verdict.
- **cap** — a ceiling the verdict cannot exceed when a problem is present (e.g. broken 50, chop 44). Caps only ever *lower* clarity.
- **gate** — a hard precondition checked before scoring (e.g. data sufficiency). Fails → `Insufficient`.
- **verdict** — the final state: `Insufficient / Unclear / Mixed / Clear / HighClarity`. The single public output of the scoring core.
- **clarity** — how readable the structure is. **Permission, not prediction.** High clarity must be rare.
- **false confidence** — the #1 risk: a bad/unclear chart reading as Clear/High. Everything is biased to avoid this.
- **false cap** — the inverse error: a genuinely clean chart wrongly capped down. The current Broken-Zone over-rejection.
- **normal_pullback_false_cap** — Broken fired too early on a normal pullback into *active* support that price reclaimed.
- **stale_zone_false_cap** — Broken fired on a stale/secondary/far level while the nearest active structure held.
- **genuinely_unclear** — Broken may be imperfect, but the chart is truly conflicted (contradiction/volatility/deep excursion) → stays capped.
- **true_broken** — Broken is correct: the relevant in-play structure decisively failed and did not reclaim.
- **primary_in_play_zone** — the nearest active S/R the chart is interacting with now; the only level that should drive Broken.
- **secondary_local_level** — a nearer-ish but non-primary cluster; context, not a hard cap.
- **major_regime_level** — a major higher-timeframe structural level; can matter even when old.
- **stale_minor_cluster** — an old, minor pivot cluster price left long ago; should not cap on its own.
- **frozen baseline** — the locked 1,767-window Real Baseline v1 run; every change is measured against it.
- **A/B candidate** — a single, reversible, scoped change tested vs the frozen baseline before adoption.
- **conviction RED / YELLOW / GREEN** — RED: not trustworthy, blocked (current). YELLOW: promising, human-reviewed, still gated. GREEN: validated against the baseline + labels, safe to ship (e.g. to Pine).

---

## Task 4 — Refactor Candidates, Not Yet Approved

1. **Extract a pure scoring-core API (`scoreWindow(input) -> RcVerdict`).**
   - *Problem:* `score_window(df, num, highs, lows, t, params, caps_cfg, …)` forces callers to pre-load data + compute the feature frame + pivots; data loading is colocated in the scoring package.
   - *Boundary:* a thin facade that takes a normalized window and internally builds features/pivots; the lens engines stay as-is behind it.
   - *Risk:* **MEDIUM** — must produce byte-identical verdicts.
   - *Test before:* golden-output test — run the facade over the frozen 1,767-window baseline and assert **identical** state distribution + cap counts.
   - *Order:* **1st.**
2. **Normalize founder-label loading into a Founder Review API.**
   - *Problem:* loader logic lives inside the review-agent script; callers vary.
   - *Boundary:* `loadFounderLabels()` / `compareAgentToFounder()` as the only entry points.
   - *Risk:* **LOW.**
   - *Test before:* the existing label-schema guardrail (`npm run test`) + a unit test on file precedence (template/priority/founder_labels).
   - *Order:* **2nd.**
3. **Isolate Broken-Zone semantics behind one function.**
   - *Problem:* the Broken decision is inline in `zone_engine.zones_asof`; it is the A/B target but not swappable in isolation.
   - *Boundary:* a single `isBroken(zoneContext) -> bool` the A/B can swap without touching other lenses.
   - *Risk:* **MEDIUM** — must stay behaviorally identical until the A/B is approved.
   - *Test before:* golden-output (`broken` binding rate unchanged) + founder-label review ≥20.
   - *Order:* **3rd** (after the core API exists).
4. **Add a stable experiment-runner interface (`runExperiment(config) -> ExperimentReport`).**
   - *Problem:* experiments are run via ad-hoc scripts (`full_real_review.py`, `compare_baselines.py`) with no common contract.
   - *Boundary:* one facade over the existing scripts; output schema fixed.
   - *Risk:* **LOW** (new facade over existing code).
   - *Test before:* reproduce the frozen baseline numbers exactly.
   - *Order:* **4th.**
5. **Web `health`/`verify` scripts.** — **DONE** this session (health=fast, verify=full; copy + label guardrails). *Risk: LOW.* *Order: complete; keep green.*
6. **Keep Pine untouched until conviction improves.** — No refactor. Pine stays a consumer; do not let it originate scoring. *Order: last; gated on GREEN conviction.*

**Later candidate (not in the top list):** consolidate the **two parallel research packages** (`rc1_ultimate_offline_indicator` = frozen canonical, `rc1_autonomous_model` = earlier synthetic) into one canonical engine + experiment harness. **Risk: HIGH** — do only after candidate 1 (the stable core API) exists and is golden-tested.

---

## Task 5 — Testing Rules for Deep Modules

- **Pure core logic must be unit-testable without a browser** — `scoreWindow` and each lens take data in, return values out; no I/O, no globals.
- **Data adapters must be schema-tested** — every loader returns the same `NormalizedCandles` schema; `check_data`-style validation is mandatory.
- **Web must be smoke-tested with Playwright** — key public pages load, show their key copy, no console errors, and gated routes 404 (`tests/e2e/smoke.spec.ts`).
- **Research experiments must compare against the frozen baseline** — every run reports its delta vs the 1,767-window Real Baseline v1; no "looks better" without numbers.
- **No scoring change is accepted without a before/after report** — state distribution, cap binding rates, `suspicious_high`, and the founder-label confusion table, side by side.
- **No feature is accepted if it increases false confidence** — `suspicious_high` must not rise; `Clear`/`HighClarity` must remain rare and only on genuinely clean charts.
- **No UI copy may use buy/sell/entry/exit/profit/prediction framing** — enforced by the copy guardrail in `npm run test` (negation-aware; gated/experimental routes excluded).

---

## Status
Architecture language + boundaries defined; **nothing refactored**. Conviction remains **RED**; the
Broken-Zone A/B stays spec-only and blocked until founder labeling reaches ≥20 and is compared against
the frozen baseline. No behavior, scoring, caps, `agree3`, Pine, or payment code was changed.

---

## Deep-module glossary (architecture terms)
- **Deep module** - lots of functionality behind a small, stable, boring interface; the outside cannot see how the inside works.
- **Module awareness** - knowing, before any change, which module owns the work, what it must not know about, its public interface, and its test boundary.
- **Public interface** - the small set of entry points a module exposes (e.g. `scoreWindow`, `loadCandles`); kept minimal and stable.
- **Hidden complexity** - the logic a module keeps inside, behind its interface, so callers never depend on it.

(`lens`, `cap`, `gate`, `verdict`, `clarity`, `false confidence`, `false cap`, the label terms, the level
terms, `frozen baseline`, `A/B candidate`, and `conviction RED/YELLOW/GREEN` are defined in
"Task 3 - Shared vocabulary" above.)
