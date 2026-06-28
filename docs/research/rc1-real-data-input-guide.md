# RC-1 Real Data Input Guide (Tiingo EOD)

> How to feed real Daily OHLCV into the autonomous harness. **Research validation only —
> not financial advice, not beta readiness.** Secrets stay in `.env` (gitignored); the key
> is sent as an auth header, never printed/committed.

## Why you run this locally
This assistant's sandbox has **no outbound network** (`api.tiingo.com` is unreachable) and
no key in its env, so it **cannot fetch here**. The loader is built to run on **your
machine**, where `.env` + internet exist.

## 1. Set the key (once)
In the repo-root `.env` (already gitignored):
```
TIINGO_API_KEY=<your key>
# optional:
TIINGO_START_DATE=2018-01-01
TIINGO_END_DATE=2025-01-01     # omit for latest
```
**Never** commit `.env` or paste the key into code/logs.

## 2. Install deps
```
py -m pip install python-dotenv requests pandas numpy pyyaml
```

## 3. Fetch → validate → baseline
```
cd research/rc1_autonomous_model
python3 fetch_tiingo.py     # pulls the 20 symbols -> data/ohlcv/<SYM>.csv (+ raw cache in data/ohlcv/tiingo/)
python3 check_data.py       # readiness: bar counts, schema, missing symbols
python3 run_research.py     # Real Data Baseline v1: distributions, ablation, founder queue
```

## What the loader does
- Endpoint: Tiingo daily prices; key in `Authorization: Token` header (not the URL).
- **Adjusted OHLCV** (`adjOpen/High/Low/Close`, `adjVolume`) is used for modeling; the full
  **raw + adjusted** rows are preserved in `data/ohlcv/tiingo/<SYM>.csv`.
- Canonical run file schema: `symbol,date,open,high,low,close,volume` (adjusted).

## Validation (per symbol; rejects reported, never silently dropped)
required columns · valid ISO dates · sorted ascending · no duplicate dates · **≥ 500 bars**
· no impossible OHLC (`high≥low`, `high≥open/close`, `low≤open/close`, all > 0) · volume
present. Symbols failing any check are listed as rejected with the reason.

## Universe (20)
SPY QQQ AAPL MSFT NVDA TSLA META AMZN KO XOM JPM GE F AMD AVGO CVX INTC JNJ WMT DIS.

## After the baseline
Read `reports/real_baseline_summary.md` + `docs/research/rc1-real-data-baseline-v1-report.md`.
Conviction stays **Red** — weak labels are not human truth; this is a real-market
*distribution baseline*, not validation. The human-label path (labels-50 → Reject-Probe v0)
remains the route to real conviction.
