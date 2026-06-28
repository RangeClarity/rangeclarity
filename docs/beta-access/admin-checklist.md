# Paid Beta Admin Checklist

## New Signup

- [ ] Check new signup record.
- [ ] Confirm name and email are present.
- [ ] Confirm market focus is useful for beta.
- [ ] Confirm whether user has a TradingView account.
- [ ] Mark access status as `lead` or `registered`.
- [ ] Send beta signup received email.

## Payment / Test Payment

- [ ] Check provider dashboard manually.
- [ ] Confirm payment/test payment status.
- [ ] Confirm amount and currency.
- [ ] Do not grant access if payment status is unclear.
- [ ] Mark payment status as `test_paid` only after verification.
- [ ] Send payment received email.

## TradingView Username

- [ ] Copy TradingView username exactly.
- [ ] Check for obvious typo or email-address submission.
- [ ] Ask user to confirm if username is unclear.
- [ ] Mark status as `tradingview_username_submitted`.

## Manual TradingView Access

- [ ] Open TradingView publisher/script access settings.
- [ ] Add the verified TradingView username to invite-only access.
- [ ] Confirm access is granted.
- [ ] Mark user as `access_granted`.
- [ ] Send access granted email.

## Follow-Up

- [ ] Schedule 3-day feedback follow-up.
- [ ] Ask for chart examples.
- [ ] Track feedback in feedback log or database.
- [ ] Track bugs separately from feature requests.
- [ ] Prioritize issues that block setup or clarity.

## Revoke Access If Needed

- [ ] Confirm reason for revocation or expiry.
- [ ] Remove TradingView invite-only access manually.
- [ ] Mark status as `access_revoked`.
- [ ] Send access revoked/expired email.
- [ ] Keep admin notes factual and brief.

## Admin Safety Rules

- Do not expose secrets.
- Do not promise instant access.
- Do not grant access before payment/test payment and username verification.
- Do not use advice-style language in email or support.
- Keep support focused on setup, clarity, and product feedback.
