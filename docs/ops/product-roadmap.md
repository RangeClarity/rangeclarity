# Product Core Roadmap

Source of truth for the Command Center's **Product Core Roadmap** panel. Update the `[status]` tag as work
moves. Format per line: `- [status] Title — note`.
Statuses: `[done]` `[live]` `[next]` `[in-progress]` `[review]` `[specced]` `[config]` `[blocked]` `[todo]`.

## Indicator Core V2
- [review] Location — Quality Kernel v1 + proximity gate; QA-clean (0 product criticals); awaiting TradingView visual approval on 9 symbols
- [next] Zone Quality — gated: do not start until Location passes visual + QA review
- [in-progress] Trend Structure — MA Structure Stack + RC Engine v2 weighting (S/R 35 · MA 25 · Trend 20 · Location 20 · volume 0%)
- [specced] Extension — V2 engine spec (10 pts), ATR-normalized maturity; not built
- [specced] Structure Change — Structure Delta (5 pts) in V2 engine spec; not built
- [specced] Score Caps — hard caps defined in V2 engine spec; partial via Phase 1 penalties; finalize with engine
- [specced] Regime — regime module (15 pts) in V2 engine spec; market-state row only so far

## Quality & ops
- [done] Live QA — offline agent (rc_live_qa.v1 fixtures + scanner rules + report); 0 product criticals
- [live] Ops loops — health · qa:rc · ops:status · Command Center · decision queue

## Platform
- [live] Website funnel — homepage + /beta + /beta/free-access + mobile hero & sticky CTA
- [config] Lemon / payment — env-based (provider = manual default); confirm live checkout links in the canonical repo
