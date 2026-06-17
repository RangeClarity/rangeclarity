# Support / Resistance Patterns

Distilled concepts for meaningful zones (not a hundred lines): pivot zones, swing highs/lows, volume/reaction zones, multi-touch zones, dynamic S/R, zone strength.

## The core question

"Where is price likely to react, and how strong is that level?" The value is *selectivity* — two good zones beat twenty noisy lines.

## Concepts worth keeping

### Zones, not lines
- A level is a **band** (e.g. pivot ± a fraction of ATR), because real reactions cluster, not snap to a tick.
- ATR-scaled width self-normalizes across instruments.

### Build zones from confirmed swing pivots
- Collect recent confirmed pivot highs (resistance candidates) and lows (support candidates).
- **Nearest resistance** = lowest pivot high above price; **nearest support** = highest pivot low below price. Draw only the nearest of each → at most 2 boxes.

### Zone strength (multi-touch)
- Count how many historical pivots cluster within the band (within ~ATR tolerance). More touches = stronger zone.
- Optional weightings to study: recency (recent touches matter more), volume / RVOL at the touch, round numbers.

### Dynamic S/R (alternatives)
- Moving-average or VWAP bands as dynamic S/R in trends.
- Volume profile / point-of-control as high-reaction zones (heavier compute — future module).

### Range position
- Where price sits between nearest support and resistance, as 0–100. Drives "Upper / Mid / Lower range" and is a key input to the no-edge logic (mid-range = poor R/R).

## Mapping to a clean output (what RangeClarity does)

Two boxes max (nearest support + nearest resistance), optional dashed range bounds, and a **Range Position %**. Touch count feeds a zone-quality score into confidence. Objects are *reused* (updated), never spawned per bar — respects the ~500 object cap.

## Pitfalls / what NOT to copy

- Don't render every pivot as a line — instant clutter and object-limit blowups.
- Don't redraw fresh boxes each bar; reuse/replace existing objects.
- Don't claim precise levels; a *zone* with honest width is more truthful than a hairline.

## Open ideas to test later

- RVOL- and volume-profile-weighted zone strength.
- Liquidity-sweep tagging (price wicks beyond a zone then reverses) as an optional overlay.
