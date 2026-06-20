# RangeClarity Customer Flow

## Purpose

Define the first practical customer journey for RangeClarity from public content to paid/private beta onboarding. This flow is intentionally manual-first so the founder can validate demand, copy, onboarding friction, payment intent, TradingView access, and product value before building automation.

## High-Level Journey

```text
X/content
  -> landing page
  -> beta signup/payment
  -> TradingView username collection
  -> manual approval
  -> onboarding
  -> feedback
```

## 1. X / Content

**Goal:** Earn trust before asking for payment.

**Primary content themes:**

- Simple chart. Complex engine.
- No signals. No noise. Just structure.
- Clarity over noise.
- How to read support, resistance, trend, range, and extension without clutter.
- Examples where "no clean structure" is the useful answer.

**User sees:**

- Short chart breakdowns.
- Honest process notes.
- Screenshots or mockups showing clean structure.
- Clear statement that RangeClarity is not a signal service.

**Founder action:**

- Post consistently.
- Reply with educational context only.
- Route interested users to the landing page or beta waitlist.

## 2. Landing Page

**Goal:** Convert interest into a beta signup without overpromising.

**User sees:**

- What RangeClarity is.
- What it is not.
- Founding Beta Access: $79 for 90 days.
- TradingView requirement.
- Manual payment and manual approval note.
- Private RangeClarity Beta Room mention for support, onboarding help, feedback, bug reports, feature requests, product updates, and changelog notes.
- Educational-use disclaimer.

**Recommended CTA:**

Request private beta access

**Founder action:**

- Review page copy for hype, prediction, or trade-instruction language.
- Confirm CTA points to the beta signup path.

## 3. Beta Signup / Payment

**Goal:** Identify serious beta users, collect manual payment intent, and keep the workflow founder-led.

**User submits:**

- Name
- Email
- TradingView username if already known
- Whether they have a TradingView account
- Market focus
- Why they want RangeClarity

**Payment posture for first beta:**

- Use a manual invoice or manual payment link first.
- Default beta offer: $79 for 90 days.
- Do not implement a full payment provider yet.
- Do not enable live payment automation yet.
- Do not automate paid access until manual beta proves the flow.
- Keep records compatible with later `manual`, `stripe`, `paddle`, and `lemon_squeezy` providers.

**Founder action:**

- Verify the signup is a good-fit beta user.
- Verify payment manually.
- Mark `paymentProvider = manual`.
- Mark `paymentStatus = pending`, `paid`, `failed`, or `refunded`.
- Keep `accessStatus = pending` until TradingView access is granted.

## 4. TradingView Username Collection

**Goal:** Capture the exact TradingView username needed for invite-only script access.

**User sees:**

- A short instruction explaining where to find their TradingView username.
- A required username field.
- A warning that email is not usually the TradingView username.

**Founder action:**

- Check spelling.
- Confirm it is not obviously an email or wrong account.
- Ask user to confirm if uncertain.

## 5. Manual Approval

**Goal:** Grant access safely and avoid early automation.

**Founder checklist:**

- Signup received.
- `paymentProvider = manual`.
- `paymentStatus = paid`.
- TradingView username submitted.
- TradingView username confirmed as required before access.
- Username added to invite-only script access.
- Access granted email sent.
- User status updated to `accessStatus = granted`.

**User sees:**

- Pending approval page.
- Manual approval timing.
- Support/contact path.

## 6. Onboarding

**Goal:** Get the user to the first useful chart read quickly.

**User sees:**

- How to open TradingView.
- How to find invite-only scripts.
- How to add RangeClarity to a chart.
- Recommended first test: daily or weekly chart.
- What the dashboard means.
- What RangeClarity does not do.
- TradingView affiliate placeholder if applicable.
- Private RangeClarity Beta Room for support, onboarding help, feedback, bug reports, feature requests, product updates, and changelog notes.

**Founder action:**

- Send onboarding email.
- Encourage the user to test 3-5 charts.
- Ask for notes on clarity, confusion, and setup friction.

## 7. Feedback

**Goal:** Learn whether RangeClarity creates real chart-review clarity.

**Feedback prompts:**

- What was clear?
- What was confusing?
- Which chart/timeframe did you test?
- Did the dashboard help you understand structure faster?
- Any bugs?
- Any labels that felt too strong or too vague?

**Founder action:**

- Review feedback after 3 days.
- Separate bugs from copy issues and feature requests.
- Prioritize fixes that improve trust and onboarding.
- Track whether the user would still pay after the 90-day beta window.

## Operational Principle

Keep the first beta manual, narrow, and founder-led. The goal is not to prove that automation works. The goal is to prove that users understand the product, pay for access, submit the correct TradingView username, can access it, and find the structure read useful enough to keep testing.
