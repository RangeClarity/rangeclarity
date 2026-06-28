# RC-1 Real Data Baseline v1 — Summary (Tiingo EOD)

> **Status: loader built; fetch BLOCKED in this environment.** The assistant sandbox has
> **no outbound network** (`api.tiingo.com` unreachable) and no key in its env, so the live
> Tiingo fetch **cannot run here**. No data was fetched or fabricated. Run locally to
> produce the real baseline. **Research only — not beta readiness. Conviction: RED.**

## What was built
- `fetch_tiingo.py` — Tiingo daily fetch → adjusted-OHLCV normalize → validate → cache.
  Key read from `.env` via `Authorization` header; **never printed/committed**.
- `check_data.py` — readiness report. `requirements.txt` — deps.
- Cache layout: raw+adj in `data/ohlcv/tiingo/<SYM>.csv`; canonical (adjusted)
  `symbol,date,open,high,low,close,volume` in `data/ohlcv/<SYM>.csv`.

## Run locally to produce this baseline
```
# .env has TIINGO_API_KEY (gitignored). optional TIINGO_START_DATE / TIINGO_END_DATE
py -m pip install python-dotenv requests pandas numpy pyyaml
cd research/rc1_autonomous_model
python3 fetch_tiingo.py      # exits with instructions if key missing; lists rejects (>=500 bars)
python3 check_data.py
python3 run_research.py      # overwrites this file + the real CSVs below
```
On the real run this file is replaced with: symbols loaded/rejected, windows tested, state
& band distribution, cap/gate distribution, High Clarity & Clear rarity, weakest_lens &
why_not_higher distributions, per-symbol segments. The harness also writes
`real_state_distribution.csv`, `real_ablation_results.csv`, `founder_review_queue.csv`.

## Sandbox verification done
`fetch_tiingo.py` ran and exited cleanly (code 2) with setup instructions — **no silent
failure, no secret printed.** Network probe to Tiingo: URLError (offline sandbox).
