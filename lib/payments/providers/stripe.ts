import type { CheckoutResult, PaymentProvider } from "../types";
import { ProviderNotConfiguredError } from "../types";

/**
 * Stripe integration slot — NOT implemented (no live payments yet).
 *
 * To wire later:
 *  1. Set STRIPE_SECRET_KEY + STRIPE_PRICE_ID (use test keys first).
 *  2. Implement createCheckout via Stripe Checkout Sessions and return
 *     { mode: "redirect", provider: "stripe", url: session.url }.
 *  3. Add a /api/webhooks/stripe handler (checkout.session.completed) to mark paid.
 */
export const stripeProvider: PaymentProvider = {
  id: "stripe",
  label: "Stripe",
  isConfigured: () =>
    Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID),
  async createCheckout(): Promise<CheckoutResult> {
    throw new ProviderNotConfiguredError(
      "stripe",
      "Set STRIPE_* env vars and implement createCheckout in lib/payments/providers/stripe.ts.",
    );
  },
};
