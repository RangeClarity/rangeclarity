# Phased product map

## MVP now — Pine-first Paid Beta (TradingView)
- One overlay indicator: candles + volume + MA50/100/200 + ≤2 support / ≤2 resistance **zones** + current-price marker + one compact dashboard table.
- Engine: Data Gate, MA Structure, Trend, Zone Engine, Price Location, Extension, RS-vs-SPY, No-Edge, **Structure Score + Entry Score (separate)**, **5-state machine**, reason-code explanation.
- Numeric **plots 0–9** (screener-ready, can be hidden): Structure, Entry, State code, Extension%, dist-support, dist-resistance, MA-alignment, RS, zone-confidence, data-quality.
- Confirmed-bar alerts (state change, zone activated) → optional webhook.
- Inputs: ~6 beginner + advanced group (weights/lengths/thresholds).
- Website: marketing, pricing, Whop checkout, access instructions, education, support.

## Beta expansion (still TradingView-centric)
- Weekly-confirmation refinement; optional sector-RS (ticker→sector map); earnings-proximity gap flag (`request.earnings`, where covered).
- Optional RangeClarity backend: ingest Pine alert webhooks → alert history, notifications, a lightweight setup **journal**, usage analytics.
- Pine Screener guide so users rank their own watchlists on the numeric plots.

## Future SaaS (web platform — separate, licensed)
- Licensed market-data provider + the **canonical engine executed server-side** (the same TS core, now run on real OHLCV).
- Single-ticker web analysis, **RangeClarity Radar** (multi-ticker ranking), watchlist scoring, **daily brief**, saved plans, shareable analysis cards, mobile app.
- Auth + billing in-app (the deferred `auth-billing-plan.md` work), only after paid validation proves demand.

**Boundary discipline:** anything needing ownership/news/options/LLM-scoring or true multi-ticker scanning is **future SaaS**, never forced into the Pine MVP. The canonical core is what carries forward unchanged from MVP → SaaS.
