# RC-1 Scoring Rubric

> Two rubrics: (A) how we score a **reference** for study value, and (B) how the **RC
> Score** itself is composed and bounded. Research only — no Pine.

## A. Reference scoring rubric (rate each source 1–5; high = better unless noted)
| Criterion | 1 → 5 |
|---|---|
| Transferable value | nothing for us → directly feeds an RC lens/rule |
| Conceptual clarity | black-box → explainable from first principles |
| Conservatism fit | hype/over-fires → calm, evidence-gated, structure-first |
| Visual simplicity | cluttered → screenshot-clean |
| Pine v6 feasibility | needs banned features → scalar math on confirmed bars |
| Originality headroom | me-too → lets us build something distinct |
| Generic-risk *(low=good)* | identical to many scripts → differentiated |
| Repaint/noise-risk *(low=good)* | repaints/lookahead → confirmed-bar safe |

**Promotion bar:** a reference becomes a candidate RC rule only if it scores **≥4** on
Transferable value, Conceptual clarity, and Conservatism fit, **and** is repaint-safe.
LuxAlgo/proprietary: study **description only**, never promote code-level detail.

## B. RC Score composition rubric
**Stage I — structure-only weighted base (volume 0%):**

| Lens | Weight | Source signal |
|---|---|---|
| Trend Structure | 25 | MA 20/50/200 alignment + slope + channel R² + HH/HL/LH/LL |
| Location | 25 | signed distance to key S/R, range position, ATR distance |
| Zone Quality | 25 | touches, freshness, ATR-reaction, violations, age decay (volume-free) |
| Regime | 15 | Trend/Range/Compression/Expansion/Chop (+ ATR percentile) |
| ATR Extension | 10 | ATR distance from MA/range mid → Normal/Stretched/Extended |
| Volume | **0** | **context/veto only — never additive** |

**Stage II — discipline (in order):** `agree3` gate → `min`-caps → penalties →
hysteresis → state band. Final = `min(base − penalties, every cap)`, smoothed.

**Caps:** Chop ≤50 · Weak/one-touch zone ≤55 · Conflict ≤55 · Extended ≤60 ·
Price-discovery ≤60 · Expansion ≤60 · Lens-missing ≤65 · no-agreement ≤69 ·
Contradictory ≤44 · Insufficient → no number.

**Penalties (subtract, then cap):** conflict −10 · stale key zone −8 · one-touch key
zone −8 · low freshness −5.

**Bands:** High Clarity >85 (rare, full agreement, no caps) · Clear 70–85 · Mixed
45–69 (default) · Unclear <45 · Insufficient (gate).

**Calibration targets (verified in batch):** High Clarity on a small minority of
observations; Clear a minority; Mixed/Unclear the bulk; no observation reads Clear
while any lens is Weak/Insufficient or in conflict; band changes ≤~15 pts/confirmed bar.

## Honesty rules
Whole numbers only · low is allowed to be low · agreement rewarded, conflict penalised
· a score never inflates because many things fire · structure not trades.
