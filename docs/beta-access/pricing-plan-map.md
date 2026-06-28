# RangeClarity — Beta Pricing Plan Map

Gives the existing landing-page pricing (**$0 / $29 / $49**) clear product meaning and connects it
to the Paid Beta Access Loop. **No pricing redesign.** Internal `selectedPlan` values:
`free_preview`, `beta_29`, `pro_beta_49`. Default payment provider: `manual` (no live payments).

Positioning: *Simple chart. Complex engine. No signals. No noise. Just structure.* A premium
market-structure clarity system for TradingView, built first for **Daily/Weekly chart structure review**.

---

## $0 — Free Preview / Watchlist  ·  `free_preview`

- **Purpose:** lead capture and product education.
- **Included:** public RangeClarity updates · basic onboarding/docs preview · TradingView setup guide · waitlist / beta interest form.
- **Not included:** invite-only indicator access (unless a founder manually approves/upgrades).
- **CTA label:** **Join Free Preview**
- **Access rules:** stays `free_preview`; `accessStatus` remains `pending` and is **never** auto-granted invite-only access. A founder may manually upgrade the plan and grant access.
- **Payment:** none. Capture lead/signup only.

## $29 — Beta Access  ·  `beta_29`  ·  PRIMARY

- **Purpose:** the main paid beta plan.
- **Included:** invite-only RangeClarity TradingView indicator access · beta onboarding page · Daily/Weekly structure review workflow · TradingView setup guide · feedback form · product updates during the beta.
- **Not included:** signals, predictions, win-rate or profit claims, or financial advice.
- **CTA label:** **Get Beta Access**  *(primary CTA across the site)*
- **Access rules:** eligible for invite-only access once `paymentStatus = paid` (or founder override) **and** a TradingView username is present. Access is granted/revoked manually.
- **Payment:** manual payment link — `[MANUAL_PAYMENT_LINK_29_HERE]` (env `MANUAL_PAYMENT_LINK_29`).

## $49 — Pro Beta / Founder Access  ·  `pro_beta_49`

- **Purpose:** higher-intent beta users.
- **Included:** everything in $29 Beta Access · priority manual access review · priority support/feedback · early feature previews when available · private beta feedback channel access if available.
- **Not included:** **no** better trades, **no** better performance, **no** signals, **no** profit advantage, **no** 1:1 trading advice. The $49 tier is the **same structure tool with priority service**, not a performance upgrade.
- **CTA label:** **Get Pro Beta Access**
- **Access rules:** same eligibility as $29 (paid + TradingView username, or override); access granted/revoked manually, with priority review.
- **Payment:** manual payment link — `[MANUAL_PAYMENT_LINK_49_HERE]` (env `MANUAL_PAYMENT_LINK_49`).

---

## CTA routing

| Tier | selectedPlan | CTA | Routes to |
|------|--------------|-----|-----------|
| $0  | `free_preview` | Join Free Preview | `/beta?plan=free_preview` |
| $29 | `beta_29` | Get Beta Access (primary) | `/beta?plan=beta_29` |
| $49 | `pro_beta_49` | Get Pro Beta Access | `/beta?plan=pro_beta_49` |

Primary homepage CTA → **$29 Beta Access**. Secondary homepage CTA → **$0 Free Preview**.

## Safe language (required everywhere)

Use: *market-structure visualization tool · clarity layer · structure, bias, support/resistance, range
position, clarity score · decision-support · Daily/Weekly structure review.*
Never use: *buy/sell signals · entries/exits · price prediction · win rate · guaranteed/▲ profit ·
"better trades" · financial/trading advice · 1:1 advice.*

## Notes for future automation (not built yet)

1. Replace manual payment links by implementing one provider slot in `lib/payments/providers/*` (Lemon Squeezy, Paddle, Whop, Stripe) + a webhook that sets `paymentStatus = paid`.
2. Switch the active provider via `PAYMENT_PROVIDER` (default `manual`).
3. Automate TradingView grant/revoke only after the manual loop is validated (out of scope now).
4. Move signups to durable storage (`BETA_SIGNUPS_FILE` or a hosted DB) — `.data/*.jsonl` is ephemeral on serverless.
5. Add transactional email for confirmation + payment-link delivery; add the private feedback channel for Pro.
