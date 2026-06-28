# RC-1 Autonomous Modeling — Methodology

> How the offline research loop reduces dependence on manual labeling, and **exactly what
> it can and cannot prove.** Package: `research/rc1_autonomous_model/`. Offline only — no
> Pine, no live trading, no returns, no signal language, no future bars in scoring.

## Why this exists
The founder cannot reliably hand-score 50 charts. So instead of blocking on expert labels,
the system manufactures **weak labels** from strict rules, runs **massive offline
simulation**, **hunts false-highs**, and **ablates** each concept — producing a founder
review queue instead of a full labeling burden. **Important honesty bound:** weak labels
are *not* human truth (see Circularity below).

## Pipeline
`data_loader → features → weak_labeler → negative_first_scorer → simulator → optimizer →
ablation → false_high_hunter → metrics → report`.

## Data resolution (no fabrication)
local CSV (`data/ohlcv/<SYMBOL>.csv`) → Alpaca historical (if creds + package) →
**synthetic fixtures** (deterministic, regime-varied, tagged `source=synthetic`).
Synthetic runs verify the pipeline only; they are **not** evidence.

## Feature engine (confirmed-bar, ATR-normalised)
Trend (MA 20/50/200 align + slope + ADX + ER), Chop/Regime (Choppiness, ER, ATR
contraction/expansion), Zone (confirmed pivots → clusters, touches, freshness, broken,
width in ATR, de-dup), Location (Donchian/Keltner position, distance to zones, mid-range,
price-discovery), ATR Extension (distance from MA200 in ATR, severe flag), Agreement
(agreement_count, contradiction, weakest_lens). **No future bars** — every feature ends on
the confirmed as-of bar.

## Scoring law
**The score is the minimum of what structure permits, never the sum of what is present.**
Flow: `data gate → contradiction gate → chop gate → zone gate → location gate → extension
gate → agreement gate → hysteresis → final_state`. Caps from
`validation/rc1-cap-thresholds-v0.md`; `final = min(candidate, all triggered caps)`. High
Clarity requires full six-lens agreement + zero caps + persistence (rare by construction).
No additive confluence (enforced by the scorer contract).

## Weak labels (proxy ground truth)
Strict **reject** rules (chop, broken/weak/stale zone, severe extension, contradiction,
mid-range-no-structure, compression-no-direction, insufficient, unstable); strict
**clear** (clean trend/range + useful zone + good location + low chop + controlled
extension + high agreement + no caps); **high clarity** (extremely strict: full agreement,
zero caps, persistence, 1–5% target).

## Simulation
Per symbol × stepped as-of window: compute features → weak label → score → record state,
caps, weakest lens, why_not_higher, false_high_proxy, fatal_proxy. Future bars are read
**only** for evaluation proxies (future ER / chop / extension), never for scoring.

## Optimizer & objective (NOT returns)
Grid/random sweep over thresholds. Objective = 0.40 false-high prevention + 0.20 fatal
prevention (hard gate: any fatal → objective 0) + 0.15 cap accuracy + 0.10 band/state
consistency + 0.10 stability + 0.05 simplicity.

## Ablation
Remove one concept (chop/extension/zone/location/agreement); a concept **earns its place**
only if removal worsens false-high / fatal / High-Clarity inflation / stability.
(trend-quality + hysteresis ablation are state-level-deferred in v0.)

## Structural proxy validation (validity, not signals)
Compares forward structural behaviour (future ER, chop, extension) of Clear/High vs
Unclear groups. Checks that clarity ≠ noise. **Never** a trade signal, never fed to the
score.

## Circularity caveat (the key limitation)
Weak labels and the scorer share rule DNA, so their agreement is **partly circular**. A 0%
false-high proxy rate proves the caps fire and the scorer is internally consistent — it
does **NOT** measure the real-world false-high rate. **Real conviction requires human
labels (labels-50 → 100 → 300) and an untouched holdout.** Until then the model conviction
is **Red** regardless of the proxy numbers.

## What this can / cannot prove
- **Can:** the pipeline runs; caps fire; the scorer is conservative and stable; which caps
  are load-bearing (ablation); a founder review queue of the few cases worth human eyes.
- **Cannot:** a trustworthy false-high *rate*, calibration, or segment robustness — those
  need real data + human labels. No conviction is claimed from synthetic/weak-label runs.
