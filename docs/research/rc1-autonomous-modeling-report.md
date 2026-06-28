# RC-1 Autonomous Modeling — Run Report

> First end-to-end run of `research/rc1_autonomous_model/`. **Data source: synthetic
> fixtures (no local OHLCV, no Alpaca creds).** This verifies the pipeline; it is **NOT
> validation evidence and claims NO conviction.** Offline; no Pine, no returns, no live data.

## Run facts
- **Data available:** No real data. Python 3.10 + numpy + pandas present; no local CSVs,
  no Alpaca credentials → **synthetic fixtures** (deterministic, regime-varied).
- **Universe:** 20 symbols (config `universe_small`). **Windows scored:** 260
  (reject weak-label: 258). **Configs swept:** 8.
- **Commands:** `python3 run_research.py` (full) and `--n 6` (smoke). Reports in
  `research/rc1_autonomous_model/reports/`.

## Headline metrics (best ruleset, SYNTHETIC)
| Metric | Value | Note |
|---|---|---|
| false_high_proxy_rate | **0.0** | trivial — almost nothing is allowed Clear/High |
| fatal_false_high | **0** | hard gate held |
| rule-of-three upper-95 | 0.0116 | bound on 258 reject cases (proxy, not human) |
| Wilson upper-95 | 0.0147 | — |
| High Clarity rarity | 0.0 | 0 HC (strict by design) |
| State mix | Mixed 132 · Unclear 127 · **Clear 1** | over-rejection on synthetic noise |
| cap_accuracy | 1.0 | reject cases all capped below Clear |
| stability | 0.99 | few band jumps |
| **Provisional internal conviction** | **20/100 — RED** | capped; synthetic + weak-labels, no holdout |

**Honest read:** the negative-first system is *overwhelmingly conservative* on synthetic
noise — 258/260 windows reject, only 1 Clear, 0 High Clarity. So false-high = 0 is
**trivially true** (there are almost no highs to be wrong about). This proves the pipeline
runs and the caps fire; it does **not** prove discrimination. Only 1 Clear-eligible case →
true-clear recall is not measurable.

## Answers to the 8 questions
1. **Best ruleset:** all 8 configs tied (objective 0.874) — thresholds did not differentiate
   on synthetic data (expected; real data needed to separate them). Best = config_0
   (chop_ci 55, er 0.25, adx 18).
2. **Caps preventing the most false-highs:** **extension** — removing it produced a
   **fatal false-high** (config disqualified). chop and zone removal hurt stability.
3. **Concepts that earned conviction (ablation worsened on removal):** **extension (fatal!),
   chop (stability 0.99→0.97), zone (0.99→0.88).**
4. **Concepts that showed no effect here:** **location, agreement** — *artifact of
   over-rejection* (other caps already bind), **not** evidence they're useless. Recheck on
   real data with more Clear-eligible cases.
5. **Founder review queues:** `reports/founder_review_*` — suspicious highs, borderline,
   caps-saved, uncertain. (On this synthetic run these are tiny because highs are rare.)
6. **Python scorer v0:** the min-gate + locked caps as implemented are correct; keep them,
   no additive terms. Implement exactly this against the filled labels-50.
7. **Not into Pine yet:** everything — nothing is human-validated. No ML, no volume-in-score,
   no momentum, no Pine until labels confirm a false-high rate.
8. **Model conviction level: RED.** Pipeline works; real evidence does not exist yet.

## Proxy validation (future bars = evaluation only)
Mixed group future_er 0.411 / future_ci 43.5 vs Unclear future_er 0.328 / future_ci 49.9 —
i.e. less-unclear cases were followed by *slightly* cleaner, less-choppy structure
(directionally sane). **No Clear group to compare** (1 case) → not evidence.

## Top concepts to keep / remove
- **Keep (earned, even on synthetic):** ATR extension cap, chop cap, zone quality.
- **Re-test on real data (no effect on synthetic):** location cap, agreement gate.
- **Remove:** nothing yet — but the parameter grid is uninformative on synthetic; do not
  trust the tie. Volume/momentum/FVG were never included (correct).

## Blocker
**No market data.** The whole loop runs on synthetic fixtures, which cannot validate the
false-high rate. Two ways to unblock (your choice; both offline/historical):
1. Drop CSVs into `research/rc1_autonomous_model/data/ohlcv/<SYMBOL>.csv`
   (`date,open,high,low,close,volume`), or
2. Set `ALPACA_API_KEY_ID` + `ALPACA_API_SECRET_KEY` in the env and `pip install alpaca-py`.
Then re-run `python3 run_research.py`.

## Exact next task
This loop does **not** replace human truth — it is a measurement harness. The real
conviction path is unchanged:
1. **Get data** (CSV or Alpaca) → re-run for a real-data feature/distribution baseline.
2. **Manually score `labels-50`** (still the gating step for human-confirmed false-highs).
3. Run **Reject-Probe v0** on the human labels; only then does a false-high *rate* mean
   anything. Conviction stays **Red** until then.
