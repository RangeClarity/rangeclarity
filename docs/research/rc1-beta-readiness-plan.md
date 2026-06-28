# RC-1 Beta-Readiness Plan

> Shortest defensible path from **now** (50 cases drafted, 0/50 labeled) to a **beta-ready**
> RC-1. Everything ties to `labels-50.csv`, Reject-Probe v0, the locked v0 caps
> (`validation/rc1-cap-thresholds-v0.md`), and the **false-high rate**. RC Score is
> permission, not prediction. No Pine, no returns, no live data without approval.

## 1. What "good enough for beta" means — measurable gates
Beta = **Green** in the rubric (§6). Hard gates:
| Gate | Beta (Green) target | Alpha (Yellow) entry |
|---|---|---|
| **False-high rate** | **0 on ≥300 reject cases → ≤~1% upper-95** (rule of 3) | 0 on ≥100 → ≤~3% |
| **Fatal false-high** | **exactly 0** (always, every level) | 0 |
| **High Clarity rarity** | **1–5%** of observations (≤2/50 on the seed) | ≤2/50 |
| **Cap accuracy** | **≥95%** (expected caps fire, none missing/extra) | ≥90% |
| **State accuracy** | **≥90%** exact (±1 band ≥98%) | ≥85% |
| **Band accuracy** | **≥90%** | ≥85% |
| **Min labeled sample** | **300** human-confirmed, stratified (≥20–30 per reject bucket) | 100 |
| **Manual review** | **100% of Clear/High audited** by a human | 100% of highs |
| **Segment robustness** | gate holds per segment: daily+weekly, large+small cap, trend+range, ≥2 yrs — **no segment with a false-high cluster** | daily+weekly + large+small |

If any gate fails, fix the **model**, never the test.

## 2. What creates conviction (strict hierarchy — cannot skip up)
1. **Negative-first rejection works** — the locked caps actually force Unclear on bad
   buckets (chop→44, contradiction→40, broken→50…). Foundation.
2. **labels-50 pass** — ≥46/50, 0 fatal, 0 false-Clear on any reject bucket, HC ≤2.
3. **100-case validation** — 0 false-high (≤~3% bound).
4. **300-case validation** — 0 on ~250 reject (**≤~1% bound**) — the real conviction line.
5. **False-high confidence intervals** — rule-of-three, computed **per segment**.
6. **High-score human audit** — every Clear/High reviewed; precision proven.
7. **Batch distribution sanity** — High Clarity rare, Mixed/Unclear dominate (calibration).
8. **Python prototype parity with manual rules** — the scorer reproduces the manual scores.
9. **Pine parity with Python rules** — the shipped indicator matches the validated Python.
Each layer rests on the ones below it. Conviction is cumulative.

## 3. What does NOT count as conviction
- **Good-looking screenshots** — cherry-picked, survivorship.
- **High correlation with returns** — RC measures clarity, not returns; wrong objective and against brand law.
- **Many indicators combined** — complexity ≠ correctness; it *raises* false-high risk.
- **High downloads of references** — adoption ≠ correctness (popularity is a ≤10 bonus only).
- **One model agreeing with itself** — no holdout = circular.
- **Unreviewed batch output** — a tidy distribution proves nothing without a high-score audit.
- **Thresholds optimized and tested on the same data** — in-sample overfit; needs a holdout.

## 4. Fastest beta path (A–I)
| Step | Purpose | Output | Pass | Fail | Effort | Who |
|---|---|---|---|---|---|---|
| **A. Complete manual labels-50** | ground truth + test locked rules | filled `labels-50-scoring-template.csv` (50/50) | ≥46/50, 0 fatal, 0 false-Clear on reject, HC≤2 | any fatal / false-Clear on a reject bucket | ~2–3h | **Founder/operator** (needs TradingView eyes) |
| **B. Run Reject-Probe v0 on labels-50** | measure false-high rate of current rules | conviction report (md+json) | false-high=0 on ~41 reject, 0 fatal | any false-high | ~0.5 day to build offline harness + run | Claude/dev (reads CSV, **no live data**) |
| **C. Fix any false-highs** | close cap holes | updated caps + re-run | FH back to 0 **without** crushing clean controls | can't fix without breaking positives → rethink model | ~0.5 day | Claude proposes, founder approves |
| **D. Expand to 100 labeled** | tighten bound (0/~80 reject → ≤~4%) | `labels-100` | 0 FH, distribution healthy | any FH | ~3–4h labeling | Founder (+Claude drafts cases) |
| **E. Build minimal Python scorer** | auto-score so 300+ needn't be all hand-labeled | scorer w/ ≥95% parity to manual on labels-100 | parity ≥95%, 0 fatal | parity gap / fatal | ~3–5 days | Claude/dev — **needs Alpaca approval** |
| **F. High-score audit** | precision; human reviews every Clear/High | audit log | 0 FH among audited highs | any FH | cheap (highs rare) | Founder |
| **G. Validate 300 / semi-labeled** | the ≤1% bound + segments | 300-case report + per-segment | 0 FH on ~250 reject, segment-robust | any segment FH cluster | ~1–2 days | Claude runs, founder audits highs |
| **H. Translate stable rules to Pine** | ship the validated rules | Pine matching Python | Pine↔Python parity on 300; qa:rc green | parity gap | ~3–5 days | Claude/dev — **needs Pine approval** |
| **I. Beta QA** | final live-chart check | QA sign-off + fresh 20-chart spot check | 0 fatal, FH CI holds, HC rare | any fatal/regression | ~1–2 days | Founder + Claude |

**Decisive sequencing.** A→B→C→D→F needs **no approvals and no live data** and already
earns **controlled alpha** (Yellow). Green beta then needs the two approval gates: **E
(Alpaca data)** and **H (Pine)**, with **G** in between. Do A–C immediately.

## 6. Beta-readiness rubric
| Level | Required data | Acceptable false-high | Required audits | Allowed claims | Not allowed |
|---|---|---|---|---|---|
| **Red — research only** | none labeled | unknown | none | internal research notes | any user-facing scoring |
| **Orange — prototype** | labels-50 passed + v0 run | ≤~7% bound (0/41) | seed self-audit | "experimental internal prototype" | external users; "reliable"; user-shown numbers |
| **Yellow — controlled alpha** | 100 labeled, 0 fatal, 0 FH | ≤~3–4% bound | 100% high-score audit | tiny invite alpha, heavy caveats ("early, structural clarity only, may be wrong") | paid; "validated"; rarity/accuracy claims |
| **Green — beta-ready** | 300 labeled, segment-robust, Python(+Pine) parity | **≤~1% bound, 0 fatal** | 100% highs + holdout once | **paid beta**; "conservative structural-clarity score; high scores rare & earned; not advice/not prediction" | "predicts"; "win-rate"; "profit"; returns claims |
| **Blue — premium-ready** | 1,000+ + S&P/Russell batch, multi-year | ≤~0.3% bound, 0 fatal | full batch audit + recalibration | premium positioning; published methodology + conviction stats | still never trade/return/prediction claims (brand law, permanent) |

## 7. Current gaps
- **Already strong:** complete, IP-clean, negative-first, *measurable* system; locked v0
  caps; stratified 50-case set across 11 buckets; false-high hunter design; statistical
  framework (rule-of-three, conviction ladder).
- **Missing:** any labeled data (0/50); the v0 harness (unbuilt); a Python feature engine;
  100/300 labeled; segment data; a holdout; Pine.
- **Blocking beta:** (1) **0/50 labeled — the gating blocker**; (2) v0 harness unbuilt;
  (3) no ≥300 validation; (4) Alpaca approval (scale) + Pine approval (ship).
- **Can skip for beta:** the 84-reference conviction scoring, the LLM review panel, the ML
  model-research/distillation layer (hand-rules may suffice for beta — ML is optimisation,
  not a beta gate), the 1,000/batch (that's Blue), advanced MTF/compression.
- **Must NOT skip:** manual labels (ground truth), **0 fatal false-highs**, the high-score
  audit, holdout cleanliness, ≥300 for the ≤1% claim, Python↔Pine parity if shipping Pine.

*(Internal Conviction Score that gates these levels: `rc1-conviction-score-framework.md`.)*
