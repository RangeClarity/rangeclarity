# RangeClarity — Active Roadmap & Work Plan

**This is the active execution plan.** It is the single "what do we do now" source. It synthesizes and supersedes the scattered plans for day-to-day execution: `docs/kanban.md`, `docs/current-sprint.md`, `docs/launch-readiness.md`, `docs/customer-flow.md`, `docs/beta-launch-checklist.md`, `docs/beta-business-decisions.md`, `docs/roadmap/*`, and `docs/project-plan/rangeclarity-live-plan.md`. Those stay as reference; this file drives the week. Machine-readable mirror: `data/roadmap.json`.

**Updated:** 2026-06-20 · **Branch:** `main` · **Owner of record:** Dean (founder)

---

## Project status

The product is largely **built**. The remaining work to reach first revenue is mostly **decisions and manual execution**, not engineering.

- **Landing + funnel:** done. Public nav cleaned and committed (`052a3e4`). Pricing CTAs route to `/beta?plan=free_preview | beta_29 | pro_beta_49`.
- **Registration → checkout → access loop:** built and verified. `/beta` collects name, email, TradingView username, plan; saves to `lib/betaStore.ts` (`.data/beta-signups.jsonl`) as `unpaid` / access `pending` **before** checkout. Manual Lemon Squeezy hosted link (`MANUAL_PAYMENT_LINK_29/_49`) shows a "Complete payment" button. `/beta/admin` (gated by `ADMIN_TOKEN`) marks paid and grants TradingView access (requires a TV username); refund/revoke work.
- **Post-purchase pages:** `onboarding`, `tradingview-access`, `how-to-use`, `faq`, `disclaimer`, and a `feedback` form + API + store all exist.
- **Distribution:** X content agent (`scripts/generate_x_drafts.py`) is **draft-only** and active; a curated batch (`content/x/daily-drafts.md`) and 7+ days of generated drafts are ready.
- **Product asset:** the TradingView Pine indicator (`RangeClarity_Core.pine`) is built.
- **Payment posture:** `PAYMENT_PROVIDER=manual`, **no live payment keys**. Nothing charges automatically.

## Current phase

**Phase 1 — Activate the Paid/Private Beta loop.** Move from "built product" to "first 5–10 real beta users, onboarded, giving feedback." Do not build new product surface this phase.

## This week's objective

> **Get the first 5–10 beta users into RangeClarity and collect feedback within 72 hours of access.** Everything below serves that one outcome.

---

## Current State (done / partial / missing / risky)

**Done**
- Landing page, cleaned nav, pricing→/beta routing.
- Registration-before-checkout with TradingView username capture, saved to a file-based tracker.
- Manual Lemon checkout button + `/beta/admin` mark-paid / grant / refund / revoke.
- Onboarding, TradingView-access, how-to-use, FAQ, disclaimer, and feedback pages.
- X draft agent + a week of on-brand, compliance-clean drafts.
- Pine indicator built; Terms/Privacy present.

**Partial**
- **Offer/price is unreconciled:** the written decision (`beta-business-decisions.md`, `customer-flow.md`) is **$79 / 90 days**; the implemented `/beta` page sells **$29 / $49 per month** + a free preview. These disagree.
- Legal copy has educational + no-advice disclaimers, but **refund/cancellation** wording for a paid beta is not finalized.
- `app/beta/welcome/page.tsx` is a 6-line stub.
- Beta tracker is file-based (`.data/*`) — fine locally / on a persistent host, **ephemeral on serverless**.

**Missing / not started**
- TradingView indicator **published invite-only** and access tested end-to-end.
- **Private Beta Room** (Discord/Telegram) chosen and stood up.
- A single **manual fulfilment runbook** (buy → verify amount → mark paid → grant TV access → email).
- The actual **first 5–10 invites** and the **feedback** loop (founder execution).

**Risky / blocking**
- **Price/offer decision** is the top blocker — it gates invites, the Lemon configuration, and legal copy.
- Charging for an **unvalidated indicator** if users are cold. Mitigation: invite warm users + a quick confidence pass.
- Serverless deploy would drop file-based signups. Mitigation: stay local/persistent host for the manual beta.
- **Environment (this machine):** the sandbox mount is corrupting repo-wide reads and a stale `.git/index.lock` keeps reappearing, so `next build` / `eslint .` / `tsc` can't be trusted here. Run them on your machine.

---

## Immediate next step (do this right now)

**Run the full flow yourself, end to end, in Lemon TEST mode — and lock the price in the same sitting.**

1. Open `/beta?plan=beta_29` → register with a throwaway email + a real TradingView username.
2. Click **Complete payment** → confirm it opens the **Lemon TEST** checkout (not live).
3. In `/beta/admin` (use your `ADMIN_TOKEN`): mark the signup paid, then grant access.
4. Walk `/beta/onboarding` and `/beta/tradingview-access` as a new user would.
5. Write down every friction point. **Decide $79/90d vs $29** before you invite anyone.

This produces a real punch-list and the price decision, which together unblock inviting the first users this week. Do not start new features.

---

## Top 10 prioritized tasks

| # | Task | Priority | Status | Owner | Due window | Why it matters | Acceptance criteria |
|---|------|----------|--------|-------|-----------|----------------|---------------------|
| 1 | **RUN-1** Founder end-to-end dry run (Lemon TEST) | Must do now | Todo | Dean | Today | Proves the loop works for a real human; surfaces friction | Full path register→pay(test)→mark paid→grant→onboard completed; friction list written |
| 2 | **O-002** Lock beta offer + price; reconcile docs vs page | Must do now | Todo (decision) | Dean | Today | Biggest blocker; gates invites, Lemon config, legal copy | One offer chosen ($79/90d **or** $29); `/beta` plan labels + Lemon variant match it |
| 3 | **PAY-1** Confirm Lemon TEST mode + amount mapping | Must do now | Todo | Dean | Today | Prevents accidental live charges / wrong amounts | Checkout is test mode; link maps to the decided price; rule: verify amount in Lemon before "paid" |
| 4 | **ACCESS-1** Publish indicator invite-only; test grant/revoke | Should do this week | Todo | Dean | Day 2 | No access path = no product delivery | Script is invite-only on TradingView; you grant + revoke your own test account successfully |
| 5 | **RUN-2** Write manual fulfilment runbook | Should do this week | Todo | Claude+Dean | Day 2 | Repeatable, low-error fulfilment for 5–10 buyers | One doc: buy → verify amount → mark paid in /beta/admin → add TV username to invite-only → send access email |
| 6 | **RC-6-lite** Quick indicator confidence pass (~8 charts) | Should do this week | Todo | Dean | Day 3–4 | Honest basis to charge; catches repaint/false-structure | ~8 charts (1D + 4H) read sanely; no repaint surprise on bar-replay; go/no-go noted |
| 7 | **ROOM-1** Pick + stand up Private Beta Room | Should do this week | Todo | Dean | Day 3 | Support + feedback channel; part of the offer | Discord/Telegram group created; invite link added to `/beta/onboarding` |
| 8 | **ONB-1** Verify onboarding pages + light paid legal reword | Should do this week | Todo | Claude+Dean | Day 3 | New users must self-onboard; paid needs refund/cancellation terms | Onboarding/TV-access read clean; welcome stub filled; refund + cancellation lines added to Terms |
| 9 | **INVITE-1** Invite first 5–10 warm beta users | Should do this week | Todo | Dean | Day 5–6 | The actual goal: real users + real money + learning | 5–10 personally invited; ≥3 complete register→pay→access |
| 10 | **DIST-1** Run X agent daily (draft) + post 1/day manually | Should do this week / ongoing | In progress (drafts ready) | Dean | Daily | Top-of-funnel; compounds; stays draft-only/safe | 1 approved post/day from `content/x/`; status tracked in `content/x/status.json`; **no auto-posting** |

> Close the loop: **collect feedback 48–72h after each user gets access** (the `/beta/feedback` form exists) — this is the point of the whole week.

---

## Blockers

- **Price/offer undecided** (Task 2) — blocks invites, Lemon setup, and legal copy.
- **TradingView invite-only not yet confirmed published** (Task 4) — blocks granting access.
- **Beta Room not selected** (Task 7) — onboarding is incomplete without it.
- **Indicator not formally validated** — risk if charging cold; mitigated by warm invites + Task 6.
- **Environment-only:** mount corruption + stale `.git/index.lock` in this sandbox block repo-wide build/lint and committing here — run locally.

## Decisions Dean needs to make

1. **Offer + price:** $79 / 90 days (per the written decision docs) vs $29 or $49 / month (per the live page). Pick one and reconcile the `/beta` plans + the Lemon variant. *(This is the #1 unblock.)*
2. **Lemon link:** one shared checkout vs separate variants per price; stay **test mode** until you say go-live.
3. **Beta Room platform:** Discord vs Telegram vs Circle (start simple).
4. **First cohort:** who are the specific 5–10 warm users to invite?
5. *(Minor/later)* How much of the scoring formula to expose to users (`O-007`).

## What NOT to work on yet

- Lemon **webhooks** / automated fulfilment.
- In-app **Stripe / auth / accounts / entitlements**.
- The **Website Brain / multi-ticker scanner / Market Room** (`EN-1`).
- Any **landing redesign** or new app features.
- **Live X auto-posting** (keep the agent draft-only).
- A full **community platform**, durable DB migration, or analytics build-out — defer until the manual beta proves demand.

---

## 7-day execution plan

- **Day 1 (today):** RUN-1 dry run in Lemon TEST; decide price (O-002); confirm Lemon test mode + amount (PAY-1).
- **Day 2:** Publish indicator invite-only + test grant/revoke (ACCESS-1); draft the fulfilment runbook (RUN-2).
- **Day 3:** Stand up Beta Room (ROOM-1); verify onboarding pages + add refund/cancellation terms (ONB-1).
- **Day 4:** Indicator confidence pass on ~8 charts (RC-6-lite); fix the single worst friction from Day 1.
- **Day 5:** Invite the first 3–5 warm users (INVITE-1); start the daily X post cadence (DIST-1).
- **Day 6:** Invite the next batch to reach 5–10; keep posting 1/day.
- **Day 7:** Collect 48–72h feedback from the first users; write a one-paragraph "what we learned" + next-week adjustment.

## 30-day direction

- **Week 1:** Activate the beta loop; first 5–10 users onboarded and giving feedback (this plan).
- **Week 2:** Iterate on the highest-friction onboarding step from real feedback; daily X distribution; capture renew-intent signal.
- **Week 3:** Formal-ish indicator validation (fill the test matrix, `RC-6`); tighten copy/legal; decide whether $79/90d or $29/mo is the keeper based on what users actually paid for.
- **Week 4:** Decision gate — continue manual beta vs invest in automation. Only then consider Lemon **live** mode, durable lead storage (off file-based), and minimal funnel analytics. No automation before demand is proven.

---

*Guardrails (every surface): no profit promises, no buy/sell signals, no prediction or win-rate claims, no financial-advice wording, no generic SaaS fluff. Simple chart. Complex engine. Clarity over noise.*
