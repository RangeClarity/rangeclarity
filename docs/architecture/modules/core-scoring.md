# Module: Core Scoring

> Living architecture doc — **documentation only**. No behavior/scoring/caps/`agree3`/Pine/payment change.
> Index: [system-map](../system-map.md) · [registry](../module-registry.md) · vocabulary + audit:
> [rangeclarity-deep-modules](../rangeclarity-deep-modules.md). Principle: a **deep module** hides a lot
> of logic behind a **small, stable, boring interface**. The product *is* this verdict.

## Purpose
Turn one window of normalized structure into a single calm verdict — **permission, not prediction**.
This is the heart of RangeClarity; everything else feeds it or renders it.

## Public interface
- **Target (boring, new — exists):** `score_window_input(RcWindowInput) -> RcVerdict`
  (`research/rc1_ultimate_offline_indicator/rc_scoring_facade.py`). One call in, one typed verdict out.
- **Legacy (current, frozen):** `score_window(df, num, highs, lows, t, params, caps_cfg, prior=None, ablation=None) -> (sc, L)`
  (`negative_first_scorer.py:50`). Still used by all 5 callers; do not change its behavior.
- **Output verdict fields:** `score · state (Insufficient/Unclear/Mixed/Clear/HighClarity) · band · caps ·
  weakest_lens · agreement_count · why_not_higher · false_high_self_flag` + lens diagnostics.

## Hidden complexity
The **negative-first min-gate law** (score = *minimum* of what structure permits, never a sum); six lens
engines; cap ceilings + ordering; the `agree3` gate; hysteresis (`hysteresis_max_jump`); persistence
promotion to 88; band thresholds; the `why_not_higher` audit; and the `false_high` self-flag. A caller of
the facade sees none of this.

## Owns
Caps · gates · lenses · agreement count · final verdict · band mapping · hysteresis · false-high self-flag.

## Must not own
Where data came from · file paths · yfinance/Tiingo details · UI rendering · Pine display rules · marketing
copy · label storage.

## Subfunctions
`build_lenses` · `_band_state` · `score_window` · `score_window_input` · `RcWindowInput` · `RcVerdict`;
lens engines: `zone_engine.zones_asof` · `regime_engine.regime_state` · `location_engine.location_state` ·
`extension_engine.extension_state` · `agreement_engine.assemble` · `structure_features.{trend_state,structure_dir,compute_frame}`.

## Dependencies
Data Adapters (`df`, `num` via `compute_frame`) · `indicators.confirmed_pivots` (pivots) · config
(`params`, `caps_cfg`). Today these are **caller-assembled** — that is the leak below.

## Dependent modules
Research Experiments (`optimizer`, `full_real_review`) · Founder Review (`build_founder_review`,
`render_visual_review`). Web UI and Pine consume the *verdict*, never the function.

## Current leaks
1. Leaky, caller-heavy signature (`score_window(df, num, highs, lows, t, …)`).
2. `data_loader.py` is **colocated inside** the scoring package.
3. The Broken decision is inline in `zone_engine.zones_asof` (not swappable for the A/B).
4. A duplicate scorer exists in `rc1_autonomous_model` (second source of truth risk).

## Risk level
**HIGH.** Any change can manufacture **false confidence** (the #1 risk). Behavior is frozen; **conviction RED**.

## Tests required
- **Golden-output equivalence** — facade == `score_window` over the frozen **1,767-window** baseline.
  **EXISTS + PASSING:** `test_rc_scoring_facade.py` (`RC_GOLDEN_FULL=1`).
- Per-lens unit tests (data in → values out, no I/O).
- Any scoring change requires a **before/after** state-distribution + cap-binding report; `suspicious_high` must not rise.

## Agent / skill to use
`/module-awareness Core Scoring` before any touch · `/improve-codebase-architecture` for the facade
migration · `/grill-me` → `/write-a-prd` for any scoring idea before code.

## Next approved task
Migrate **one** read-only caller (`render_visual_review.py`) to `score_window_input`, then re-run the
golden test — it must stay **1,767 windows identical**. (The facade itself was added this session, additive,
no callers migrated.)

## Blocked work
Any cap / threshold / `agree3` / Broken-Zone change — **blocked** until founder labels ≥20 **and** a
frozen-baseline A/B. Pine consuming any new scoring logic — **blocked** until conviction GREEN.
