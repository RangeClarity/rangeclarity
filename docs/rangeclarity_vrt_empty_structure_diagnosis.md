# RangeClarity VRT Empty-Structure Diagnosis

Target: `pine/rangeclarity_sr_core_v1.pine`. Follows v1.4 (`docs/rangeclarity_empty_charts_line_ux_diagnosis.md`). Companion patch notes: `docs/rangeclarity_sr_core_v1_5_patch_notes.md`. Test case: **VRT daily** (strong uptrend near highs).

## 1. Why VRT daily shows no support/resistance
VRT is a strong, near-parabolic uptrend trading close to its highs. Two things combine:

- **No resistance above (correct):** at/near highs there are no confirmed pivot highs above price, so there is genuinely no overhead structure. That part *should* read "none above."
- **Support below is missed (the bug):** the nearest confirmed `ta.pivotlow(8,8)` is far below after the run, and v1.4's fallback only consulted (a) the scored-zone array and (b) the **single 50-bar lowest low** — which in a parabolic move is also >30% down. Both exceed the fallback budget, so `visCount = 0`. The fallback **never looks at the nearest recent pullback low** (a short window), which is the level a trader actually sees as support and is usually well within range.

So tracked zones exist (old/far pivots), but nothing renders, and the dashboard reads blank — making a clearly-structured chart look broken.

## 2. Where the problem lives
Mostly **fallback robustness + dashboard logic**, secondarily distance filtering:
- **Fallback source too coarse (primary cause):** only the zone array + one long-lookback extreme; no nearest-recent-pullback source.
- **Distance budget (secondary):** the binding limit is `fallbackDistPct` (~30%), and a parabolic name's nearest *confirmed* pivot can sit beyond it.
- **Dashboard (symptom):** it mirrored the empty result and showed blanks instead of a fallback/`none above`.
- **Pivot detection (contributor):** 8/8 confirmation is sparse, so recent shallow pullbacks aren't pivots yet.
- **Scoring (not the cause):** the nearest/fallback buckets don't gate on score, so thresholds aren't why VRT is empty.

## 3. Why strong uptrends / price discovery need special handling
In price discovery there is no real resistance above — forcing a line there would be **inventing fake structure**. The correct behavior is to *classify* resistance as "none above / price discovery" and put the effort into **local support below** (recent higher-low, pullback low, breakout base). Support and resistance are asymmetric here and must be handled asymmetrically.

## 4. Why "Swing S/R" should be renamed
"Swing" reads as trader jargon / debug text, not a premium product label. "Local S/R" (nearest structure), "Key S/R" (medium-quality scored), and "Strong S/R" (high-conviction) communicate *confidence tier* to the user without jargon, and read cleanly on a chart pill.

## 5. Minimal patch plan (v1.5)
1. **Robust fallback support:** nearest of {nearest support zone, **recent pullback low** `lowest(pullbackLookback)`, structure low `lowest(fallbackLookback)`} that is below price and within `fallbackDist` → subtle **Local S** line. The short pullback window is what fixes VRT.
2. **Honest fallback resistance:** only a real confirmed pivot-high zone above price within `fallbackDist` → **Local R**. **No raw-high resistance** — if none, dashboard says "none above" (or "price discovery" near the lookback high). Never invents resistance.
3. **Tier labels:** derive `Strong` / `Key` / `Local` from score; Strong/Key show the score, Local shows the % distance. Remove "Swing".
4. **Dashboard understands fallback:** Nearest support/resistance show tier + distance (or "none above" / "none nearby"); single "Strongest zone" → "Strong S 91" or "none local"; true "Visible levels" count.
5. Boxes stay rare (strong + narrow only); fallback/local levels are subtle lines only; far levels stay hidden (hard cap 40%).

## 6. Risks of showing too much weak structure
Clutter and false confidence. Mitigated by: at most one nearest + one strongest per side and ≤1 fallback per side; fallback only when a side is otherwise empty; subtle dashed styling and tier labels so a Local line never looks like a high-conviction zone; hard 40% cap.

## 7. Testing plan
- **VRT daily:** expect a subtle **Local S** below price; **Nearest resistance: none above / price discovery**; Visible levels ≥ 1.
- **BTCUSD daily:** local structure when present, nothing 80–90% away.
- **INOD / MELI / TSCO daily:** at least a Local S (and Local R where real) when recent structure exists; not empty.
- Edge: a genuinely structureless brand-new listing may still read "none nearby" — acceptable and rare.

## Note
Static review only — TradingView's Pine compiler has not been run here; a Pine Editor compile pass remains the final gate.
