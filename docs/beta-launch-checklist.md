# Paid / Private Beta Launch Checklist

## Beta Definition

The first beta is a private, manual-access validation loop for RangeClarity. It should prove that users can understand the offer, complete manual payment, provide a TradingView username, receive invite-only access, onboard, get value from the indicator, and give useful feedback.

Default offer: **Founding Beta Access, $79 for 90 days**.

Alternative future beta subscription: **$29/month**, but do not use it as the first default offer.

## P0: Must Have Before First Beta User

### Product / Access

- [ ] TradingView indicator compiles successfully.
- [ ] Invite-only access process is confirmed inside TradingView.
- [ ] Founder can manually grant and revoke access.
- [ ] Indicator name and description avoid hype and advice language.
- [ ] Recommended first use case is defined: daily/weekly chart structure review.

### Landing / Signup

- [ ] Beta CTA is visible.
- [ ] Default beta offer says $79 for 90 days.
- [ ] Signup form captures name, email, market focus, and TradingView account status.
- [ ] TradingView username capture exists or is clearly the next step.
- [ ] Success state tells the user what happens next.
- [ ] Disclaimer is visible before payment.
- [ ] Copy explains that RangeClarity is a visual market-structure clarity system, not a prediction or financial-advice product.

### Payment

- [ ] Manual invoice or manual payment link selected as the first payment method.
- [ ] `paymentProvider = manual` is supported in the operating record.
- [ ] `paymentStatus = pending | paid | failed | refunded` is supported.
- [ ] Payment failed/refunded path exists.
- [ ] No live payment automation is enabled before approval.
- [ ] Founder knows how to verify payment manually.
- [ ] Paddle, Lemon Squeezy, and Stripe are treated as later provider options, not current implementation work.

### Onboarding

- [ ] Onboarding guide exists.
- [ ] User knows where to find invite-only scripts.
- [ ] User knows how to add RangeClarity to a chart.
- [ ] User knows how to save a layout.
- [ ] User knows what RangeClarity does not do.
- [ ] Beta onboarding page exists.
- [ ] TradingView setup guide exists.
- [ ] TradingView affiliate link placeholder exists.
- [ ] Private RangeClarity Beta Room exists or is selected.
- [ ] Feedback form exists.
- [ ] Changelog / beta updates page or doc exists.

### Admin Workflow

- [ ] New signup review checklist exists.
- [ ] Payment verification checklist exists.
- [ ] TradingView username review checklist exists.
- [ ] `accessStatus = pending | granted | revoked` is supported.
- [ ] TradingView username is required before `accessStatus` can become `granted`.
- [ ] Access granted email exists.
- [ ] 3-day feedback follow-up exists.
- [ ] Revocation/expiry process exists.

### QA

- [ ] Full user journey tested end to end.
- [ ] Mobile layout checked.
- [ ] Desktop layout checked.
- [ ] All CTAs route correctly.
- [ ] No broken links.
- [ ] No secret values exposed.
- [ ] No prediction, trade-call, or performance-promise language.

## P1: Important Before Scaling Beyond First Few Users

- [ ] Durable lead storage selected.
- [ ] Duplicate email handling defined.
- [ ] Payment records can be reconciled manually.
- [ ] Feedback storage exists.
- [ ] Bug tracker or issue board exists.
- [ ] Founder dashboard or spreadsheet is ready.
- [ ] Refund/cancellation language is drafted.
- [ ] Terms/Privacy reviewed for beta.

## P2: Later

- [ ] Automated transactional email provider.
- [ ] Lemon Squeezy or Paddle provider test.
- [ ] Stripe provider review after legal/business setup is confirmed.
- [ ] Payment webhooks.
- [ ] User account portal.
- [ ] Automated access status dashboard.
- [ ] Automated renewal/cancellation logic.
- [ ] TradingView access automation research.
- [ ] Analytics funnel instrumentation.

## First Beta Launch Gate

Launch the first paid/private beta only when:

- The founder can complete the full journey manually.
- Manual payment is verified without code changes.
- TradingView access can be granted manually.
- The user can onboard without a live call.
- Feedback can be collected within 3 days.

## Stop Conditions

Pause launch if:

- TradingView invite-only access is not confirmed.
- Manual payment cannot be verified.
- Users cannot find the indicator after access.
- Copy implies trade advice or performance certainty.
- The support burden is unclear.
