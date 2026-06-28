# Co Work Phase 3 — The Inevitable Shape
*Final design review. No code. The smallest founder OS: the software disappears, the project remains.*

> The realization: every "tab" was a **tool wearing a costume**. A founder doesn't open *Decision* or *Build* — they
> open **a project** and **continue**. Capabilities (Claude, Codex, Hermes, Linear, Git, Deploy) are *verbs you invoke
> on the current task*, not *rooms you walk into*. So navigation collapses to almost nothing.

## 1. Final recommended navigation — **two doors + a command bar**
```
●  Home                         ← resume "where you stopped" + what needs you across projects
●  RangeClarity   ○ Marketing   ← your projects ARE the nav; you live inside one
   + New project
──────────────
⌘K                              ← every capability + search, everywhere (NOT a page)
```
No Decision tab. No Build tab. No Knowledge tab. No Daily / Search / Settings tabs.
- **Home** is the only non-project page — and it's nearly empty (§7).
- **A Project** is the whole OS. Inside it, *Work · Decisions · Knowledge · Progress* are **facets that surface contextually**, never pages you navigate to.
- **⌘K** runs anything ("Ask Council", "Generate Hermes plan", "Create Linear issue", "Search everything") and jumps anywhere.

*Considered & rejected: **One** (just-the-project + ⌘K) — loses the cross-project "what needs me" glance. **Three+** — re-introduces tools-as-tabs the Apple/Linear test rejects.*

## 2. Justification — only two surfaces survive
- **Home** — you must **resume in one second** and see the single thing that needs you. Apple & Linear both keep one "inbox/continue" door. ✅
- **Project** — the object you actually think about ("RC-1"). Everything else is a *property* of a project. It's the point. ✅
- **⌘K** — speed. Raycast/Cursor/Linear feel instant because you **type intent**, you don't browse. The spine, not a page. ✅

## 3. Pages removed (failed "would Apple expose this?")
| Removed | Because it's really… |
|---|---|
| **Decision** (tab) | a *capability* invoked on a project; its output is a record **inside** the project |
| **Build / Execution** (tab) | just **the current work inside a project**; Claude/Codex/Hermes/Linear/Git/Deploy are inline actions on the task |
| **Knowledge** (tab) | **contextual** (lives in its project) + globally recalled via **⌘K search** |
| **Daily** | Home's "today" |
| **Search · Settings** | ⌘K · the account menu |
| `/ops` · `/command-center` · neural-map · `/linear-board` · `/project-plan` · Mission widgets | absorbed into **Home + Project** |

## 4. Pages merged
- Mission Control + Daily → **Home** (one calm launchpad).
- Decision Lab + Execution + Knowledge → **facets of a Project** (Work · Decisions · Knowledge · Progress), shown in-page, not as nav.
- Every dashboard/doc → **inside its project** (or ⌘K search). Nothing lives loose.

## 5. Why this is simpler
- **Two doors, not eight.** You never pick a tool — you open a project and continue.
- **The software disappears.** When you land, you're already building, not deciding where to click.
- **Capabilities on demand.** Claude/Hermes/Linear appear *on the current task* and vanish when irrelevant.
- **Type, don't browse.** ⌘K makes manual navigation almost unnecessary.
- **One object to hold in mind:** the project. Everything is a property of it.

## 6. Three founder journeys
- **"Continue RC-1."** Open Co Work → Home shows **"Continue: RC-1 — Fix Vercel preview (16h ago)"** → click → you're on the exact task. **(1 click.)**
- **"Make a hard decision."** Inside the project, ⌘K → **"Ask Council: caps vs agree3"** → debate runs **inline** → decision saved to the project's history → ⌘K **"Plan in Hermes"** if you act. **(0 navigation.)**
- **"I have a new idea."** ⌘K → **"New idea"** → captured to the project inbox (or spins up a new project), from anywhere. **(1 action.)**

## 7. One screen — the home experience
```
┌──────────────────────────────────────────────────────────────────┐
│  Co Work                                                  ⌘K   ◐  │
│                                                                    │
│   ▸  Continue   RC-1 — "Fix Vercel preview"        stopped 16h ago │   ← the ONE thing
│                                                                    │
│   Focus            Migrate full_real_review.py to the facade       │
│   Blocker          Vercel preview red until the CTA fix lands      │
│   Recommendation   Commit the feedback-loop scripts (ready)        │
│                                                                    │
│   Projects   ● RangeClarity    ○ Marketing    + New                │
└──────────────────────────────────────────────────────────────────┘
```
One **Continue** line, three one-liners (focus · blocker · recommendation), your projects. No widgets, no grid, no scroll.

## 8. One sentence
> **Co Work is the place you open to continue building — your projects, resumed, with every capability one keystroke away.**
