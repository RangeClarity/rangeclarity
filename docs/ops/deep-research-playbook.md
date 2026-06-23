# Deep Research Playbook

The **weekly / on-demand** strategic research loop. This is *not* a daily health check and is *not*
automated. You run it deliberately, paste the prompt into a research-capable tool, and capture the brief.

> No paid API is wired. Today this is manual: paste `prompts/deep-research-weekly.md` into a capable
> research assistant (or do the desk research yourself). The OpenAI Deep Research API is a **future**
> backend for this loop only — see `docs/ops/langsmith-future-plan.md`. Daily loops never depend on it.

## Cadence
- **Weekly** strategy block, or **on-demand** before a positioning/pricing decision.
- Never on the daily path — it's slower, broader, and meant for thinking, not shipping.

## Scope (what to research)
1. **Competitors** — comparable TradingView indicators / "market structure" tools; what they claim, how they price, their weaknesses.
2. **TradingView marketplace** — invite-only vs public scripts, discovery, reviews, what gets traction.
3. **Pricing** — common tiers for premium indicators, free-trial norms, $29/$49-type bands, what converts.
4. **Pine specialists** — who builds credibility (educators, script authors), collaboration/affiliate angles.
5. **Positioning** — how to own "Simple chart. Complex engine. No signals. Just structure." vs signal-seller noise.
6. **Acquisition channels** — where the audience is (YouTube, X, TV ideas, Discord, newsletters) and what's repeatable.

## How to run
1. Open `prompts/deep-research-weekly.md`, fill the focus line (what this week is about).
2. Paste into your research tool; let it gather sources.
3. Capture the output as a dated brief in `data/ops/research/` (e.g. `2026-06-23-weekly.md`) — create the folder when you first save one.
4. Pull any decisions into `docs/decisions.md`; pull any concrete tasks into `docs/kanban.md`. Don't let a research brief silently become scope.

## Output shape (from the prompt)
Competitor landscape · marketplace notes · pricing read · Pine-specialist/partnership angles · positioning
recommendation · ranked acquisition channels · **3–5 recommended moves** (each: effort, risk, why).

## Founder decisions this loop feeds
Pricing/tiers · positioning language · which acquisition channel to test next · whether to pursue a
Pine-specialist partnership. None of these are auto-actioned — they're decisions for Dean.

## Guardrails
Research only — no scraping behind logins, no PII collection, cite sources. A brief is an input to a
decision, not a mandate to build. Keep the daily loops independent of this one.
