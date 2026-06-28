# RC-1 Validation Framework — golden-seed measurement

> Turns the 20-case golden seed (`validation/labels.csv`) into a **measurable
> structural-clarity validation framework.** No Pine, no scoring-rule changes, no
> trading returns. The seed tests **correctness** (do caps/gates/fatal-avoidance
> behave); base-rate **rarity** is tested later on the random 100/5000 set.

## 1. Seed distribution (n=20)

**By expected_state** — HighClarity 1 · Clear 5 · Mixed 9 · Unclear 4 · Insufficient 1.
**By expected_band** — 86–100: 1 · 70–85: 5 · 45–69: 8 · 45–65: 1 · 0–44: 4 · NA: 1.
**By expected_caps** — none 6 · weakzone≤55 2 · chop≤50 2 · conflict≤55 2 · agree3≤69 1
· extended≤60 1 · pricediscovery≤60 1 · expansion≤60 1 · lensmissing≤65 1 ·
contradictory≤44 1 · too_close 1 · no_number 1. *(11 cap/gate types exercised.)*
**By scenario** — 20 unique (1 each). **By timeframe** — 1D ×19, 1W ×1.
**By asset** — US equities ×17, crypto ×1, operator-pick ×2.

**Human lens columns (`human_trend/location/zone/regime/extension`) are unpopulated**
— filled during Phase 2 capture. Their *intended* coverage (what the operator should
record per scenario), with gaps flagged:
- **Trend:** Clean ~8 · Range-bound ~3 · Mixed ~5 · Weak ~2. *(short-side only 1.)*
- **Location:** NearSupport, NearResistance, Mid, Upper, Above covered; **Lower thin,
  Below Range absent.**
- **Zone:** Fresh, Tested, Weak/one-touch, Stale, Insufficient covered; **Broken absent.**
- **Regime:** Trend, Range, Chop, Expansion covered; **Compression absent.**
- **Extension:** Normal, Stretched, Extended all covered.

## 2. Proposed model-output columns (the run sheet)
Kept **separate** from the immutable golden seed → `validation/validation-run-template.csv`
(one row per case per run). Maps the existing `engine_*`/`result` columns onto a full set:

| Column | Meaning |
|---|---|
| actual_score | model's 0–100 (blank if Insufficient) |
| actual_state | HighClarity / Clear / Mixed / Unclear / Insufficient |
| actual_band | numeric band the score fell in |
| actual_caps | caps that actually fired (semicolon list) |
| m_trend, m_zone, m_location, m_regime, m_extension | the five lens sub-scores 0–100 |
| agreement_score | how many lenses agree (0–6, normalised) |
| state_match | 1 exact · 0.5 ±1 band · 0 else |
| band_match | 1 if actual_band == expected_band else 0 |
| cap_match | 1 exact set · 0.5 partial · 0 if a required cap missing/extra-wrong |
| fatal_fail | TRUE/FALSE (see §4) |
| failure_reason | enum: none / false_clear_chop / false_clear_weakzone / false_clear_extended / false_clear_contradictory / number_on_insufficient / jump / wrong_band / wrong_caps / human_disagree |
| reviewer_confidence | 1–5 (how sure the human is of the label) |
| vcs_case | per-case Validation Conviction Score (§3) |

## 3. Validation Conviction Score (VCS)
Per-case 0–100, **with a fatal gate**:

```
if fatal_fail: vcs_case = 0          # any fatal zeroes the case (see §4)
else:
  vcs_case = 100 * ( 0.35*state_match
                   + 0.15*band_match
                   + 0.25*cap_match
                   + 0.15*agreement_correct
                   + 0.10*reviewer_agreement )
```
- **state_match / band_match / cap_match** — as defined above.
- **agreement_correct** — 1 if agreement_score is consistent with the state band
  (e.g. High/Clear ⇒ high agreement; Unclear ⇒ low/contradictory), else 0.
- **reviewer_agreement** — 1 if `human_rc_call` == `actual_state` (±1 band), scaled by
  `reviewer_confidence/5`.

**Run VCS** = mean(vcs_case) over all 20 (Insufficient case scores on "showed
Insufficient + no number"). **Phase-2 pass gate:** Run VCS ≥ 85 **AND** zero fatal
**AND** false-clear count = 0 **AND** High Clarity on ≤1–2 cases.

## 4. Fatal failures (any one → case fails, vcs=0, blocks the run)
1. **high_score_on_chop** — actual_state ∈ {Clear, HighClarity} while regime = Chop.
2. **high_score_on_weak/broken_zone** — Clear/High while key zone ∈ {Weak, one-touch,
   Broken, Insufficient}.
3. **high_score_on_severe_extension** — Clear/High while extension = Extended.
4. **clear/high_on_contradictory** — Clear/High while structure = Contradictory.
5. **number_on_insufficient** — any numeric score shown while data = Insufficient
   (must read "Insufficient Structure", no number).
6. **score_jump_without_structure_change** — |actual_score − prior_confirmed_score| > 15
   with no structural event (hysteresis breach).

Fatals are **non-negotiable**: even one in the 20 blocks Phase 2 until the model
(not the test) is fixed.

## 5. Validation report template (fill per run → `validation/reports/`)
```
# RC-1 Validation Report — <run_date> — model <version>
- Cases: 20 | Reviewers: <list>
## Headline
- Pass rate: <x>/20    Run VCS: <0-100>    Fatal count: <n> (must be 0)
- False-clear count: <n> (must be 0)
## Cap accuracy
- Correct-cap cases: <x>/20 ; per-cap table (expected vs fired vs missed/extra)
## High-score audit (every Clear / HighClarity case)
- case_id | actual_state | human "looks clean? Y/N" | notes   (any N = investigate)
## State distribution
- High/Clear/Mixed/Unclear/Insufficient counts vs expected ; Mixed+Unclear should dominate
## Top failure causes
- ranked failure_reason tally
## Recommended rule adjustments  (PROPOSAL ONLY — no rule change without approval)
- e.g. "chop cap leaked at VCS<x> → propose tightening Choppiness threshold"
```

## 6. What the 20 teach us / balance / gaps / before 100-chart

**What they teach.** This is a **stratified correctness set** (one positive/negative
control per failure mode), not a representative sample. It proves the **caps, gates,
fatal-avoidance, and symmetry** behave — it **cannot** validate "Clear is rare"
(Clear+High = 6/20 here *by design*). Rarity is a separate test on the random set.

**Where it's balanced.** All five states present; every major cap type has ≥1 case
(chop/conflict/weakzone ×2); clean positive controls *and* chop/contradictory negative
controls; one short-side symmetry case; one rare High-Clarity control.

**Where it's missing cases.**
- **Short-side** (only 1 downtrend); **Below Range / Lower** locations absent.
- **Compression/squeeze regime** absent; **Broken/reclaimed zone** absent.
- **Multi-cap simultaneous** (e.g. chop+extended) — real charts fire several; none here.
- **Boundary cases** at 69/70 and 85/86 to test band edges — none.
- **Timeframe/asset thinness:** 19×1D + 1×1W, no intraday; 17 equities, 1 crypto, no
  FX/futures/index/ETF.
- **No replication** (1 case/scenario ⇒ no within-scenario variance) and **single
  reviewer slot** (⇒ no inter-rater reliability).
- Case 19 (hysteresis) needs **two adjacent-bar screenshots**, not one.

**What must be added before 100-chart validation.**
1. **Replicate** each scenario ×2–3 and add the missing scenarios above (target ~40–50
   stratified cases) so caps are tested with variance, not single anecdotes.
2. **≥2 reviewers** on a shared subset → inter-rater agreement + `reviewer_confidence`.
3. **Boundary + multi-cap + short-side + compression + broken-zone** cases explicitly.
4. **Lock the hand-scoring worksheet** so reviewers compute VCS identically.
5. **Separate the random 100-set** (stratified-random sample) from this golden seed —
   the 100-set measures **rarity/base-rate**, the seed measures **correctness**. Keep both.
6. Confirm **Phase-3 Alpaca parity** so the same cases can be auto-scored and compared
   to the human VCS.
