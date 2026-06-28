# RangeClarity V2 — Engine Spec (the hidden Structure Quality Engine)

> Canonical. Pairs with `docs/RANGECLARITY_V2_SURFACE_SPEC.md` (the visible table).
> This is the **complex engine** behind the **simple surface**. Everything here is
> internal and deterministic; only a handful of **states** surface. Spec/lock —
> no Pine written until the founder approves an implementation pass.

## Design laws
- **Confirmed-bar only.** Every state that drives the table is computed on
  confirmed structure (confirmed pivots, closed bars). The live bar may *preview*;
  it is final on close. No repaint, no back-dating, no `request.security` lookahead.
- **Deterministic + bounded.** No unbounded loops; object pools reused; engine adds
  no chart objects of its own (it feeds states + the existing zone/channel draw).
- **Honesty.** Whole numbers only. Low is allowed to be low. Insufficient data shows
  `Insufficient Structure`, never a forced score. Agreement is rewarded; conflict is
  penalised — a score never inflates just because many things fire.
- **No volume engine, no momentum, no signals.**

## The seven hidden modules
Each emits an internal 0–100 quality plus a small surfaced **state**.

1. **Zone Quality** — touches, **freshness** (recency of last touch), **reaction
   strength** (ATR-normalised bounce), **violation history** (broken / reclaimed),
   **age decay** (stale + untouched → penalised), tightness/cleanliness. (Phase-1
   `f_rescore` already implements most of this, volume-free.)
   → state: `Fresh` / `Tested` / `Weak` / `Insufficient`.
2. **Location Quality** — signed **distance to key support/resistance** (%),
   **range position** 0–100 within the key band, **ATR distance**, **MA distance**.
   → state: `Near Support` / `Lower` / `Mid-Range` / `Upper` / `Near Resistance` /
   `Above Range` / `Below Range`.
3. **Trend Structure** — MA 20/50/200 **alignment**, **slope**, **channel quality**,
   **HH/HL or LH/LL consistency**.
   → state: `Clean` / `Mixed` / `Weak` / `Range-bound`.
4. **Regime** — `Trend` / `Range` / `Compression` / `Expansion` / `Chop`, from
   structure behaviour + an internal **volatility-percentile** context (ATR
   percentile; optional ADX kept internal/Advanced only — never a core promise).
   → feeds the score + Advanced; not a default row.
5. **Extension / Maturity** — stretched from structure (ATR distance from the MA /
   range mid), late-trend vs normal reset.
   → state: `Normal` / `Stretched` / `Extended`.
6. **Structure Delta** — compares the current **confirmed** read to the prior
   confirmed bar **and** the prior session/day (stored in `var` snapshots): did RC
   Score / key-zone set / trend state **improve**, **weaken**, or stay the same?
   → state: `Improved` / `Weakened` / `Unchanged`. *The daily habit hook.*
7. **Data Quality** — insufficient pivots, noisy/expanding range, or only weak
   zones → gates the whole read.
   → `OK` / `Insufficient` (forces `Insufficient Structure`, no number).

## Headline score formula (whole numbers only)
```
RC Score = Trend Structure 25
         + Location        25
         + Zone Quality    20
         + Regime          15
         + Extension       10
         + Structure Delta  5
```
**Hard caps (applied after the sum, in this order):**
- Data Quality = Insufficient → **no score**; show `Insufficient Structure`.
- Weak/unclear zones (Zone Quality `Weak`) → cap RC Score (e.g. ≤ 55).
- Choppy regime (`Chop`) → cap (e.g. ≤ 50).
- Extended location (`Extended`) → cap (e.g. ≤ 65).
- **Conflicting structure** (trend direction vs location/zone disagree) → lower the
  **state band** before any number can inflate.

**State mapping (calm, 3–4 bands):** `Clear` ≥ 70 · `Mixed` 45–69 · `Weak` < 45 ·
`Insufficient Structure` (data gate). The state is what the user reads; the number
is secondary and optional.

## Engine → surface mapping
| Engine module | Surface row | In score |
|---|---|---|
| (blend, capped) | RangeClarity (headline) | RC Score |
| Trend Structure | Trend Structure | 25 |
| Location Quality | Location | 25 |
| Zone Quality | Zone Quality + Key Zones | 20 |
| Regime | (Advanced) | 15 |
| Extension/Maturity | Extension | 10 |
| Structure Delta | Structure Change | 5 |
| Data Quality | gates the headline | cap |

## Pine v6 feasibility
All modules are scalar math on confirmed bars: MAs, ATR/percentrank, pivot arrays
(already maintained), and `var` snapshots for Structure Delta. No new overlays, no
heavy loops, no volume engine, no MTF in default. Object budget stays well under
the 60/60/60 limits (the engine reuses the existing zone/channel pools).

## Roadmap hooks (architected now, off by default)
- **HTF structure alignment (MTF):** the engine is structured so a later
  `request.security` (lookahead off) can add an HTF trend-structure agreement
  factor — **not** in the default view.
- **Alerts / AI text:** deferred; the state outputs are alert-ready when wanted.
