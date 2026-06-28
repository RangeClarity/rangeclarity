# Paid Beta Access Flow

## Purpose

This document defines the safe first paid beta customer journey for RangeClarity. It is a preparation plan only. It does not enable live payments, automate TradingView access, or change production code.

## Customer Journey

1. A visitor lands on RangeClarity and understands the product: a premium TradingView market-structure clarity system, not a signal service.
2. The visitor clicks a beta access call to action.
3. The visitor submits name, email, market focus, and TradingView account status.
4. The system or founder marks the lead as registered.
5. The user reaches a payment or test-payment step.
6. After payment/test payment, the user submits a TradingView username.
7. The founder manually verifies payment and TradingView username.
8. The founder grants invite-only TradingView indicator access.
9. The user receives onboarding instructions and opens the TradingView guide.
10. The user tests RangeClarity and submits feedback.

## Step-by-Step Flow

| Step | User action | System state | Founder/admin action |
|---|---|---|---|
| 1 | Visits page | visitor | No action |
| 2 | Clicks beta CTA | visitor | No action |
| 3 | Submits signup form | lead | Review submission quality |
| 4 | Confirms beta interest | registered | Confirm lead record |
| 5 | Starts payment/test payment | payment_pending | Check payment provider manually |
| 6 | Completes test payment | test_paid | Verify payment/test payment |
| 7 | Submits TradingView username | tradingview_username_submitted | Verify username format/account |
| 8 | Waits for manual approval | access_pending | Grant invite-only access in TradingView |
| 9 | Receives access | access_granted | Send access granted email |
| 10 | Gives feedback | access_granted | Track notes, bugs, objections |
| 11 | Access ends if needed | access_revoked | Send revocation/expiry email |

## Visitor States

### visitor

**What happens:** The person is browsing only.

**User sees:** Product promise, beta CTA, compliance language, pricing/beta access note.

**Founder/admin does:** Nothing.

### lead

**What happens:** The visitor submitted initial interest.

**User sees:** Confirmation that beta interest was received.

**Founder/admin does:** Check email, source, and whether the lead fits the beta profile.

### registered

**What happens:** The lead has enough information to proceed.

**User sees:** Next step: payment/test payment or manual payment instructions.

**Founder/admin does:** Mark lead as ready for payment/test payment.

### payment_pending

**What happens:** The user has started but not completed the payment/test-payment step.

**User sees:** Payment pending or cancelled guidance.

**Founder/admin does:** Check provider dashboard manually. Do not grant access yet.

### test_paid

**What happens:** Payment/test payment is complete in sandbox/manual mode.

**User sees:** Success page asking for TradingView username.

**Founder/admin does:** Verify amount/status and update payment status.

### tradingview_username_submitted

**What happens:** The user submitted the TradingView username.

**User sees:** Confirmation that username was received.

**Founder/admin does:** Copy username, verify spelling, check for duplicate records.

### access_pending

**What happens:** Manual review is in progress.

**User sees:** Pending approval page with expected manual review timing.

**Founder/admin does:** Grant invite-only access through TradingView manually.

### access_granted

**What happens:** User has access.

**User sees:** Onboarding guide, TradingView setup instructions, affiliate placeholder, feedback link.

**Founder/admin does:** Send access email, follow up after 3 days, track feedback.

### access_revoked

**What happens:** Access is removed or expired.

**User sees:** Clear status message and support/contact path.

**Founder/admin does:** Revoke TradingView access manually and send expiry/revocation email.

## Manual Admin Notes

- Keep the first beta manual until the user journey is proven.
- Do not automate invite-only access before the first 5-10 beta users reveal where the process breaks.
- Do not grant access before payment/test payment and TradingView username are both verified.
- Keep all user-facing language educational and process-oriented.
