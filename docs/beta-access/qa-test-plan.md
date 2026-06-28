# Paid Beta QA Test Plan

## Scope

This checklist validates the full paid beta access loop before external beta users enter the flow.

## Landing Page

- [ ] Beta CTA is visible.
- [ ] CTA copy is calm and non-hype.
- [ ] CTA routes to the correct signup step.
- [ ] Legal/disclaimer copy is visible.
- [ ] No performance-promise language appears.
- [ ] No trade-instruction language appears.

## Signup Form

- [ ] Signup form loads.
- [ ] Name is captured.
- [ ] Email is required.
- [ ] Email validation works.
- [ ] TradingView username field exists or is clearly deferred to the next step.
- [ ] TradingView account status is captured.
- [ ] Market focus is captured.
- [ ] Submission creates a beta lead record.
- [ ] Duplicate email behavior is defined.

## Payment / Test Payment

- [ ] Payment success route works.
- [ ] Payment cancelled route works.
- [ ] Payment/test-payment status is not trusted without verification.
- [ ] No live provider is connected until explicitly approved.
- [ ] No real money flow is enabled during preparation.

## TradingView Username

- [ ] TradingView username is required before access approval.
- [ ] Username helper text is clear.
- [ ] Email address is not accepted as username without warning.
- [ ] Success state confirms manual review.

## Pending Approval

- [ ] Pending approval page works.
- [ ] Manual review timing is visible.
- [ ] User understands access is not instant.
- [ ] Support/contact path exists.

## Onboarding Page

- [ ] Onboarding page loads.
- [ ] TradingView account instructions are clear.
- [ ] Invite-only access instructions are clear.
- [ ] Indicator add-to-chart steps are clear.
- [ ] Save-layout instructions are clear.
- [ ] Responsible-use copy is visible.
- [ ] Affiliate link placeholder exists: `[TRADINGVIEW_AFFILIATE_LINK_HERE]`.

## Feedback

- [ ] Feedback form/page loads.
- [ ] Rating can be captured.
- [ ] Comment can be captured.
- [ ] Bug report can be captured.
- [ ] Requested feature can be captured.
- [ ] Feedback is tied to user or email.

## Layout

- [ ] Mobile layout is usable.
- [ ] Desktop layout is usable.
- [ ] Form fields do not overflow.
- [ ] Buttons are readable.
- [ ] Legal/disclaimer copy remains visible.

## Full Test User Journey

- [ ] Visitor sees beta CTA.
- [ ] Visitor submits signup form.
- [ ] User reaches payment/test-payment step.
- [ ] Success route asks for TradingView username.
- [ ] Username submission enters pending approval.
- [ ] Admin grants TradingView access manually.
- [ ] User receives access email.
- [ ] User opens onboarding page.
- [ ] User submits feedback.

## Final Beta Gate

- [ ] Founder can complete the whole flow manually.
- [ ] No product-code changes are required to validate the first manual beta.
- [ ] All risky automation remains deferred.
