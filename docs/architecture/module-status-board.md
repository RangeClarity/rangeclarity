# RangeClarity Module Status Board

> **Visual status of every module.** Documentation only. _As of 2026-06-25._
> Legend: 🟢 GREEN = healthy/safe · 🟡 YELLOW = active or has a known boundary leak, work carefully ·
> 🔴 RED = frozen / do-not-touch. Detail per module: [`modules/`](./modules/) ·
> boundaries: [module-registry](./module-registry.md) · daily view: [command-center](../ops/rangeclarity-command-center.md).

| Module | Status | Owner / purpose | Current risk | Next approved action | Blocked actions | Required test | Last known state |
|---|---|---|---|---|---|---|---|
| **Core Scoring** | 🟡 YELLOW | Window → calm verdict (`score_window_input`→`RcVerdict`) | **HIGH** — can manufacture false confidence | Migrate `full_real_review.py` to the facade (chains `prior`) | Any scoring / cap / `agree3` / Broken-Zone behavior change | Golden equivalence (`test_rc_scoring_facade.py`, full=1,767) | Facade exists; **2 consumers migrated** (render_visual_review, build_founder_review); baseline **1,767/1,767 identical** |
| **Data Adapters** | 🟡 YELLOW | Load + normalize candles (`loadCandles` target) | MEDIUM — loader colocated in scoring pkg + duplicated | None until Core API exists | Consolidating the 2 parallel `data_loader` copies | Schema test (identical `NormalizedCandles`) | Loads real CSVs (19/20) + synthetic fallback; isolated from product |
| **Research Experiments** | 🟡 YELLOW | Offline A/B vs the frozen baseline | MEDIUM — calls scorer internals; 2 parallel pkgs | Wait for ≥20 labels, then re-run the review agent | **Broken-Zone A/B** | Delta-vs-frozen-baseline report; reproduce 1,767 exactly | Real Baseline v1 frozen (1,767 windows · 0 Clear/High) |
| **Founder Review** | 🟡 YELLOW | Human labels = the truth signal | MEDIUM — agent imports engine internals | **Continue labels 15 → 20+**, then re-run review agent | A/B before enough labels | Label-schema guardrail (`npm run test`) | **15/40** labels written |
| **Web UI / Mobile** | 🟡 YELLOW | Marketing + access; never originates a verdict | LOW–MED — copy/compliance; structurally decoupled (good) | Run `health`/`verify` + browser smoke (mobile verification) | Broad redesign unless explicitly requested | Copy guardrail + Playwright smoke (`test:e2e`) | Mobile changes pending QA; web commits paused (workspace drift) |
| **Pine Layer** | 🔴 RED | TradingView visual companion (consumer only) | HIGH — risk of a second source of truth | **NONE** — do not touch until conviction improves | **All** Pine changes | Manual validation checklist (no automated test) | Frozen; must mirror the Python verdict, never lead |
| **Payments / Access** | 🔴 RED | Checkout + beta grant + access state | MEDIUM — money + access (isolated) | **NONE** — do not touch unless explicitly requested | All payment/Lemon behavior changes; Stripe live | Typecheck/lint + `betaStore` unit tests | Isolated under `lib/payments`; live links in env/Vercel only |
| **Ops / Feedback Loops** | 🟡 YELLOW | Make the project fast to test (`health`/`verify`) | LOW — inspection only | Document the daily command flow; keep `health` green | None | Is the test layer; add golden test to the routine | `health`=fast, `verify`=full; golden test wired in |
| **Product / Docs / PRD** | 🟢 GREEN | Planning language + source of truth | LOW | Keep this board + system model current | None | Copy/label guardrails (indirect) | Living system model + command center in place |

## How to read a row
- **Status** = the traffic light for "can I safely work here today?" 🔴 means hands off.
- **Required test** = the gate that must pass before that module's work is considered done.
- **Next approved action** = the *only* thing approved now; anything else needs a PRD + founder approval.
- Update this board whenever a status, next action, or blocker changes (it is a living dashboard).
