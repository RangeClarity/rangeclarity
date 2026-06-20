# TradingView Access Process

## Purpose

Document the manual process for granting private beta users access to the RangeClarity TradingView indicator.

This process is intentionally manual for the first beta. Do not automate TradingView access until the first users prove the flow and the support burden is understood.

## Required User Data

Before granting access, collect:

- Name
- Email
- `paymentProvider`
- `paymentStatus`
- `accessStatus`
- Exact TradingView username
- Market focus
- Plan/access type
- Admin notes

Current beta defaults:

- `paymentProvider = manual`
- `paymentStatus = pending | paid | failed | refunded`
- `accessStatus = pending | granted | revoked`
- Default offer: Founding Beta Access, $79 for 90 days.
- TradingView username is required before access can be granted.

## User-Facing Steps

1. User signs up for beta access.
2. User completes manual invoice or manual payment link.
3. User submits exact TradingView username.
4. User sees a pending approval message.
5. Founder/admin manually grants invite-only script access.
6. User receives access granted email.
7. User opens TradingView and adds the indicator from invite-only scripts.

## Founder/Admin Process

### 1. Verify Signup

- Confirm name and email are present.
- Confirm user fits the beta profile.
- Confirm no duplicate record exists.

### 2. Verify Payment

- Check the manual payment record.
- Confirm status is complete.
- Confirm email matches signup or is clearly linked.
- Set `paymentProvider = manual`.
- Set `paymentStatus = paid` only after payment is confirmed.
- Do not grant access if payment is pending, failed, refunded, or unclear.

### 3. Verify TradingView Username

- Copy username exactly.
- Confirm it is not an email address.
- Ask user to confirm if spelling looks suspicious.
- Save username in the beta record.

### 4. Grant TradingView Access

In TradingView:

1. Open the publisher/script management area.
2. Open the private/invite-only RangeClarity indicator access settings.
3. Add the user's exact TradingView username.
4. Save/confirm access.
5. If TradingView provides an access list, verify the username appears.

### 5. Update Internal Status

Set:

- `paymentProvider = manual`.
- `paymentStatus = paid`.
- `accessStatus = granted`.
- `tradingViewUsername = exact username`.
- `updatedAt = current timestamp`.
- `adminNotes = access granted manually`.

### 6. Send Access Granted Email

Include:

- Confirmation that access is ready.
- TradingView setup instructions.
- Onboarding guide link.
- Responsible-use reminder.
- Feedback link.

## Revoking Access

Use only when access expires, refund/cancellation is confirmed, abuse occurs, or the beta period ends.

Steps:

1. Confirm reason for revocation.
2. Remove username from invite-only access list in TradingView.
3. Update internal status to `accessStatus = revoked`.
4. Send a clear access update email.
5. Keep notes factual and short.

## Common User Problems

### User cannot find the indicator

Check:

- Correct TradingView account.
- Correct username.
- Access has been granted.
- User is looking under invite-only scripts.

### User submitted the wrong username

Ask for the corrected username, update the record, and add the correct account manually.

### User expects instant access

Point them to the pending approval page and explain that beta access is manually reviewed.

## Safety Rules

- Do not grant access before manual payment is verified.
- Do not grant access before the TradingView username is submitted and checked.
- Do not promise instant access.
- Do not automate access yet.
- Do not use trade-instruction language in support.
- Keep the process calm, documented, and repeatable.
