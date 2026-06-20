import type { CheckoutResult, PaymentProvider } from "../types";
import { ProviderNotConfiguredError } from "../types";

/**
 * Paddle integration slot — NOT implemented (no live payments yet).
 *
 * To wire later:
 *  1. Set PADDLE_API_KEY + PADDLE_PRICE_ID (+ PADDLE_ENV=sandbox|production).
 *  2. Implement createCheckout (Paddle Billing) and return a redirect URL or
 *     hand the client a Paddle.js transaction token.
 *  3. Add a /api/webhooks/paddle handler to mark signups paid.
 */
export const paddleProvider: PaymentProvider = {
  id: "paddle",
  label: "Paddle",
  isConfigured: () =>
    Boolean(process.env.PADDLE_API_KEY && process.env.PADDLE_PRICE_ID),
  async createCheckout(): Promise<CheckoutResult> {
    throw new ProviderNotConfiguredError(
      "paddle",
      "Set PADDLE_* env vars and implement createCheckout in lib/payments/providers/paddle.ts.",
    );
  },
};
