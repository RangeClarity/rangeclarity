# Real Data Baseline v1 - Yahoo/yfinance fallback

> **Data source: Yahoo Finance via `yfinance` — RESEARCH UNBLOCKER ONLY.** Not the final
> vendor baseline; Tiingo or another official provider is still preferred for final
> validation. **No scoring changes, no cap loosening, no Pine, no validation claims.**
> Conviction stays **RED**.

## Status: loader built; fetch BLOCKED in this sandbox -> run locally
- `fetch_yfinance.py` added (syntax verified; graceful guard verified).
- Sandbox egress: **PyPI reachable, but Yahoo Finance is blocked** ("Tunnel connection
  failed: 403 Forbidden"), and `yfinance` isn't installed here. So the download **cannot run
  in this environment** — it runs on your machine. **No data was fetched or fabricated.**

## Adjusted vs unadjusted (documented choice)
Fetch `auto_adjust=False` → preserve **raw** bars (+`Adj Close`) in
`data/ohlcv/yfinance_raw/<SYM>.csv`; write the canonical modeling file with
**split/dividend-ADJUSTED O/H/L/C** (back-adjusted via `factor = AdjClose/Close`), matching
the Tiingo path's adjusted OHLC. **Volume is raw** (yfinance gives no adjusted volume; volume
is **0% of the RC score**, so this is immaterial to scoring). Canonical schema is identical:
`symbol,date,open,high,low,close,volume`.

## Run locally (Windows PowerShell)
```powershell
$py = "C:\Users\USER\.local\bin\python3.11.exe"
& $py -m pip install yfinance pandas numpy pyyaml
Set-Location C:\Users\USER\Claude\Projects\RangeClarity\research\rc1_autonomous_model
& $py fetch_yfinance.py        # 20 symbols, 2018-01-01..today -> data\ohlcv\<SYM>.csv (+ raw cache)
& $py check_data.py
Set-Location C:\Users\USER\Claude\Projects\RangeClarity\research
& $py compare_baselines.py     # both baselines on the same Yahoo CSVs -> v1-results doc
```

## Report fields (auto-produced on the local run)
From `compare_baselines.py` console + each package's `reports/`:
- **symbols / windows tested** — run stdout (`source`, `windows`).
- **state distribution** — `rc1_ultimate_offline_indicator/reports/state_distribution.csv`.
- **over-rejection** — 0 Clear/0 HighClarity across many real windows (incl. obvious clean
  trends) ⇒ likely OVER-REJECTION, not validation.
- **caps fired most** — `reports/cap_distribution.csv`.
- **agree3 binding rate** = `agree3` count ÷ windows · **zone binding** =
  (`broken`+`weakzone`) ÷ windows · **extension binding** = (`severe`+`extended`) ÷ windows
  (all from `cap_distribution.csv`).
- **ablation findings** — `reports/ablation_results.csv` (which concepts earn their place).
- **founder review queue** — `reports/founder_review_queue.csv` (suspicious_high / borderline
  / caps_saved / uncertain) in both packages.

## Frozen SYNTHETIC reference (NOT this run; do not conflate)
ultimate: 520 windows · Unclear 220 / Mixed 300 / Clear 0 / HighClarity 0; caps agree3 503,
severe 404, broken 364, chop 171. (See `rc1-real-data-baseline-v1-comparison.md`.)

## Likely smallest refinement to test next (RECOMMEND ONLY — do not implement)
Run the Yahoo baseline first. **If real clean charts also never reach Clear**, the single
smallest test is loosening the `agree3` location/zone leg so a `Clean` trend / clean `Range`
(Trend/Range regime, Normal extension) can reach Clear via proximity-to-a-real-level OR clean
range-position **without** a ≥2-touch in-play zone — because `agree3` is the dominant binding
cap. One toggle, A/B vs the frozen baseline, accepted only if Clear becomes reachable on clean
charts without raising the false-high self-flag and with High Clarity still rare. **Not
implemented; no caps loosened.** Paste the outputs and we analyze before any change.
