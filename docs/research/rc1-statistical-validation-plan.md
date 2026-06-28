# RC-1 Statistical Validation Plan

> Upgrades RC-1 validation from qualitative research into a **quantitative,
> probabilistic conviction framework.** RC Score measures **structural clarity, not
> trade probability**; high scores must be rare; the danger we are bounding is **false
> confidence** (bad/unclear charts getting Clear/High Clarity). Research/QA only — **no
> Pine, no returns optimisation, not financial advice, no restricted scraping.**

## Governing principle
```
Conviction = large data  +  pre-defined metrics  +  false-high rate with confidence intervals
Data volume alone ≠ conviction.
```
The headline number we are chasing: **0 false-highs out of N human-confirmed bad charts**,
which (rule of three) bounds the false-high rate at ~3/N with 95% confidence. 0/300 ⇒
**< ~1%** — the first point where conviction becomes real.

## 1. Conviction ladder
| Level | Dataset | What it buys | Statistical claim |
|---|---|---|---|
| **0** | research hypotheses + reference support | direction only | none |
| **1** | 20-case seed (`labels.csv`) | "not obviously dangerous" | **0 fatal false-highs** required |
| **2** | 100 labeled, stratified by bad-structure | early confidence | false-high target = 0; 0/100 ⇒ ≤~3% |
| **3** | 300 labeled | serious false-high estimate | **0/300 ⇒ ≤~1% @95%** (rule of three) |
| **4** | 1,000 labeled/semi-labeled windows (scenario × TF × sector × vol) | strong internal confidence | 0/1000 ⇒ ≤~0.3%; per-segment CIs |
| **5** | large batch — S&P 500 + Russell 2000, multi-TF, multi-window | distribution, calibration, robustness | full distribution + segment CIs |

Advance one level at a time; a failure at any level halts promotion until the **model**
(not the test) is fixed.

## 2. Sample-size math
**Estimating a proportion (95% confidence):**
```
n ≈ 1.96² · p·(1−p) / margin²      (worst case p = 0.5 ⇒ 1.96²·0.25 = 0.9604)
±10% margin → n ≈ 96   (~100)
±5%  margin → n ≈ 385
±3%  margin → n ≈ 1,067
```
**False-high upper bound when we observe 0 failures (rule of three / Hanley):**
```
95% upper bound ≈ 3 / n        99% upper bound ≈ 4.6 / n
0/60  → ≤ ~5%        0/150 → ≤ ~2%
0/300 → ≤ ~1%        0/600 → ≤ ~0.5%        0/1000 → ≤ ~0.3%
```
Reading: to *claim* a sub-1% false-high rate you need ≈ **300 clean passes** on bad
charts. Sub-0.5% needs ≈ 600. These are **per-stratum** ideals; the batch aggregates them.

**Efficient labeling shortcut (precision audit).** You do not need to hand-label every
chart's full state. Because High Clarity is rare (1–5%), the cheap, rigorous protocol is:
run the model on a large set and **human-audit every chart it scored Clear/High** ("is
this actually clean? Y/N"). A false-high = model said Clear/High, human says bad. In a
1,000-chart batch that's only ~10–50 audits. Combine with a **stratified bad-set rejection
test** (N human-confirmed bad charts, expect 0 highs) for the rule-of-three bound.

## 3. Primary & secondary metrics (pre-defined — declare before collecting)
**Primary**
- **False-High Rate** — P(bad/unclear chart receives Clear or High Clarity). *Target 0;
  bound by rule of three.*
- **Fatal False-High Rate** — P(chop / broken zone / contradiction / severe extension
  receives **High Clarity**). *Must be exactly 0.*
- **Band Accuracy** — expected_band == actual_band (±1 band tolerance reported separately).
- **State Accuracy** — expected_state == actual_state.
- **Cap Accuracy** — expected caps fired, none missing/extra.
- **High-Clarity Rarity** — share of observations at >85. *Target ~1–5%; if higher,
  thresholds are too loose.*

**Secondary** — score stability (Δ distribution), hysteresis-violation count, agreement-
score consistency vs state, score distribution by scenario, **calibration by band** (does
"Clear" actually look clean on audit?).

## 4. Correlation / proxy framework (structural, NOT returns)
**Do not correlate RC Score with profit.** Correlate it with **structural proxies**
computed post-hoc, to check that high-clarity reads *behave differently* from unclear
reads:
- future **trend efficiency** over next N bars (net move ÷ path length);
- **lower realised chop** (Choppiness/Efficiency Ratio) over next N bars;
- **lower zone-overlap ratio** / cleaner level interaction;
- **structure persistence** (the read holds, not immediately invalidated);
- **lower score instability** going forward;
- **fewer immediate cap violations** after a high read;
- **volatility-normalised movement cleanliness.**

**These are validity checks on the *clarity construct*, not trade signals, not
predictions, not returns.** They confirm "high structural clarity ≠ noise," and are
**never fed back into the score** (no lookahead in scoring). If high-clarity charts are
*not* structurally cleaner forward than unclear charts, the construct is broken — that's
the only inference drawn.

## 5. Stratified validation design (by bad-structure bucket)
Eleven buckets (from the negative-first taxonomy + positive controls):
Chop · Weak zone · Broken zone · Mid-range/poor location · Overextension · Contradiction
· Compression · Thin data · Clean trend · Clean range · Full agreement.

| Stage | Per bucket | Total (~11 buckets) | Use |
|---|---|---|---|
| Early | **20** | ~220 | catch obvious failures, tune gates |
| Stronger | **50** | ~550 | per-bucket false-high CIs |
| Robust | **100** | ~1,100 | tight per-bucket bounds (0/100 ⇒ ≤~3%/bucket) |

Bad-structure buckets are weighted heavier than positive controls (the product's job is
rejection). The current seed has **gaps**: Broken zone and Compression have 0 cases — add
first.

## 6. Train / Validate / Holdout
- **Research set** — used to *design* rules (the 20-seed + early 50).
- **Validation set** — used to *tune* caps/thresholds.
- **Holdout test set** — **never touched** until final evaluation; reports the honest
  false-high CI.

**Splits (use several):** time split (older→design, newer→holdout), symbol split, sector
split, market-regime split. **Anti-leakage (hard rules):** confirmed bars only · no future
bars in the score · no lookahead pivots unless delayed/confirmed · **never tune on the
holdout** · proxies (§4) may use future bars *for evaluation only*, never in scoring.

## 7. Robustness checks
Re-estimate the primary metrics across: S&P 500 vs Russell 2000 · large vs small cap ·
high vs low volatility · trending vs range markets · daily vs weekly · different years ·
sector groups. **No segment may hide a false-high cluster** — report per-segment CIs, not
just the pooled number. A single bad segment blocks promotion.

## 8. Decision thresholds (promotion gates)
- **→ Python prototype** if: 20-case labels pass · **zero fatal false-highs** · negative-
  first gates accepted.
- **→ Pine** if: **100+ labeled cases pass** · false-high rate acceptably low · High
  Clarity remains rare · caps behave consistently across buckets.
- **→ Beta** if: **300 labeled cases pass** · **0 fatal false-highs** · false-high CI
  acceptable (≤~1% upper bound) · batch distribution healthy · **no major segment failure.**

## 9. Risks
- **Label cost** — 300 human-confirmed bad charts is real work; mitigate with the precision-
  audit shortcut (§2) + prototype-assisted scoring (human audits only the highs).
- **Bucket imbalance / rare buckets** — Broken/Compression/Contradiction are rarer in the
  wild; deliberately oversample them (stratify, don't random-sample).
- **Leakage** — the #1 way to fake conviction; enforce §6 hard rules, especially holdout
  hygiene and confirmed-bar scoring.
- **Survivorship/delisting** in historical universes skews distributions — note it.
- **Construct drift** — "bad chart" labels must follow the taxonomy, not gut; lock a
  labeling guide and measure inter-rater agreement.
- **Proxy misread as trading** — §4 proxies are validity checks, never signals; keep that
  framing explicit so the work is not mistaken for a backtest.

## 10. Recommendation (decisive)
**How much data per conviction tier:**
- **First sanity:** 20 (have it) — zero fatal false-highs.
- **Early conviction:** **50 stratified now** (≥4–5 per bucket, incl. the missing Broken
  & Compression cases). 0/50 only bounds ≤~6%, but it cheaply hardens the negative-first
  gates and gives a prototype a real target.
- **Strong conviction:** **300** (0/300 ⇒ ≤~1%). The first "real conviction" point.
- **Premium product confidence:** **1,000+ stratified + the large batch** (0/600 ⇒
  ≤~0.5%) with per-segment CIs and calibration.

**Sequence — be decisive: A → B → (C/D via prototype).**
1. **A — Expand `labels.csv` to 50 now.** *Chosen.* Cheapest high-information step; it
   closes the Broken/Compression gaps, exercises every bucket, and sharpens the caps from
   the negative-first pass **before** any code.
2. **B — Build the Python prototype** (Alpaca Daily/Weekly) once the 50 pass — so 300 and
   the batch can be **auto-scored** (with human audit of every high), not hand-labeled.
3. **C/D — 300 labeled, then the large batch** via the prototype, for the ≤1% bound and
   the distribution/calibration/robustness checks.

**Not B/C/D first:** coding against only 20 cases (B) would miss bucket-specific failures;
300 hand-labels (C) before a prototype is slow and un-scoreable; a batch (D) now validates
nothing because there is no calibrated model yet.

## Output recap
Plan ✔ · sample sizes (96/385/1067; 3/n bounds) ✔ · conviction ladder (L0–L5) ✔ · metric
definitions ✔ · structural-proxy framework (not returns) ✔ · train/val/holdout + anti-
leakage ✔ · risks ✔. **Exact next task:** expand `labels.csv` to ~50 stratified cases
(add Broken-zone and Compression buckets; ≥4–5 per bucket; keep positive controls a
minority), with a one-page labeling guide and the pre-declared metrics above. Still
upstream of Pine, batch, push, Telegram, and Linear.
