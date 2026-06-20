import type { CheckoutResult, PaymentProvider } from "../types";
import { ProviderNotConfiguredError } from "../types";

/**
 * Lemon Squeezy integration slot — NOT implemented (no live payments yet).
 *
 * To wire later:
 *  1. Set LEMONSQUEEZY_API_KEY + LEMONSQUEEZY_STORE_ID + LEMONSQUEEZY_VARIANT_ID.
 *  2. Implement createCheckout to call the Lemon Squeezy "create checkout" API
 *     and return { mode: "redirect", provider: "lemonsqueezy", url }.
 *  3. Add a /api/webhooks/lemonsqueezy handler to mark signups paid.
 */
export const lemonSqueezyProvider: PaymentProvider = {
  id: "lemonsqueezy",
  label: "Lemon Squeezy",
  isConfigured: () =>
    Boolean(
      process.env.LEMONSQUEEZY_API_KEY &&
        process.env.LEMONSQUEEZY_STORE_ID &&
        process.env.LEMONSQUEEZY_VARIANT_ID,
    ),
  async createCheckout(): Promise<CheckoutResult> {
    throw new ProviderNotConfiguredError(
      "lemonsqueezy",
      "Set LEMONSQUEEZY_* env vars and implement createCheckout in lib/payments/providers/lemonsqueezy.ts.",
    );
  },
};
