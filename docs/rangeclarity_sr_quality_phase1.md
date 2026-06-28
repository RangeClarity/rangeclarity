# RangeClarity — S/R Quality Upgrade (Phase 1)

Scope: `pine/rangeclarity_sr_core_v1.pine` only. Phase 1 of the Professional
Structure Stack — **fewer, better zones**, a structure‑only scoring model, RC
Engine v2 weights, and structure‑first dashboard wording. No Volume engine,
no new modules. **Simple Chart. Complex Engine. No Signals. No Noise. Just
Structure.**

## What changed
**1. Zone quality is now structure‑only (volume excluded).** `f_rescore`
re‑weighted to: Freshness 25 · Reaction 25 · Touch+retest 20 · Cleanliness 15 ·
Bias 15, with penalties for broken, stale (untouched > ~250 bars with < 2
touches), and weak (many touches, no reaction) zones. Freshness decays gently
with bars‑since‑touch so it **removes stale zones without chasing every new
pivot** (a fresh but untested level still scores low because the other 75 points
require real touches/reactions). Distance from price is applied at **selection**
(below), not baked into the persistent score.

**2. Fewer, better zones.** New `f_pickSide` chooses, per side, the **Key** zone
by relevance (`0.85 × quality + 0.15 × proximity`) plus an optional **secondary**
only if it is clearly distinct (> 1.5 ATR away) and high quality. Caps:
- Clean / Premium Dark / default → 1 key per side, secondary only if score ≥
  Strong threshold → usually 1, sometimes 2.
- Max Visual → up to 2 per side (secondary if ≥ Key threshold).
- Hard cap 4 real zones; the subtle anti‑empty fallback still adds ≤ 1 faint
  level per empty side when needed.
Overlap/duplicates are suppressed by the existing merge plus the distinctness
test; broken zones are excluded.

**3. RC Engine v2 score.** S/R Structure 35 · MA Structure 25 · Trend/Channel
Quality 20 · Location Clarity 20 · **Volume 0**. Trend/Channel Quality is the
derived Trend Quality (MA alignment/slope agreement). Location Clarity scores how
*clearly* price is framed (distance from the 200 MA + having key support and
resistance present) — **clarity, not direction**, so it never implies buy/sell.
Weights renormalize when the MA layer is unavailable.

**4. Volume is inert.** Volume is removed from the zone score entirely; the
`volScoring` input remains but no longer affects anything. Toggling it does not
change the zone score, the RC Score, opacity, labels, or any hierarchy.

**5. Dashboard wording (structure‑first).** The S/R row now reads **Structure →
Clear / Mixed / Weak** (Structure Clarity). Level rows are **Key Support** and
**Key Resistance**. On‑chart zone labels shortened to tier + side (e.g. "Key S",
"Strong R"). No volume row, no signal/entry/exit/conviction/liquidity wording.

## What was intentionally NOT built (Phase 1)
No Volume/Liquidity engine, no RVOL/z‑score, no VWMA conviction, no volume‑at‑
price binning, no absorption/rejection, no breakout‑participation scoring, no
Volume Confirmation score, no volume row, no alerts, no MTF, no VWAP/AVWAP, no
squeeze/breakout markers, no AI text. Volatility remains internal/dashboard
context only (not scored). MA layer left as‑is (already 20/50/200 + subtle cloud
+ 200 anchor, no rainbow).

## Wording policy
Allowed: Structure Clarity, Clear/Mixed/Weak, Key/Nearest Support, Key/Nearest
Resistance, Range/Trend Context. Forbidden: buy/sell, entry/exit, signal, setup,
confirmed, breakout confirmation, conviction, liquidity, absorption, prediction,
win‑rate.

## 20‑chart validation checklist (run in the TradingView Pine Editor — the gate)
> Statically verified here (balanced syntax, single definitions, correct
> ordering, volume inert, brand‑clean); **not compiled** in this environment.

Categories (test 1D and 4H each): clean uptrend (AAPL, NVDA), clean downtrend
(a weak/declining name), range/sideways (a chopping name), messy/no‑edge chart,
gaps/events name, low‑liquidity small‑cap, ETF/index (SPY, QQQ), crypto (BTCUSD).
For each: (1) compiles, no object‑limit errors; (2) ≤ 1–2 support + 1–2
resistance, ≤ 4 total; (3) no overlapping/duplicate zones; (4) stale zones gone;
(5) Key Support/Resistance is unambiguous; (6) strong zones clearly heavier;
(7) labels short; (8) dashboard shows Structure Clear/Mixed/Weak + Key levels +
Range/Trend; (9) **toggle `Use volume in scoring` → RC Score unchanged**;
(10) Max Visual impressive, Clean restrained; (11) no signal/arrow/prediction
language; (12) Bar Replay shows no misleading repaint (confirmed pivots only).
