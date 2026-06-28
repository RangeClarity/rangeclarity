# RangeClarity Command Center

> **The main daily view.** Documentation / dashboard only. _As of 2026-06-27 (Recovery Sprint)._
> Companions: [module-status-board](../architecture/module-status-board.md) · [daily-workflow](./daily-workflow.md)
> · [decision-log](./decision-log.md) · [system-map](../architecture/system-map.md) · [neural map](../architecture/rangeclarity-neural-map.json).

---

## 🔴 Conviction: RED
> RED → YELLOW → GREEN. GREEN = validated vs the frozen baseline + founder labels.

**Why RED**
- Founder labeling is only **15/40**.
- **Broken-Zone A/B is not validated** (blocked until ≥20 labels + a frozen-baseline comparison).
- **Pine is blocked.**
- **Scoring changes are blocked.**
- **The worktree is dirty** (~638 entries) and needs **controlled, small commit groups** before finished work is visible.

**Latest pushed commit:** `fd6e760 Fix Vercel preview missing CTA runtime files` — tip of `landing-mobile-cta-polish`. The Vercel preview should now be green — **verify in the browser**.

---

## 🟢 Active lanes (safe to work)
1. **Web / mobile beta readiness** — verify Vercel green; mobile CTA / free-access QA.
2. **Founder review labels** — 15 → 20+.
3. **Feedback loops / health scripts** — land the `health`/`verify`/`test` commit group.
4. **Deep Modules / architecture** — behavior-preserving facade migration (golden-tested).
5. **X content / brand distribution** — daily content batch.

## ⛔ Blocked lanes (do not work)
1. **Pine** (until GREEN).
2. **Broken-Zone A/B implementation** (until ≥20 labels + baseline compare).
3. **Broad scoring refactor.**
4. **Payment / Lemon changes** (unless explicitly auditing).
5. **Large cleanup commits** (small reviewable groups only).

---

## 🎯 Current priority (in order)
1. **Confirm the Vercel preview for `fd6e760` is green.**
2. **Land finished work in small commit groups** — next: the feedback-loop scripts.
3. **Continue founder labels to ≥20**, then re-run the review agent.
4. **Keep scoring behavior frozen** — no cap / `agree3` / Broken-Zone change.

## Facade migration tracker (Core Scoring)
| Consumer | Status |
|---|---|
| `research/render_visual_review.py` | ✅ migrated (golden-identical) |
| `research/rc1_review_agent/build_founder_review.py` | ✅ migrated (40/40 identical) |
| `research/full_real_review.py` | ⏳ next (chains prior) |
| `research/rc1_ultimate_offline_indicator/optimizer.py` | ⏳ later |

Golden equivalence: smoke 93/93 · full baseline **1,767/1,767 identical**.

## Next safe commit group
**"Add project health and test scripts"** — `package.json` + `scripts/test/run-tests.mjs` + `tests/playwright.config.ts` + `docs/ops/feedback-loops.md`. No new deps (package-lock unchanged); `vitest`/`playwright` are opt-in (not wired into `health`/`verify`).

---

## One-line status
> Conviction **RED**. The Vercel blocker is fixed and pushed (`fd6e760`); this week's real job is **landing finished work in small groups** and pushing **founder labels to 20+** — without touching scoring, Pine, or payments.
