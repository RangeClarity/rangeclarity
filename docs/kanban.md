# RangeClarity — Kanban Board (source of truth)

The **working source of truth** for tickets/status (hierarchy in `CLAUDE.md`). Linear is a downstream mirror only, and only after approval (`docs/decisions.md` O-005). Decisions are logged in `docs/decisions.md`; readiness in `docs/launch-readiness.md`.

## Recovery Override - 2026-06-25

AntiGravity found a split-brain workspace state between:

- Canonical active repo: `C:\Users\USER\Claude\Projects\RangeClarity`
- Planning-only drift folder: `C:\Users\USER\OneDrive\Documents\RangeClarity`

Current P0 is no longer founder labeling. Current P0 is **Workspace Alignment & Path Reconciliation**.

Recovery report: `docs/ops/rangeclarity-workspace-reconciliation-2026-06-25.md`.

### Daily Operating Priority

Every task must move RangeClarity closer to 10 qualified beta users and first paid subscribers without increasing false confidence.

Hermes daily message:

> Today's question: does this move RangeClarity closer to 10 qualified beta users without increasing false confidence?

Track order:

1. Confirm canonical repo and branch.
2. Verify visual review artifacts.
3. Verify founder labeling files.
4. Founder labels `clean_but_capped` only after paths are verified.
5. Only after labels, decide Broken Zone A/B.
6. Website QA remains paused until repo/branch drift is resolved.
7. Revenue track stays visible daily: content, waitlist, and first 10 beta users.

### Updated Priority Stack

- P0: Workspace Alignment & Path Reconciliation.
- P1: Visual Review Tool Verification.
- P2: Founder labels `clean_but_capped` only after workspace paths are verified.

### Active Research Paths

- `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\founder_review_charts.html`
- `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\founder_review_priority.csv`
- `C:\Users\USER\Claude\Projects\RangeClarity\research\reports\visual_review\agent_label_suggestions.csv`
- `C:\Users\USER\Claude\Projects\RangeClarity\research\rc1_review_agent\rc_structural_review_agent.py`

### Paused / Blocked Until Reconciliation Is Accepted

- Founder labeling.
- Broken Zone A/B.
- Pine.
- Scoring/cap changes.
- `agree3` loosening.
- Website QA/commits.
- Linear/Hermes external sync.
- Payment/Lemon changes.
- Pushes.

Local markdown in the canonical Projects repo is the source of truth until workspace drift is fixed.

---

**Direction:** direct **Paid Beta** (first 5 paying customers), not waitlist-first (`docs/decisions.md` D-003). The product sold is the TradingView indicator; the web app is marketing.

### Format
`## <ID> — <Title>` then `- key: value` lines (status, priority, owner, estimate, labels), a blank line, then body with **Acceptance** / **Definition of done**. Priority P0→Urgent, P1→High, P2→Medium, P3→Low.

### Columns
`Backlog` · `Todo` · `In Progress` · `In Review` · `Done`

---

## OPS-RECOVERY-2026-06-25 — Workspace Alignment & Path Reconciliation
- status: In Progress
- priority: P0
- owner: Codex/Founder
- estimate: same-day planning/recovery
- labels: ops, recovery, source-of-truth, blocker

AntiGravity identified that the active code/research workspace and the planning/docs workspace diverged. The active repo is `C:\Users\USER\Claude\Projects\RangeClarity`; OneDrive contains planning-only drift. Founder labeling and website QA are paused until the source of truth is stable.

**Acceptance:** reconciliation report exists at `docs/ops/rangeclarity-workspace-reconciliation-2026-06-25.md`; active branch is recorded; Projects-only, OneDrive-only, differing, and missing files are listed; active artifact paths are corrected to Projects; safe-copy recommendations are written; no docs are recreated from memory.
**Definition of done:** founder accepts the canonical path and branch for the day. Only then does P1 Visual Review Tool Verification start. Daily operating question is visible in Hermes/local planning: "does this move RangeClarity closer to 10 qualified beta users without increasing false confidence?"
- blocks: RC-11, RC-12, RC-6

## RC-11 — Validate & redesign Broken-Zone semantics before Pine (RC-1 engine)
- status: In Progress
- priority: P0
- owner: Founder (review) + Claude (research)
- estimate: 1–2d research + founder review
- labels: research, scoring, validation, beta-blocker

**New top priority (founder direction, 2026-06-25). Replaces the generic "investigate over-rejection."** Real Baseline v1 (`docs/research/rc1-real-data-visual-review-v1.md`, frozen) shows strong OVER-REJECTION on real data: 19/20 symbols, **1,767 windows, 0 Clear / 0 HighClarity**. Primary suspect is **broken-zone semantics**, not just `agree3`: `broken` binds **74.1%** of windows (`agree3` 97.5%, severe 55.5%, chop 52.7%); all **42 `clean_but_capped`** windows read `zone = Broken` on a `Clean` trend. Root cause is in `research/rc1_ultimate_offline_indicator/zone_engine.py` (`zones_asof`): `Broken` is tested against **every historical support cluster** with a tiny `0.25·ATR`, order-independent, no-reclaim / no-time-confirm rule → normal pullbacks through stale levels get marked Broken → cap 50.

**Acceptance:** (1) founder reviews `clean_but_capped` in `research/reports/visual_review/index.html` and labels 20–40 cases via `founder_labels_template.csv` (`true_broken` / `stale_zone_false_cap` / `normal_pullback_false_cap` / `genuinely_unclear` / `unsure`); (2) labels confirm or refute the hypothesis; (3) if confirmed, the smallest reversible A/B toggle (spec: `docs/research/rc1-ab-test-broken-zone-v0.md`) is approved and its constants frozen; (4) the A/B run meets all success criteria vs the frozen baseline (Clear reachable on clean charts; HighClarity stays rare; no messy leakage into Clear; `suspicious_high` ~0; `clean_but_capped` down; `caps_saved` still meaningful).
**Definition of done:** founder go/no-go recorded in `docs/decisions.md` (O-008); if go, an A/B results doc shows the criteria met. **No scoring / `agree3` / cap / Pine change until then. Conviction RED. BLOCK Pine.**
- blocks: RC-6

## RC-6 — Validate Core indicator for Paid Beta
- status: Todo
- priority: P0
- owner: Founder+Codex
- estimate: 1d
- labels: product, validation, beta

Execute the Pine test plan against the **canonical** indicator and record results. The deliverable customers pay for must be proven before charging.

**Acceptance:** confirm which file is canonical (`RangeClarity_Core.pine` vs `pine/rangeclarity_ultimate_core.pine`); compiles in TradingView with no errors/warnings; the `RANGECLARITY_PINE_TEST_PLAN.md` coverage matrix is filled for ≥6 of 9 categories on 1D + 4H/1H; repaint check passes via Bar Replay (confirmed outputs never contradict; alerts only on closed bars); founder records an explicit "worth $X to 5 people" verdict or a concrete fix list.
**Definition of done:** completed matrix committed (or a results doc) + founder go/no-go recorded in `docs/decisions.md`.
- blocked-by: RC-11 (the RC-1 scoring engine must be trustworthy on real data before Pine is validated/created)

## RC-7 — Stand up Paid Beta offer + access path
- status: Todo
- priority: P0
- owner: Founder
- estimate: 0.5d
- labels: monetization, access, beta

Make it possible to take money and grant access for 5 buyers without app code: Whop product + checkout link; TradingView invite-only publish; Discord access role; written manual-fulfillment runbook (Claude drafts the runbook).

**Acceptance:** a Whop checkout URL exists for the decided offer/price (O-002); indicator published invite-only on TradingView; Discord invite/role ready; a one-page fulfillment runbook in `docs/` describes the buy→invite→Discord steps.
**Definition of done:** a test purchase (or sandbox) grants TradingView + Discord access end-to-end.
- blocked-by: RC-6, O-002

## RC-8 — Point landing CTA at the real offer
- status: Todo
- priority: P1
- owner: Claude
- estimate: 0.5d
- labels: frontend, funnel

Replace the non-functional "Join Early Access" form (`action="#"` in `app/designs/premium-hero-range-command-v2/RangeCommandV2LowerSections.tsx`) with a CTA that links to the Whop checkout. No payment code in the app.

**Acceptance:** primary CTA links to the Whop URL; copy reflects Paid Beta (not "waitlist"); no dead `action="#"` form remains on the live homepage; `npm run build` passes.
**Definition of done:** clicking the CTA on a preview deploy reaches Whop checkout.
- blocked-by: RC-7, O-004

## RC-9 — Update legal for paid (refund + billing terms)
- status: Backlog
- priority: P1
- owner: Claude+Founder
- estimate: 0.25d
- labels: legal, beta

Reword Terms/Privacy from "waitlist" to a paid Beta: add a simple refund policy and billing/cancellation note; keep educational + no-advice disclaimers.

**Acceptance:** Terms states refund window + cancellation path; "waitlist does not guarantee access" line updated; disclaimers intact.
**Definition of done:** founder approves wording; pages build.

## RC-3 — Deploy landing to Vercel (preview → prod)
- status: Backlog
- priority: P1
- owner: Founder
- estimate: 1h
- labels: launch, deploy

Build and deploy per `docs/deploy-rangeclarity.md`; review preview before promoting. No prod promote without approval.

**Acceptance:** preview + prod URLs load, no console errors.
**Definition of done:** production deployment succeeds (founder promotes).

## RC-4 — Connect rangeclarity.com + SSL
- status: Backlog
- priority: P2
- owner: Founder
- estimate: 45m
- labels: launch, dns

Add domain in Vercel; set DNS; remove parking records.

**Acceptance:** both URLs HTTPS; `www`→apex.
**Definition of done:** Vercel "valid configuration" + valid certificate.
- blocked-by: RC-3

## RC-1 — Homepage decision (previous-pro vs current Codex hero)
- status: Backlog
- priority: P2
- owner: Founder
- estimate: 45m
- labels: design, decision

Decide whether to keep the live "Codex Premium Hero" or promote `/designs/previous-pro`. Decision-gated; no churn until decided (`docs/decisions.md` O-003).

**Acceptance:** one homepage chosen; other designs noindexed; no route deleted.
**Definition of done:** builds clean; `/` renders the chosen design.

## RC-2 — Launch-blocker polish (mobile + Paid Beta copy)
- status: Backlog
- priority: P2
- owner: Claude+Founder
- estimate: 1.5h
- labels: launch, qa

Mobile QA; align pricing/positioning/CTA copy with the Paid Beta offer.

**Acceptance:** no mobile overflow ~375px; copy approved; CTA works.
**Definition of done:** launch-blocker checklist green.
- blocked-by: RC-8

## RC-10 — Minimal conversion analytics
- status: Backlog
- priority: P3
- owner: Claude
- estimate: 0.5d
- labels: analytics

Track CTA→Whop clicks and conversions with the lightest possible tool. Only after the offer is live.

**Acceptance:** CTA click + purchase events visible.
**Definition of done:** one dashboard shows funnel counts.

## RC-5 — Durable email capture (DEFERRED)
- status: Deferred
- priority: P3
- owner: Founder+Claude
- estimate: 2h
- labels: funnel, deferred

Superseded as a launch mechanic by the Paid Beta direction (`docs/decisions.md` D-003). Keep only as optional interest-capture if it does not delay the Beta. The current file-based store is not durable on Vercel.

**Acceptance:** (if revived) a test signup persists in a hosted store.
**Definition of done:** end-to-end signup verified.

## RC-12 — Unify RangeClarity web brand system
- status: Todo
- priority: P1
- owner: Claude+Founder
- estimate: 0.5–1d
- labels: frontend, cleanup, brand
- scheduled: tomorrow (2026-06-26)

**Tomorrow's task (founder direction, 2026-06-25).** The public site is visually inconsistent across screens — different logo treatments, inconsistent Fox/avatar usage, mismatched CTA labels ("Get Beta Access" / "7-Day Free Access" / "Request beta access" / "Join the Beta"), differing nav labels, hero copy that varies too much — so some pages read as different products. Unify into ONE production-ready visual system before pushing to git. Mirrored in Linear (DEA). **UI only — no Pine, no research/scoring, no payment/Lemon changes unless a build error requires it; no new features; no redesign from scratch; preserve the approved Fox / RangeClarity dark-premium direction; reuse existing assets.**

Plan: (1) audit all public web screens/routes; (2) identify inconsistencies — logos, nav labels, CTA/button text, hero copy, colors, typography, spacing, mobile layout, debug/mock remnants; (3) pick one source of truth for logo/avatar, primary CTA, secondary CTA, nav labels, hero headline/copy, visual style; (4) apply across public pages; (5) hide / production-gate experimental design routes; (6) remove visible debug/cosmetic scaffolding; (7) verify `npm run lint` + `npm run typecheck` + `npm run build` (+ `npm run health` if present); (8) browser QA — desktop home, mobile home, key CTA flow, gated routes; (9) one focused commit if clean.

Suggested source of truth: headline **"No signals. No noise. Just structure."**; primary CTA **"Get Beta Access"**; secondary CTA **"7-Day Free Access"**; nav **"Premium Indicators"** + **"Investor Research Lab"**. Commit message: **`Unify RangeClarity web brand system`**.

**Acceptance:** public pages share one logo/avatar treatment, CTA labels, nav labels, hero copy, and visual style; experimental design routes gated/hidden; no visible debug scaffolding; lint + typecheck + build pass; desktop + mobile + CTA flow QA'd.
**Definition of done:** one focused commit `Unify RangeClarity web brand system` (founder approves push). No Pine / research / scoring / payment changes.
