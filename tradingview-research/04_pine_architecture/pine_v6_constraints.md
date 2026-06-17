# Pine Script v6 — constraints that shape the design

- **Declaration:** `//@version=6` then `indicator(...)`. Use `overlay=true` for the price-chart layer; consider a second script or `force_overlay` for sub-pane elements (v6 allows per-object `force_overlay`).
- **Drawing object limits:** `max_lines_count`, `max_labels_count`, `max_boxes_count` cap at **500 each** (default 50). Polylines capped too. → We must **reuse/replace** objects, not create per-bar. Budget: ~2–4 zones + 1 dashboard table.
- **Tables are cheap and ideal for the dashboard** (`table.new`), don't count against line/label limits, and don't move with bars. Our one-read UI = a single small table.
- **`request.security` / MTF:** use `lookahead=barmerge.lookahead_off` (default) to avoid lookahead bias; HTF values must be read on confirmed HTF bars. Limit number of `request.*` calls (performance + the ~40 security-call guidance).
- **Series vs simple:** many function args require `simple`/`const` (e.g., lengths). Adaptive lengths often need `int` constants or workarounds.
- **Loops/arrays:** allowed but bounded; heavy per-bar loops (e.g., K-Means recompute) hurt performance → prefer rolling/percentile math.
- **No persistent cross-execution memory** except `var`/`varip`. State machine uses `var`.
- **Alerts:** `alert()` (dynamic) and `alertcondition()` (compile-time). Use confirmed-bar gating to avoid intrabar alert spam.
- **Repainting surfaces:** `request.security` lookahead, intrabar values, `ta.pivot*` look-ahead by design (need N confirmed bars), historical vs realtime barstate differences. See `repainting_rules.md`.
