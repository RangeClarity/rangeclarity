# RC-1 50-Case Labeling — Operator Guide (one page)

> Run the manual scoring pass fast, consistent, auditable. Pairs with the worksheet
> (`rc1-50-manual-scoring-worksheet.md`), caps (`rc1-cap-thresholds-v0.md`), and the
> entry sheet (`labels-50-scoring-template.csv`). **Manual only** — no auto-capture, no
> live data, no Pine. **Golden rule: when unsure → Unclear / Mixed, never Clear.**

## 1. Open each case
Work in worksheet order (RC1-01 → 50). Open the suggested symbol + timeframe. The
**scenario is the requirement, the symbol is a suggestion** — if the chart no longer shows
the scenario, substitute a chart that does and record the new symbol + `as_of_date`. Chart
setup: clean candles, MAs 20/50/200, one Keltner (ATR) band, ~150–300 bars, dark theme.

## 2. Capture the screenshot
Name it exactly `RC1_<id>_<SYMBOL>_<TF>_<YYYYMMDD>_<scenario>.png` (SYMBOL without
exchange prefix, lowercase scenario), save to `validation/screens/`, set
`screenshot_captured = Y`.

## 3. Fill the human columns (record what you SEE, before scoring)
Use only these enums: `human_trend` Clean/Mixed/Weak/Range-bound · `human_location`
NearSupport/Lower/Mid/Upper/NearResistance/Above/Below · `human_zone`
Fresh/Tested/Weak/Insufficient · `human_regime` Trend/Range/Compression/Expansion/Chop ·
`human_extension` Normal/Stretched/Extended/Severe. Then `human_review_done = Y`.

## 4. Operator-pick symbols (RC1-09, 13, 46, 47)
Choose real names yourself: 09 a stock IPO'd <6 months ago · 13 / 47 a listing with <200
daily bars (no MA-200) · 46 an illiquid microcap with sparse pivots. Record the ticker in
`symbol`. Don't reuse the same name twice.

## 5. Decide clear vs unclear (`human_is_clear`)
Ask only: *"Is the structure obviously clean and self-consistent?"* Yes only when trend,
location, and a quality zone agree and nothing contradicts. Anything tangled, broken,
stretched, contradictory, mid-gap, or thin → **N**. Clarity is not opportunity — a clean
downtrend is as "clear" as a clean uptrend.

## 6. Apply caps (`negative_gate_applied`, `cap_applied`, `manual_state`, `manual_band`)
From the observed states, read the **lowest applicable ceiling** in
`rc1-cap-thresholds-v0.md`. That ceiling's band = `manual_band`; its state = `manual_state`.
If two caps apply, use the **lower**. Examples: regime Chop → gate chop, cap 44 → Unclear.
Zone Weak → cap 52 → Mixed. Trend+Location+Zone all clean and no cap → Clear (and only
full six-lens agreement + persistence → HighClarity).

## 7. What counts as a FATAL false-high (flag `fatal_false_high_risk = Y`)
If your `manual_state` ever comes out **Clear or HighClarity** on a chop, broken-zone,
contradiction, or severe-overextension case — or a **number** on an Insufficient case —
that's a fatal. It means a cap has a hole. Flag it; it blocks the run and feeds a rule fix.

## 8. When unsure
Default **down**: pick Unclear over Mixed, Mixed over Clear. Lower `reviewer_confidence`
(1–5) and write why in `notes`. Never round up to Clear to "resolve" doubt — the product's
job is to withhold confidence, not manufacture it.

## Pace & audit
~2–4 min/chart ⇒ the 50 in ~2–3 hours. Every row must have a screenshot + the filled
columns so the pass is fully auditable. Pass bar (Level 2): ≥46/50 consistent · **0 fatal**
· 0 Clear on any reject bucket · HighClarity on ≤2.
