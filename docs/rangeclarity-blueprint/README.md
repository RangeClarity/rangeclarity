# RangeClarity — Visual Product Blueprint (design only)

> **PROPOSAL. No production engine, payments, auth, deploy, or Linear writes.** This is the architecture + visualization + product spec for the **Pine-first Paid Beta anchored by a canonical tested core** (decision `docs/decisions.md` D-006). It builds on the existing research in `tradingview-research/` and the scoring philosophy in `RANGECLARITY_ALGORITHM_DESIGN.md`.

## What this folder contains
| File | Purpose |
|---|---|
| `system-architecture.mmd` / `.svg` | The five layers (TradingView data plane → Pine runtime → product surface → canonical TS core → backend/SaaS) + the RangeClarity Moat Map. Arrow legend: solid = runtime data, dashed = spec/formula relationship, dotted = future, outbound = alert webhook, red/blocked = the unsupported backend→Pine API path. |
| `data-flow.mmd` / `.svg` | How market data flows at Pine runtime and how the canonical core verifies parity. |
| `canonical-core.mmd` | OHLCV fixture → validation → features → zones → scores → state → reasons → expected output ↔ Pine parity. |
| `pine-data-boundaries.md` | Exactly what Pine can/cannot access (verified against TradingView docs, 2026). |
| `engine-module-map.md` | The 14 Pine runtime modules with a concrete **V0.1** design for each. |
| `feature-feasibility-matrix.md` | Every candidate feature scored: data, Pine feasibility, repaint risk, cost, value, MVP/Later/Reject. |
| `scoring-state-machine.md` | The transparent decision tree (Structure, Entry, zones, extension, confidence → the five states) + reason codes. |
| `product-screen.html` | Interactive prototype — chart + zones + MAs + dashboard, with a **Favorable / Extended / No Edge** state switcher, an expandable "Why?", and data-source annotations. Synthetic, clearly-labelled demonstration data. |
| `visual-to-data-map.md` | Every visible UI element → its data, engine module, formula, update cadence, confirmed-vs-preview behaviour, Pine approach, and the user question it answers. |
| `phased-product-map.md` | MVP now / Beta expansion / Future SaaS. |

PNG previews (`product-screen-desktop.png`, `-mobile.png`) are **not generated** — exporting them needs a headless-browser step I'll add on approval (no heavy dependency installed unprompted). The HTML renders the same visuals interactively.

## The product in one screen
The user types a ticker (TradingView), loads the RangeClarity indicator, and in ~5 seconds reads: **Setup State** (Favorable / Watch / Extended / No Edge / Structurally Weak), **Entry Quality** and **Structure Quality** as *separate* scores, where support and resistance **zones** sit, how extended price is, and **one plain-English sentence explaining why**. Core insight: *a strong stock can still be a bad entry.*

## How the pieces relate (the durable idea)
The **canonical TypeScript core** is the authoritative *specification + test harness* for the scores and states — Pine never imports or runs it. The relationship is **specification → Pine re-implementation → parity verification** against golden fixtures. That keeps the Pine Beta and a future web engine from diverging, and makes the formula the durable asset (the moat), not the disposable surface.
