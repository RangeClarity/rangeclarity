# RC-1 Restart Checkpoint

> Resume-from-here after a computer restart. Files persist on disk
> (`C:\Users\USER\Claude\Projects\RangeClarity`); the sandbox/session resets. **No Pine,
> no live data, no ML, no push/Telegram/Linear.**

## Current project state
RC-1 is in the **research + validation** phase — upstream of any code. The negative-first
RC Score model, the Reject-Probe v0 spec, the locked v0 cap thresholds, and the full
50-case manual-scoring kit are all written. The 50-case set is **drafted but not yet
labeled** (0/50 human columns filled). Nothing is staged/committed/pushed; git branch =
`landing-mobile-cta-polish`, working tree dirty (~211 files) — expected, leave as is.

## Completed today (RC-1 research arc)
RC Score model (`RANGECLARITY_RC_SCORE_MODEL.md`) · indicator research library plan ·
reference library + top-20 cards · **license ledger extended 18→36** + IP-risk summary
(4 buckets; LuxAlgo = proprietary/exclude) · validation methodology + 20-chart pack +
run-template · reference conviction engine + expanded inventory (35→84) + concept
conviction matrix (25 concepts) · negative-first scoring (10-bucket taxonomy + gate order)
· statistical validation plan (conviction ladder, rule-of-three) · `labels-50.csv` (50
stratified) + labeling guide · Learning Agent (architecture + feature engine + false-high
hunter + model-validation + rule-distillation) · **Reject-Probe v0 spec** · **v0 cap
thresholds (locked)** · 50-case worksheet · operator guide · blank scoring template.

## Files created/updated today (key)
- `docs/research/rc1-reject-probe-v0-spec.md`
- `docs/research/validation/rc1-cap-thresholds-v0.md`
- `docs/research/validation/rc1-50-manual-scoring-worksheet.md`
- `docs/research/validation/rc1-50-labeling-operator-guide.md`
- `docs/research/validation/labels-50-scoring-template.csv`
- (+ the full `docs/research/` set listed above; `indicator_research_library/license_ledger.md` extended)

## Current NOW task
**Run the manual scoring pass on the 50 cases** — fill
`docs/research/validation/labels-50-scoring-template.csv` (currently 0/50). This produces
the input Reject-Probe v0 consumes.

## Exact next step after restart
1. Open this checkpoint. 2. Open the operator guide + worksheet + cap thresholds + the
blank template. 3. Pick the 4 operator symbols. 4. Label the **first 10 cases** on
TradingView (capture screenshot → fill human columns → apply caps → manual_state/band →
confidence). 5. Continue to 50. 6. Then run Reject-Probe v0. 7. **Then** plan 50→300.

## First files to open
- `docs/research/rc1-restart-checkpoint.md` (this file)
- `docs/research/validation/rc1-50-labeling-operator-guide.md`
- `docs/research/validation/rc1-50-manual-scoring-worksheet.md`
- `docs/research/validation/rc1-cap-thresholds-v0.md`
- `docs/research/validation/labels-50-scoring-template.csv` (the entry sheet)

## Four operator-pick symbols still needed
- **RC1-09** — a stock IPO'd < 6 months ago (recent IPO, few pivots).
- **RC1-13** — a recent listing with < 200 daily bars (short history → no MA-200).
- **RC1-46** — an illiquid microcap (sparse/erratic pivots).
- **RC1-47** — another recent listing with < 200 bars (short history).
*(Don't reuse the same ticker; record it in `symbol`.)*

## First 10 cases to label (calibration spread)
RC1-01 AAPL (Clear) · RC1-03 KO (Clear) · RC1-18 AVGO (rare High Clarity) · RC1-05 TSLA
(chop→Unclear) · RC1-14 GE (contradiction→Unclear) · RC1-07 NVDA (overextension) ·
RC1-10 F (weak zone) · RC1-27 META (broken zone) · RC1-41 JNJ (compression) · RC1-09
your IPO pick (thin→Insufficient).

## Locked v0 cap thresholds (summary)
Insufficient → no number · Contradiction → 40 (Unclear) · Chop → 44 (Unclear) · Broken
zone → 50 · Severe overextension → 50 · Weak/stale/one-touch zone → 52 · Trend-location
conflict → 55 · Compression / moderate extension / price-discovery / lens-missing → 60 ·
Mid-range/poor location → 65 · No agreement → 69 · Score instability → hold (no promotion)
· High Clarity (>85) → full 6-lens agreement + 0 caps + ≥3-bar persistence. Final = min of
all triggered ceilings; prefer stricter. Full table: `rc1-cap-thresholds-v0.md`.

## Confirmations (verified this checkpoint)
- `labels.csv` = **20** · `labels-50.csv` = **50** · `labels-50-scoring-template.csv` =
  **50 rows, manual fields blank (0 pre-filled)**.
- Exist: rc1-reject-probe-v0-spec.md ✔ · rc1-cap-thresholds-v0.md ✔ ·
  rc1-50-manual-scoring-worksheet.md ✔ · rc1-50-labeling-operator-guide.md ✔ ·
  labels-50-scoring-template.csv ✔.

## Reminders
**No Pine · no live data · no ML · no push · no Telegram · no Linear.** When unsure while
labeling → Unclear/Mixed, never Clear.

## Resume prompt (paste after restart)
```
Resume from docs/research/rc1-restart-checkpoint.md. Read it first and tell me:
1. current NOW task
2. first files to open
3. first 10 cases to label
4. remaining blockers
Do not push. Do not implement Pine. Do not run live data. Do not send Telegram. Do not write Linear.
```
