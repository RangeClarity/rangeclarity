import type { CheckoutResult, PaymentProvider } from "../types";
import { ProviderNotConfiguredError } from "../types";

/**
 * Whop integration slot — NOT implemented (no live payments yet).
 *
 * Whop is the founder's indicated checkout (decisions.md D-002): hosted
 * checkout + invite-only TradingView + Discord onboarding. To wire later:
 *  1. Set WHOP_API_KEY + WHOP_PLAN_ID.
 *  2. Implement createCheckout to return the Whop checkout URL
 *     ({ mode: "redirect", provider: "whop", url }).
 *  3. Add a /api/webhooks/whop handler to mark signups paid + trigger access.
 */
export const whopProvider: PaymentProvider = {
  id: "whop",
  label: "Whop",
  isConfigured: () =>
    Boolean(process.env.WHOP_API_KEY && process.env.WHOP_PLAN_ID),
  async createCheckout(): Promise<CheckoutResult> {
    throw new ProviderNotConfiguredError(
      "whop",
      "Set WHOP_API_KEY / WHOP_PLAN_ID and implement createCheckout in lib/payments/providers/whop.ts.",
    );
  },
};
