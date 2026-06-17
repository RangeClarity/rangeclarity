# RangeClarity Cut List

What is **deliberately excluded** from the first stable indicator, and why. The goal is not to include everything — it is to ship the best stable core. Cut reasons: half-working · noisy · hard to explain · repainting · too complex for MVP · redundant · too signal-bot-like · reduces trust.

## Cut entirely (does not belong in this product)

| Idea / module | Source | Why cut |
|---|---|---|
| Buy/sell/TP/SL entry engine | FVG (trade_w_samet) | Signal bot — the exact thing RangeClarity rejects. Reduces trust; invites profit/win-rate framing. |
| Harmonic pattern recognition (Gartley/Bat/etc.) | Vdubus | Off-scope; niche; dilutes the "clarity" promise. |
| Multi-timeframe HTF bias via `request.security` lookahead | FVG | Repaint risk; complexity; not needed for a context tool. |
| "AI/ML/Neural" branding | MLRSI, Neural | We will not market explainable math as AI. Honest scoring only. |
| Profit prediction / win-rate / guaranteed entries | (general anti-pattern) | Forbidden by product principles. |

## Cut from MVP → moved to Future (good ideas, not now)

| Idea / module | Source | Why deferred |
|---|---|---|
| Volume-profile POC / thermal heatmap | Liquidity Thermal, Smart Trader | Heavy compute + many drawn objects; raises clutter and performance risk. |
| Polynomial / linear-regression zones | Polynomial | Regression coefficients shift bar-to-bar → repaint risk; complex to explain. |
| Stop-cluster / liquidity-sweep mapping via LTF volume | Breakouts (Kioseff) | CPU-heavy polyline rendering; intrabar updates; visually overwhelming. |
| k-NN analog matching engine | MLRSI | Needs 500+ bar memory + warm-up; heavy; hard to keep simple. |
| ADAM online-learning oscillator | Neural | Trains intrabar (repaint), complex, opaque to users. |
| Dual-scale zigzag micro/macro | Vdubus | Adds inputs and visual layers; structure already covered for MVP. |
| Block aggregation + narrative engine | Smart Trader | The 1000-line narrative is overkill; we keep only a single context line. |
| Anchored-VWAP overlay | Dynamic Swing | Nice but adds a line and recompute logic; not core to the dashboard read. |
| Trend-duration distribution histogram | Deviation | Aesthetic context, not decision-critical; adds drawing. |
| Multi-window volume-delta consensus | Volume Bubbles | Delta needs LTF requests; MVP uses simple on-chart volume percentile instead. |

## Cut to protect simplicity and trust (general)

- No more than **one table + 2 zone boxes + 2 range lines + 1 small range meter**. Everything beyond that is cut.
- No more than ~6 basic inputs on the front; advanced settings hidden in one group.
- No more than ~6 dashboard rows + context line.
- No per-bar object creation, no label spam, no >6 colors.
- No intrabar state changes to the verdict; confirmed-bar only.
- No second oscillator pane in the core product (regime/momentum read lives in the table).

## Principle

> Stable beats clever. No-edge is a feature, not a failure. Every cut above is a feature: it keeps the surface simple, the engine explainable, and the product trustworthy.
