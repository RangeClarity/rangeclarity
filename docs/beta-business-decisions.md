# RangeClarity Beta Business Decisions

## Current Beta Default

RangeClarity Founding Beta Access is:

- $79 for 90 days.
- Manual payment first.
- Manual TradingView invite-only access.
- Built to validate product value, onboarding clarity, indicator usefulness, and willingness to pay.

The alternative future beta subscription is $29/month, but the default first offer is $79 for 90 days.

## Payment Provider Decision

Use a manual invoice or manual payment link first.

The first goal is not payment automation. The first goal is to prove that a real user:

1. Understands the offer.
2. Pays for beta access.
3. Submits their TradingView username.
4. Receives invite-only access.
5. Gets value from the indicator and provides useful feedback.

Do not implement a full payment provider yet. Do not enable automated live payments yet.

## Future Provider Readiness

Prepare internal records so `paymentProvider` can later be:

- `manual`
- `stripe`
- `paddle`
- `lemon_squeezy`

For the current beta:

- `paymentProvider = manual`
- `paymentStatus = pending | paid | failed | refunded`
- `accessStatus = pending | granted | revoked`
- `tradingViewUsername` is required before access can be granted.

Recommended providers to test later: Lemon Squeezy or Paddle, because RangeClarity is a digital software product and merchant-of-record handling may be useful for global digital sales.

Stripe remains an option, but should not be treated as the default until legal, tax, and business setup are confirmed.

## What Beta Includes

Founding Beta Access includes:

- TradingView invite-only RangeClarity indicator.
- Beta onboarding page.
- TradingView setup guide.
- TradingView affiliate link placeholder.
- Private RangeClarity Beta Room.
- Changelog / beta updates.
- Feedback form.

The Private RangeClarity Beta Room is for:

- Support.
- Onboarding help.
- Feedback.
- Bug reports.
- Feature requests.
- Product updates.
- Changelog notes.

It is not a trade-call room or market prediction group. Use a simple private Telegram, Discord, or Circle group first. Do not build a large community platform yet.

## Beta Positioning

RangeClarity Beta gives early users access to a premium market-structure clarity layer for TradingView.

It helps users read range, structure, zones, weak/strong areas, and chart context with less noise.

It does not predict price. It does not provide directional trade signals. It is not financial advice. It is a visual clarity system for market structure.
