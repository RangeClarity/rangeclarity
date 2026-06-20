import type { CheckoutRequest, CheckoutResult, PaymentProvider } from "../types";
import { PLAN_CONFIG } from "../plans";

/**
 * Manual provider — default for the first paid beta. No money moves through code.
 * Free plan => waitlist/lead capture (no invite-only access). Paid plans => record
 * payment_pending and hand back the manual payment-link placeholder; a founder then
 * confirms payment and grants TradingView access by hand (see /beta/admin).
 */
export const manualProvider: PaymentProvider = {
  id: "manual",
  label: "Manual (founder-confirmed)",
  isConfigured: () => true,
  async createCheckout(req: CheckoutRequest): Promise<CheckoutResult> {
    const cfg = PLAN_CONFIG[req.plan];
    if (!cfg.paid) {
      return {
        mode: "manual",
        provider: "manual",
        status: "pending_manual_review",
        plan: req.plan,
        paid: false,
        paymentLink: null,
        message:
          "You're on the free preview list. We'll send docs and product updates — " +
          "no invite-only indicator access is granted on the free tier.",
      };
    }
    return {
      mode: "manual",
      provider: "manual",
      status: "pending_manual_review",
      plan: req.plan,
      paid: true,
      paymentLink: cfg.manualPaymentLink,
      message:
        `Request received for ${cfg.label} (${cfg.price}). A founder will confirm ` +
        "your payment and grant invite-only TradingView access — usually within 24 hours.",
    };
  },
};
