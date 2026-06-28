import type { SelectedPlan } from "./types";

const DEFAULT_BETA_29_PAYMENT_LINK =
  "https://rangeclarity.lemonsqueezy.com/checkout/buy/521660a9-eb79-4591-ad64-a17a485f2f67";
const DEFAULT_PRO_BETA_49_PAYMENT_LINK =
  "https://rangeclarity.lemonsqueezy.com/checkout/buy/cb19a9f5-5379-4c27-a437-49f6be9dad8e";

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
    label: "RangeClarity Beta",
    price: "$29/mo",
    paid: true,
    manualPaymentLink:
      process.env.MANUAL_PAYMENT_LINK_29 ?? DEFAULT_BETA_29_PAYMENT_LINK,
    blurb:
      "Core beta access to the RangeClarity TradingView indicator.",
  },
  pro_beta_49: {
    id: "pro_beta_49",
    label: "RangeClarity Pro Beta",
    price: "$49/mo",
    paid: true,
    manualPaymentLink:
      process.env.MANUAL_PAYMENT_LINK_49 ?? DEFAULT_PRO_BETA_49_PAYMENT_LINK,
    blurb:
      "Pro Beta access with priority updates, deeper setup guidance, and early access to upcoming RangeClarity improvements.",
  },
};

export const DEFAULT_PLAN: SelectedPlan = "beta_29";

export function normalizePlan(raw: unknown): SelectedPlan {
  return raw === "free_preview" || raw === "beta_29" || raw === "pro_beta_49"
    ? raw
    : DEFAULT_PLAN;
}
