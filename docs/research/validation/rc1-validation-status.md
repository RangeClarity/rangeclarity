# RC-1 Validation Status

> Single source of truth for "where is RC-1 in the model loop." Update this file as the
> loop advances. **The model is NOT validated yet — no conviction is claimed before labels
> exist.**

## Current status (as of this writing)
- **Phase:** pre-loop / setup complete. Spec + caps + contract + checklist all exist.
- **Data:** `labels-50.csv` = 50 drafted cases (11 buckets). `labels-50-scoring-template.csv`
  = 50 rows, **0/50 human-labeled** (verified genuinely blank, not faked).
- **Model evidence:** **none.** No false-high rate, no CI. Model Conviction Score ≈ **0–5
  → Red** (research-complete, evidence-zero).

## Current blocker
**`labels-50` is not manually scored (0/50).** Nothing downstream — Reject-Probe v0, the
false-high rate, the Conviction Score — can be computed or claimed until this is done. It
requires a human's eyes on TradingView; it cannot be automated or faked.

## Next action
Run the **first model loop** per `rc1-first-model-loop-checklist.md`: pick the 4 operator
symbols → warmup 10 → label all 50 into the scoring template (strict v0 caps).

## Definition of "done" (for this step)
1. 50/50 rows have `human_review_done = Y`.
2. No illegal enum values; no missing required fields.
3. Then a **clean Reject-Probe v0 run**: **0 fatal false-highs**, **0 Clear on any reject
   bucket**, High Clarity ≤2, ≥46/50 consistent — yielding the first false-high report +
   Conviction Score.

## What happens after done
- Build + run **Reject-Probe v0** (offline, reads the filled CSV) → false-high / fatal /
  cap-accuracy reports + Conviction Score.
- If any false-high: enter the **rule-fix loop** (checklist §E) — one stricter change, re-run.
- When clean: **expand to labels-100** (tightens the bound toward ≤~3–4%), repeat the loop.
- Then (behind approvals): Python feature engine on **Alpaca**, labels-300 (≤~1% bound),
  and only after that, Pine.

## What NOT to do yet
- No Pine. · No live data. · No ML. · No 300-case or large-batch run. · No claim that RC-1
  "works," is "validated," or has any false-high/accuracy number — **until labels exist and
  Reject-Probe v0 has run.** Red until measured.

## Status log
- *(setup)* labels-50 drafted (50), template blank (0/50), v0 caps locked, Reject-Probe v0
  spec + Python scorer contract + first-loop checklist written. Blocker = manual labeling.
- *(next entry)* — fill after the labels-50 pass: date, #labeled, #fatal, #false-high,
  Conviction Score, decision.
