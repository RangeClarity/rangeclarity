# Co Work Phase 2 — Radical Simplification
## Five tabs. Five questions. Nothing else.

> **Design only — nothing implemented.** Supersedes the 8-item sidebar in [`phase-1-ux-refactor-plan`](./phase-1-ux-refactor-plan.md).
> The principles still hold; this collapses them to the founder's mental model. Optimize for **one** thing: *mental clarity.*
> Every click has a cost. The goal is not to expose everything — it's to help decide **what to do next**.

## The shift: from lenses to objects
Phase 1 organized by **workflow lens** (8 places). Phase 2 organizes by **the object you're thinking about** (5).
You never think *"I want Hermes."* You think *"I want to ship RC-1."* The five tabs are the five questions a founder
actually asks; **everything else is a view reached *inside* the answer.**

---

## 1. Final sidebar — exactly five
| Tab | The one question it answers |
|---|---|
| **Mission** | What deserves my attention **now**? |
| **Projects** | What am I **building**? |
| **Decision** | What **should I do**? |
| **Build** | **How** do I execute it? |
| **Knowledge** | What have I **already learned**? |

Not tabs (they don't earn a top-level slot): **⌘K command palette** (everywhere) · **pinned projects** · **recent work**.
That's the entire chrome. One sidebar, five items, a palette.

---

## 2. Page responsibilities (one question each · hard walls)
- **Mission** — *what now?* One screen, **≤6 cards**, only actionable. **Never** a workroom (it routes; it doesn't do).
- **Projects** — *what am I building?* The container; every artifact lives in a project. **Never** a place for loose, project-less docs.
- **Decision** — *what should I do?* The council: architecture · product · research · trade-offs · risks · consensus. **Never** coding, chat, or sprint-building.
- **Build** — *how do I execute it?* Claude · Codex · Hermes · Linear · Git · Deploy. **Never** strategy, brainstorming, or research.
- **Knowledge** — *what have I learned?* Architecture · research · specs · decision history · lessons · release notes + search. **Never** live status or decisions.

---

## 3. Internal navigation (secondary nav = views *inside* the five)
| Tab | Views inside it (segments/sub-tabs, scoped to the active project) |
|---|---|
| **Mission** | **Today** (default: focus · blocked · waiting decisions · sprint · recent · quick actions) ⇄ **This week** · the **Daily** morning/evening rhythm lives here |
| **Projects** | Overview · **Progress** (roadmap/milestones) · Knowledge · Build · Decisions |
| **Decision** | New decision + recent **Sessions**; modes: Architecture · Product · Research · Trade-off · Risk · Consensus → records a decision |
| **Build** | **Plan** (Hermes) · **Agents** (Claude · Codex) · **Track** (Linear) · **Ship** (Git · Deploy · Releases) |
| **Knowledge** | Architecture · Research · Specifications · Decision History · Lessons Learned · Release Notes · Documents · **Search** |

Everything is **project-scoped** by default (pick the object first); with no project selected, a tab aggregates across projects.

---

## 4. What gets merged (8 → 5)
| Phase-1 (8) | Phase-2 (5) | How |
|---|---|---|
| Mission Control | **Mission** | rename + tighten to ≤6 cards |
| Decision Lab | **Decision** | rename |
| Execution | **Build** | rename; Git/Deploy/Releases become views |
| Knowledge | **Knowledge** | absorbs Documents/Architecture/Research/Specs/Release Notes/Decision History/Sessions as views |
| **Daily** | → **Mission** | morning/evening is Mission's time dimension, not a tab |
| **Search** | → **⌘K** + Knowledge ▸ Search | a command, not a destination |
| **Settings** | → top-bar menu / ⌘K | a utility, not a tab |
| Projects | **Projects** | unchanged (the container) |

---

## 5. What gets removed (challenge every page — if it can't justify a top-level slot, it's demoted or deleted)
| Page / tab | Verdict |
|---|---|
| `/ops`, `/command-center` (duplicate dashboards) | **Removed** → merged into **Mission** |
| `/ops/neural-map`, module-status-board (map duplicates) | **Removed as pages** → a **view** in Knowledge ▸ Architecture |
| `/linear-board` | **Removed as a tab** → **Build ▸ Track** |
| `/project-plan` | **Removed** → **Projects ▸ Progress** |
| **Daily** (as a tab) | **Removed** → **Mission** (Today) |
| **Search** (as a tab) | **Removed** → **⌘K** |
| **Settings** (as a tab) | **Removed** → menu/⌘K |
| `/designs/**`, experiment routes | **Removed** from the workspace (archive) |
| The 110-file loose `docs/` pile | **Removed from "places"** → lives only inside a project's Knowledge |

Five primary pages survive. Everything that was a "place" but isn't one of the five questions is now a **view**.

---

## 6. What becomes secondary navigation (object-first, never tool-first)
| You think… (not "I want Hermes") | It lives in |
|---|---|
| Hermes · Linear · Claude · Codex · Git · Deploy · Releases | **Build** (Plan · Agents · Track · Ship) |
| Daily | **Mission** (Today rhythm) |
| Research · Architecture · Documents · Specifications · Release Notes · Lessons | **Knowledge** |
| Decision History · Sessions | **Decision** (recent) + **Knowledge** (record) + **Project ▸ Decisions** |
| Roadmap | **Projects ▸ Progress** |
| Search · Settings | **⌘K** (+ Knowledge ▸ Search) |

---

## 7. Why this is simpler
- **Five tabs = five questions.** No tab overlaps another; you pick by *what you're asking*, not what tool you want.
- **Object-first.** You enter through the **project** ("ship RC-1") and the views follow you — the UI mirrors how you think.
- **Workflow happens inside a page, not across pages** (next section).
- **⌘K removes browsing.** Most actions are typed, not navigated.
- **Mission is ≤6 cards.** The home never overwhelms; empty cards disappear.
- **One mental model** to hold: *Mission (now) → Projects (what) → Decision (should) → Build (how) → Knowledge (learned).*

## Remove long flows — process ≠ UI
The chain **Idea → Research → Council → Decision → Hermes → Linear → Claude → Review → Docs → Archive** is a *process*,
not a navigation path. In the UI it's an **inline action chain**: from a **Decision** session you click **"→ Plan in Build"**;
from the Hermes plan, **"→ Create Linear issues"**; from a merged PR, **"→ Save to Knowledge."** Most real work is **1–2 clicks**,
and the workflow unfolds **inside the current page** — you never walk the ten steps as ten screens.

## The justification test (kept from Phase 1, stricter now)
A surface earns a **top-level tab** only if it's one of the five questions. Otherwise it's a **view**. Before anything
returns to the sidebar it must fail to be expressible as a view inside Mission / Projects / Decision / Build / Knowledge —
and almost nothing does. **Less pages. More meaning.**

---

## ⛔ Awaiting approval
Design only — **nothing built or changed.** On approval this *replaces* the Phase-1 8-tab sidebar; the first build step
becomes the same as before but with **five** items: stand up the `AppShell` with **Mission · Projects · Decision · Build ·
Knowledge** + ⌘K (empty shells, flagged, zero data moved), then proceed one step per lane.
