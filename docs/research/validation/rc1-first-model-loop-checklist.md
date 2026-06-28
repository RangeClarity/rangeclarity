# RC-1 First Model Loop — Operational Checklist

> The first real, measurable loop: **labels-50 manual scoring → Reject-Probe v0 →
> false-high report → rule fixes → next dataset.** The model becomes real only when
> measured against labeled cases. No Pine, no live data, no ML, no returns, no fake labels.
> Entry sheet: `labels-50-scoring-template.csv`. Caps: `rc1-cap-thresholds-v0.md`.

## A. Before labeling
- [ ] Pick the **4 operator symbols** (real, not reused): RC1-09 a stock IPO'd <6 months
      ago · RC1-13 a recent listing <200 daily bars · RC1-47 another short-history listing
      · RC1-46 an illiquid microcap. Record each in `symbol`.
- [ ] Open `rc1-labels-50-START-HERE.md` first.
- [ ] Do the **warmup 10** (AAPL, KO, AVGO, TSLA, GE, NVDA, F, META, JNJ, RC1-09) to
      calibrate all five states + the two new buckets.
- [ ] Use the **strict v0 caps** as written (chop 44, contradiction 40, broken 50, severe
      50, weak 52, conflict 55, compression/ext/price-disc/lens-missing 60, mid-range 65,
      no-agreement 69). When two apply, use the lower. When unsure → Mixed/Unclear, never Clear.

## B. During labeling (per case, into the CSV)
- [ ] `screenshot_captured` (Y) — image saved as `RC1_<id>_<SYMBOL>_<TF>_<YYYYMMDD>_<scenario>.png`
- [ ] `human_review_done` (Y)
- [ ] `human_trend` · `human_location` · `human_zone` · `human_regime` · `human_extension`
- [ ] `human_is_clear` (Y/N)
- [ ] `negative_gate_applied` · `cap_applied`
- [ ] `manual_state` · `manual_band`
- [ ] `reviewer_confidence` (1–5)
- [ ] `fatal_false_high_risk` (Y if your manual_state came out Clear/High on a chop /
      broken / contradiction / severe-extension case, or a number on Insufficient)
- [ ] `notes`
Use only the allowed enum values (see START-HERE §3). No free text in enum fields.

## C. After labeling (gate before any run)
- [ ] **50/50** rows have `human_review_done = Y`.
- [ ] **No illegal enum values** (every human_*, gate, cap, state, band matches the allowed set).
- [ ] **No missing required fields** (B's fields all present on every row).
- [ ] **High Clarity count ≤ 2** across the 50.
- [ ] **Clear count in reject buckets = 0** (chop, weak_zone, broken_zone, mid_range,
      overextension, contradiction_conflict, compression, thin_data → never Clear/High).
- [ ] **Review every `fatal_false_high_risk = Y`** — each is a model hole, not a labeling slip.

## D. Reject-Probe v0 run criteria
- [ ] Run **only after** C passes (50/50 `human_review_done`, enums clean).
- [ ] Produce: **false-high report** (rate + rule-of-three upper bound + Wilson CI),
      **fatal false-high report** (must be 0), **cap-accuracy report** (expected vs fired),
      and the **Model Conviction Score** (`rc1-conviction-score-framework.md`).
- [ ] Pass bar: **0 fatal**, **0 Clear on any reject bucket**, High Clarity ≤2,
      **≥46/50 consistent** with expected (±1 band).

## E. Rule-fix loop (only if a false-high is found)
- [ ] Identify the **failed gate/cap** (which lens leaked, which cap should have bound).
- [ ] Propose **one** cap/rule change (smallest, stricter) — log it; do not batch many.
- [ ] **Re-run** Reject-Probe v0.
- [ ] **Do not relax** any cap without a **positive-control damage review** (confirm the
      change doesn't push the 8 clean controls out of Clear). Tightening is free; loosening
      requires evidence.
- [ ] Repeat until 0 false-high **and** clean-control recall intact; then advance to labels-100.

## Loop summary
```
A pick symbols + warmup → B label 50 → C verify → D run v0 → (E fix if needed) → labels-100
```
Conviction is earned here, not assumed. The loop is real the moment 50/50 is filled.
