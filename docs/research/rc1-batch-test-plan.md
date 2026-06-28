# RC-1 Batch Test Plan — structural-clarity validation at scale

> **Not a trading backtest.** No forward returns, no P&L, no win-rate, no signals.
> The batch validates that RC Score is **conservative and honest** across thousands
> of charts: that `High Clarity` is rare, caps fire correctly, and the state
> distribution looks like reality (mostly Mixed/Unclear). Computed by a **Python
> prototype** of the RC math (Phase 3), not Pine.

## Universe & sampling
- **S&P 500** (~500) + **Russell 2000** (~2000) = ~2500 symbols.
- Timeframes: **1D** (primary) + **1W** (secondary). ~2500×2 ≈ **5000 observations**
  at the latest confirmed bar; optionally sample N historical as-of dates per symbol
  for distribution depth.
- Date range: trailing **2–3 years** of daily bars per symbol (enough pivots/MA-200).
- **Data source is a decision (see Risks):** needs an OHLCV provider; not chosen yet.

## Per-observation output schema (one CSV row)
```
symbol, timeframe, as_of_date,
trend_quality_score, zone_quality_score, location_context_score,
chop_regime_score, atr_extension_score, agreement_score, final_rc_score,
state_label,            # HighClarity / Clear / Mixed / Unclear / Insufficient
hard_caps_applied,      # e.g. "chop<=50;extended<=60"
warnings,               # e.g. "one_touch_zone;stale_level"
result                  # pass / fail / unclear  (structural-honesty check, not a trade)
```
`agreement_score` = how many lenses agree (0–6 → normalised); `result` is the
self-consistency verdict below — **never** a trade outcome.

## Structural-honesty checks (how pass/fail/unclear is decided — no returns)
- **fail** if `state_label` ∈ {Clear, HighClarity} while any lens score is in its
  Weak/Insufficient band, or a conflict/contradiction is present, or a required cap is
  absent. (False confidence.)
- **fail** if `final_rc_score` > 85 without full six-lens agreement + zero caps.
- **fail** if a number is shown while data is Insufficient.
- **unclear** if lenses are split and the engine landed a confident band (needs review).
- **pass** otherwise (the read is internally consistent and appropriately humble).

## Distribution acceptance targets (the real validation)
Across the ~5000 observations:
- **High Clarity (>85): ≤ ~2–5%** of observations. If higher → thresholds too loose.
- **Clear (70–85): minority** (single-digit to low-double-digit %).
- **Mixed/Unclear: the majority.** Insufficient: the genuinely thin names.
- **Cap-firing rates** sane: Chop cap fires on demonstrably choppy names; Extended on
  stretched ones; Contradictory rare.
- **Stability:** re-running on the prior confirmed bar changes few states (hysteresis).
- **Symmetry:** uptrend and downtrend names reach High Clarity at similar rates.
- **No-leakage check:** scrambling/altering one lens degrades scores as expected
  (sanity that each lens actually contributes).

## Reporting
A summary notebook/report: state histogram, per-lens score distributions, cap-firing
table, High-Clarity exemplars (eyeball 20 to confirm they *look* clean), and a list of
"suspicious Clear" rows for manual review. Output to `docs/research/validation/`.

---

## First implementation order (exact)
- **Phase 1 — docs & schemas (now, this folder).** Truth Engine, rubric, validation
  methodology, batch plan, `labels.csv`. *Deliverable: this `docs/research/` set.*
- **Phase 2 — 20-chart manual validation.** Founder fills `labels.csv` + screenshots;
  score by hand against the model. *Gate: ≥18/20 pass, zero false-Clear.*
- **Phase 3 — Python prototype.** Re-implement RC math (Stage I + II) in Python over
  OHLCV; reproduce the 20-chart results first, then run small samples. *No Pine.*
- **Phase 4 — 300-chart validation.** Stratified sample (trends/ranges/chop/edge)
  across both indices; confirm distribution targets on a manageable set.
- **Phase 5 — S&P 500 + Russell 2000 batch (~5000).** Full distribution + cap-firing +
  stability + symmetry checks; tune thresholds so High Clarity stays rare.
- **Phase 6 — Pine implementation.** Only after the Python model is calibrated and
  approved, port Stage I + II into `sr_core_v1.pine` (single, reversible change) and
  re-validate via `qa:rc` + a fresh 20-chart spot check.

## Risks
- **Data source unchosen.** The batch needs an OHLCV provider (free vs paid; rate
  limits; survivorship bias on Russell 2000). **Decision needed before Phase 3** — do
  not assume one.
- **Python↔Pine parity.** The prototype must mirror Pine's confirmed-bar semantics or
  results won't transfer; lock the math in Phase 3 before scaling.
- **Survivorship / delistings** in the historical universe can skew distributions; note
  it, don't over-claim.
- **"No Edge" wording.** Keep the low state as **Unclear/Insufficient** on any surface;
  "No Edge" stays internal-only (brand law).
- **Ledger gap.** Subfolder references (incl. LuxAlgo proprietary) aren't in
  `license_ledger.md`; extend it before any concept from them informs the prototype.
- **Compute.** 5000×(historical bars) is non-trivial; cache OHLCV; vectorise.
