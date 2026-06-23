# RangeClarity Master Action Plan / RC-MAP

**Status:** Central project source of truth  
**Owner:** Dean  
**Last updated:** 2026-06-23  
**Applies to:** Dean, Codex, Claude Code, Hermes, and future agents

RC-MAP is the single shared plan for RangeClarity product critique, planning, implementation, and prioritization. Do not create a competing roadmap. Do not create a separate strategy document unless it is linked from RC-MAP. Future reviews, build plans, implementation notes, and critique passes should reference this file first.

Related supporting docs:

- `RANGECLARITY_MASTER_PLAN.md` - legacy long-form plan and historical context.
- `docs/kanban.md` - active task board derived from RC-MAP.
- `docs/TASKS.md` - task tracker derived from RC-MAP.
- `docs/visual/rc-neural-roadmap.md` - visual operating map derived from RC-MAP.
- `data/roadmap/rc-neural-roadmap.json` - structured dataset for the visual operating map.
- `RANGECLARITY_CORE_INDICATOR_SPEC.md` - current indicator spec snapshot.
- `RANGECLARITY_ALGORITHM_DESIGN.md` - current algorithm design notes.

---

## 1. North Star

RangeClarity is a premium market-structure clarity system for TradingView users. It should make trend, support, resistance, location, extension, and structure quality easier to read without turning the chart into a noisy signal board. Simple chart. Complex engine. No signals. No noise. Just structure.

---

## 2. Product Principles

- Clarity over noise.
- No buy/sell signals.
- No prediction claims.
- No guaranteed-profit language.
- No financial advice.
- Screenshot-friendly visual design.
- Beginner-readable, advanced-useful.
- Complexity belongs in the engine, not on the chart.

---

## 3. Current Product State

The current TradingView indicator direction includes:

- RC Score.
- S/R score.
- MA Structure.
- Trend Quality.
- Market State.
- Support / Resistance rows.
- Moving average/channel visual.
- Volume bars.
- RSI panel when relevant, but not as the core product promise.

The current product already feels closer to a structure dashboard than a signal indicator. The weakness to watch is generic indicator stacking: rows can report useful measurements without explaining the deeper structural read.

---

## 4. Current Strategic Direction

RangeClarity is moving toward a clean professional indicator that feels intelligent while staying visually restrained. The intended direction includes:

- Better support/resistance quality.
- Moving average structure.
- Trend/channel structure.
- Multi-timeframe context.
- Distance to key areas.
- Structure change / "what changed today".
- Minimal visual noise.

The operating idea is simple surface, complex engine. The chart should stay calm, but the engine should understand structure, location, trend quality, zone quality, and change over time.

---

## 5. Decision Log

| Date | Decision | Reason | Status |
|---|---|---|---|
| 2026-06-23 | Volume engine is not the current priority. | Volume can add noise and signal-like interpretation before the structure engine is trusted. | Active |
| 2026-06-23 | S/R quality upgrade remains important. | Location context depends on trustworthy support/resistance zones. Poor zones produce poor reads. | Active |
| 2026-06-23 | The indicator must not become a noisy signal tool. | The brand promise is chart clarity, not trade calls, predictions, or hype. | Active |
| 2026-06-23 | The best next feature must be chosen by impact-to-simplicity ratio. | New features must improve decision clarity without overloading the chart. | Active |
| 2026-06-23 | Simple surface, complex engine is the build direction. | The product should feel sophisticated under the hood but remain instantly readable. | Active |
| 2026-06-23 | Location Context / Distance-to-Key-Zone is a leading candidate, not permanently locked. | It appears high impact, but the next Codex critique should still compare it against other candidates. | Pending next critique |

---

## 6. Active Critique Questions

Every agent must answer these before suggesting a new feature:

- What is the single most meaningful upgrade?
- Does it improve clarity without adding noise?
- Would a serious swing trader care?
- Is it feasible in Pine Script v6?
- Can it be explained in one sentence?
- Does it improve retention or daily usage?
- Does it help us market the product?

If the answer is weak on clarity, feasibility, or simplicity, the feature should be deferred.

---

## 7. 7-Loop Review System

All major critiques should use this review system:

1. **Visual Clarity Loop** - Judge the chart like a trader seeing it for the first time. What is clear, confusing, premium, weak, or generic?
2. **Structure Engine Loop** - Evaluate whether the engine understands trend, support/resistance, location, distance, range, and regime.
3. **Simplicity Loop** - Reject anything that improves complexity more than clarity.
4. **Habit / Retention Loop** - Ask whether this makes traders open the indicator daily for ethical structure reads, regime changes, or "what changed" context.
5. **Professional Trader Loop** - Check for serious swing-trader needs: multi-timeframe structure, distance to zone, compression/expansion, trend maturity, pullback quality, level freshness, invalidation context, and volatility regime.
6. **Pine Feasibility Loop** - Confirm the idea is realistic in Pine Script v6 using confirmed-bar logic and deterministic scoring.
7. **Business Value Loop** - Check whether the improvement is easy to explain, market, screenshot, and convert from free to paid without hype.

---

## 8. Current Next-Build Candidates

Ranked candidate upgrades:

1. Multi-timeframe structure alignment.
2. Better S/R quality/freshness engine.
3. Distance-to-key-zone context.
4. Structure Delta / What changed since yesterday.
5. Trend maturity / pullback quality.
6. Volatility regime.
7. Cleaner RC Score explanation.
8. Premium table redesign.

Ranking is provisional. The next Codex critique should choose one first build by impact-to-simplicity ratio, not by feature excitement.

---

## 9. Current Recommendation

**Current Best Next Move:**  
TBD after next Codex critique.

---

## 10. What We Refuse To Add For Now

- Buy/sell labels.
- Loud alerts.
- Too many zones.
- Full volume/liquidity engine before structure is excellent.
- Overloaded dashboard.
- Prediction language.
- Complex UI controls that confuse users.

Also avoid price targets, win-rate language, "high probability" language, AI commentary, and any feature that makes the product feel like a cheap signal indicator.

---

## 11. Implementation Discipline

- Inspect code before editing.
- Make small, testable changes.
- Use confirmed-bar logic.
- Avoid repainting.
- Keep visual changes minimal.
- Update RC-MAP after every major critique or implementation.
- If a decision changes, record it in the decision log.

Implementation should proceed only after the relevant critique, spec, and Pine feasibility pass are complete. Planning changes belong in RC-MAP first, then supporting docs can be updated to match.
