# RangeClarity Empty-Chart UX Diagnosis

Target: `pine/rangeclarity_sr_core_v1.pine`. Follows the BTCUSD far-zone fix (`docs/rangeclarity_btcusd_daily_diagnosis.md`, v1.2). Companion patch notes: `docs/rangeclarity_sr_core_v1_3_patch_notes.md`.

## 1. Why the chart becomes visually empty on BTCUSD daily
The v1.2 fix added a hard 30% distance gate and a strict bucket selection to kill the −99.9% ancient zone. That over-corrected. On a trending daily chart three filters now compound and leave little or nothing near price:

- **Distance gate (30%) excludes the genuine nearest pivot.** With `pivL = pivR = 8`, confirmed swing points are sparse. After a sustained run the closest *confirmed* swing low can sit >30% below price, so `f_inRange` rejects it and `f_nearestIdx` returns −1 → no support drawn.
- **`state != "Broken"` drops the most relevant level.** Right after a breakout/breakdown, the level price just crossed is exactly the nearest support/resistance — but it is flagged `Broken` and excluded from every bucket. A broken resistance that price closed above (now *below* price) is a textbook flipped support, yet it disappears instead of showing.
- **All-or-nothing rendering.** Everything selected is drawn as a full box; there is no lighter tier. So a medium/weak nearby level is either a loud box or absent — there is no quiet "reference line," which is what a clean chart needs to avoid feeling empty.

## 2. Is it selection, thresholding, rendering, or distance filtering?
All four, in this order of impact:
1. **Distance filtering (primary):** 30% gate is too tight for the always-on nearest level on trending dailies.
2. **Selection logic (primary):** excluding `Broken` removes the post-move nearest level / polarity flips.
3. **Rendering rules (secondary):** single box mode gives no subtle tier, so weak-but-useful levels are dropped rather than shown lightly.
4. **Score thresholding (minor):** `minScore`/`showWeak` gate the *strongest* and bias-extra buckets, but the nearest bucket already ignores score — so thresholds are a contributor, not the root.

## 3. How the strong-only logic is too aggressive
The map collapsed to "show a zone only if it is valid, within 30%, not broken, and (for strongest/extras) scores ≥ 40." On a clean trending instrument that intersection is frequently empty near price. The product needs a guaranteed floor — *always* a nearest valid support below and a nearest valid resistance above when one exists at all — rendered subtly if weak.

## 4. Proposed minimal rendering redesign
Render mode is decided by the selected zone's **own score**, not by role:

| Score | Mode | Visual |
|---|---|---|
| ≥ strongThr (80) | **box** | shaded zone, 2px border — a true area |
| 60–79 | **band** | solid horizontal line at mid, clear |
| 40–59 | **line** | dashed thin line, faint — a reference level |
| < 40 | **faint** | dotted thin line — only ever shown when it is the nearest valid S/R |

Selection guarantees the floor:
- **Always:** nearest valid support below + nearest valid resistance above, within a wider `nearMaxDist` (default 60%), and **including broken/flipped levels on the correct side of price** (free polarity-flip display).
- **If available:** strongest support + strongest resistance (still gated, still excludes broken).
- **Sideways:** strongest-or-nearest pair relabeled Range High / Range Low.
- De-duplicated so nearest == strongest collapses to one object.

Labels stay short: `Nearest S • 58 • -2.4%`, `Strong R • 91`, `Range High • 76`.

## 5. Risks of making the chart busy again
- **Too many lines:** mitigated — selection still caps at ~4 levels (2 per side) + range; render mode only changes box vs line for those few, it does not add objects.
- **Broken levels everywhere:** mitigated — only the *single* nearest per side may be broken; strongest still excludes broken.
- **Wider nearest distance resurrecting ancient zones:** mitigated — 60% still hides a −99.9% level; only the genuinely closest valid level within 60% shows.
- **Label clutter:** mitigated — dropped the bias-extra `f_topN` dump (was up to 3 extra boxes+labels per side); bias now affects scoring emphasis and the dashboard, not object count.

## 6. Recommended clean solution
Keep the architecture. Add two score thresholds + a wider nearest-distance input; relax the nearest bucket (wider distance, allow broken on the correct side); render selected zones by strength (box / band / line / faint) using a `line` pool; drop the bias-extra dump; and make the dashboard show separate Strongest support / Strongest resistance rows and an explicit "none" when no nearest level exists. This is the v1.3 patch.

## Note
Static review only — TradingView's Pine compiler has not been run here; a Pine Editor compile pass remains the final gate.
