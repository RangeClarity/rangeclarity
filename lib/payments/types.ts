/**
 * Payment provider abstraction for the RangeClarity paid beta.
 *
 * Founder direction:
 *  - NOT hardcoded around one provider. Default provider is `manual`.
 *  - Integration slots exist for Lemon Squeezy, Paddle, Whop, Stripe (no live pay).
 *  - Plans align with the existing pricing: free_preview ($0), beta_29 ($29, primary),
 *    pro_beta_49 ($49). Paid plans use manual payment-link placeholders for now.
 *
 * Switch active provider with the PAYMENT_PROVIDER env var (defaults to "manual").
 */
export type PaymentProviderId =
  | "manual"
  | "lemonsqueezy"
  | "paddle"
  | "whop"
  | "stripe";

export const PAYMENT_PROVIDER_IDS: PaymentProviderId[] = [
  "manual",
  "lemonsqueezy",
  "paddle",
  "whop",
  "stripe",
];

/** Existing pricing tiers -> internal plan slugs. */
export type SelectedPlan = "free_preview" | "beta_29" | "pro_beta_49";

/** Where a signup sits in the manual fulfilment pipeline. */
export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";

export type CheckoutRequest = {
  signupId: string;
  email: string;
  plan: SelectedPlan;
};

/**
 * Result of starting a checkout. Hosted providers return a redirect URL; the
 * manual provider returns a "pending review" acknowledgement (plus, for paid
 * plans, the manual payment-link placeholder to share with the buyer).
 */
export type CheckoutResult =
  | { mode: "redirect"; provider: PaymentProviderId; url: string }
  | {
      mode: "manual";
      provider: PaymentProviderId;
      status: "pending_manual_review";
      plan: SelectedPlan;
      paid: boolean;
      paymentLink: string | null;
      message: string;
    };

export interface PaymentProvider {
  readonly id: PaymentProviderId;
  readonly label: string;
  isConfigured(): boolean;
  createCheckout(req: CheckoutRequest): Promise<CheckoutResult>;
}

export class ProviderNotConfiguredError extends Error {
  constructor(public readonly providerId: PaymentProviderId, hint: string) {
    super(`Payment provider "${providerId}" is not configured yet. ${hint}`);
    this.name = "ProviderNotConfiguredError";
  }
}
