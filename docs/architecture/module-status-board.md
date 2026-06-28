# RangeClarity Module Status Board

> **Visual status of every module.** Documentation only. _As of 2026-06-27 (Recovery Sprint)._
> Legend: 🟢 GREEN healthy/safe · 🟡 YELLOW active / work-carefully · 🔴 RED frozen / do-not-touch.
> Daily view: [command-center](../ops/rangeclarity-command-center.md) · full per-module detail: [module-registry](./module-registry.md).

| Module | Status | Risk | State | Next approved action | Blocked |
|---|---|---|---|---|---|
| **Core Scoring** | 🟡 YELLOW | HIGH | facade direction started; scoring behavior must remain **frozen** | behavior-preserving facade/migration **with golden tests only** | scoring / caps / `agree3` changes |
| **Founder Review** | 🟡 YELLOW | MED | **15/40** labels complete | continue to **20+** labels | A/B before labels + baseline comparison |
| **Research Experiments** | 🟡 YELLOW | MED | frozen **1,767-window** baseline exists | run review agent **only after** enough labels | A/B implementation |
| **Web / Mobile** | 🟡 YELLOW | LOW–MED | CTA runtime fix pushed (`fd6e760`); mobile still needs QA | verify Vercel preview + mobile CTA flow | broad redesign |
| **Ops / Feedback** | 🟡 YELLOW | LOW | health/verify/test scripts being formed | commit the package-scripts group (files exist, safe) | none |
| **Pine** | 🔴 RED | HIGH | do not touch | none | all Pine changes |
| **Payments** | 🔴 RED | MED | do not touch unless explicitly requested | none | all payment / Lemon |
| **Marketing / X** | 🟢 GREEN | LOW | safe to generate content; no product risk | daily content batch | none |

## How to read
- **Status** = "can I safely work here today?" 🔴 means hands off.
- **Next approved action** = the only approved move now; anything else needs a PRD + founder approval.
- Update this board whenever a status / next action / blocker changes. Data Adapters and Product/Docs detail live in the full [module-registry](./module-registry.md).
