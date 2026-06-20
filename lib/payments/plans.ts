import type { SelectedPlan } from "./types";

const DEFAULT_BETA_29_PAYMENT_LINK =
  "https://rangeclarity.lemonsqueezy.com/checkout/buy/0f5fcd29-b83d-421c-aafb-1c1357ecb484";

export type PlanConfig = {
  id: SelectedPlan;
  label: string;
  price: string;
  /** true => a paid plan that needs a payment link / manual confirmation. */
  paid: boolean;
  /** Manual payment-link placeholder; override via env when you have a real link. */
  manualPaymentLink: string | null;
  blurb: string;
};

/**
 * The three live tiers. Paid plans default to the manual placeholder strings
 * the founder will replace with real links (or set MANUAL_PAYMENT_LINK_29 / _49).
 */
export const PLAN_CONFIG: Record<SelectedPlan, PlanConfig> = {
  free_preview: {
    id: "free_preview",
    label: "Free Preview",
    price: "$0",
    paid: false,
    manualPaymentLink: null,
    blurb:
      "Docs preview, product updates, and a spot on the list. No invite-only indicator access on the free tier.",
  },
  beta_29: {
    id: "beta_29",
    label: "Beta Access",
    price: "$29",
    paid: true,
    manualPaymentLink:
      process.env.MANUAL_PAYMENT_LINK_29 ?? DEFAULT_BETA_29_PAYMENT_LINK,
    blurb:
      "Main beta access — the full RangeClarity indicator, invite-only on TradingView.",
  },
  pro_beta_49: {
    id: "pro_beta_49",
    label: "Pro Beta · Founder Access",
    price: "$49",
    paid: true,
    manualPaymentLink:
      process.env.MANUAL_PAYMENT_LINK_49 ?? "[MANUAL_PAYMENT_LINK_49_HERE]",
    blurb:
      "Everything in Beta Access, plus priority support, feedback, and early feature previews.",
  },
};

export const DEFAULT_PLAN: SelectedPlan = "beta_29";

export function normalizePlan(raw: unknown): SelectedPlan {
  return raw === "free_preview" || raw === "beta_29" || raw === "pro_beta_49"
    ? raw
    : DEFAULT_PLAN;
}
