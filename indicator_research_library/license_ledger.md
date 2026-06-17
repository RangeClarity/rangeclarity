# License Ledger

The gate between research and production. **No source's code may influence production until it has a row here marked with a clear reuse decision.** If the license is unclear, mark "Inspiration only."

## Headline finding (read this)

RangeClarity is a **commercial** product. Of the 18 analyzed sources:

- **11 are CC BY-NC-SA 4.0 (NonCommercial).** Their *code* may **not** be used in a commercial product. → **Inspiration only.**
- **5 are MPL-2.0.** Code reuse is permitted but is **file-level copyleft** (modified MPL files must stay open) and requires attribution. To keep RangeClarity unencumbered and closed, we **re-implement the concepts ourselves** and credit the authors. → **Concept (re-implement) + attribution.**
- **2 have no license stated** (SmartTrader, FVG). Default copyright applies. → **Inspiration only.**

**Policy adopted:** RangeClarity production code re-implements *concepts* from scratch. We copy **no** source code verbatim. Ideas, math approaches, and design patterns are not themselves copyrightable; the specific code expression is — and we are not reusing any. Attribution is given as a courtesy in the comparison report and (for MPL works whose patterns we leaned on) in code comments.

## Quick license guide (not legal advice)

| License | Code reuse in a paid product? | Attribution? | Notes |
|---|---|---|---|
| MIT / BSD / Apache-2.0 | Yes | Yes | Keep notices. |
| MPL-2.0 | Yes, but file-level copyleft | Yes | Modified MPL files stay open. We re-implement instead. |
| CC BY-NC-**SA** (NonCommercial) | **No** | — | NonCommercial blocks paid use. Inspiration only. |
| GPL / AGPL | Avoid in closed product | Yes | Strong copyleft. |
| No license stated | **No** | — | Default copyright. Inspiration only. |
| Proprietary / invite-only | **No** | — | Never copy. |

## Ledger

| # | Source file | Indicator | Author | License | Reuse decision | Attribution needed |
|---|---|---|---|---|---|---|
| 1 | IndicatorAngleMarket.MD | Angle Market Structure | BigBeluga | CC BY-NC-SA 4.0 | Inspiration only | Yes |
| 2 | IndicatorBreakouts.MD | Stop Loss Clustering (Breakouts) | KioseffTrading | MPL-2.0 | Concept (re-implement) | Yes |
| 3 | IndicatorDeviation.MD | Deviation Trend Profile | BigBeluga | CC BY-NC-SA 4.0 | Inspiration only | Yes |
| 4 | IndicatorDynamicSwing.MD | Dynamic Swing Anchored VWAP | Zeiierman | CC BY-NC-SA 4.0 | Inspiration only | Yes |
| 5 | IndicatorFVG.MD | FVG Retest Entry Engine | trade_w_samet | None stated | Inspiration only (mostly ignore — signal bot) | Yes |
| 6 | IndicatorLiquidityThermal.MD | Liquidity Thermal Map | BigBeluga | CC BY-NC-SA 4.0 | Inspiration only | Yes |
| 7 | IndicatorMLRSI.MD | Machine Learning RSI | Zeiierman | CC BY-NC-SA 4.0 | Inspiration only | Yes |
| 8 | IndicatorMagnet.MD | Liquidity Magnet Pro | officialjackofalltrades (JOAT) | MPL-2.0 | Concept (re-implement) | Yes |
| 9 | IndicatorNR2-NR20.MD | Smart NR2–NR20 + Inside Bar | Zeiierman | CC BY-NC-SA 4.0 | Inspiration only | Yes |
| 10 | IndicatorNeural.MD | Neural Weight Oscillator | Zeiierman | CC BY-NC-SA 4.0 | Inspiration only | Yes |
| 11 | IndicatorPolynomial.MD | Polynomial/Linear Regression Volume Profile | BigBeluga | CC BY-NC-SA 4.0 | Inspiration only / future | Yes |
| 12 | IndicatorSmartMoney.MD | Smart Money Breakout Channels | AlgoAlpha | MPL-2.0 | Concept (re-implement) | Yes |
| 13 | IndicatorSmartTrader.MD | Smart Trader, Ep.03 | Ata Sabancı | None stated | Inspiration only / future | Yes |
| 14 | IndicatorSupportResistance.MD | Support Resistance Channels | LonesomeTheBlue | MPL-2.0 | Concept (re-implement) | Yes |
| 15 | IndicatorTrendImpulse.MD | Trend Impulse Channels | Zeiierman | CC BY-NC-SA 4.0 | Inspiration only | Yes |
| 16 | IndicatorVdubus.MD | Vdubus Pattern Gen V2 | Bespoke_Analysis_Engine | MPL-2.0 | Ignore / future (off-scope harmonics) | Yes |
| 17 | IndicatorVolumaticSupport.MD | Volumatic Support/Resistance Levels | BigBeluga | CC BY-NC-SA 4.0 | Inspiration only | Yes |
| 18 | IndicatorVolumeBubble.MD | Volume Bubbles | QuantAlgo | CC BY-NC-SA 4.0 | Inspiration only | Yes |

## Decision log

- **2026-06-17:** Adopted "re-implement concepts, copy no code" policy for all 18 sources given the commercial nature of RangeClarity and the prevalence of NonCommercial licenses. The `rangeclarity_ultimate_core.pine` is original code; no source was pasted. Concepts that influenced design are credited in `INDICATOR_COMPARISON_REPORT.md` and `BEST_IDEAS_EXTRACTED.md`.
- **FVG (trade_w_samet):** explicitly avoided as an architectural model — it is a buy/sell/TP/SL entry engine and uses `barmerge.lookahead_on`. Only the abstract "reason it isn't valid yet" idea ("Blocker Lens") informed our no-edge reason strings.
