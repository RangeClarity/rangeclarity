# Repainting rules (non-negotiable for a "serious, explainable" tool)

Our brand promise dies if zones/scores silently change after the fact. Rules:

1. **Confirm before commit.** Any structural event (pivot, BOS/CHoCH, sweep, zone touch, regime change) is only "official" on `barstate.isconfirmed`. Use confirmed-bar logic for everything that drives the verdict and alerts.
2. **Pivots inherently lag.** `ta.pivothigh/low(left, right)` needs `right` bars to confirm — accept the lag; never back-date a pivot to look prettier. State this honestly in the docs.
3. **HTF reads.** `request.security(..., lookahead=barmerge.lookahead_off)` and only consume the **previous closed** HTF value (`[1]` pattern) on the realtime HTF bar to avoid future leakage.
4. **No intrabar signals.** The verdict may *preview* on the forming bar but only **locks** on close. The dashboard can show "forming" vs "confirmed" state explicitly.
5. **Score stability.** The confidence score may update intrabar but the **alert** for "high-confidence confluence" fires only on confirmed bar to prevent flip-flopping.
6. **Honest realtime vs historical.** Document that historical bars show only confirmed states (so backtest visuals match what users saw live). Avoid functions that behave differently historically vs realtime without disclosure.
7. **"No edge" is repaint-safe by design** — when inputs disagree or data is thin, output `No edge` rather than inventing a level.

Testing: replay mode + compare a level/score on the forming bar vs after close; they must not contradict for confirmed outputs.
