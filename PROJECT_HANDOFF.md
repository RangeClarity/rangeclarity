# RangeClarity — Project Handoff

**Purpose:** Pause point. This file lets you return later and continue quickly without losing context.
**Status:** Planning & foundation only — intentionally not coding yet.
**Last updated:** 2026-06-14
**Owner:** Dean

---

## When you return — start here

**First question to answer:** *Do you want to continue with planning, freelancer outreach, landing page, or Free Starter indicator?*

Pick one of those four tracks and we proceed from the matching next step below. Nothing else starts until you choose.

---

## 1. Current project summary

RangeClarity is a clean TradingView dashboard/indicator (Pine Script) that helps traders read a chart in ~10 seconds — trend regime, nearest support/resistance, distance to each, range width and position in range, ATR extension, volume confirmation, setup quality, and a one-sentence interpretation. Positioning is **chart clarity, not signals** ("No signals. No hype. Just chart clarity."). Inspired by Mark Minervini (stage 2, relative strength, VCP, clean bases, risk control) and Brian Shannon (VWAP/AVWAP, multi-timeframe, location, market structure, support/resistance).

Business model: free public **Starter** script for discovery → invite-only paid **Pro** script → **Whop** for checkout/access → **Discord** for onboarding/retention → landing page on **RangeClarity.com**. TradingView Paid Spaces possibly later.

**Where things stand right now:**
- `RANGECLARITY_MASTER_PLAN.md` — complete (21 sections: strategy, MVP, indicator spec, S/R engine, scoring, UX, landing page, GTM, monetization, compliance, architecture, 30/60/90 roadmap, Phase 1 plan, open questions). This is the source of truth.
- A minimal Next.js + TypeScript scaffold exists in this folder from an earlier step. It is **parked** — the plan calls for a static landing page later, not now. Note: `git init` could not complete in the build environment; run it locally when you resume.
- No production code, no landing page, no Pine Script written. By design.
- A strict review pass was completed in-house on 2026-06-14 (`REVIEW_AND_PHASE1.md`). The intended external **Codex output was never saved into the project** — only the review *request* prompt (`Codex_REVIEW_REQUEST.md`) exists. If you ran Codex elsewhere, paste its output and I'll reconcile.
- The master plan is now **revision 2**: review refinements applied as recommendations pending your approval.

**Files in this project:**
- `RANGECLARITY_MASTER_PLAN.md` — full plan, revision 2 (source of truth)
- `REVIEW_AND_PHASE1.md` — review verdict, changelog, consolidated Phase 1 plan
- `Codex_REVIEW_REQUEST.md` — the review prompt (no Codex output captured)
- `PROJECT_HANDOFF.md` — this file
- `docs/ARCHITECTURE.md`, `docs/TASKS.md` — foundation docs
- Parked Next.js scaffold (`app/`, config files)

---

## 2. Decisions already made

- Domain purchased: **RangeClarity.com**.
- Positioning: **chart clarity, not signals**.
- Brand direction: **clean, premium, trustworthy, slightly meme / internet-native** — but never scammy.
- **No** profit promises, **no** win-rate claims, **no** "buy/sell/guaranteed" language; educational decision-support only.
- Model: **Free Starter + invite-only Pro**.
- Monetization: **Whop first**.
- Keep the **MVP lean**; **do not overbuild** the backend; **no AI features yet**.
- Product surface: **TradingView-first** (Pine Script).
- Operating principle: **build slowly, professionally, one phase at a time**.

### Tooling roles (how the team operates)
- **Claude Code** — main architect / builder.
- **Codex** — strict reviewer / QA.
- **Gemini** — prompt strategist / external critic / alternative thinking.
- **Hermes** — project manager / daily execution discipline.

### Freelancer direction
- Hire **one** freelancer first, for a **small scoped task** only.
- Most important first role: **Product / Brand / UX Designer for a Mini Brand Sprint.**
- Desired deliverables from that sprint:
  - 2–3 logo / wordmark directions
  - mascot direction
  - color palette
  - font direction
  - landing page hero concept
  - TradingView dashboard visual style
  - a few meme / social templates
- Candidate: **Daniel Bright / BrightStudios** (Contra) — strong for premium brand/web, but maybe not trading-dashboard-specific.
- Next step with him: send a **short message** asking if he's open to a **small paid concept sprint** before any larger project.

---

## 3. Open questions (blockers to resolve)

From the master plan, still unanswered:

1. **Asset focus** — US equities only, or also crypto/FX? (Changes default thresholds and S/R tuning.)
2. **Primary timeframe** — swing/daily default, with intraday secondary?
3. **Pro price at launch** — $39 vs $49/month; trial with card, trial without card, or money-back window?
4. **Trend regime depth** — full Minervini stage 1–4 model, or simpler bullish/bearish/neutral for v1?
5. **VWAP default** — on subtly by default in Clean Mode, or toggle-only?
6. **Waitlist tool** — hosted form vs Whop/Discord-native capture?
7. **Brand visuals** — defer to the freelancer Brand Sprint, or set an interim direction now?
8. **Discord vs newsletter** — which is the primary retention channel at launch?
9. **TradingView account** — do you have the plan tier to publish invite-only scripts, and the username to publish under?
10. **Score in Starter, ~7-row layout, validation targets, money-back vs trial** — the four decisions from the review pass that need your confirmation to make the plan build-ready (see `REVIEW_AND_PHASE1.md` section L).

---

## 4. Next 10 actions (when you resume)

1. Re-read `RANGECLARITY_MASTER_PLAN.md` to reload context.
2. Capture **Codex review feedback** (if available) into a short notes file or the plan's decision log.
3. Answer the highest-leverage open questions: **asset focus, primary timeframe, Pro price.**
4. **Finalize the Phase 1 plan** (planning + foundation only) based on answers.
5. Decide: **contact Daniel Bright now**, or shortlist 2–3 more designers first.
6. If proceeding with Daniel: send the **short paid-concept-sprint** message (no big commitment).
7. Write the **Free Starter indicator spec on paper** (rows, defaults, thresholds, interpretation rules) — still no code.
8. Decide the **waitlist tool** and stand up an empty capture form.
9. Plan the **simple live landing page** for RangeClarity.com (content + hero), but don't build until the spec/brand inputs are ready.
10. Only **after** specs and brand inputs exist: begin coding the landing page, then the Starter indicator.

---

## 5. What NOT to do

- Don't write production code, the landing page, or Pine Script during this pause.
- Don't change the product direction or positioning.
- Don't add new features or scope.
- Don't build a SaaS backend, auth, or database — none is needed yet.
- Don't add AI/Elite features or multiple pricing tiers before traction.
- Don't drift toward signals/arrows/recommendations — it breaks the brand and invites compliance risk.
- Don't use profit, win-rate, accuracy, or "guaranteed" language anywhere.
- Don't hire a large freelancer engagement up front — keep the first task small and scoped.
- Don't run paid ads yet.
- Don't let branding perfectionism delay the validated core (the free Starter is the discovery engine).

---

## 6. Phase 1 checklist (planning & foundation only)

Mirrors Section 17 of the master plan. **No production code in this phase.**

- [ ] **P1-1** — Approve & finalize the master plan; answer the 10 open questions; capture Codex feedback.
- [ ] **P1-2** — Detailed Starter indicator spec on paper (rows, defaults, thresholds, interpretation rules).
- [ ] **P1-3** — Support/resistance + scoring spec finalized (pivots, clustering, ATR tolerance, formulas, score/penalties).
- [ ] **P1-4** — Brand & compliance kit (banned/approved language, standard disclosure, dark-mode direction) — partly informed by the Brand Sprint.
- [ ] **P1-5** — Tooling & accounts readiness (GitHub repo, task tracker, Discord + social handles reserved, Whop + Vercel access confirmed) — no build.
- [ ] **Freelancer decision** — contact Daniel Bright or shortlist alternatives; scope the Mini Brand Sprint.

---

*Paused here. Awaiting your approval before any further action.*
