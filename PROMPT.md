You are Codex working inside the RangeClarity project.

Your mission is to prepare the full Paid Beta Access package WITHOUT making risky product-code changes yet.

Important:

* Do not redesign the landing page.
* Do not implement live payments.
* Do not connect real Stripe/Paddle/Lemon Squeezy.
* Do not deploy.
* Do not change core app architecture.
* Do not touch secrets or production env files.
* Work mainly in docs, copy, checklists, and safe planning files.
* If you create code, keep it isolated, optional, and clearly marked as draft.

Project context:
RangeClarity is a premium market-structure clarity system.

Positioning:

* “Simple chart. Complex engine.”
* “No signals. No noise. Just structure.”
* “Clarity over noise.”
* Premium TradingView indicator + future Website Brain.
* Avoid buy/sell signals, financial advice, prediction claims, and guaranteed-profit language.

Business goal:
We are preparing the first paid beta customer flow:

Landing page → beta signup → payment/test payment → collect TradingView username → manual approval → TradingView invite-only indicator access → onboarding page → TradingView affiliate link → user feedback.

Your task:
Create a safe, professional preparation package that Claude Code can later use to build the flow.

Create this folder:

docs/beta-access/

Create these files:

1. docs/beta-access/paid-beta-flow.md

Include:

* Full customer journey
* Step-by-step flow
* Visitor states:

  * visitor
  * lead
  * registered
  * payment_pending
  * test_paid
  * tradingview_username_submitted
  * access_pending
  * access_granted
  * access_revoked
* What happens at every state
* What the user sees
* What the founder/admin needs to do manually

2. docs/beta-access/page-copy.md

Write premium copy for:

* Beta CTA section
* Pricing/beta access section
* Signup page
* Payment success page
* Payment cancelled page
* TradingView username submission page
* Pending approval page
* Onboarding page
* FAQ section
* Feedback page

Tone:
Premium, calm, fintech, clean, direct.
Not hype.
Not crypto-bro.
Not “get rich.”
No financial advice language.

3. docs/beta-access/email-templates.md

Create email templates for:

* Beta signup received
* Payment received / test payment complete
* TradingView username received
* Access pending
* Access granted
* Feedback request after 3 days
* Changelog/update email
* Payment failed / cancelled
* Beta access revoked / expired

Each email should include:

* Subject
* Body
* CTA
* Notes for personalization

4. docs/beta-access/tradingview-onboarding.md

Create the complete user guide:

* How to create/open a TradingView account
* Where to enter TradingView username
* How invite-only indicator access works
* What the user should expect after payment
* How to add the indicator to chart
* How to save the layout
* How to use RangeClarity responsibly
* What RangeClarity does not do
* Troubleshooting section
* Placeholders for affiliate link

Important:
Use placeholder:
[TRADINGVIEW_AFFILIATE_LINK_HERE]

5. docs/beta-access/beta-faq.md

Create FAQ covering:

* What is RangeClarity?
* Is this a buy/sell signal tool?
* Does it predict price?
* Do I need TradingView?
* Do I need a paid TradingView plan?
* How do I get access?
* How long does manual approval take?
* What markets does it support?
* What is included in beta?
* Can I cancel?
* Is this financial advice?
* How do I give feedback?

6. docs/beta-access/admin-checklist.md

Create founder/admin workflow:

* Check new signup
* Verify payment/test payment
* Copy TradingView username
* Grant invite-only indicator access manually
* Mark user as access_granted
* Send access granted email
* Follow up after 3 days
* Track feedback
* Track bugs
* Revoke access if needed

7. docs/beta-access/qa-test-plan.md

Create QA checklist:

* Landing page CTA works
* Signup form works
* TradingView username is required
* Email validation works
* Payment success route works
* Payment cancelled route works
* Onboarding page works
* Affiliate link placeholder exists
* Mobile layout
* Desktop layout
* Legal/disclaimer copy visible
* No buy/sell or profit-promise language
* Full test user journey

8. docs/beta-access/sprint-board.md

Create a practical task board for Sprint 1:

Sprint name:
Paid Beta Access Loop

Dates:
June 20, 2026 – July 7, 2026

Columns:

* Backlog
* Now
* In Progress
* Review
* Done

Prioritize tasks by:
P0 = must have for beta
P1 = important
P2 = later

The most important P0 tasks:

* Beta signup CTA
* Signup form
* TradingView username capture
* Payment/test-payment placeholder or sandbox plan
* Pending approval page
* Onboarding guide
* Admin manual approval checklist
* Feedback form
* Legal disclaimer
* QA full flow

9. docs/beta-access/data-model-draft.md

Create a simple draft data model:
User/BetaLead:

* id
* name
* email
* tradingViewUsername
* hasTradingViewAccount
* marketFocus
* paymentStatus
* accessStatus
* plan
* source
* notes
* adminNotes
* createdAt
* updatedAt

Payment:

* id
* userId
* provider
* providerCustomerId
* providerPaymentId
* status
* amount
* currency
* createdAt

Feedback:

* id
* userId
* rating
* comment
* bugReport
* requestedFeature
* createdAt

10. docs/beta-access/implementation-ticket-pack.md

Create implementation tickets for Claude Code.

Each ticket should include:

* Title
* Priority
* Goal
* Files likely affected
* Acceptance criteria
* Risk
* Dependencies

Split into:

* P0 tickets
* P1 tickets
* P2 tickets

11. docs/beta-access/README.md

Summarize:

* What was created
* Why it exists
* How Claude Code should use these docs
* What should be built first
* What should not be built yet

After finishing, print:

* Files created
* Biggest recommendation
* What Claude Code should build first
* What should wait
* Any assumptions made
* Any questions/blockers

Remember:
You are preparing the beta system foundation.
Do not overbuild.
Do not make risky production changes.
Do not enable real money payments.
