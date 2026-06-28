# RC-1 Negative-First Scoring

> **Reject bad structure fast, before trying to reward good structure.** RC Score is
> **permission, not prediction**; it measures structural clarity/trustworthiness, not
> trade probability. Default state = **Mixed / Unclear**. Only clean structural
> agreement earns **Clear** or **High Clarity**. Research only — no Pine, no returns,
> no code/UI/name copying.

Core asymmetry: it is **easier and safer to lower a score than to prove a chart deserves
a high one.** The product must first be excellent at **not** giving high scores to
bad/unclear charts. Success = a near-zero false-high rate, **not** more highs.

## 1. Negative-First Scoring Architecture
Order of operations is inverted from a normal indicator: **gates → caps → penalties →
(only then) reward.**

- **Rejection gates (first, top-down).** Before any base score, run the gate ladder
  (§4). The **first** gate that triggers sets the ceiling and, for severe gates, the
  floor state. Data and contradiction gates can end scoring immediately.
- **Instant low-score conditions.** Insufficient data → no number. Contradiction or
  chop → forced Unclear. Broken key zone → forced ≤ low-Mixed. These never wait for the
  base calculation.
- **Hard caps (ceilings, take the minimum).** `ceiling = min(all triggered caps)`. A
  cap can only *lower*.
- **Penalty stack (subtract).** Soft penalties for stale/one-touch/low-freshness/minor
  conflict accumulate and subtract before the cap is applied.
- **Ambiguity handling.** When lenses are split or evidence is thin, **round down**, not
  up. Ambiguity resolves toward Mixed/Unclear, never toward Clear.
- **NA / Insufficient.** Shown when confirmed structure is too thin to read (pivots < 2
  per side, no key zone, or no MA-200). **No number** — never fake precision.
- **Suppress score confidence.** When a single lens is missing or the read just changed,
  hold the prior band (hysteresis) and/or widen toward Mixed; do not display a confident
  high number on shaky inputs.
- **Force Unclear.** Chop, contradiction, failed-breakout, severe instability → Unclear
  (< 45) regardless of any one strong lens.
- **Allow only Mixed.** Weak/stale zone, moderate extension, poor/mid location, ordinary
  conflict, compression, missing lens → capped into Mixed (45–69); cannot reach Clear.

## 2. Bad-Structure Taxonomy
Ten categories of bad/unclear structure. Each: meaning · on-chart · detect · RC state ·
cap · penalty · validation · false-high risk · dashboard wording · what **not** to say.

### A. Noise / Chop
Price oscillating with no directional structure; MAs tangled. **On-chart:** overlapping
wicks, flat braided MAs, no clean swings. **Detect:** high Choppiness, low Efficiency
Ratio, low ADX, MA tangle (C1/C9 in the matrix). **State:** Unclear. **Cap:** ≤44 (force
Unclear). **Penalty:** −10. **Validation:** RC1-05, RC1-20. **False-high risk:** HIGH
(chop masquerades as consolidation). **Dashboard:** "Unclear — choppy structure."
**Don't say:** "consolidation before breakout," "coiling."

### B. Weak Zone
A level with thin evidence — one touch, no reaction. **On-chart:** a line price barely
interacted with. **Detect:** touches < 2, reaction = 0, no clean bounce. **State:** Mixed
(Unclear if it's the only structure). **Cap:** ≤52. **Penalty:** −10 (one-touch).
**Validation:** RC1-10. **Risk:** MED-HIGH. **Dashboard:** "Zone Quality: Weak."
**Don't say:** "strong support."

### C. Broken Structure
A key zone was sliced/violated; the prior structure is invalidated. **On-chart:** a
decisive close through a level. **Detect:** zone.state = Broken; decisive close beyond a
key level. **State:** Unclear / low-Mixed. **Cap:** ≤50. **Penalty:** −12. **Validation:**
*(gap — add a broken-zone case).* **Risk:** HIGH. **Dashboard:** "Structure broken —
Unclear." **Don't say:** "support-turned-resistance, buy the retest."

### D. Poor Location
Price in no-man's-land — mid-gap, not near any defined level, or above/below the range.
**On-chart:** price floating between levels. **Detect:** distance to nearest key zone >
threshold; ambiguous range-position; Above/Below Range. **State:** Mixed. **Cap:**
mid-range ≤65; price-discovery ≤60. **Penalty:** −5. **Validation:** RC1-02, RC1-08.
**Risk:** MED. **Dashboard:** "Location: Mid-Range / Above Range." **Don't say:** "entry
zone."

### E. Overextension
Price stretched far from the anchor (200-MA / range mid) in ATR units. **On-chart:** price
far from the MA, parabolic. **Detect:** ATR distance Stretched/Extended (C2). **State:**
Mixed. **Cap:** Extended ≤60; **severe (>3 ATR) ≤50.** **Penalty:** −8. **Validation:**
RC1-07. **Risk:** MED-HIGH (a strong trend looks great but is late/fragile). **Dashboard:**
"Extension: Extended." **Don't say:** "momentum, ride it."

### F. Contradiction
Lenses point opposite ways (MA up while structure prints LH/LL). **On-chart:** rising MA
but lower highs. **Detect:** sign(trend) disagrees with location/zone on ≥2 lenses.
**State:** Unclear. **Cap:** ≤44 (≤40 recommended). **Penalty:** −10. **Validation:**
RC1-14. **Risk:** HIGH. **Dashboard:** "Contradictory — Unclear." **Don't say:**
"divergence, reversal incoming."

### G. Thin / Missing Data
Not enough confirmed structure (few pivots, no MA-200). **On-chart:** short history,
sparse swings. **Detect:** pivots < 2/side; bars < 200; no key zone. **State:**
Insufficient (data gate). **Cap:** **no number.** **Penalty:** n/a. **Validation:**
RC1-09, RC1-13. **Risk:** HIGH (a number on thin data is fake precision — a fatal).
**Dashboard:** "Insufficient Structure." **Don't say:** any number; "new uptrend."

### H. Compression Without Direction
Tight range / squeeze with no directional resolution. **On-chart:** narrowing range,
coiling, no trend. **Detect:** BandWidth contraction / NR + low ADX + no MA alignment
(C16). **State:** Mixed (Unclear if also choppy). **Cap:** ≤60. **Penalty:** −5.
**Validation:** *(gap — add a compression case).* **Risk:** MED (a squeeze looks
"ready"). **Dashboard:** "Compression — direction unclear." **Don't say:** "breakout
imminent, get ready."

### I. Score Instability
The read flips bar-to-bar with no structural event. **On-chart:** state/score jumping.
**Detect:** |Δscore| > 15 between confirmed bars without a structural change. **State:**
hold prior (hysteresis); suppress. **Cap:** delta-limit (smoothing). **Penalty:** n/a.
**Validation:** RC1-19. **Risk:** MED (a transient spike to Clear). **Dashboard:** stable
state. **Don't say:** rapidly changing calls.

### J. Visual / Dashboard Risk
Surface clutter or a scoreboard-of-numbers manufacturing false confidence. **On-chart:**
too many rows/zones, multiple /100s. **Detect:** > 7 rows; multiple per-row numbers; > 4
zones drawn; near-duplicate zones. **State:** n/a (surface). **Cap:** n/a. **Penalty:**
n/a. **Validation:** RC1-17. **Risk:** MED (numbers imply precision). **Dashboard:** state
words + **one** number, ≤ 7 rows. **Don't say:** a column of /100 sub-scores.

## 3. labels.csv negative-first review (see §8 for the proposed diff)
Summarised case-by-case in §8. Headline: 6 positive controls, 14 rejection tests; three
cases (RC1-05, 16, 20) have caps that don't guarantee their expected Unclear state.

## 4. Rejection Gate Priority Order (most → least severe)
Evaluated top-down; first trigger sets the ceiling (severe gates also set the floor state).

| # | Gate | Condition | Immediate state | Max score | Score shown? | Test case |
|---|---|---|---|---|---|---|
|1|Insufficient / missing data|pivots<2/side · no key zone · no MA-200|Insufficient|**none**|**Hidden**|RC1-09,13|
|2|Contradictory structure|≥2 lenses oppose|Unclear|≤44 (→40)|Shown|RC1-14|
|3|Broken nearby key zone|key zone violated/sliced|Unclear/low-Mixed|≤50|Shown|*(add)*|
|4|High chop / low efficiency|Choppiness↑, ER↓, ADX↓|Unclear|**≤44**|Shown|RC1-05,20|
|5|Severe overextension|ATR distance Extended (>3 ATR)|Mixed|≤50|Shown|RC1-07|
|6|Weak / stale zone|touches<2 / stale / no reaction|Mixed|≤52|Shown|RC1-10,11|
|7|Mid-range / poor location|no level nearby; mid-gap; above/below range|Mixed|≤60–65|Shown|RC1-02,08|
|8|Compression w/o direction|squeeze + low ADX + no alignment|Mixed|≤60|Shown|*(add)*|
|9|Trend–location disagreement|price against opposing level (incl. failed break)|Mixed (Unclear if failed break)|≤55 (failed break ≤44)|Shown|RC1-06,16|
|10|Score instability|Δ>15 w/o structural event|hold prior|smoothing|Shown (stable)|RC1-19|

## 5. What matters most to the user
**High-value (compute well — these earn or deny clarity):** Zone Quality · Location
Context · Chop/Regime · Extension · Agreement Engine · Hard Caps. *Why:* they determine
whether the structure is **trustworthy and readable**, and they are the levers that
**prevent false confidence**. Every one is a place a bad chart should be caught.

**Lower-value (de-emphasise):** exact score precision · complex MA variations
(Hull/ALMA/adaptive zoo) · many indicators · volume as a central score · reference
popularity · decorative dashboard detail. *Why:* they add complexity or precision-theatre
without improving clarity — and several (volume-in-score, decimal precision, dashboard
clutter) **actively create false confidence**. Whole numbers; 20/50/200 only; volume is
context (0%); popularity is a small bonus, not truth.

## 6. Negative-first scoring formula (conceptual)
```
1. GATES FIRST (top-down §4). On a data/severe gate → Insufficient (no number) or
   forced Unclear. STOP — do not compute a base.
2. Survivors only: base = structure-only weighted lenses (Trend/Location/Zone/Regime/Ext).
3. ceiling = min(all triggered caps).
4. base := base − Σ(soft penalties).
5. agreementFactor: full agreement required for >85; partial agreement holds ≤69.
6. final = clamp( min(base, ceiling) ) then hysteresis-smooth → band.
   Default lands in Mixed/Unclear unless agreement is clean.
```
**Severity ladder:**
- **Fatal Fail** — the read is invalid; we must never do it: a number on Insufficient,
  Clear/High on chop/contradiction/broken/extended, or a jump without a structural event.
  → voids the score / forces Insufficient or Unclear.
- **Severe Cap (≤44–50)** — chop, contradiction, broken zone, failed breakout → Unclear/low-Mixed.
- **Moderate Cap (≤52–65)** — weak/stale zone, extension, poor/mid location, conflict,
  lens-missing, compression → holds Mixed.
- **Soft Penalty (−5…−12)** — stale, one-touch, low freshness, minor conflict → nudges down.
- **No-Cap Observation** — volume context, round numbers, MTF note → informs only;
  **never raises** the score.

## 7. Recommended rubric changes (do NOT auto-apply — founder review)
The current rubric is slightly too generous for a negative-first product. Proposed:
1. **Chop cap ≤50 → ≤44** — chop must force Unclear, not low-Mixed. *(Fixes RC1-05/20.)*
2. **Add failed-breakout / false-break severe cap ≤44** (distinct from conflict ≤55).
   *(Fixes RC1-16.)*
3. **Add explicit mid-range / poor-location cap ≤65** (today only price-discovery ≤60).
4. **Severe-overextension cap ≤50** (Extended **and** >3 ATR) vs moderate ≤60.
5. **Name a broken-zone cap ≤50** (currently folded into weak-zone).
6. **Weak/one-touch zone cap ≤55 → ≤52**, and one-touch penalty −8 → −10.
7. **High Clarity (>85): require ≥3 confirmed bars persistence + zero caps + all six
   lenses best + full agreement.** Make explicit and stricter (rarer).
8. **Lens-missing cap ≤65 → ≤60.**
9. **Name a compression-without-direction cap ≤60.**
10. **Contradiction ≤44 → ≤40.**
Net effect: more conditions force Unclear; fewer paths reach Clear; High Clarity becomes
materially rarer. *(Apply only with approval; then re-run the validation framework.)*

## 8. Proposed labels.csv diff (NOT applied)
Justified consistency fixes — the listed caps cannot currently produce the expected
Unclear state:
```
RC1-05  expected_caps: chop<=50      → chop<=44          # force Unclear (was Mixed-capable)
RC1-20  expected_caps: chop<=50      → chop<=44          # same
RC1-16  expected_caps: conflict<=55  → false_break<=44   # failed break is severe, expects Unclear
RC1-03  (optional) expected_state Clear→Mixed; band 70-85→45-69; add midrange<=69
        # stricter mid-range: a clean range with price mid is good structure but not "at" a level
```
RC1-03 is **optional** (it reclassifies a positive control) → founder decision. The other
three are consistency fixes between cap and expected_state.
