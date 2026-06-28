# RC-1 Truth Engine — RC Score as permission, not prediction

> **Status: research spec / lock.** No Pine. Companion to
> `docs/RANGECLARITY_RC_SCORE_MODEL.md` (this is the RC-1 distillation + Agreement
> Engine). Core law: **RC Score is permission, not prediction.**

## What "permission, not prediction" means
RC Score does **not** forecast price, direction, or outcome. It grants **permission
to trust the structural read** — "how clearly and consistently does the structure
describe itself right now." A high score says *the picture is clean and the lenses
agree*, never *price will go up*. This is a clarity/trust meter, not a trade meter.

- High score = **earned structural agreement**, and is **rare**.
- Low/Unclear is the **honest default** — the burden of proof is on clarity.
- The score reads the **same for longs and shorts** (direction-agnostic).

## RC state bands (surface)
| State | Band | Meaning |
|---|---|---|
| **High Clarity** | **> 85** | rare; *all* lenses agree, no caps fired, strong data |
| **Clear** | 70–85 | clean, agreeing structure |
| **Mixed** | 45–69 | the **default**; partial agreement / ordinary noise |
| **Unclear** | < 45 | lenses disagree or structure is poor |
| **Insufficient Structure** | data gate | not enough confirmed structure to score |

> Brand-safe wording: the low state is **"Unclear" / "Insufficient Structure"** — we
> do **not** surface "No Edge" (an edge/trade judgment the Surface Spec retired). "No
> Edge" may exist only as an *internal* synonym in engine notes, never on the chart.

## Agreement Engine v1
Six lenses each emit a 0–100 quality and a small state: **Trend Structure, Zone
Quality, Location, Regime (chop), ATR Extension, MA Structure** (MA feeds Trend). The
Agreement Engine decides how they may combine.

### When modules AGREE
Two/three lenses agree when their states are mutually consistent **and point the same
way**, e.g.:
- Trend `Clean`(up) **+** Location `Near Support` **+** Zone `Fresh/Tested` → agreement.
- Trend `Range-bound` **+** Location `Mid-Range` of a clean range **+** Zone `Tested` on both rails → agreement (a clean range is clean structure).
- Regime `Trend`/clean `Range` **+** Extension `Normal` → supportive.

`agree3 = TrendDecided AND LocationMeaningful AND ZoneReal` is the gate for any score
**> 70**. Full agreement of **all six** + no caps + strong data is the only path **> 85**.

### When modules CONFLICT
A conflict is a *directional/structural disagreement* between lenses, e.g.:
- Trend up **but** price jammed **under** strong resistance (Location/Zone vs Trend).
- Strong Zone **but** Regime `Chop` (a level inside noise).
- Trend `Clean` **but** Extension `Extended` (clean but late/fragile).
Conflict → **cap 55** + a −10 penalty; never `High Clarity`.

### When a chart is CONTRADICTORY
**Contradictory** = ≥2 independent conflicts, or a lens directly negates another
(e.g., MA says up-trend while structure prints LH/LL down-structure). Contradictory →
force **Unclear** (cap ≤44) regardless of any single strong lens. This is the
strongest "do not trust" state short of Insufficient.

### When score must be CAPPED (min of all)
Applied as `min(base, every cap)` (from `RANGECLARITY_RC_SCORE_MODEL.md` §3):
- Insufficient data → **no number** (gate).
- Chop regime → **≤50**; Weak/one-touch zone → **≤55**; Conflict → **≤55**;
  Extended → **≤60**; Price-discovery location → **≤60**; Expansion → **≤60**;
  Lens missing (MA off / one-sided) → **≤65**; `agree3` fails → **≤69**;
  Contradictory → **≤44**.

### When score CAN EXCEED 85 (the rare ceiling)
**> 85 is permission of the highest order — it must be earned.** All must hold:
1. Data Quality strong (ample confirmed pivots, both sides defined).
2. **All six lenses** in their best state (Trend `Clean`, Zone `Fresh/Tested`,
   Location `Meaningful`, Regime `Trend`/clean `Range`, Extension `Normal`, MA aligned).
3. **No cap fired and no conflict** (not merely `agree3` — full agreement).
4. **Persistence:** the read held for ≥N confirmed bars (hysteresis), not a one-bar spike.
Target frequency: **High Clarity should appear on only a small minority of charts/bars**
(validated in the batch plan). If it's common, thresholds are too loose.

### When RC shows UNCLEAR / INSUFFICIENT
- **Unclear (<45):** genuine lens disagreement, contradictory structure, or chop.
- **Insufficient Structure:** &lt;2 confirmed pivots/side or no key zone — the data gate;
  show no number. Never invent a level to avoid this.

## Anti-false-confidence laws (recap)
AND-gates not averages · take the minimum of caps · hysteresis on band changes ·
confirmed-bar only · whole numbers · low may be low · no single lens can manufacture a
high score · volume is **0%** of the score (context/veto only) · structure, not trades.
