# RC-1 Real Data Visual Review v1 (FULL run) — FROZEN as Real Baseline v1 (2026-06-25)

> **Source = Yahoo/yfinance fallback — NOT final-vendor validation.** Real data = **19/20
> symbols** (F/Ford missing). **Conviction: RED** (no human labels / manual review yet).
> Read-only over the frozen engine: no scoring change, no agree3 loosening, no cap change,
> no Pine, no trade language. RC Score is permission, not prediction.

## Decision package (frozen 2026-06-25)
This report is the frozen **Real Baseline v1**. The over-rejection finding now drives a focused
decision package — **no scoring / cap / `agree3` / Pine change is made by any of it**:
- **A/B spec (spec only — not implemented):** [`rc1-ab-test-broken-zone-v0.md`](./rc1-ab-test-broken-zone-v0.md)
- **Founder review checklist (the gate):** [`rc1-founder-review-checklist.md`](./rc1-founder-review-checklist.md)
- **Labeling sheet:** `research/reports/visual_review/founder_labels_template.csv` (≈40 `clean_but_capped` rows)
- **Board:** RC-11 (`docs/kanban.md`) · **Decision:** O-008 (`docs/decisions.md`). BLOCK Pine stands; conviction **RED**.

## Run
`full_real_review.py` (resumable, per-symbol cache). 19 symbols, ~93 windows each (Daily,
2018-01-02 → 2026-06-24, split/dividend-adjusted). Total **1,767 windows**.

## Headline: strong OVER-REJECTION
- **State distribution: Unclear 984 · Mixed 783 · Clear 0 · HighClarity 0** (across all 1,767 windows).
- **0 Clear / 0 HighClarity on 19 large-caps over 8 years** — including obvious clean
  trends (NVDA, AAPL, MSFT, AVGO). The earlier 38-window snapshot (0/0) is now confirmed by
  the full run. Per the interpretation rule this is **over-rejection, not validation** —
  but it is **not final** until human review of the flagged charts + labeled cases exist.

## Binding rates (share of windows where the cap fired)
| cap | rate | count |
|---|---|---|
| **agree3** | **97.5%** | 1723 |
| **broken (zone)** | **74.1%** | 1309 |
| severe (extension) | 55.5% | 980 |
| chop | 52.7% | 931 |
| weakzone | 14.8% | 262 |
| extended | 12.5% | 220 |
| contradictory | 4.6% | 81 |
| midrange / pricediscovery / compression | ~2% / ~2% / 0.4% | 35 / 34 / 7 |
- **Zone binding (broken+weakzone): ~89%. Extension binding: ~66%. Chop binding: ~53%.**
- **Weakest lens:** Chop/Regime 903 · **Zone 589** · Extension 185 · Agreement 90.

## What the visual evidence shows (founder_review_queue.csv)
Categories: **caps_saved 1337 · uncertain 379 · clean_but_capped 42 · borderline 6 · other 3** (suspicious_high 0).
The decisive group is **clean_but_capped** — windows where Trend = **Clean** and Regime =
Trend/Range and Extension Normal/Stretched, yet capped to Mixed/Unclear. Every sampled
example is a clean trend whose **zone reads `Broken`**, e.g.:
- AAPL 2019-08-06 Clean/Trend → Unclear (40): `broken;contradictory;agree3`
- MSFT 2024-12-31 Clean/Trend/NearSupport → Mixed (50): `broken;agree3`
- NVDA 2021-05-05 Clean/Trend → Mixed (50): `broken;agree3`
So clean trends are being held at Mixed/Unclear chiefly by the **broken-zone flag** (and,
when structure momentarily disagrees, `contradictory`), with `agree3` then capping the
rest at ≤69.

## Outputs (research/reports/visual_review/)
`index.html` (visual review, charts by category, calm bands + audit) · `founder_review_queue.csv`
(clean_but_capped / borderline / caps_saved / suspicious_high / uncertain) ·
`real_state_distribution.csv` · `real_cap_distribution.csv` · `real_per_symbol_summary.csv` ·
`cache/<SYM>.csv` (per-symbol scored windows; resumable).

## Local commands (Windows PowerShell)
```powershell
$py = "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe"
& $py -m pip install pandas numpy pyyaml plotly
Set-Location C:\Users\USER\Claude\Projects\RangeClarity
& $py research\full_real_review.py --max-new 99 --charts 32   # full run in one go; resumable
# open research\reports\visual_review\index.html
```
(Resumable: re-running skips cached symbols; delete `reports\visual_review\cache\` to force
a full re-score. The 38-window quick view: `& $py research\render_visual_review.py`.)

## Single smallest A/B toggle to test next (RECOMMEND ONLY — not implemented; no caps loosened)
The data refines the original hypothesis. The dominant binder on **clean trends** is the
**`broken`-zone detector**, which fires on **74%** of all real windows — implausibly high
for trending large-caps. Inspecting it: `zones_asof` flags `Broken` if price closed beyond
**any** historical support cluster by ≥0.25·ATR within the last 20 bars while having been
above it — which is true on nearly every normal pullback in an uptrend. That single flag
caps clean trends to ≤50 and is the largest over-rejection lever.

**Proposed A/B (one change, reversible, measured vs the frozen baseline):** scope/strengthen
the **broken** detector so it only flags the **in-play** key zone on a **decisive, recent**
violation (e.g. a confirmed close-through with follow-through), instead of scanning all
historical clusters. Acceptance: clean trends can reach Clear *sometimes*, High Clarity
stays rare (≤~1-5%), and no false-high self-flag/fatal appears. **Secondary suspect:**
`agree3`'s `zone_real` requirement (a Clean trend cannot reach Clear without a Fresh/Tested
in-play zone). Test `broken` first — it has the highest leverage and least risk.

**Do not implement yet.** Confirm by eyeballing the `clean_but_capped` charts in `index.html`
(are those broken flags real or spurious?) and, ultimately, with human-labeled review.
Conviction stays **RED**.
