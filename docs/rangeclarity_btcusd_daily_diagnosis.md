# RangeClarity S/R Core v1 — BTCUSD Daily Bug + UX Diagnosis

Target file: `pine/rangeclarity_sr_core_v1.pine`. Companion patch notes: `docs/rangeclarity_sr_core_v1_2_patch_notes.md`. Architecture: `docs/rangeclarity_sr_core_v1_architecture.md`.

## Symptom (reported)
On **BTCUSD / Bitstamp / 1D**:
- A support zone drawn near price 0 / below the visible chart.
- Label `S • Medium 75 • -99.9% • Developing`.
- Dashboard `Nearest support: around -94.1%`.

## Root-cause hypothesis (confirmed by code reading)
This is **not** a literal zero, a bad initialization, or NA corruption. BTCUSD on Bitstamp has price history going back to ~2011–2013 when BTC traded between roughly **$13 and ~$1,000**. `ta.pivotlow` legitimately created **real** support zones at those ancient prices. With BTC near ~$100k today, a zone at ~$100 sits at `(100 − 100000) / 100000 × 100 ≈ −99.9%` from price — exactly the reported number.

The zone is *real and correctly computed*. The bug is that **v1 had no concept of "too far / too old to matter."** Specifically:

1. **No distance gate.** Selection and the dashboard considered every non-broken zone in the array regardless of how far it was from current price. An ancient zone 99.9% away was eligible.
2. **Selection rewarded the wrong thing.** The dashboard's "nearest support" loop walked *all* zones; "strongest" was pure `max(score)`. A long-lived ancient zone accumulates touches/age over thousands of bars, so it can score "Medium 75" and win — even though it is meaningless for a trader today.
3. **No validity guard.** There was also no defense against a genuinely degenerate zone (mid ≤ 0, inverted top/bottom, NA fields) if one ever arose from a bad pivot or merge.

So the −99.9% zone was a *true* pivot that the engine had no reason to suppress. The fix is a **validity layer** plus a **max-display-distance filter**, and a selection redesign that distinguishes *nearest* from *strongest* among **valid, in-range** zones only.

## Exact code sections involved (pre-patch)
- **Zone creation:** `f_addZone(...)` from `ta.pivothigh/low` confirmations — *correct*, not the cause. Ancient pivots are valid input.
- **No filter existed** between the `zones` array and either (a) the visual selection block or (b) the dashboard "nearest/strongest" loop.
- **Visual selection (old):** a single bias-driven `f_topN(...)` list appended into one `sel` array, then drawn. `f_topN` filtered by type/state/score but **not by distance or validity**.
- **Dashboard (old):** a `for` loop over **all** `zones` computing nearest support/resistance by `mid < close`/`mid > close` and "strongest" by `max(score)` — **no distance or validity filter**, which is why it reported `-94.1%`.

## Classification of the cause
- Zone **initialization**: ✅ correct (not the cause).
- Zone **merging**: ✅ not implicated (the ancient zone is a standalone real pivot).
- **Scoring**: ⚠️ contributory — age/touch components let an ancient zone reach Medium, but scoring is *working as designed*; the real gap is no relevance gate.
- **Selection / rendering**: ❌ **primary cause** — no validity and no distance filtering; "nearest" and "strongest" both ran over the full unfiltered array.
- **Dashboard**: ❌ **primary cause** (same missing filters, separate code path from rendering).

## Minimal patch plan (applied)
Low-risk, additive, no architecture change, no new indicators:

1. **Validity layer** — `f_isValidZone(z)`: rejects NA fields, non-positive `mid`/`top`, inverted `top < bottom`, and uninitialized `createdBar`. Every selection/dashboard path now requires it.
2. **Distance gate** — input `maxDistPct` (default **30%**) + `f_inRange(z)`; an input `showFar` (default off) restores history mode for inspection. Zones beyond the gate are never drawn and never feed the dashboard.
3. **Bucket-based selection** (replaces the single `f_topN` dump):
   - A = **nearest support**, B = **nearest resistance** (closest *valid, in-range* zone each side, by absolute distance),
   - C = **strongest support**, D = **strongest resistance** (highest score among *valid, in-range*),
   - E = **bias extras** (Bullish → resistance above; Bearish → support below),
   - **de-duplicated** (an index can't be added twice), so nearest and strongest collapse to one box when they're the same zone.
   - Sideways uses **Range High / Range Low** from the strongest-or-nearest pair.
4. **Dashboard rewrite** — nearest/strongest now read from the same valid+in-range buckets; added **Visible zones** (drawn) vs **Tracked zones** (full array) so the count is honest.

## Visual selection redesign (neutral language)
Roles shown on labels: **Nearest S, Nearest R, Strong S, Strong R, Range High, Range Low, Above, Below** (signed % distance, except Range rows). No "Target"/"Defense"/buy-sell wording — structural and educational only.

## Patch risks & mitigations
- **Ternary + `array.get` out-of-bounds:** Pine can evaluate *both* branches of `a ? b : c`. The dashboard nearest/strongest reads were therefore written as guarded `if idx >= 0` blocks (not ternaries) so a `-1` index is never dereferenced — this avoids re-introducing the original `array.get index out of bounds` class of error.
- **Over-filtering on tight charts:** default 30% may hide everything on a very quiet instrument; `showFar` and a higher `maxDistPct` recover the old behaviour. Documented.
- **Object limits:** buckets cap visible zones to a small de-duplicated set (typically 2–6), well under the `max_boxes/labels` budget. Drawings are still cleared and rebuilt only on `barstate.islast`.

## Manual test plan (BTCUSD daily)
1. Open **BTCUSD / Bitstamp / 1D**. Confirm **no** zone near 0 / −99.9%; the lowest support shown is within ~30% of price.
2. Dashboard: "Nearest support" is a realistic small negative %, not −94%. Check **Visible zones** (small) vs **Tracked zones** (large, e.g. 40–60).
3. Toggle **Show far zones** on → ancient zones reappear (proves they're still tracked, just hidden by default).
4. Cross-check **AAPL / 1D** and **EURUSD / 1D** (no deep-history distortion) for sane nearest/strongest.
5. Set `maxDistPct` to 5% → only very close zones remain; to 100% → near old behaviour. Confirm no runtime errors at extremes.

## Note
Static review only here — TradingView's Pine compiler has not been run by us. A Pine Editor compile pass remains the final gate.
