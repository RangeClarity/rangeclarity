# RC-1 Real Data Baseline v1 — Local Runbook (Windows / PowerShell)

> Run the real Tiingo baseline on your machine and paste the outputs back. **The synthetic
> package stays frozen** (no scoring changes, no cap loosening, no Pine, no validation
> claims). Your key never leaves `.env`; it is sent as an auth header, never printed.

## 0. Prerequisites
- **`.env` at the repo root:** `C:\Users\USER\Claude\Projects\RangeClarity\.env`
  *(note the backslash before `.env`).* Required lines:
  ```
  TIINGO_API_KEY=<your key>
  TIINGO_START_DATE=2018-01-01
  ```
  (`.env` is gitignored — never commit it. `fetch_tiingo.py` searches up to the repo root to find it.)
- **Python:** confirm your interpreter path (yours, adjust if needed):
  ```powershell
  $py = "C:\Users\USER\.local\bin\python3.11.exe"
  & $py --version          # expect Python 3.11.x
  ```

## 1. One-time: install deps
```powershell
& $py -m pip install python-dotenv requests pandas numpy pyyaml
```

## 2. Fetch real Daily OHLCV (key read from .env, never printed)
```powershell
Set-Location C:\Users\USER\Claude\Projects\RangeClarity\research\rc1_autonomous_model
& $py fetch_tiingo.py        # 20 symbols, 2018-01-01..latest -> data\ohlcv\<SYM>.csv (+ raw cache in data\ohlcv\tiingo\)
& $py check_data.py          # readiness: bar counts, schema, rejects; "usable symbols" must be > 0
```

## 2b. Alternative data source: Yahoo/yfinance fallback (no key, RESEARCH ONLY)
If Tiingo auth is blocking you, use the Yahoo fallback instead of step 2 (no key needed).
Yahoo/yfinance is a research unblocker only — **not** the final vendor; prefer Tiingo later.
```powershell
& $py -m pip install yfinance
Set-Location C:\Users\USER\Claude\Projects\RangeClarity\research\rc1_autonomous_model
& $py fetch_yfinance.py        # 20 symbols, 2018-01-01..today -> data\ohlcv\<SYM>.csv (+ raw cache in data\ohlcv\yfinance_raw\)
& $py check_data.py
```
Data is split/dividend-ADJUSTED O/H/L/C (raw preserved in `yfinance_raw\`); volume is raw
(0% of score). Then continue with step 3. Label any report **"Yahoo/yfinance fallback."**

## 3. Run BOTH baselines + the comparison
```powershell
Set-Location C:\Users\USER\Claude\Projects\RangeClarity\research
& $py compare_baselines.py   # copies CSVs into both packages, runs both, writes the REAL results doc
```
`compare_baselines.py` uses the *same* Python that launches it for both sub-runs, so keep
using `& $py`. It exits with the fetch command if no CSVs are present (it never fabricates).

## Expected output files
- `research\rc1_autonomous_model\data\ohlcv\<SYM>.csv` (+ `tiingo\` raw cache)
- `research\rc1_autonomous_model\reports\` — run_summary, candidate_rulesets, ablation_results,
  founder_review_*, segment_results, etc.
- `research\rc1_ultimate_offline_indicator\reports\` — offline_indicator_summary.md,
  **state_distribution.csv**, **cap_distribution.csv**, **ablation_results.csv**,
  **founder_review_queue.csv**, high_clarity_audit.csv, borderline_cases.csv, best_ruleset.json
- `docs\research\rc1-real-data-baseline-v1-results.md` — the auto REAL comparison (separate
  from the frozen synthetic reference in `rc1-real-data-baseline-v1-comparison.md`)

## What to paste back (for analysis only)
1. The console output of `compare_baselines.py` (and any `WARNING` lines).
2. `docs\research\rc1-real-data-baseline-v1-results.md`.
3. Both `reports\founder_review_queue.csv` (autonomous + ultimate).
4. `rc1_ultimate_offline_indicator\reports\state_distribution.csv` + `cap_distribution.csv` + `ablation_results.csv`.
Confirm each run printed **source = real** (not synthetic). If you see a `WARNING` that a run
used synthetic, the real CSVs weren't found — re-check step 2.

## How to interpret 0 Clear / 0 HighClarity
- On **real** data, **0 Clear / 0 HighClarity across hundreds of windows (including obvious
  clean trends/ranges) almost certainly means OVER-REJECTION, not validation.**
- High Clarity being rare is good **only if** real clean charts can still reach Clear *sometimes*.
- If real clean charts never reach Clear, the dominant binding gate (`agree3`, then zone/extension)
  is the suspect — note it, but **do not change anything**; paste outputs and we analyze.
- A non-zero but small Clear share + rare High Clarity + caps firing on genuinely messy charts =
  the healthy target. We confirm with the founder review queue + (later) human labels.

## What NOT to do before real data + review exist
- Do **not** loosen `agree3` / zone / extension caps. Do **not** change any scoring config.
- Do **not** create Pine. Do **not** claim the model is validated. Do **not** tune on synthetic.
- Do **not** commit `.env` or paste the API key anywhere. Conviction stays **RED** until
  human-labeled review of real results.
