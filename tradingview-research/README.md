# TradingView Research — RangeClarity Engine

**Phase:** 1 (research only — no indicator code yet).
**Goal:** Design a clean-chart, sophisticated-engine TradingView indicator suite for long-term investors and swing traders. One clear market read on the surface; weighted multi-factor engine underneath. Not a signal-spam tool.

## Folder map
- `00_sources/` — every page/script we look at, with URLs, license status, and an attribution log.
- `01_idea_cards/` — 10-field idea cards (template + ranked top ideas + rejected).
- `02_pattern_library/` — distilled, original write-ups of each technique class (structure, zones, liquidity, delta, momentum, volatility, trend, scoring, dashboards, alerts).
- `03_product_strategy/` — vision, beginner/advanced modes, moat, personas, prioritization.
- `04_pine_architecture/` — Pine v6 constraints, object limits, repainting rules, state machines, module design, performance.
- `05_indicator_specs/` — MVP/V1 specs, alerts, settings.
- `06_experiments/` — experiment log, scoring validation notes, visual mockups.
- `src/pine/` — placeholder only until architecture is approved (Phase 3).

## Research method (how idea cards are produced)
1. **Survey, don't scrape.** Read TradingView script listings/descriptions for *concepts*, not code. We study public open-source scripts as inspiration only.
2. **One idea card per script** using `01_idea_cards/template.md` (10 fields). The card captures the *concept and what to avoid*, never copied code.
3. **Attribution integrity (non-negotiable).** For every script: record name, author, URL, and **open-source status as VERIFY until confirmed on the script page**. We do not assert a license we haven't checked. We do not reuse any code unless the license explicitly permits it *and* attribution rules are followed. Default stance: **build original from the concept.**
4. **Distill to patterns.** Concepts graduate from cards into `02_pattern_library/` as our own original descriptions (math, edge cases, repaint risk) — the reusable knowledge, decoupled from any one author.
5. **Rank** every idea on 8 axes (below) and select a combined product concept.
6. **Only then** design architecture (Phase 2) and build (Phase 3).

## Ranking axes (1–5, higher = better unless noted)
User value · Originality · Simplicity of visual output · Engine complexity (capability, not clutter) · Pine feasibility · Moat potential · Risk of being generic (lower better) · Risk of repainting/noise (lower better).

## Sourcing note (honesty)
The page-2 listing was readable and grounded the first cards in real, current scripts. **License/open-source status for each was NOT individually confirmed** in this pass — every card and the `source_review_status.csv` marks it `VERIFY`. Confirm on each script's page before any reuse. Several surveyed scripts are deliberately logged as *anti-patterns* (signal spam, "AI forecasting") — useful as "what not to build."

## Phase gates
- Phase 1 (now): folders + method + idea cards + recommendation.
- Phase 2: 3 architectures (A simple MVP / B advanced-feasible / C monster engine). **Await approval.**
- Phase 3: Pine v6 MVP. **Await approval.**
- Phase 4: manual testing checklist across market types.
- Phase 5: productization (description, disclaimer, guides, changelog, attribution log).
