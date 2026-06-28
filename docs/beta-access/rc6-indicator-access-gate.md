# RC-6 — Validate Indicator Access Gate (checklist)

Confirms the indicator and the invite-only access process are ready to charge for, **before** the
Paid Beta Access Loop goes live. Mark each item; record evidence. Founder/Codex owns sign-off.

> Gate question: can a paid beta user be granted invite-only access to a real, on-brand indicator
> and start a Daily/Weekly structure review without confusion?

## 1. Indicator exists
- [ ] Canonical Pine file confirmed (`RangeClarity_Core.pine` vs `pine/rangeclarity_ultimate_core.pine`) — one is authoritative.
- [ ] Compiles in TradingView with no errors/warnings.
- [ ] Renders structure on a Daily chart (bias, S/R tiers, range position, clarity) — evidence: screenshot.

## 2. Name + description avoid hype/advice language
- [ ] Indicator title and description contain **no** buy/sell, signal, prediction, win-rate, or profit language.
- [ ] Description frames it as a **market-structure visualization / clarity** tool (educational decision-support).
- [ ] No "guaranteed", "best trades", or performance claims anywhere in the indicator metadata.

## 3. Invite-only access process confirmed in TradingView
- [ ] Indicator is published **Invite-only** (not public/open).
- [ ] A test username can be added and the script appears under that account's *Invite-only scripts*.
- [ ] Process for collecting the exact TradingView username is in place (captured at signup).

## 4. Founder can manually grant / revoke
- [ ] Founder can **grant** access to a TradingView username and confirm it appears for that user.
- [ ] Founder can **revoke** access and confirm it is removed.
- [ ] Runbook step exists: paid → grant; refund → revoke; beta window end → expire/review.
- [ ] Admin console (`/beta/admin`) reflects these states (paid · granted · revoked · expired).

## 5. First use case = Daily/Weekly chart structure review
- [ ] Onboarding (`/beta/onboarding`) and how-to-use (`/beta/how-to-use`) describe the Daily/Weekly workflow.
- [ ] A new user can read bias + clarity + S/R tiers + range position on a Daily, then check the Weekly.
- [ ] "What it does NOT do" is shown (no signals/predictions/advice).

## Sign-off
- [ ] Founder verdict recorded: indicator + access gate are **worth charging $29/$49** (or a concrete fix list).
- Evidence / notes: ______________________________________________
