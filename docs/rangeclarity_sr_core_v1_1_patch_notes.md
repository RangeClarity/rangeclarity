# RangeClarity S/R Core — v1.1 stabilization patch notes

Scope: a small, focused stability pass on `pine/rangeclarity_sr_core_v1.pine`. **No rewrite, no architecture change, no new indicators.** Driven by `docs/codex_review_rangeclarity_sr_core_v1.md` and the founder's v1.1 fix list. Companion architecture: `docs/rangeclarity_sr_core_v1_architecture.md`.

## What changed (and why)

1. **Event-flag lifetime (P0).** The seven alert flags are now reset to `false` on **every script execution** (immediately before the `if barstate.isconfirmed` block) and set only inside confirmed-bar logic. Previously they were `var` and reset only inside the confirmed block, so a flag set on a closed bar could remain `true` during the next forming bar. *Why:* prevents `alertcondition()` from appearing active longer than the actual event.

2. **Alerts gated to confirmed bars.** All seven `alertcondition(...)` calls are now `alertcondition(barstate.isconfirmed and f..., ...)`. *Why:* alerts represent closed-bar events only; this removes intrabar flip-flop risk. (Still set alerts to "Once per bar close" in TradingView.)

3. **Pivot-bar anchoring (P1).** `f_addZone()` now takes a `sourceBar` argument and sets `createdBar = sourceBar`; it is called with `bar_index - pivR`. *Why:* a zone's "created" bar is now the actual pivot bar, matching the architecture doc, instead of the (later) confirmation bar. This is honest about when structure formed; it does not change repaint behaviour (zones still only appear after confirmation).

4. **Same-bar break→flip prevention (P0).** Added `lastBreakBar` to the `Zone` type. On a confirmed break the zone records `lastBreakBar = bar_index`; the retest/flip block now requires `bar_index > z.lastBreakBar`, so a zone can no longer be marked `Broken` and `Flipped`/retested on the **same** candle. A retest must occur on a **later** confirmed bar. *Why:* a breakout candle that still overlaps the old zone was incorrectly read as an immediate retest.

5. **Neutral UX language (P1).** Removed "Target"/"Defense" everywhere:
   - Dashboard "Active setup": now "Resistance above + key support" / "Support below + key resistance" / "Range boundaries" / "Developing structure".
   - Labels: the role suffix was removed entirely (the signed % already shows above/below).
   - Alerts: "support defense zone" / "resistance target zone" → "support zone" / "resistance zone".
   *Why:* keeps the product educational/structural, not action guidance.

6. **Alert filtering (P1).** Enter-zone alerts (`fEnterSupDef`/`fEnterResTgt`) are now set **after** the zone is re-scored and only when `z.score >= minScore or showWeak`. Previously any touch — even a hidden/weak zone — could fire an enter alert. *Why:* alerts now match the zones the user actually sees.

7. **Label cleanup (UX).** Label format shortened to `R • Strong 84 • +4.2%` (type • strength score • distance). *Why:* less crowded; score no longer competes with the role word.

8. **Dashboard "Last event" preserved.** Because alert flags now reset every bar, the dashboard reads a new persistent `var string lastEvent` (set on breakout/breakdown/retest) instead of the transient flags — so the dashboard still shows the most recent structural event.

## Why it changed
The biggest pre-patch risk was not classic future-data repainting but **misleading state/alert timing**: persistent event flags and same-bar break→flip transitions. These fixes make the alerts and state transitions honest and quieter, and align zone metadata with the confirmed-pivot model — the prerequisites the review set before any external testing.

## What was intentionally NOT changed
Per the "minimal patch" scope, these review suggestions were **deferred** (no change in this pass):
- Scoring redesign / failed-break cooldown / reduced chop inflation.
- Merge cascade (merging *all* overlapping zones, not just the first) and touch-weighted midpoint; `mergeCount` field.
- Market-bias model beyond the two-pivot HH/HL · LH/LL logic.
- Flipped zones changing `ztype` / re-entering target/defense selection.
- Aggressive stale-zone decay; pruning broken/stale before lowest-score.
- Any new indicators, MTF, VWAP, RSI/MACD, order blocks, FVG, liquidity, signals, or strategy entries.

## Known limitations (still true after v1.1)
- **Not yet compiled in TradingView by us** — this patch is edits + self-review; a Pine Editor compile pass is still required.
- Pivots confirm with a `pivR`-bar lag (disclosed, by design).
- Drawings render as a *current* structure map on the latest bar (not painted historically across all bars).
- Merge still collapses only the first nearby same-type zone; three close levels can leave a third as minor noise.
- Scoring can still over-credit repeated touches/failed breaks in chop (the v1.1 scoring redesign is deferred).
- Basic flip: a broken zone can relabel `Flipped` on a later retest but does not switch `ztype` or re-enter target/defense selection.

## Next step
Compile in the Pine Editor, then test across daily/weekly stock and crypto charts (see the main file's test checklist). The recommended next substantive pass is the **scoring + merge calibration** (failed-break cooldown, touch-weighted merge, merge cascade) — a separate, reviewed change, not part of this stabilization patch.
