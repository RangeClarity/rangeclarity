# RC-1 Autonomous Model (offline research)

Reduce dependence on manual labeling by combining **weak labels + structural proxy
validation + massive offline simulation + false-high hunting + ablation** into a
data-driven RC-1 scoring loop. **Offline only — no Pine, no live trading, no returns
optimisation, no signal language, no future bars in scoring.**

## The law
**The score is the minimum of what structure permits, never the sum of what is present.**
No additive confluence. (See `docs/research/rc1-python-scorer-v0-contract.md`.)

## Pipeline
`data_loader → features → weak_labeler → negative_first_scorer → simulator → optimizer →
ablation → false_high_hunter → metrics → report`.

## Data resolution (no fabrication)
1. **local CSV** in `data/ohlcv/<SYMBOL>.csv` (`date,open,high,low,close,volume`), else
2. **Alpaca** historical Daily/Weekly **if** `ALPACA_API_KEY_ID` + `ALPACA_API_SECRET_KEY`
   are in the environment **and** the `alpaca` package is installed, else
3. **synthetic fixtures** — deterministic, regime-varied, **clearly tagged
   `source=synthetic`**. Synthetic runs verify the *pipeline*; they are **not** validation
   evidence and claim **no conviction**.

## Run
```
cd research/rc1_autonomous_model
python3 run_research.py            # full small universe (20)
python3 run_research.py --n 6      # quick smoke run
```
Outputs → `reports/`: `run_summary.md`, `candidate_rulesets.csv`, `best_ruleset.json`,
`false_high_cases.csv`, `high_clarity_audit.csv`, `ablation_results.csv`,
`segment_results.csv`, `feature_distributions.csv`, `proxy_validation.csv`,
`founder_review_*.csv`.

## To run on REAL data
Drop CSVs in `data/ohlcv/` (or set Alpaca env + `pip install alpaca-py`), then re-run.
**Conviction stays Red until human-labeled cases (labels-50 → 100 → 300) confirm the
false-high rate** — weak labels share rule DNA with the scorer and only test internal
consistency, not real-world false-highs.

## Honesty guardrails
No returns. No Pine. No future bars in scoring (proxies are evaluation-only). No
volume-in-score. No momentum/FVG/order-block inputs. No claim beyond available evidence.
