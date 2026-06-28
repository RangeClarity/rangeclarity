# RangeClarity — Linear Kanban Plan (read-only proposal)

A local plan for turning the current project state into a clean Linear Kanban. **Nothing here has been
written to Linear.** Created from a read-only pass. Create only after founder approval (see end).

## Recovery Freeze - 2026-06-25

Do not write to Linear while the local source of truth is unstable.

Daily operating question: does this move RangeClarity closer to 10 qualified beta users without increasing false confidence?

Current local priority mapping:

- P0: Workspace Alignment & Path Reconciliation.
- Founder labeling: blocked until visual review paths are verified.
- Broken Zone A/B: blocked by founder labels.
- Website QA/commits: paused until branch/workspace drift is resolved.

External Linear sync stays paused until the canonical repo, branch, artifact paths, and local planning docs are accepted. Update existing Linear issues only after that, and do not create duplicates.

## Linear workspace (read-only inventory, 2026-06-23)
- **Workspace:** Dean Lich · **Team:** `DEA` (`Dean Lich`, id `cdd0ac7c…`).
- **Existing projects:** Taskoza · Hermes Agent OS · FolioVantage → **no RangeClarity projects yet** (all 6 below are new).
- **Existing labels:** Improvement · Bug · Feature → only **Bug** overlaps; the rest are new.
- **Existing statuses (team DEA):** Inbox · Spec Needed · Backlog · Ready for Agent · Todo · Human Review · Running - Hermes · In Progress · Blocked · Done · Duplicate · Canceled.
- **Write API:** the Linear MCP connector is authenticated and **write-capable now**; the repo's own client (`lib/linear/client.ts`) is separately gated off (`LINEAR_WRITE_ENABLED=false`, no `LINEAR_API_KEY`). No writes have been made.

## 1. Projects (6 — all new)
| Project | Purpose |
|---|---|
| **Indicator Core V2** | The Pine engine: Location, Zone Quality, Extension, Structure Change, Score Caps, Regime |
| **Website Funnel** | Homepage + /beta + free-access + mobile conversion |
| **Live QA Agent** | Offline indicator-QA engine, fixtures, findings → tasks |
| **Command Center / Ops** | Internal workbench, loops, gating, repo hygiene, decisions |
| **Payments / Lemon** | Checkout links, providers, billing posture (no logic changes without approval) |
| **Launch Readiness** | Go/no-go for the first paying beta users |

## 2. Statuses (proposed → map to existing DEA workflow, so no new statuses are required)
| Proposed | Use existing DEA status | Note |
|---|---|---|
| Inbox | **Inbox** | exact |
| Founder Review | **Human Review** | reuse (or add a "Founder Review" status later) |
| Ready | **Ready for Agent** | (or Todo) |
| In Progress | **In Progress** | exact |
| Needs QA | **Human Review** + `qa` label | or add a "Needs QA" status later |
| Blocked | **Blocked** | exact |
| Done | **Done** | exact |

## 3. Labels (13 — create the 12 new; reuse `Bug`)
`indicator` · `pine` · `website` · `mobile` · `qa` · `ops` · `payments` · `linear` · `git` ·
`founder-decision` · `bug` (→ existing **Bug**) · `risk` · `cleanup`

## 4. Priority model → Linear priority field
| Plan | Linear |
|---|---|
| **P0 blocker** | 1 · Urgent |
| **P1 high leverage** | 2 · High |
| **P2 useful** | 3 · Medium |
| **P3 later** | 4 · Low |

## 5. GitHub linking convention
- **Branch:** `dean/<LINEAR-ID>-short-slug` → e.g. `dean/dea-123-internal-pages-gate`
- **Commit:** `<LINEAR-ID> short message` → e.g. `DEA-123 Gate internal ops pages`
- **PR:** `<LINEAR-ID> title` → e.g. `DEA-123 Gate internal ops pages before main deploy`
- `<LINEAR-ID>` (e.g. `DEA-123`) is assigned by Linear when the issue is created; the `RC-##` below are
  provisional plan IDs only.

---

## 6. Initial issues (11)

> Provisional IDs `RC-01…RC-11`; real `DEA-###` assigned on creation. Owners: Founder · Claude · Codex · Pine Specialist · Fullstack.

### RC-01 — Gate internal ops pages before main deploy
- **Project:** Command Center / Ops · **Priority:** P0 · **Labels:** ops, risk, git · **Owner:** Claude/Fullstack → Founder (approve merge)
- **Description:** Gate `/ops`, `/command-center`, `/linear-board` behind `RC_INTERNAL_PAGES_ENABLED` (`notFound()` unless `"true"`). Code is implemented this session; needs `npm run health` green + merge so internal pages can never deploy publicly.
- **Acceptance:** var unset/false → all three 404; `=true` locally → render; health green; merged to main before any deploy.
- **Docs/files:** `app/ops/page.tsx`, `app/command-center/page.tsx`, `app/linear-board/page.tsx`, `.env.example`, `docs/ops/command-center.md`
- **Branch:** `dean/dea-XXX-internal-pages-gate` · **PR:** `DEA-XXX Gate internal ops pages before main deploy`

### RC-02 — Update Lemon live checkout links in canonical repo
- **Project:** Payments / Lemon · **Priority:** P1 · **Labels:** payments, founder-decision · **Owner:** Founder (links/keys) + Fullstack
- **Description:** Confirm + set the live Lemon checkout (env `LEMONSQUEEZY_*` / provider) in the canonical repo env / Vercel. No secrets committed. Verify in Lemon test mode (no real card).
- **Acceptance:** checkout opens the correct live links from the canonical repo; secrets only in env; tested in test mode.
- **Docs/files:** `.env.example`, `app/api/beta-checkout/route.ts`, `lib/payments/providers/lemonsqueezy.ts`, `docs/ops/project-memory.md`
- **Branch:** `dean/dea-XXX-lemon-live-links` · **PR:** `DEA-XXX Update Lemon live checkout links`

### RC-03 — Clean dirty git tree into safe commit groups
- **Project:** Command Center / Ops · **Priority:** P1 · **Labels:** git, cleanup, risk · **Owner:** Founder (runs git) + Claude (plan)
- **Description:** Working tree is large; group into explicit-path commits (website hero+asset / Pine / payments / `package.json`+lock / ops). Never `git add -A`. Remove junk (`.opscheck/`, `repo-dropin*/`, `Mobile_Design.zip`).
- **Acceptance:** tree organized into reviewed commits (or intentionally ignored); junk removed; main green; nothing pushed without approval.
- **Docs/files:** `docs/ops/project-os.md` (cleanup plan)
- **Branch:** per-group · **PR:** e.g. `DEA-XXX Commit website mobile hero + asset swap`

### RC-04 — Website + mobile QA on homepage and beta funnel
- **Project:** Website Funnel · **Priority:** P1 · **Labels:** website, mobile, qa · **Owner:** Codex/Claude (audit) → Founder (approve batch)
- **Description:** Audit homepage + `/beta` + `/beta/free-access` at 390/430px + desktop; produce findings (severity/file/fix) → one safe fix batch. No redesign.
- **Acceptance:** findings produced; one approved fix batch; health green; no layout regressions.
- **Docs/files:** `prompts/website-mobile-qa.md`, `app/designs/rangeclarity-fox-brand-v1/*`, `app/beta/*`
- **Branch:** `dean/dea-XXX-website-mobile-qa` · **PR:** `DEA-XXX Website/mobile QA fix batch`

### RC-05 — Build Indicator Core V2 Location Engine (finalize + visual approval)
- **Project:** Indicator Core V2 · **Priority:** P1 · **Labels:** indicator, pine, qa · **Owner:** Pine Specialist/Claude → Founder (visual approval)
- **Description:** Location Quality Kernel v1 is implemented + QA-clean (0 product criticals) with the proximity gate. Remaining: visual approval on QQQ/SPY/AAPL/NVDA/TSLA/MSFT/META/BTCUSD/ETHUSD, then sign off. Pine edits stay approval-gated.
- **Acceptance:** visual pass on the 9 symbols; QA green; Dean sign-off; `product-roadmap.md` Location → done.
- **Docs/files:** `pine/rangeclarity_sr_core_v1.pine`, `docs/qa/location-kernel-v1-manual-test.md`, `docs/qa/live-qa-report.md`, `docs/ops/product-roadmap.md`
- **Branch:** `dean/dea-XXX-location-engine` · **PR:** `DEA-XXX Location Engine v1 sign-off`

### RC-06 — Build Zone Quality scoring v1
- **Project:** Indicator Core V2 · **Priority:** P2 · **Labels:** indicator, pine · **Owner:** Pine Specialist/Claude → Founder · **Blocked by:** RC-05
- **Description:** Zone Quality = 20 pts in the V2 engine spec. Do NOT start until Location passes visual + QA. Plan-first → approval → implement one slice → QA gate.
- **Acceptance:** plan approved; implemented as one slice; `rc_live_qa` fixtures updated; `qa:rc` clean; visual pass.
- **Docs/files:** `docs/RANGECLARITY_V2_ENGINE_SPEC.md`, `docs/ops/product-roadmap.md`, `prompts/indicator-core-upgrade.md`
- **Branch:** `dean/dea-XXX-zone-quality-v1` · **PR:** `DEA-XXX Zone Quality scoring v1`

### RC-07 — Connect Live QA findings to task drafts
- **Project:** Live QA Agent · **Priority:** P2 · **Labels:** qa, ops · **Owner:** Claude/Fullstack
- **Description:** Read `data/qa/findings.jsonl` → draft tasks (title/severity/files/acceptance/owner); read-only display in the Command Center; optional `qa:tasks` script. (Green slice from `project-os.md`.)
- **Acceptance:** findings render as draft tasks; read-only; no execution; health green.
- **Docs/files:** `data/qa/findings.jsonl`, `docs/qa/live-qa-report.md`, `lib/ops/opsData.ts`, `docs/ops/project-os.md`
- **Branch:** `dean/dea-XXX-qa-task-converter` · **PR:** `DEA-XXX QA findings → task drafts`

### RC-08 — Prepare beta launch readiness checklist
- **Project:** Launch Readiness · **Priority:** P1 · **Labels:** ops, founder-decision · **Owner:** Founder + Codex
- **Description:** Go/no-go before charging the first beta users (health, QA, indicator visual, brand, mobile, funnel, legal disclaimers, env, manual fulfillment). Use the release-readiness prompt.
- **Acceptance:** checklist completed; blockers cleared or noted; go/no-go recorded in `docs/decisions.md`.
- **Docs/files:** `prompts/release-readiness.md`, `docs/launch-readiness.md`, `docs/ops/founder-decision-queue.md`
- **Branch:** `dean/dea-XXX-launch-readiness` · **PR:** `DEA-XXX Beta launch readiness checklist`

### RC-09 — Confirm canonical repo + retire OneDrive checkout
- **Project:** Command Center / Ops · **Priority:** P0 · **Labels:** founder-decision, git, risk · **Owner:** Founder
- **Description:** Confirm `C:\Users\USER\Claude\Projects\RangeClarity` is the ONLY working checkout; never push from the OneDrive copy; decide port vs abandon its commits.
- **Acceptance:** decision recorded in `decisions.md`; OneDrive checkout not used for pushes.
- **Docs/files:** `docs/ops/founder-decision-queue.md`
- **Branch:** n/a (decision) · **PR:** n/a

### RC-10 — Confirm `npm run health` green baseline on host
- **Project:** Command Center / Ops · **Priority:** P0 · **Labels:** ops, risk · **Owner:** Founder
- **Description:** The agent sandbox cannot run health (corrupted mount); confirm typecheck + lint + qa:rc + build are green on the canonical machine. The whole loop depends on a trustworthy signal.
- **Acceptance:** `npm run health` green locally; recorded in `current-loop-status.md`.
- **Docs/files:** `docs/ops/current-loop-status.md`, `package.json`
- **Branch:** n/a (verification) · **PR:** n/a

### RC-11 — Keep Linear board/data gated until auth
- **Project:** Command Center / Ops · **Priority:** P2 · **Labels:** founder-decision, linear, ops, risk · **Owner:** Founder
- **Description:** `/linear-board` is now gated by `RC_INTERNAL_PAGES_ENABLED`; Linear writes by `LINEAR_WRITE_ENABLED` + connector approval. Confirm board/issue data stays non-public until auth; keep writes approval-gated.
- **Acceptance:** decision recorded; board not publicly reachable; Linear writes require explicit approval.
- **Docs/files:** `app/linear-board/page.tsx`, `lib/linear/client.ts`, `docs/ops/founder-decision-queue.md`
- **Branch:** n/a · **PR:** n/a

---

## 7. Suggested create order
1. **Structure:** 6 projects + the 12 new labels (reuse `Bug`).
2. **P0 guardrails:** RC-01 (gate), RC-09 (canonical repo), RC-10 (health baseline).
3. **P1 high-leverage:** RC-02 (Lemon), RC-04 (mobile QA), RC-05 (Location), RC-08 (launch readiness).
4. **P2 later:** RC-03 (git cleanup), RC-06 (Zone Quality, blocked), RC-07 (QA→tasks), RC-11 (Linear gating).

_Nothing is created until Dean approves. The Linear connector can write now, but is being held._
