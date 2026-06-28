# Co Work — Implementation Plan v1
## Three surfaces (Home · Projects · Strategy) + global ⌘K

> **Approved direction**, with the correction: **3 primary surfaces**, not 2. Strategy is a **durable thinking
> space**, not just a command. Capabilities (Claude, Codex, Hermes, Linear, Git, Deploy, Documents, Daily, Search,
> Settings) are **actions / views / contextual panels — never tabs.** _Plan only — do not implement yet._

## 0. Assumptions
- **Placement:** the Co Work workspace is **its own Next.js app**, built by **growing `ai-architecture-council/`** (it already ships the council engine, Hermes, Linear adapters, storage, Zod schemas). The **RangeClarity product app stays untouched** (it owns `/`, `/beta`, scoring, Pine, payments).
- **Stack:** Next.js (App Router) · TypeScript · Tailwind + shadcn/ui · React Query · Server Actions · Prisma (SQLite→Postgres) · Zod schemas as the contract. Speed model (Linear/Raycast): prefetch, optimistic UI, local cache, keyboard-first.
- **Law:** nothing lives outside a Project except *floating Strategy threads* (a question that doesn't belong to a project yet) and Home (the launchpad).

## 1. Routes
| Route | Surface | Notes |
|---|---|---|
| `/` | **Home** | Continue + focus/blocker/recommendation + recent projects. ~4 elements, no widgets. |
| `/p/[projectId]` | **Project** (default = **Work**) | current task · reviews · ready-to-ship · history, in one stream |
| `/p/[projectId]/knowledge` | Project ▸ Knowledge | architecture · research · specs · lessons · release notes (a *view*, deep-linkable) |
| `/p/[projectId]/progress` | Project ▸ Progress | roadmap · milestones |
| `/p/[projectId]/history` | Project ▸ History | event timeline (incl. linked decisions) |
| `/strategy` | **Strategy** | durable thinking: decisions · research · sessions · trade-offs · rejected ideas · architecture reviews · open questions |
| `/strategy/s/[sessionId]` | Strategy ▸ Session | a council session / decision record |
| `/strategy/t/[threadId]` | Strategy ▸ Thread | a strategic question (may have `projectId = null`) |
| `/settings` | (not a tab) | reachable via ⌘K / account menu |
| — | **⌘K** | global overlay component — search + every capability. Not a route. |
**Capabilities are NOT routes:** "Ask Council", "Generate Hermes plan", "Create Linear issue", "Run Claude/Codex", "Git/Deploy status", "Search", "Daily", "Continue yesterday", "New idea" — all are **⌘K actions** + **inline action bars** on the current object.

## 2. Components
- **Chrome:** `AppShell` (3-item rail: Home · Projects · Strategy + pinned/recent project list + ⌘K trigger) · `CommandPalette` (⌘K: search + actions) · `ActionBar` (inline "→ Ask Council / Plan in Hermes / Create issue" on any object).
- **Home:** `ContinueCard` (the one resume target) · `FocusBlockerRecommendation` (3 one-liners) · `RecentProjects`.
- **Project:** `ProjectShell` (header + facet switch) · `WorkStream` (current task · reviews · ready-to-ship · history) · contextual panels `KnowledgePanel` · `ProgressPanel` · `ExecutionContext` (Hermes/Linear/Git/Deploy as **panels**, not pages).
- **Strategy:** `StrategyBoard` (threads + sessions) · `SessionView` (**reuse** the council's `AgentChips`/`ResultTabs`/`LinearPreview`) · `DecisionRecord` · `ResearchThread` · `RejectedIdeas`.
- **Reuse unchanged (from `ai-architecture-council/src`):** `providers/*` · `orchestrator/*` · `debate/*` · `synthesizer/*` · `hermes/*` · `linear/*` · `schema/{council,hermes,linear}` · `config/*`.

## 3. Data model assumptions (extend the council Prisma store)
| Model | Key fields | Owns |
|---|---|---|
| **Project** | id · name · slug · status(inbox/active/maintenance/archived) · context · pinned · createdAt · lastActiveAt · resumeTaskId | the operating object |
| **WorkItem** | id · projectId · title · kind(task/review/ready-to-ship) · status · sourceRef(decision/issue) · updatedAt | the Work stream |
| **StrategyThread** | id · title · kind(decision/research/tradeoff/rejected/architecture/question) · **projectId?(nullable)** · status · createdAt | durable thinking |
| **KnowledgeDoc** | id · projectId · type(architecture/research/spec/lesson/release-note/decision/document) · title · body · updatedAt | settled memory |
| **Event** | id · projectId · type · summary · at | history + Home "recent / changed since" |
| *(reuse)* **Session · HermesPlan · LinearPreview · Result** | from the council schema | strategy sessions → execution |
- **Resume state:** per-user `lastActiveProjectId` + `resumeTaskId` → powers Home's *Continue*.
- **Search:** one index over Project · StrategyThread · Session · KnowledgeDoc · WorkItem (SQLite FTS5 for MVP → pg tr\_gm later).
- A **Decision** (council output) links to its **StrategyThread** *and*, when it belongs to a project, the project's **History/Knowledge** — recorded once, referenced twice.

## 4. Migration map (current → new home, one destination each)
| Current | New home | Action |
|---|---|---|
| `/ops` + `/command-center` + Mission widgets | **Home** + per-project context | Merge |
| `/linear-board` | **Project ▸ ExecutionContext** (Linear panel) + ⌘K "Create issue" | Move (demote) |
| `/ops/neural-map` · `module-status-board` · `system-map` | **Project ▸ Knowledge ▸ Architecture** (one view) | Merge/Move |
| `/project-plan` | **Project ▸ Progress** | Move |
| `ai-architecture-council/` (council) | **Strategy** engine + Build capabilities | Adopt (becomes the app) |
| `docs/architecture/*` | Project ▸ Knowledge ▸ Architecture (1 map) | Merge |
| `docs/research/*` (53) | Project ▸ Knowledge ▸ Research / Strategy threads | Move |
| `docs/ops/{daily-*}` (6) | **Home** Daily panel (no docs) | Merge |
| `docs/ops/{decision-log,founder-decision-queue}` + `docs/decisions.md` | **Strategy ▸ Decisions** + Project History | Merge |
| `docs/{kanban,current-sprint,roadmaps…}` (~12) | Project ▸ Progress + ExecutionContext | Merge |
| `docs/specs/*` · patch notes | Project ▸ Knowledge ▸ Specs / Release Notes | Move |
| `docs/marketing/*` | **Marketing project** ▸ Knowledge | Move |
| product/payment/beta docs | RangeClarity product (out of scope) | Keep |
| `/designs/**` · experiments · junk | — | Archive/Delete |
| "Should we even do X?" (no project yet) | **Strategy thread** (`projectId = null`) | New home |

## 5. Feature flag
- `COWORK_WORKSPACE_V2=true` — single hard gate for the whole new workspace; **all** new routes/components behind it. Off → existing surfaces unchanged (zero risk to current internal pages / the product).
- Per-surface sub-flags for incremental rollout: `COWORK_HOME`, `COWORK_PROJECTS`, `COWORK_STRATEGY`, `COWORK_CMDK`.
- Reuse the existing env-gate pattern (`process.env.* !== "true" → notFound()`), plus a client flag for ⌘K.

## 6. Rollout steps (one lane each · verified typecheck/lint/test · reversible · nothing auto-committed)
1. **Shell** — `AppShell` (Home/Projects/Strategy rail + project list) + global `CommandPalette`, behind `COWORK_WORKSPACE_V2`. Empty surfaces, **zero data moved**.
2. **Data model** — add Prisma models (Project, WorkItem, StrategyThread, KnowledgeDoc, Event); `db:push`; seed one **RangeClarity** project from existing state (read-only).
3. **Home** — `ContinueCard` + focus/blocker/recommendation (from existing ops data) + recent projects. No widgets.
4. **Projects** — `/p/[id]` Work stream + Knowledge/Progress/History panels as **contextual views**, not tabs.
5. **Strategy** — adopt the council as `/strategy`: thread/session board + `SessionView` (reuse council components) + decision records + research/rejected threads (nullable project).
6. **⌘K capabilities** — wire actions: Continue · New idea · Ask Council · Generate Hermes plan · Create Linear issue (gated) · Search everything. Add inline `ActionBar`s. Tools become actions.
7. **Migrate content** — move docs into project Knowledge in **waves** (architecture → research → specs → notes); fold daily/decision/roadmap docs into Home/Strategy/Progress. Preserve links; originals archived, not deleted.
8. **Retire** — remove `/ops`, `/command-center`, `/linear-board`, `/ops/neural-map`, `/project-plan` (with redirects); archive experiments; flip `COWORK_WORKSPACE_V2` default on.
9. **Polish** — empty states, prefetch/optimistic/local cache, keyboard-first; verify "one destination per task".

## 7. Files likely to change / create
**Create (workspace app — extending `ai-architecture-council/`):**
- `app/(workspace)/layout.tsx` (AppShell) · `app/(workspace)/page.tsx` (Home) · `app/(workspace)/p/[projectId]/{page,knowledge,progress,history}` · `app/(workspace)/strategy/{page,s/[id],t/[id]}` · `app/(workspace)/settings/page.tsx`
- `app/components/{AppShell,CommandPalette,ActionBar,ContinueCard,FocusBlockerRecommendation,RecentProjects,ProjectShell,WorkStream,KnowledgePanel,ProgressPanel,ExecutionContext,StrategyBoard,SessionView}.tsx`
- `src/schema/{project,work,strategy,knowledge,event}.ts`
- `src/capabilities/registry.ts` (⌘K actions) · `src/search/index.ts` (FTS) · `src/config/flags.ts`
- `prisma/schema.prisma` (+ Project, WorkItem, StrategyThread, KnowledgeDoc, Event) · `src/storage/*` (impl SessionStore)
**Reuse unchanged:** `src/{providers,orchestrator,debate,synthesizer,hermes,linear}` · `src/schema/{council,hermes,linear}`.
**Untouched:** the RangeClarity product app (app/, lib/, research/, *.pine, lib/payments). Migration moves *docs*, not product code.

## 8. Risks
| # | Risk | Mitigation |
|---|---|---|
| R1 | App placement (grow council vs new app) | Extend the council app — lowest friction; engine already there |
| R2 | "Everything in a project" needs a real Project model + migrating ~110 docs | Migrate in waves; preserve links; **archive, never delete** originals |
| R3 | ⌘K-as-primary feels empty without fast search + action coverage | Ship core actions + FTS first; expand |
| R4 | Floating Strategy threads (nullable project) → dumping ground | "Promote to project" action; Strategy is durable but reviewed |
| R5 | Speed expectations (Linear/Raycast) | prefetch · optimistic · local cache · keep Home ≤4 elements |
| R6 | Breaking current internal pages while building | everything behind `COWORK_WORKSPACE_V2`; old surfaces stay until step 8 |
| R7 | Git constraints (dirty tree · sandbox can't commit) | small lanes; commit locally per step; no broad cleanup commit |
| R8 | Scope creep (it's an OS — temptation to add) | 3 surfaces + ⌘K only; capabilities are **actions**, never pages |

---
## ⛔ Await approval
Plan only — **nothing built**. On approval I'll execute **Rollout Step 1** (the `AppShell` + 3-rail + ⌘K shell behind
`COWORK_WORKSPACE_V2`, empty, zero data moved) and stop for review — then one rollout step per lane.
