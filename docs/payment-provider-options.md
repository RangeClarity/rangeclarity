# Payment Provider Options for RangeClarity

## Goal

Choose the simplest first payment setup for a manual paid/private beta. The goal is not to build billing infrastructure. The goal is to validate willingness to pay while keeping access manual and operational risk low.

Current beta decision: use a manual invoice or manual payment link first. Do not implement a full payment provider yet and do not enable automated live payments yet.

## RangeClarity Requirements

For the first beta, the payment setup should support:

- One simple paid beta offer: Founding Beta Access, $79 for 90 days.
- Manual approval after payment.
- Easy payment confirmation.
- Minimal engineering.
- Clear refund/cancellation handling.
- No need for user accounts yet.
- No automated TradingView access yet.
- Future provider readiness for `manual`, `stripe`, `paddle`, and `lemon_squeezy`.

## Option 1: Manual Payment Links / Manual Invoice

**Fit:** Best first beta choice for RangeClarity now.

**Why it fits:** The first goal is not payment automation. The first goal is to prove that a real user understands the offer, pays, submits their TradingView username, receives access, and gets value from the indicator.

**Pros:**

- Fastest validation path.
- No code.
- No payment infrastructure work.
- Founder can approve each beta user manually.
- Keeps focus on onboarding and product feedback.
- Works for the first small group before choosing a provider.

**Cons:**

- Not scalable.
- Manual reconciliation required.
- Can feel less polished.
- Receipts, refunds, and recordkeeping must be handled carefully.

**Best use for RangeClarity now:**

Use for the first paid/private beta. Keep `paymentProvider = manual`, manually verify `paymentStatus`, then manually grant TradingView invite-only access.

## Option 2: Paddle

**Fit:** Strong later candidate if merchant-of-record support and global digital sales handling become important.

**Pros:**

- Strong for software/SaaS-style digital products.
- Merchant-of-record model can simplify tax complexity.
- Supports subscriptions and global payments.
- Good candidate if RangeClarity becomes an international subscription product.

**Cons:**

- More setup and review overhead than a simple first beta needs.
- More platform complexity than manual beta validation requires.
- May slow down launch if the first goal is simply to test paid demand.

**Best use for RangeClarity now:**

Do not start here for the first beta. Test Paddle later if manual beta proves demand and global tax/payment handling becomes important.

## Option 3: Lemon Squeezy

**Fit:** Strong later candidate for digital product sales, but still more than needed for first manual validation.

**Pros:**

- Designed for digital products and software.
- Often simpler than building a full custom checkout.
- Can handle checkout, subscriptions, and digital-product workflows.
- May be attractive for a solo founder.

**Cons:**

- Still requires provider setup and policy review.
- Need to confirm TradingView indicator access fits their product/compliance expectations.
- Manual access still needs a separate admin process.

**Best use for RangeClarity now:**

Do not start here for the first beta. Test Lemon Squeezy later alongside or before Paddle if a merchant-of-record style setup is useful.

## Option 4: Stripe Payment Links

**Fit:** Useful option later if Stripe account, tax, legal, and business setup are confirmed.

**Why it fits later:** Stripe Payment Links can create a hosted checkout page without writing payment code. Stripe documents Payment Links as a no-code way to accept payments online, with shareable links, hosted checkout, payment methods, receipts, and refunds managed from the dashboard.

**Pros:**

- Fast to set up once the Stripe account is ready.
- No custom checkout code required.
- Can support one-time or subscription-style beta offers.
- Familiar checkout.
- Manual payment verification is easy from the dashboard.
- Can grow into proper Stripe integration later.

**Cons:**

- Tax/VAT/accounting details still need proper setup.
- Requires Stripe account approval.
- Checkout branding is limited compared with a custom flow.
- Stripe should not be treated as the default until business setup is confirmed.
- Webhook automation should wait until beta proves the path.

**Best use for RangeClarity now:**

Keep Stripe as an option, but do not start with it. Revisit after manual beta validation and business setup review.

## Option 5: Whop

**Fit:** Strong if RangeClarity wants a creator/product storefront, paid community, or membership-style distribution layer.

**Pros:**

- Built around digital product and membership sales.
- Has marketplace/distribution/community-adjacent features.
- Whop's public seller page highlights checkout links or embedded checkout, local payment methods, marketplace, affiliates, and support.
- Could fit a later RangeClarity community/membership motion.

**Cons:**

- May pull the product toward a creator/community storefront before the core TradingView workflow is proven.
- Marketplace context may be noisier than RangeClarity's premium, calm positioning.
- More platform surface than the first manual beta needs.

**Best use for RangeClarity now:**

Defer unless the first paid beta is intentionally packaged as a Whop membership.

## Recommendation

**Recommended simplest first setup: manual invoice or manual payment link.**

Use one manual paid beta process for Founding Beta Access at $79 for 90 days, then manually collect/verify:

1. Payment status.
2. Email.
3. TradingView username.
4. Manual TradingView access.
5. Feedback after 3 days.

Later provider test order:

1. Lemon Squeezy or Paddle first, because merchant-of-record handling may be useful for a global digital software product.
2. Stripe remains an option after legal, tax, and business setup are confirmed.
3. Whop remains a later option only if a creator storefront or membership layer becomes strategically useful.

## Do Not Build Yet

- Custom checkout.
- Payment webhooks.
- Subscription management UI.
- Customer portal.
- Automated access grants.
- Multi-tier pricing.
- Affiliate program.

## Internal Status Fields

For the current beta:

- `paymentProvider = manual`
- `paymentStatus = pending | paid | failed | refunded`
- `accessStatus = pending | granted | revoked`
- `tradingViewUsername` is required before access can be granted.

## Verification Before Launch

- Confirm exact provider fees.
- Confirm tax handling.
- Confirm refund/cancellation process.
- Confirm terms allow TradingView indicator access / digital beta access.
- Confirm whether the provider supports the user's country and payout needs.

## Sources Checked

- Stripe Payment Links documentation: https://docs.stripe.com/payment-links
- Whop seller/product page: https://whop.com/sell
