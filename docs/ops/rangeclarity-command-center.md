# RangeClarity Command Center

> **The main daily view.** Documentation / dashboard only — reading this changes nothing.
> _As of 2026-06-25._ Companions: [module-status-board](../architecture/module-status-board.md) ·
> [daily-workflow](./daily-workflow.md) · [decision-log](./decision-log.md) ·
> [system-map](../architecture/system-map.md) · [project-status-template](./project-status-template.md).

---

## 🔴 Conviction: RED

> **RED** = not trustworthy yet, scoring is frozen, ship-to-Pine is blocked.
> Ladder: **RED → YELLOW → GREEN** (GREEN = validated vs the frozen baseline + founder labels).

**Why RED:**
- Founder labeling is only **15/40**.
- **Broken-Zone A/B is blocked** (needs ≥20 labels + a frozen-baseline comparison).
- **Pine is blocked** (no changes until conviction improves).
- **Scoring changes are blocked** until a baseline comparison proves no regression.

---

## 🟢 Active lanes (safe to work today)
| Lane | What's moving |
|---|---|
| **Research** | Baseline stable (1,767 windows frozen); waiting on labels before the next review-agent run. |
| **Core Scoring** | Behavior-preserving **facade migration** of low-risk consumers only. |
| **Web / Mobile** | Mobile verification via `health` / `verify` + browser smoke. |
| **Ops / Feedback Loops** | Documenting the daily command flow + keeping `health`/`verify` green. |
| **Product / Docs** | Living system model, command center, decision log. |

## ⛔ Blocked lanes (do not work — gated)
| Lane | Gate to unblock |
|---|---|
| **Pine** | Conviction must reach GREEN. |
| **Broken-Zone A/B** | ≥20 founder labels **and** a frozen-baseline comparison. |
| **Payment / Lemon** | Explicit founder request only. |
| **Broad scoring refactors** | A PRD + founder approval + golden-test proof; never speculative. |

---

## 🎯 Current priority (in order)
1. **Continue founder labels to at least 20** (currently 15/40) — this is the gate that unblocks everything in Research/Scoring.
2. **Continue the safe facade migration** — low-risk consumers only, golden-tested.
3. **Keep scoring behavior identical** — no cap / `agree3` / Broken-Zone change without the baseline comparison.

## Facade migration tracker (Core Scoring)
| Consumer | Status | Note |
|---|---|---|
| `research/render_visual_review.py` | ✅ migrated | golden + render-path identical |
| `research/rc1_review_agent/build_founder_review.py` | ✅ migrated | 40/40 agent windows identical |
| `research/full_real_review.py` | ⏳ next | baseline harness — **chains `prior`**, higher care |
| `research/rc1_ultimate_offline_indicator/optimizer.py` | ⏳ later | hot sweep loop + `ablation` arg |

**Golden equivalence:** smoke 93/93 · full baseline **1,767/1,767 identical**.

---

## One-line status
> Conviction **RED**. Today: push founder labels toward 20 and/or migrate the next low-risk caller — **without changing any scoring behavior**. Pine and Payments are untouchable.
