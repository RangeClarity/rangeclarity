# RangeClarity Empty-Charts + Line UX Diagnosis

Target: `pine/rangeclarity_sr_core_v1.pine`. Follows v1.3 (`docs/rangeclarity_empty_chart_diagnosis.md`). Companion patch notes: `docs/rangeclarity_sr_core_v1_4_patch_notes.md`. Tested-empty examples: INOD, BTCUSD, MELI, TSCO (daily).

## 1. Why INOD / BTCUSD / MELI / TSCO show no support/resistance
Every level the indicator can draw comes from **one source**: confirmed `ta.pivothigh/low(8,8)` zones held in the `zones` array. v1.3's "always-on nearest" still requires a *zone to exist in that array* within the distance budget on the correct side. On these names that intersection is frequently empty:

- **INOD / MELI (strong uptrends, near highs):** few confirmed 8/8 pivots near price; often **no pivot high above price at all** (price at/near highs) → no resistance candidate exists to show.
- **BTCUSD (large % swings):** the nearest confirmed pivot is often >30–60% away *in percent terms* because swings are huge; a fixed % radius hides it.
- **TSCO (range/chop then break):** when price sits between old structure or just broke a level, the just-broken pivot is excluded or far, and new structure hasn't confirmed yet.

Net: sparse 8/8 pivots + fixed % distance + single source = empty.

## 2. Which filter is most likely too aggressive
The **distance filter combined with the single pivot-zone source.** v1.3's `nearMaxDist` (60%) and `maxDistPct` (30%) are *fixed* percentages applied to a *pivot-only* candidate set. There is **no raw-swing fallback**, so when no 8/8 pivot sits inside the radius, nothing renders. The distance numbers themselves aren't crazy — the problem is they gate a candidate set that is too thin and don't adapt to volatility.

## 3. Is pivot detection too strict?
Partly. `pivL = pivR = 8` needs 8 bars on each side, so the most recent swing is only confirmed 8 bars late and shallow pullbacks never become pivots. On fast names this leaves gaps near price. Rather than loosen pivots (which would add noise and repaint risk), the fix is a **secondary source**: recent swing high/low over a lookback as subtle fallback lines.

## 4. Are minScore / strength thresholds too strict?
Secondary. `minScore` (40) and `strongThr`/`medThr` only gate the *strongest* and *box/line tier* — the nearest bucket already ignores score. So thresholds aren't the root cause of total emptiness; they affect *how* a level renders, not *whether* a nearest level exists.

## 5. Are distance filters too strict?
Yes, in two ways: (a) **fixed, not adaptive** — the same 30/60% applies to a calm $55 stock and a 5×-volatility name, so high-volatility charts get nothing inside the radius; (b) **no hard/soft tiering** — there's no wider "fallback only" band distinct from the primary band, and no absolute hard cap, so the only knob is one radius that's either too tight (empty) or too loose (far junk).

## 6. Why fallback levels are needed
Because confirmed pivots are a *sparse* sample of structure. A trader still needs "where's the nearest floor/ceiling" even when no clean 8/8 pivot qualifies. Recent swing highs/lows (or nearer-but-weaker pivots) answer that. Shown subtly, they fill the map without pretending to be high-conviction zones.

## 7. How to add fallback without making the chart noisy
- Fallback is **per-side and only when that side is empty** *and* total visible < `minVisibleLevels`.
- Fallback draws **lines only — never boxes**, dashed/dotted, dimmer than primary lines.
- Fallback is **distance-capped** (`fallbackDistPct`, hard-capped by `hardMaxDistPct` 40%) so it never resurrects 80–90% levels.
- Two-tier source: first a nearer pivot zone within the wider fallback radius ("Local"), else the recent swing high/low ("Swing").

## 8. Visual style improvement plan for lines
- Strong zone → **capped** shaded box (height-capped; a too-tall strong zone becomes a solid line, not a giant box).
- Strong-but-tall / strong line → **solid, thicker** (width 2).
- Medium → solid thin line. Weak → dashed thin line. Fallback → dotted/dashed, dimmest.
- Compact right-side label pills: `Local S • -3.2%`, `Strong R • 91`, `Swing S`. No score+% stacking, no debug text, no labels far from price.

## 9. Risks of showing too many weak levels
Chart clutter and false confidence in low-evidence levels. Mitigated by: caps (≤ ~2 primary per side + ≤1 fallback per side), fallback only when a side is empty, lines (not boxes) for everything below strong, and dimmer styling so hierarchy reads instantly.

## 10. Recommended minimal patch (v1.4)
Keep the architecture and the v1.3 strength-rendering. Add: (1) **adaptive local distance** `min(hardMax, max(localPct, ATR%×k, range%×k))`; (2) a **fallback layer** — nearest pivot within `fallbackDist`, else recent swing high/low — drawn as subtle lines labelled Local/Swing, only when a side is empty and visible < `minVisibleLevels`; (3) **box height cap** so strong-but-tall zones render as lines; (4) dashboard shows fallback distance / "fallback swing" / "none nearby" and a true **Visible levels** count. New inputs with clean defaults; far levels stay hidden (hard cap 40%).

## Note
Static review only — TradingView's Pine compiler has not been run here; a Pine Editor compile pass remains the final gate.
