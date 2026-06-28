# RangeClarity Workspace Reconciliation - 2026-06-25

## Verdict

Canonical active repo for today: `C:\Users\USER\Claude\Projects\RangeClarity`.

Planning-only drift folder: `C:\Users\USER\OneDrive\Documents\RangeClarity`.

Current P0 is Workspace Alignment & Path Reconciliation. Founder labeling, website QA/commits, Broken Zone A/B, Pine, scoring/cap changes, `agree3` loosening, Linear writes, Hermes sends, and payment/Lemon work stay blocked until this reconciliation is accepted.

Daily operating question: does this move RangeClarity closer to 10 qualified beta users without increasing false confidence?

Track order for recovery:

1. Confirm canonical repo and branch.
2. Verify visual review artifacts.
3. Verify founder labeling files.
4. Founder labels `clean_but_capped` only after paths are verified.
5. Only after labels, decide Broken Zone A/B.
6. Website QA remains paused until repo/branch drift is resolved.
7. Revenue track stays visible daily: content, waitlist, and first 10 beta users.

## Branch State

- Active Projects branch: `landing-mobile-cta-polish`.
- Projects remotes include `origin/main`, `origin/landing-mobile-cta-polish`, and `origin/ops-command-center-v1`.
- Projects latest commits include:
  - `e093ab5` Final RangeClarity web QA polish
  - `5b01959` Polish RangeClarity mobile hero and web style guide
  - `acc89a7` Unify RangeClarity web brand system
- `HEAD..origin/main --stat` shows `32 files changed, 44 insertions(+), 2191 deletions(-)`, so branch drift is material.
- Branch to use today: stay on `landing-mobile-cta-polish` for read-only reconciliation and planning updates only. Do not switch, merge, rebase, commit, push, or run website QA until branch drift is reviewed.

## Workspace Contents

### Projects Only

These files exist in the canonical Projects repo and should be treated as the active research/artifact paths:

- `research/reports/visual_review/founder_review_charts.html`
- `research/reports/visual_review/founder_review_priority.csv`
- `research/reports/visual_review/founder_labels_template.csv`
- `research/reports/visual_review/agent_label_suggestions.csv`
- `research/rc1_review_agent/rc_structural_review_agent.py`
- `docs/research/validation/labels-50.csv`
- `docs/research/rc1-real-data-visual-review-v1.md`
- `docs/research/rc1-ab-test-broken-zone-v0.md`
- `docs/research/rc1-founder-labeling-guide.md`
- `docs/web/rangeclarity-web-style-guide.md`

Do not point founder workflow to OneDrive for these artifacts.

### OneDrive Only

These planning files exist in OneDrive and not in the active Projects repo:

- `docs/ops/hermes-rc1-handoff.md`
- `docs/ops/rangeclarity-tomorrow-execution-plan-2026-06-26.md`
- `docs/research/rc1-tomorrow-plan.md`

Recommendation: review and merge useful planning content into Projects after this reconciliation. Do not overwrite Projects blindly.

### Exists In Both But Differs

- `docs/current-sprint.md`
- `docs/kanban.md`

Diff size observed:

- `docs/current-sprint.md`: OneDrive version has about 172 insertions and 12 deletions versus Projects.
- `docs/kanban.md`: OneDrive version has about 274 insertions and 129 deletions versus Projects.

Recommendation: use Projects as canonical, then manually merge only the recovery-safe planning pieces. Do not copy either file wholesale across workspaces without review.

### Missing From Both

No requested reconciliation artifact was missing from both checked workspaces.

## Current Dirty State Risk

Projects has a very dirty worktree, including modified or untracked files across Pine, beta, website, payment, docs, public assets, scripts, research, and local tool folders. This is why workspace alignment must precede founder labeling or website QA.

High-risk categories observed in Projects status:

- Pine: `RangeClarity_Core.pine`, `pine/rangeclarity_ultimate_core.pine`, and additional Pine files are modified or untracked.
- Payment/beta: `lib/payments/plans.ts`, `app/beta/*`, and beta admin/access pages are modified.
- Website/design: multiple `app/designs/*`, public brand assets, layout, command center, and guide pages are modified.
- Research: `research/*`, `docs/research/*`, review agent, and visual-review reports are present in Projects.
- Docs/ops: many planning docs are untracked or modified.

## Safe To Copy Or Merge

Safe to review for merge into Projects after this report:

- OneDrive-only planning docs listed above.
- Track C funnel questions and daily routine language, if not already represented in Projects.
- Hermes handoff language that explicitly says local markdown is source of truth until drift is fixed.

Safe to reference directly in founder workflow after reconciliation:

- `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\founder_review_charts.html`
- `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\founder_review_priority.csv`
- `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\agent_label_suggestions.csv`
- `C:\Users\USER\Claude\Projects\RangeClarity\research\rc1_review_agent\rc_structural_review_agent.py`

## Must Not Do

- Do not recreate missing docs from memory.
- Do not copy OneDrive files into Projects without diff review.
- Do not overwrite Projects research artifacts with OneDrive paths.
- Do not run Broken Zone A/B.
- Do not change Pine.
- Do not change scoring, caps, or `agree3`.
- Do not touch payment/Lemon.
- Do not run website QA or commit web polish until branch/workspace drift is resolved.
- Do not write to Linear or force Hermes sends.
- Do not push.

## Updated Plan

P0: Workspace Alignment & Path Reconciliation.

P1: Visual Review Tool Verification.

P2: Founder labels `clean_but_capped` only after workspace paths are verified.

Blocked:

- Founder labeling until workspace reconciliation is accepted.
- Broken Zone A/B until founder labels exist and the safety gate passes.
- Pine.
- Scoring/cap changes.
- `agree3` loosening.
- Website QA/commits until branch/workspace drift is resolved.
- Linear/Hermes external sync until local source of truth is stable.

## Founder Next Action

Before reconciliation is accepted: founder should not label anything.

After reconciliation is accepted: founder opens `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\founder_review_charts.html` and labels `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\founder_review_priority.csv`.

---

## Verification pass (Claude Cowork sandbox, 2026-06-25)

Independent re-inspection of the **Projects** repo only. NOTE: the OneDrive folder
(`C:\Users\USER\OneDrive\Documents\RangeClarity`) is **not mounted in this sandbox**, so the
OneDrive-only / differs / diff-size findings above are carried from the earlier local pass and were
NOT re-run here. Refresh them with the local commands at the end of this section.

Confirmed in Projects (`C:\Users\USER\Claude\Projects\RangeClarity`):
- Canonical git repo: `origin = https://github.com/RangeClarity/RangeClarity.git`; 257 tracked files.
- Active branch `landing-mobile-cta-polish` at `e093ab5`; parents `5b01959`, `acc89a7`, `0cf36de` --
  every agent-referenced commit exists in this checkout (no missing-commit drift in Projects).
- Dirty worktree: 214 entries. By category: web 47; docs 78; root specs/unknown 48; config/scripts 27;
  payment/lemon 8 (DO NOT TOUCH); pine 4 (DO NOT TOUCH); whole `research/` tree untracked; `.opscheck/` cache.
- All active research/review artifacts present (visual_review reports, `rc_structural_review_agent.py`,
  `labels-50.csv`, rc1 research docs, web style guide, the `.dc.html` mobile reference).

Updates to the table above (verified this pass):
- `docs/ops/hermes-rc1-handoff.md` now EXISTS in Projects (previously listed OneDrive-only) -- reconciled in.
- Still missing from Projects (OneDrive-only): `docs/ops/rangeclarity-tomorrow-execution-plan-2026-06-26.md`
  and `docs/research/rc1-tomorrow-plan.md`. Do NOT recreate from memory; copy from OneDrive only after diff review.

Git lock: `.git/index.lock` is present (0 bytes) with NO git process running, but it is host-owned and
cannot be removed from this sandbox ("Operation not permitted"). Git reads work; writes are blocked here.
Clear it locally before any commit: `Remove-Item .git\index.lock -Force`.

### Founder: refresh the OneDrive vs Projects diff (Windows PowerShell, local, read-only)

    $P="C:\Users\USER\Claude\Projects\RangeClarity"; $O="C:\Users\USER\OneDrive\Documents\RangeClarity"
    $pf = Get-ChildItem $P -Recurse -File -EA SilentlyContinue | % { $_.FullName.Substring($P.Length) }
    $of = Get-ChildItem $O -Recurse -File -EA SilentlyContinue | % { $_.FullName.Substring($O.Length) }
    "=== only in Projects ==="; (Compare-Object $pf $of | ? SideIndicator -eq '<=').InputObject
    "=== only in OneDrive ==="; (Compare-Object $pf $of | ? SideIndicator -eq '=>').InputObject
    git diff --no-index --stat -- "$O\docs\current-sprint.md" "$P\docs\current-sprint.md"

No copy is performed automatically. Review diffs, then copy only OneDrive-only PLANNING docs into Projects.
