# Current Sprint — "Workspace Recovery"

## Recovery Override - 2026-06-25

AntiGravity found a split-brain workspace state. The current sprint is paused until the active repo and planning docs are reconciled.

Canonical active repo: `C:\Users\USER\Claude\Projects\RangeClarity`.

Planning-only drift folder: `C:\Users\USER\OneDrive\Documents\RangeClarity`.

Recovery report: `docs/ops/rangeclarity-workspace-reconciliation-2026-06-25.md`.

## Daily Operating Priority

Every task must move RangeClarity closer to 10 qualified beta users and first paid subscribers without increasing false confidence.

Today's question: does this move RangeClarity closer to 10 qualified beta users without increasing false confidence?

### Track Order

1. Confirm canonical repo and branch.
2. Verify visual review artifacts.
3. Verify founder labeling files.
4. Founder labels `clean_but_capped` only after paths are verified.
5. Only after labels, decide Broken Zone A/B.
6. Website QA remains paused until repo/branch drift is resolved.
7. Revenue track stays visible daily: content, waitlist, and first 10 beta users.

### Updated P0/P1/P2

- P0: Workspace Alignment & Path Reconciliation.
- P1: Visual Review Tool Verification.
- P2: Founder labels `clean_but_capped` only after workspace paths are verified.

### Today's order

1. Confirm canonical repo and branch (`C:\Users\USER\Claude\Projects\RangeClarity`, branch `landing-mobile-cta-polish`).
2. Verify visual review artifacts open and resolve (charts HTML + priority CSV + agent CSV + review agent).
3. Verify founder labeling files (`founder_review_priority.csv` / `founder_labels_template.csv`).
4. Only then: founder labels `clean_but_capped`.
5. Only after labels exist: decide the Broken-Zone A/B (still spec-only — do not implement).
6. Web QA stays separate and paused until repo/branch/workspace drift is clean.

### Active Artifact Paths

- `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\founder_review_charts.html`
- `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\founder_review_priority.csv`
- `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\agent_label_suggestions.csv`
- `C:\Users\USER\Claude\Projects\RangeClarity\research\rc1_review_agent\rc_structural_review_agent.py`

Do not point founder workflow to OneDrive unless OneDrive is explicitly promoted and shown to contain the active research artifacts.

### Paused / Blocked

- Founder labeling until workspace reconciliation is accepted.
- Broken Zone A/B until founder labels exist and the safety gate passes.
- Pine.
- Scoring/cap changes.
- `agree3` loosening.
- Website QA/commits until branch/workspace drift is resolved.
- Linear/Hermes external sync until local source of truth is stable.
- Payment/Lemon changes.
- Pushes.

Revenue track remains visible but planning-only until workspace drift is resolved: content shipped, waitlist/qualified lead progress, direct outreach, and blockers to first paid subscribers must be recorded daily.

Founder next action before reconciliation is accepted: do not label anything.

Founder next action after reconciliation is accepted: open `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\founder_review_charts.html` and label `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\founder_review_priority.csv`.

---

A focused view onto `docs/kanban.md` (the board owns full detail). Goal: prove value, then make it purchasable. **Max 5 active.**

_Sprint goal: a validated indicator that 5 people can buy and access._

| Ticket | Outcome | Owner | Status | Why it moves us toward first revenue |
|--------|---------|-------|--------|--------------------------------------|
| **RC-11** | Broken-zone semantics validated/redesigned before Pine (RC-1 engine) | Founder + Claude | In Progress | First real-data signal: the engine over-rejects (0 Clear / 0 High); it must be trustworthy before Pine |
| **RC-6** | Indicator validated as worth charging for | Founder + Codex | Todo (blocked by RC-11) | Answers the central question; gates everything else |
| **RC-7** | Whop checkout + TradingView invite + Discord access live | Founder | Todo (blocked by RC-6) | The actual way to take money + deliver |
| **RC-8** | Landing CTA points at the real offer (replace dead `action="#"` form) | Claude | Todo (blocked by O-002) | Turns the landing page into a funnel |
| **RC-3** | Landing deployed to Vercel (preview→prod) | Founder | Todo | Hosts the offer publicly |

Not in this sprint (see board): RC-1 (homepage choice), RC-2 (polish), RC-4 (domain), RC-9 (legal reword), RC-10 (analytics), RC-5 (deferred email capture).

**Single highest priority:** Workspace Alignment & Path Reconciliation. RC-6 remains blocked until workspace drift is resolved and RC-11/founder review gates pass.
