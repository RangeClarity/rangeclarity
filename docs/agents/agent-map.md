# RangeClarity Agent & Skill Map

> **Documentation only.** How to drive RangeClarity's design with the project-local slash commands and
> agents. No behavior/scoring/Pine/payment change. Companion: [system-map](../architecture/system-map.md) ·
> [module-registry](../architecture/module-registry.md) · [daily-design-loop](../ops/daily-design-loop.md).

## Who does what
- **RangeClarity Chief of Staff** (`.claude/agents/rangeclarity-chief-of-staff.md`, per `CLAUDE.md`) — the
  planning-first project planner. Reviews, daily planning, turning **approved** decisions into tickets.
  Never ships product/payment/auth/deploy/Linear writes without founder approval.
- **The 5 slash commands** (`.claude/commands/*.md`) — the day-to-day design workflow, below.
- **RC structural review agent** (`research/rc1_review_agent/rc_structural_review_agent.py`) — read-only;
  generates label suggestions for Founder Review. Advisory; never changes scoring.

## The five commands

### `/grill-me <idea>`
- **Purpose:** pressure-test an idea before any work — surface risks, missing evidence, false-confidence traps.
- **When:** the moment a new idea appears, *before* a PRD.
- **Output:** Decision pressure test · Risks · Missing evidence · Suggested next step · **Verdict: Go / No-go / Needs PRD**.
- **RangeClarity questions it always asks:** Is this buy/sell/prediction framing? Could the chart be *Clear*
  without proof? Does it increase **false confidence**? Does it touch **Pine before conviction is GREEN**?
  Does it need **founder labels / the frozen baseline** first?
- **Touches:** nothing — analysis only.

### `/write-a-prd <idea>`
- **Purpose:** turn a surviving idea into a compact PRD.
- **When:** after `/grill-me` returns **Needs PRD** (or Go for anything non-trivial).
- **Output:** `docs/prd/YYYY-MM-DD-<short-name>.md` with problem, goal, scope, non-goals, design, risks, tests, rollout.
- **Always-include guardrails:** no signals/prediction/buy-sell; no false confidence; HighClarity stays rare;
  any scoring change requires a **frozen-baseline comparison**; Pine blocked unless GREEN.
- **Touches:** `docs/prd/` only.

### `/prd-to-issues <path-to-prd>`
- **Purpose:** break an **approved** PRD into structured, buildable issues.
- **When:** after the founder approves the PRD.
- **Output:** issues with Title · Module · Goal · Scope · Non-goals · Files · Acceptance · Tests · Risk ·
  Dependencies · Rollback. Categories: P0 guardrails → P1 implementation → P1 tests → P2 docs → P2 cleanup.
- **Rule:** if Linear is available, **ask before** creating; otherwise write markdown under `docs/issues/`.
  Never create tasks for PRD-blocked items.
- **Touches:** `docs/issues/` (or Linear, only after asking).

### `/module-awareness <area>`
- **Purpose:** before touching code, know which module owns the work, what it must not know, its interface,
  and its test boundary.
- **When:** **before every code change**, no exceptions.
- **Output:** Module touched · Interface affected · Hidden complexity · Tests required · **Files safe to touch**
  · **Files forbidden to touch** · Risk.
- **Core principle:** *make interfaces smaller and modules deeper — do not move mess around.*
- **Touches:** nothing — it tells you where you're allowed to.

### `/improve-codebase-architecture`
- **Purpose:** find shallow modules + leaks and propose **small, safe, ranked** refactors.
- **When:** the daily design investment — pick one boundary to deepen.
- **Output:** ranked refactor candidates, each with current problem · target interface · hidden complexity ·
  files · tests · blast radius · **safe first step**. **Asks before implementing.**
- **Forbidden without approval:** scoring/cap/`agree3`/Pine/payment edits · broad moves · large renames ·
  deleting untracked files · commit/push.
- **Touches:** proposals first; code only after explicit approval, smallest step first.

## The daily chain (how they compose)
```
idea ─▶ /grill-me ─▶ (Needs PRD) ─▶ /write-a-prd ─▶ founder approves
     ─▶ /prd-to-issues ─▶ pick smallest issue ─▶ /module-awareness <area>
     ─▶ implement smallest safe step ─▶ npm run health (fast) ─▶ npm run verify (full, before handoff)
     ─▶ /improve-codebase-architecture (deepen one module over time)
```

## Module → agent / skill
| Module | Use |
|---|---|
| Core Scoring | `/module-awareness Core Scoring` → `/improve-codebase-architecture`; golden test before/after |
| Data Adapters | `/module-awareness Data Adapters` |
| Research Experiments | `/grill-me` → `/write-a-prd` → `/prd-to-issues`; compare vs frozen baseline |
| Founder Review | RC structural review agent (read-only) |
| Web UI | `landing-page-qa` prompt; `/module-awareness Web UI` |
| Pine Layer | `/grill-me` only (answer is "not until GREEN") |
| Ops / Feedback Loops | the [daily-design-loop](../ops/daily-design-loop.md) |
| Payments / Access | `/grill-me` only (do-not-touch) |

## Always-on guardrails (every command inherits)
No buy/sell/entry/exit/profit/prediction framing · do not increase false confidence · HighClarity stays rare
· no scoring/cap/`agree3`/Broken change without founder labels ≥20 + a frozen-baseline A/B · do not touch
Pine or payment/Lemon · do not commit or push without explicit founder approval.
