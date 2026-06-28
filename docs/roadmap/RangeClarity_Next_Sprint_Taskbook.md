# RangeClarity — Next Sprint Taskbook

**Editable source for `RangeClarity_Next_Sprint_Taskbook.pdf`.** Sprint 1 — *Paid Beta Access Loop + Core Product Value*. **Jun 20 → Jul 7, 2026 (18 days).**

> **Mission:** prove RangeClarity can become a real product, not just a visual idea.
> **Sprint goal:** a user can land on the site, understand the offer, register, complete a **sandbox** payment, receive verified access, and see one clear product-value screen or TradingView onboarding flow.
> **Hard constraint:** sandbox / test payment only. **No live payments** without explicit founder approval.

The activation loop to prove: **Traffic → Landing → Beta signup → Sandbox payment → Verified access (TV invite + Discord) → Onboarding / core value → Feedback** (which iterates back into the offer).

---

## 1. Current repo audit — what exists now

| Area | State | Evidence |
|---|---|---|
| Core indicator | **Built** | `RangeClarity_Core.pine` — 465 lines, `@version=6`, 19 inputs/visuals. The deliverable customers pay for. |
| Landing site | **Builds** | Next.js 15 + React 19 + TS 5; `typecheck` passes. Live homepage = "Codex Premium Hero". |
| Design system | **Present** | `app/globals.css` tokens (void bg + neon accents); reusable components in `components/`. |
| Legal pages | **Partial** | `terms` + `privacy` exist (educational + financial disclaimers) — worded around "waitlist". |
| Waitlist capture | **Partial** | `lib/waitlist.ts` + `.data/waitlist.jsonl`; functional form only on an archived design. |
| Deploy prep | **Ready** | icon, OpenGraph, robots, sitemap, `deploy-rangeclarity.md`. Zero-config Vercel. Not deployed. |
| Payments / auth | **Missing** | No Stripe/Whop, no accounts, no entitlements anywhere. |

Source: `docs/project-state.md` (HEAD 4297974).

## 2. What is broken / missing

- Live CTA posts to a dead `action="#"` — no conversion path.
- No payment path (no Whop/Stripe).
- No verified-access model after purchase.
- No core value screen / onboarding for a new buyer.
- Indicator not yet validated (test matrix empty).
- Legal copy still says "waitlist", not paid beta.

## 3. What should NOT be touched this sprint

- The homepage design — no redesign (decision O-003 open).
- The indicator internals beyond validation notes (polish is Phase 3).
- Live payments — sandbox only, no real money.
- In-app Stripe / auth stack — deferred (O-001).
- The website brain / scanner — Phase 4.
- Linear writes — the board stays the source of truth.

> Rule of the sprint: touch only what stands between a visitor and verified, understood, paid access.

## 4. Prioritized task board

- **Backlog:** product docs + disclaimers; legal reword (paid beta); QA full flow; trust + comprehension polish.
- **Now:** repo current-state audit; map journey + access states; decide offer + price (O-002).
- **In Progress:** registration + access model; sandbox payment (Whop test); verified-access logic; core value screen.
- **Done (pre-sprint):** landing page + design system; core indicator built (Pine).

## 5. ICE prioritization (Impact × Confidence × Ease, 1–10)

| # | Task | I | C | E | ICE |
|---|---|---|---|---|---|
| 1 | Decide offer + price (O-002) | 9 | 8 | 9 | 648 |
| 2 | Point live CTA at the offer | 6 | 9 | 9 | 486 |
| 3 | QA the full flow | 8 | 8 | 7 | 448 |
| 4 | Product docs + disclaimers | 6 | 9 | 8 | 432 |
| 5 | Validate indicator (RC-6, gate) | 10 | 8 | 5 | 400 |
| 6 | Core value screen | 9 | 7 | 6 | 378 |
| 7 | Registration + access model | 7 | 8 | 6 | 336 |
| 8 | Verified-access logic | 8 | 7 | 6 | 336 |
| 9 | Sandbox payment (Whop test) | 9 | 7 | 5 | 315 |

**Gates override ICE:** Validate indicator (RC-6) scores lower on ease but is a hard gate — sequence it first regardless of ICE. ICE ranks the rest.

## 6. Daily schedule (exact dates)

| Date | Day | Focus | Tasks |
|---|---|---|---|
| Jun 20 | Sat | Audit | Inspect structure; map landing/auth/pricing/payment/docs/indicators; write current-state audit. No major design edits. |
| Jun 21 | Sun | Journey | Map the user journey; define paid-beta flow + access states (visitor/registered/test-paid/approved); write acceptance criteria. |
| Jun 22 | Mon | Register | Implement / clean registration flow; basic account + access model. |
| Jun 23 | Tue | Access model | Protected beta-page placeholder; persist access state. |
| Jun 24 | Wed | Sandbox pay | Add sandbox payment flow only (Whop test). No live payments. |
| Jun 25 | Thu | Pay states | Test-payment success / failure states + return handling. |
| Jun 26 | Fri | Verify access | Verified-access logic: test payment unlocks the beta area. |
| Jun 27 | Sat | Manual override | Simple admin / manual access override for fulfilment. |
| Jun 28 | Sun | Core value | Build core value screen: overview, sample ticker/watchlist, bias/score/state. |
| Jun 29 | Mon | Onboarding | TradingView indicator onboarding; "what this means / does not mean". |
| Jun 30 | Tue | Docs | Product docs: what RangeClarity does; how to use the indicator. |
| Jul 1 | Wed | Disclaimers | No-advice disclaimer; beta limitations; what users should test. |
| Jul 2 | Thu | QA flow | QA full flow: signup, sandbox payment, access, protected pages. |
| Jul 3 | Fri | QA devices | Mobile + desktop basics; fix dead ends and broken states. |
| Jul 4 | Sat | Polish | Polish only what affects trust + comprehension; clarify copy. |
| Jul 5 | Sun | Trim | Remove confusing sections; keep premium fintech feel. |
| Jul 6 | Mon | Checklists | Beta launch checklist; founder review checklist. |
| Jul 7 | Tue | Finalize | Next-sprint recommendation; finalize PDFs + handoff. |

## 7. Definition of done (per task)

- **T1 Repo audit:** current-state audit doc committed; landing/auth/pricing/payment/docs/indicators catalogued with evidence.
- **T2 Journey + states:** documented flow + four access states with written acceptance criteria.
- **T3 Registration:** form persists name, email, TV username, type, notes; basic account/access record; protected beta-page placeholder.
- **T4 Sandbox payment:** test checkout completes; success + failure handled; no live keys; clear "sandbox" labelling.
- **T5 Verified access:** a test payment unlocks the beta area; manual/admin override works; access cannot be reached without payment + approval.
- **T6 Core value screen:** overview + sample ticker/watchlist + bias/score/state + TV onboarding + "what this means / does not mean".
- **T7 Docs + disclaimers:** what RangeClarity does, how to use the indicator, no-advice disclaimer, beta limits, what to test.
- **T8 QA full flow:** signup, sandbox payment, access, protected pages, mobile + desktop all pass; no dead ends.
- **T9 Polish + T10 Ship:** trust/comprehension copy clean; confusing sections removed; checklists complete; PDFs finalized.

## 8. Owners / role suggestions

| Task group | Owner | Support |
|---|---|---|
| Validate + price (gates) | Founder | Pine dev (validation), Claude (runbook) |
| Registration + access model | Full-stack | Founder (requirements) |
| Sandbox payment + access | Full-stack | Founder (Whop account) |
| Core value screen | Full-stack | Designer (1 day), Founder (copy) |
| Docs + disclaimers | Writer / Claude | Founder (no-advice sign-off) |
| QA + polish + ship | Founder + Claude | Designer (trust polish) |

## 9. Freelancer recommendations

- **Full-stack (Next.js/TS)** — 0.5–0.8 FTE, the build engine for the sprint.
- **Pine / quant dev** — ~1 day for the validation pass.
- **Designer** — ~1 day, trust polish only (no redesign).
- **Writer** — 2–3 days for docs + disclaimers.

One full-stack contractor carries this sprint; everything else is by-the-day. No full-time hires before the beta validates demand.

## 10. Risk list

- **Sandbox pay friction** — provider quirks; mitigate with a thin payment abstraction.
- **Access can be bypassed** — test the gate explicitly in QA.
- **Scope creep** into auth/brain — hold the line.
- **Indicator not validated** in time — gates the sprint's meaning.
- **Mobile dead ends** — device pass in QA.

Most items are low-risk quick wins; concentrate care on sandbox payment + the verified-access gate.

## 11. Acceptance checklist

**The loop:** visitor reads offer & reaches a working CTA · registration captures name/email/TV-username/type/notes · sandbox checkout completes (success + failure) · test payment unlocks the protected beta area · manual/admin override works · core value screen renders sample structure + score + state · TradingView onboarding path is clear.

**Trust & clarity:** "what this means / does not mean" on the value screen · no-advice + beta-limitation disclaimers visible · no buy/sell, profit, or prediction language · no dead `action="#"` forms remain · mobile + desktop pass with no overflow/dead ends · `npm run build` + `typecheck` green · copy reads premium (clarity, not returns).

## 12. Ship / No-ship checklist

**Ship if:** the full sandbox loop works end-to-end with no dead ends · verified access cannot be reached without pay + approval · a new user grasps the value in under five minutes · disclaimers + no-advice language intact · build + typecheck pass and mobile is clean.

**Do not ship if:** any step dead-ends or errors · access leaks without payment/approval · live payment keys are present anywhere · indicator value is still unproven (RC-6 open) · copy drifts into signals / profit / prediction.

> **Most important sprint now: prove the loop.** Land → register → sandbox pay → verified access → understood value. Everything else in the roadmap waits behind this evidence.
