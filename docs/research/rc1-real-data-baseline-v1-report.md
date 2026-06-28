# RC-1 Real Data Baseline v1 — Report (Tiingo EOD)

> **Provider: Tiingo EOD (approved).** Loader built and wired; **the live fetch is blocked
> in the assistant sandbox** (no outbound network: `api.tiingo.com` URLError; no key in
> sandbox env). **No data fetched, none fabricated.** You run one command locally to
> produce the real baseline. Research validation only — **not** beta readiness, **not**
> financial advice. **Conviction: RED.**

## Secrets safety (verified)
`.env` exists at repo root and **is gitignored**. The Tiingo key is read from `.env` and
sent as an `Authorization: Token` **header** (never in the URL, never printed, never
written to a file, never committed). `fetch_tiingo.py` ran here and exited cleanly (code 2)
with setup instructions — **no secret shown, no silent failure.** *(The key you pasted in
chat was not stored anywhere; consider rotating it since it appeared in plaintext.)*

## What was built / changed
- `research/rc1_autonomous_model/fetch_tiingo.py` — Tiingo daily → adjusted OHLCV →
  validate (≥500 bars) → cache (`data/ohlcv/tiingo/<SYM>.csv` raw+adj; `data/ohlcv/<SYM>.csv`
  canonical adjusted).
- `research/rc1_autonomous_model/requirements.txt`, `data/ohlcv/README.md`,
  `data/ohlcv/_TEMPLATE.csv`, `check_data.py` (from v0 prep).
- `docs/research/rc1-real-data-input-guide.md` (this guide's companion).
- `reports/real_baseline_summary.md` (blocker + run commands).

## How to run (locally, where .env + network exist)
```
py -m pip install python-dotenv requests pandas numpy pyyaml
cd research/rc1_autonomous_model
python3 fetch_tiingo.py      # 20 symbols, 2018-01-01..latest (override via TIINGO_START_DATE/END_DATE)
python3 check_data.py        # readiness; usable symbols must be > 0
python3 run_research.py      # Real Data Baseline v1
```

## Data validation enforced by the loader
required columns · ISO dates · sorted ascending · no duplicate dates · **≥ 500 bars** · no
impossible OHLC (`high≥low`, `high≥open/close`, `low≤open/close`, all > 0) · volume present.
Rejected symbols are listed with reasons (no silent drops). Adjusted OHLCV is used for
modeling; raw is preserved in the cache.

## Reports the real run will produce (auto)
`real_baseline_summary.md`, `real_state_distribution.csv`, `real_ablation_results.csv`,
`founder_review_queue.csv` (+ the v0 report set). Each answers: symbols loaded, windows
tested, Unclear/Mixed/Clear/HighClarity distribution, High-Clarity rarity, caps fired most,
weakest_lens & why_not_higher distributions, over-rejection verdict, and the top-20 queues
(suspicious highs / borderline / caps-saved / uncertain).

## Carried refinement recommendations (proposals only — revisit on real data)
- **Keep (earned on synthetic ablation):** extension cap (fatal on removal), chop cap, zone quality.
- **Likely too-binding on real markets:** zone-`Weak`-when-touches<2 + mid-range combo drove
  258/260 synthetic rejects — re-check `zone_touch_min`/cluster width; consider letting a
  clean trend reach Clear via trend+location+regime agreement without a 2-touch zone.
- **Unproven (no synthetic effect):** location cap, agreement gate — never the binding
  constraint; real data with Clear-eligible cases is needed to judge them.
- **De-circularity (recommended):** make weak-label reject conditions lean on an independent
  signal (e.g. realised forward chop/efficiency, evaluation-time only) so the false-high
  proxy isn't self-fulfilling.
- **Leave unchanged:** min-gate law, fatal definitions, volume-as-context (0%), confirmed-bar.

## Final answers
- **Files changed:** `fetch_tiingo.py`, `requirements.txt`, `rc1-real-data-input-guide.md`,
  `reports/real_baseline_summary.md`, this report (+ v0 data-readiness files).
- **Command run (sandbox):** `python3 fetch_tiingo.py` → exit 2 (no key/network), clean.
- **Symbols fetched:** **0 here** (sandbox offline). Expected locally: up to 20.
- **Symbols rejected:** n/a here (nothing fetched); locally any symbol with <500 bars or
  bad OHLC is rejected with a reason.
- **State distribution:** pending the local run.
- **Best current ruleset:** config_0 (chop_ci 55 / ER 0.25 / ADX 18) from the synthetic run
  — placeholder; the grid was uninformative on synthetic and must be re-swept on real data.
- **Model weaknesses:** over-rejection on noise; coarse zone touch/freshness features; noisy
  2-pivot contradiction; weak-label/scorer circularity; location & agreement unproven.
- **Exact next refinement step:** run the 3 commands locally → read the real over-rejection
  audit → if over-rejecting, relax the zone/mid-range binding (per above) and re-sweep; in
  parallel, score `labels-50` for the only human-confirmed false-high evidence. Conviction
  stays **RED** until then.
