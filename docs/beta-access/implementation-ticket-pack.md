# Paid Beta Implementation Ticket Pack

## P0 Tickets

### 1. Beta Signup CTA

**Priority:** P0

**Goal:** Add or confirm a clear beta access CTA without redesigning the landing page.

**Files likely affected:** `app/page.tsx`, landing page components, copy files.

**Acceptance criteria:**

- CTA is visible.
- CTA routes to beta signup.
- Copy avoids hype, advice, prediction, and performance claims.

**Risk:** Landing page drift or over-design.

**Dependencies:** Approved copy.

### 2. Beta Signup Form

**Priority:** P0

**Goal:** Capture first beta interest safely.

**Files likely affected:** signup route/page, form component, API endpoint or existing waitlist handler.

**Acceptance criteria:**

- Captures name, email, TradingView account status, market focus, and notes.
- Validates email.
- Shows clear success state.

**Risk:** Overbuilding auth/database too early.

**Dependencies:** Data model decision.

### 3. TradingView Username Capture

**Priority:** P0

**Goal:** Collect exact TradingView username before manual access.

**Files likely affected:** username submission page, form handler, admin notes.

**Acceptance criteria:**

- Username is required.
- Helper text explains where to find it.
- Pending approval state follows submission.

**Risk:** Wrong username causes access delay.

**Dependencies:** Signup/user record.

### 4. Payment/Test-Payment Placeholder

**Priority:** P0

**Goal:** Define sandbox/manual payment step without enabling live money flow.

**Files likely affected:** payment success/cancel pages, docs, optional draft route.

**Acceptance criteria:**

- Success route exists or is planned.
- Cancel route exists or is planned.
- No live provider keys are used.
- No real payment automation is enabled.

**Risk:** Accidentally implying live checkout is ready.

**Dependencies:** Provider decision later.

### 5. Pending Approval Page

**Priority:** P0

**Goal:** Explain manual review after payment/test payment and username submission.

**Files likely affected:** pending page, routing.

**Acceptance criteria:**

- User understands access is manual.
- Expected timing is visible.
- Support/contact path exists.

**Risk:** Users expect instant access.

**Dependencies:** Copy approval.

### 6. Onboarding Guide Page

**Priority:** P0

**Goal:** Help users add RangeClarity to TradingView.

**Files likely affected:** onboarding page, docs.

**Acceptance criteria:**

- TradingView account steps are clear.
- Invite-only scripts steps are clear.
- Affiliate link placeholder exists.
- Responsible-use copy is visible.

**Risk:** Support load if setup is unclear.

**Dependencies:** TradingView access process.

### 7. Admin Manual Approval Checklist

**Priority:** P0

**Goal:** Give founder a repeatable manual access workflow.

**Files likely affected:** docs only, possible internal admin page later.

**Acceptance criteria:**

- Covers signup, payment/test payment, username, access grant, email, feedback, revocation.

**Risk:** Manual mistakes if not followed.

**Dependencies:** None.

### 8. Feedback Form

**Priority:** P0

**Goal:** Collect beta feedback after access.

**Files likely affected:** feedback page/form, storage endpoint.

**Acceptance criteria:**

- Captures rating, comment, bug report, and requested feature.
- Ties feedback to user/email.

**Risk:** Feedback scattered across DMs/email.

**Dependencies:** User record or email capture.

### 9. Legal / Disclaimer Copy

**Priority:** P0

**Goal:** Keep beta copy clearly educational and non-advisory.

**Files likely affected:** beta pages, onboarding, FAQ.

**Acceptance criteria:**

- Disclaimer visible.
- No trade instructions, prediction claims, or performance promises.

**Risk:** Product trust and compliance risk.

**Dependencies:** Copy review.

### 10. QA Full Flow

**Priority:** P0

**Goal:** Validate the complete manual beta loop before real users.

**Files likely affected:** QA docs, test notes.

**Acceptance criteria:**

- Full journey tested on mobile and desktop.
- Success/cancel/pending/onboarding states checked.
- No live payment accidentally enabled.

**Risk:** User gets stuck during first paid beta.

**Dependencies:** P0 pages/forms.

## P1 Tickets

### 11. Duplicate Lead Handling

**Priority:** P1

**Goal:** Avoid duplicate beta records for the same email.

**Files likely affected:** signup API/storage.

**Acceptance criteria:** Duplicate emails return a clear status.

**Risk:** Confusing admin review.

**Dependencies:** Signup storage.

### 12. Email Template Integration

**Priority:** P1

**Goal:** Prepare transactional emails from approved templates.

**Files likely affected:** email provider integration later, docs.

**Acceptance criteria:** Templates map to each beta state.

**Risk:** Premature provider setup.

**Dependencies:** Email provider decision.

### 13. Feedback Review Workflow

**Priority:** P1

**Goal:** Triage feedback into bugs, clarity issues, and feature requests.

**Files likely affected:** docs, optional internal board.

**Acceptance criteria:** Founder can review feedback weekly.

**Risk:** Feedback becomes noisy.

**Dependencies:** Feedback form.

## P2 Tickets

### 14. Provider Comparison

**Priority:** P2

**Goal:** Compare Stripe, Paddle, Lemon Squeezy, or manual beta payment options.

**Files likely affected:** docs only.

**Acceptance criteria:** Recommendation includes fees, setup, tax complexity, and beta fit.

**Risk:** Spending time before flow is validated.

**Dependencies:** Manual beta results.

### 15. Access Automation Exploration

**Priority:** P2

**Goal:** Investigate whether TradingView access can or should be automated later.

**Files likely affected:** research docs.

**Acceptance criteria:** Clear decision on whether automation is possible and safe.

**Risk:** Overbuilding before volume exists.

**Dependencies:** At least 5-10 manual beta users.
