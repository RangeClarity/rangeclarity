# Phase 1 — Co Work UX Refactor
## Audit · Migration Map · Implementation Plan

> **Plan only — nothing changed yet.** Source of truth: [`product-development-os-redesign.md`](./product-development-os-redesign.md)
> (the architecture doc). This is the *execution map* to get the current app there. **Ends at an approval gate.**

---

## Step 1 — Audit of the current surface
The current "Co Work" is three things tangled together: a **product website**, a few **internal founder tools**,
and a **huge document pile**. Only the middle one is the workspace to refactor.

### A. Internal founder tools (app routes — the actual workspace today)
| Route | What it is | Gated? |
|---|---|---|
| `/ops` | Ops Console (health · loops · commands · output feed · do-not-touch) | ✅ internal |
| `/ops/neural-map` | Neural Map / "System Brain" (module graph) | ✅ internal |
| `/command-center` | Founder workbench (state · memory · roadmap · phase · next action) | ✅ internal |
| `/linear-board` | Kanban over Linear | ✅ internal |
| `/project-plan` | Project plan page | ⚠️ ungated (should be) |
| `/api/linear/issues` | internal Linear read API | — |
| **`ai-architecture-council/`** | the **AI Council** (separate Next.js scaffold) | standalone |

### B. Product website (NOT the workspace — out of scope, do not touch)
`/` · `/beta/**` (admin, faq, feedback, free-access, onboarding, welcome, …) · `/indicator-guide(/print)` ·
`/privacy` · `/terms` · `/tradingview-setup` + product APIs (`beta-signup`, `beta-checkout`, `free-access`, `waitlist`, `admin/beta/grant`).
*These are RangeClarity-the-product. The workspace **links** to the repo/product; it never absorbs these pages.*

### C. Experimental / design routes (dead weight in the workspace)
`/designs/**` (8 variants) · `/range-command-premium` · `/variant-codex-section` — gated experiments, not tools.

### D. Document entry points (the real sprawl — ~110 files)
| Cluster | Count / examples | Problem |
|---|---|---|
| Architecture | `docs/architecture/*` (system-map, module-registry, module-status-board, deep-modules, neural-map.json, modules/) + `ARCHITECTURE.md`, `rangeclarity_system_architecture.md` | **4–6 parallel "maps"** of one system |
| Ops / daily / loop | `docs/ops/{daily-workflow, daily-routine, daily-design-loop, continuous-improvement-loop, workflow-registry, agent-loop-playbook}` | **6 "how/when to work" docs** = one Daily |
| Mission-control-ish | `docs/ops/{command-center, rangeclarity-command-center, current-loop-status, project-memory, rc-ops-brain, rc-ops-console, project-os}` | **7 "state" docs** = one Mission Control |
| Decisions | `docs/ops/{decision-log, founder-decision-queue}` + `docs/decisions.md` | **3 decision ledgers** |
| Execution / sprint / roadmap | `docs/{kanban, current-sprint, project-state, rangeclarity-active-roadmap, rangeclarity-master-action-plan, rangeclarity_milestone_roadmap, rangeclarity_12_week_execution_plan, launch-readiness}` + `docs/ops/{product-roadmap, linear-kanban-plan, feedback-loops}` + `docs/roadmap/`, `docs/project-plan/` | **~12 overlapping plan/roadmap docs** |
| Research | `docs/research/*` (41) + `validation/` (12) + `product-intelligence/`, `rangeclarity-blueprint/` | sprawling but legit → Knowledge |
| Specs | `docs/specs/` + `RANGECLARITY_V2_{ENGINE,SURFACE}_SPEC`, `rangeclarity_shared_signal_schema`, `RANGECLARITY_RC_SCORE_MODEL` | → Knowledge ▸ Specs |
| Release / patch notes | `rangeclarity_sr_core_v1_{1..6}_patch_notes` | → Knowledge ▸ Release Notes |
| Diagnostics | `rangeclarity_*_diagnosis.md` (5+), `codex_review_*`, `product-plan-codex-review` | → Knowledge ▸ Technical Notes (or Archive) |
| Marketing | `docs/marketing/*`, `x-agent-activation`, `x-content-plan`, `RANGECLARITY_AI_VIDEO_BLUEPRINT`, `video-production/` | → **Marketing project** |
| Product / payment / beta | `beta-access/`, `auth-billing-plan`, `paid-beta-engineering-plan`, `payment-provider-options`, `customer-flow`, `deploy-rangeclarity`, `tradingview-access-process`, `hermes-linear`, `linear-integration` | product/ops → stays with product or Execution |
| Cowork-OS | `docs/cowork-os/*` (redesign + this plan) | → Knowledge (the OS canon) |
| Junk | `env_local.code-search`, `TASKS.md`, scattered `daily-updates/`, `design/`, `web/`, `qa/` | → Delete / Archive |

### Duplicates flagged (the heart of the friction)
- **State** is answered by `/ops` **and** `/command-center` **and** 7 "state" docs.
- **The system map** exists as `/ops/neural-map` **and** `system-map.md` **and** `module-registry.md` **and** `rangeclarity-deep-modules.md` **and** `neural-map.json`.
- **Daily process** is 6 docs. **Decisions** are 3 ledgers. **Roadmap/sprint** is ~12 docs.
- **Two navigations** already: `/ops` ↔ `/command-center` cross-link to each other (circular, no single home).

---

## Step 2 — Migration map (every page → exactly one destination)

### App routes
| Current | New home | Action |
|---|---|---|
| `/ops` | **Mission Control** (state/health/blocked/output) + **Execution** (commands/deploy) | **Merge** → Mission Control |
| `/command-center` | **Mission Control** (it *is* the embryonic Mission Control); roadmap panel → Projects; memory → Project Context | **Merge** → Mission Control |
| `/ops/neural-map` | **Knowledge ▸ Architecture** (a *view* of the map) | **Move** (demote to view) |
| `/linear-board` | **Execution ▸ Linear** | **Move** |
| `/project-plan` | **Projects ▸ Roadmap** (per project) | **Merge** → Projects |
| `/api/linear/issues` | **Execution** data layer | **Keep** (re-home) |
| `ai-architecture-council/` (the Council) | **Decision Lab** | **Move/Adopt** (this becomes Decision Lab) |
| `/designs/**`, `/range-command-premium`, `/variant-codex-section` | — | **Archive** (out of workspace nav) |
| `/`, `/beta/**`, `/indicator-guide*`, `/privacy`, `/terms`, `/tradingview-setup`, product APIs | RangeClarity **product** (separate concern) | **Keep — out of scope** (untouched) |

### Documents (by cluster — content moves into Knowledge/Project, not per-file pages)
| Cluster | New home | Action |
|---|---|---|
| Architecture (6 docs + neural-map view) | **Knowledge ▸ Architecture** (one living map) | **Merge** → 1 |
| Ops/daily/loop (6) | **Daily** + one "How we work" note | **Merge** → Daily |
| State docs (7) | **Mission Control** + **Project Context** | **Merge** (delete the docs as pages) |
| Decision ledgers (3) | **Decision Lab ▸ Decision History** (per project) | **Merge** → 1 |
| Sprint/roadmap (~12) | **Execution** + **Projects ▸ Roadmap** | **Merge** → 1 roadmap + sprint view |
| Research (53) | **Knowledge ▸ Research** | **Move** |
| Specs | **Knowledge ▸ Specifications** | **Move** |
| Patch/release notes (6) | **Knowledge ▸ Release Notes** | **Move** |
| Diagnostics / reviews | **Knowledge ▸ Technical Notes** | **Move / Archive** |
| Marketing | **Marketing project ▸ Knowledge/Research** | **Move** |
| Product/payment/beta | RangeClarity product (or **Execution** for deploy/linear-integration) | **Keep/Move** |
| Cowork-OS | **Knowledge** (OS canon) | **Keep** |
| Junk (`env_local.code-search`, stray dirs) | — | **Delete** |

**Guarantee:** after this, every page/doc resolves to **one** of the 8 destinations. No artifact has two homes.

---

## Step 3 — The one navigation (no legacy nav, no duplicate links)
| Item | Purpose | Open it when… | Do NOT open it when… |
|---|---|---|---|
| **Mission Control** | your daily operating center — "what now?" | you sit down; you're between tasks; something feels blocked | you want to *do* deep work (it routes, never works) |
| **Projects** | the container of all work | you're working *on a specific product* | the thing has no project yet (use Mission Control ▸ Capture) |
| **Decision Lab** | decide "what should we do?" via council debate | architecture/product/research/risk/trade-off/go-no-go | you want to chat, code, or plan a sprint |
| **Execution** | deliver after a decision (Claude Code · Codex · Hermes · Linear · Git · Deploy) | a decision is approved and it's time to build/track/ship | you're still deciding strategy or brainstorming |
| **Knowledge** | long-term memory | record/retrieve architecture, research, specs, lessons, release notes, decisions | you want live status or to make a decision |
| **Daily** | today's plan + review | morning (priorities/blockers/focus) and evening (done/lessons/tomorrow) | you want durable storage (that's Knowledge) |
| **Search (⌘K)** | find/jump to anything | always — it's the primary way to move | (never "wrong"; it's command-first) |
| **Settings** | configure providers, integrations, weights | setup/maintenance | day-to-day work |

There is exactly **one** sidebar. `/ops` and `/command-center` as *separate* nav entries are deleted; their content lives under Mission Control.

---

## Step 4 — Mission Control (the home page)
**Not a dashboard. A decision surface.** It answers the 12 questions as **at most ~7 actionable cards** — each card is
a *thing to act on*, not a metric to admire. Empty cards collapse (no widget soup, no scrolling).

| Card | Answers | The action on it |
|---|---|---|
| **Today** | what should I work on? · what sprint am I in? · next milestone | "Open in Execution" / "Plan the day → Daily" |
| **Needs a decision** | what requires a decision? | "Open in Decision Lab" (count badge) |
| **Hermes is ready** | what did Hermes prepare? | "Review plan → Execution" |
| **Linear queue** | what's waiting in Linear? | "Open Execution ▸ Linear" |
| **Blocked** | what is blocked? · production blockers? | "Unblock →" jumps to the blocker |
| **Changed since yesterday** | what changed? | diff list → click to source |
| **Health** | Git health · build/deploy status | red/green pill → "Open Execution ▸ Git/Deploy" |
| **Projects needing attention** | which project? | jump into that project |

Rules: only actionable info · empty states disappear · one click from any card to its destination · no metric that
doesn't change a decision.

---

## Step 5 — Projects (containers; nothing lives outside one)
Every project auto-contains these **as views (not duplicate docs)**: **Overview · Architecture · Decision History ·
Research · Knowledge · Roadmap · Hermes · Linear · Releases · Sessions · Context.** Selecting a project re-scopes the
four lenses (Lab/Execution/Knowledge/Daily) to it. The migrated docs land *inside their project* (RangeClarity gets
all the `rangeclarity_*` docs; a **Marketing** project gets the X/marketing docs). **No document lives loose at `docs/` root anymore.**

---
## Step 6 — Decision Lab (adopt the Council)
The `ai-architecture-council/` scaffold **becomes** Decision Lab — it is already exactly this. It is **not chat, not
Claude, not coding.** It answers one question: **"What should we do?"**

- **Workflows:** Architecture Review · Product Review · Research Debate · Trade-off Analysis · Risk Review · Final Decision · **Challenge My Idea**.
- **Every session produces:** Consensus · Risks · Alternatives · Decision · an **approved execution plan** (handed *down* to Execution/Hermes).
- **Never:** no casual Q&A, no implementation, no sprint-building. Outputs are recorded into the project's **Decision History** (the single decision ledger that replaces the 3 current ones).

## Step 7 — Execution (after a decision)
One section, sequential stages, **no strategy allowed**:
**Claude Code · Codex** (build) → **Hermes** (plan: milestones/epics/issues/sprints/acceptance/prompts) → **Linear**
(track status only) → **Git** (health/branches) → **Deploy** (Vercel status, production blockers).
- Inputs: an approved decision + Hermes plan. Outputs: tracked issues, merges, releases.
- **Never:** no brainstorming, no research, no product strategy. `/linear-board` and the `feedback-loops`/Git/Deploy surfaces live here.

## Step 8 — Knowledge (long-term memory)
Everything worth remembering ends here, **searchable**: Architecture (one living map) · Research · Specifications ·
Lessons Learned · Technical Notes · Release Notes · Decision History. This absorbs the entire `docs/` pile (by cluster,
per §2) **into the relevant project**. Read-mostly; durable; the recall layer that feeds Context into the Lab.

## Step 9 — Daily (replace the scattered daily docs)
Replaces all 6 daily/loop docs with one rhythm:
- **Morning:** today's priorities · today's blockers · today's focus.
- **Evening:** completed work · lessons · tomorrow.
Nothing else. A generated digest over Execution/Lab/Knowledge — it summarizes, it never stores.

## Step 10 — Global Command Palette (⌘K — command-first)
Browsing is the fallback; the palette is the default. Actions:
`Open RangeClarity` · `Continue yesterday` · `Create sprint` · `Review architecture` · `Ask Council` ·
`Generate Hermes plan` · `Create Linear issue` · `Open documentation` · `New decision` · `Search everything`.
It both **navigates** (jump to a project/decision/doc/issue) and **acts** (run the workflow). One overlay, every surface.

## Step 11 — Friction to remove (recommend removals before additions)
- **Too many dashboards:** `/ops` + `/command-center` + neural-map + module-status-board → **one** Mission Control + per-project views.
- **Duplicate navigation:** the circular `/ops` ↔ `/command-center` cross-links → one sidebar, no cross-nav.
- **Duplicate state:** 7 "state" docs + 2 dashboards → Mission Control is the only state surface.
- **Duplicate context:** `project-memory` + `command-center` + `rc-ops-brain` → Project ▸ Context (one).
- **Too many docs at root:** ~70 loose `docs/*.md` → none loose; all inside a project's Knowledge.
- **Too many clicks:** anything reachable in >2 clicks gets a ⌘K verb.
- **Dead weight:** `/designs/**`, experiment routes, `env_local.code-search`, stray `daily-updates/`/`web/`/`design/` → Archive/Delete.
- **Ledger sprawl:** 3 decision logs + 12 roadmap docs → 1 Decision History + 1 Roadmap.

---

## Step 12 — Implementation plan (await approval before any code)

**1. Migration map** — see §2 (every route + every doc cluster has exactly one destination).

**2. Sidebar blueprint** — one `AppShell` with the 8 items (§3); active-project chip in the top bar; ⌘K bound globally. No other nav exists.

**3. Layout blueprint**
```
┌ topbar: [Project ▾]  breadcrumb Project ▸ Lens ▸ Artifact        ⌘K ─┐
├ sidebar (8) ┬ content: the active lens, scoped to the active project  │
│ Mission Ctrl│   Mission Control = cards · Projects = container         │
│ Projects    │   Decision Lab = sessions · Execution = plan/track/ship  │
│ …           │   Knowledge = docs · Daily = morning/evening             │
└─────────────┴──────────────────────────────────────────────────────────┘
```

**4. Route changes** (target workspace app)
| New route | Replaces |
|---|---|
| `/` | `/ops` + `/command-center` → **Mission Control** |
| `/projects` · `/projects/[id]` | `/project-plan` + project containers |
| `/decision-lab` · `/decision-lab/[id]` | `ai-architecture-council/` (adopted) |
| `/execution` (tabs plan/track/git/deploy) | `/linear-board` + ops commands/deploy + feedback-loops |
| `/knowledge` · `/knowledge/[...slug]` | `/ops/neural-map` + all `docs/**` |
| `/daily` | the 6 daily docs |
| `/settings` | provider/integration/weights config |
> **Open decision (Risk #1):** the workspace should be **its own app** (the public RangeClarity product owns `/`). Recommended: grow `ai-architecture-council/` into the workspace app (Decision Lab is already there) **or** a new `cowork/` app; the product app is left untouched.

**5. Component changes**
- **New:** `AppShell` (sidebar+topbar+⌘K) · `CommandPalette` · `MissionControl` (cards) · `ProjectSwitcher` · `LensTabs` · `KnowledgeBrowser` · `DailyView` · `ExecutionTabs`.
- **Reuse/adopt:** Council's `AgentChips`/`ResultTabs`/`LinearPreview` → **Decision Lab**; `lib/ops/opsData` → Mission Control data; `lib/linear/client` → Execution; `CopyButton`.
- **Retire:** `app/ops/page.tsx`+`ops.module.css`, `app/command-center/CommandCenter.tsx`, `app/linear-board/*`, `app/ops/neural-map/*` (content re-homed, not lost).

**6. Deleted pages** (from the workspace nav): `/ops`, `/command-center`, `/linear-board`, `/ops/neural-map`, `/project-plan`, `/designs/**`, `/range-command-premium`, `/variant-codex-section`. *(Content migrated first; routes removed last, with redirects.)*

**7. Merged pages**: `/ops` + `/command-center` → **Mission Control**; 6 daily docs → **Daily**; 3 decision logs → **Decision History**; ~12 roadmap/sprint docs → **one Roadmap + sprint view**; 6 architecture docs → **one living map**.

**8. New hierarchy**
```
Workspace
├─ Mission Control            (home; cards; routes you out)
├─ Projects/<project>         (container)
│   └─ Overview · Architecture · Decisions · Research · Knowledge
│      · Roadmap · Hermes · Linear · Releases · Sessions · Context
├─ Decision Lab              (council sessions → decisions)
├─ Execution                 (Claude Code · Codex · Hermes · Linear · Git · Deploy)
├─ Knowledge                 (architecture · research · specs · lessons · release notes · decisions)
├─ Daily                     (morning · evening)
├─ ⌘K Search · Settings
```

**9. Risks**
- **R1 — one app vs two.** Workspace must not collide with / break the public product (owns `/`, gated routes). *Mitigation:* separate workspace app; product untouched.
- **R2 — doc migration is large (~110 files).** *Mitigation:* migrate in waves (architecture → research → ops/daily/decisions), preserve links, never delete originals until the new home is live.
- **R3 — dirty git tree.** Lots of uncommitted work. *Mitigation:* small, reviewable lanes; commit per migration wave; no broad cleanup commit.
- **R4 — losing history.** *Mitigation:* "Archive," never delete, for anything with provenance; keep redirects.
- **R5 — scope creep into new features.** *Mitigation:* Phase 1 only **re-homes** — zero new features, zero new dashboards.

**10. Rollout plan** (each step verified: typecheck/lint/test; reversible; one lane)
1. Stand up `AppShell` + 8-item sidebar + ⌘K (empty shells, behind a flag). *No data moves.*
2. Build **Mission Control** by *merging* `/ops` + `/command-center` data (existing sources only).
3. Move `/linear-board` → **Execution ▸ Linear**; `/ops/neural-map` → **Knowledge** view; `/project-plan` → **Projects**.
4. Adopt the Council as **Decision Lab**; wire Decision History.
5. Migrate `docs/**` into **Knowledge/Projects** in waves (architecture → research → specs → release notes → ops/daily/decisions merges).
6. Remove old routes (`/ops`, `/command-center`, …) + experiment routes from nav, with redirects; delete junk.
7. Final pass: ⌘K verbs for every action; empty-state polish; verify "one destination per task."

---

## ✅ Success check
After rollout you can name any task and point to one place without thinking: *new idea → Mission Control · architecture
→ Decision Lab · sprint → Execution · doc → Knowledge · today → Daily · find → ⌘K.* One operating system — not a pile
of dashboards, tools, or docs.

## ⛔ Awaiting approval
**Nothing has changed.** This is the plan. On approval, I'll execute **Rollout Step 1 only** (the `AppShell` + sidebar +
⌘K shells, behind a flag, zero data moved) and stop for review — then proceed one rollout step per lane.
