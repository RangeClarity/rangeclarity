import type { SelectedPlan } from "./types";

const STANDARD_CHECKOUT_LINK =
  "https://rangeclarity.lemonsqueezy.com/checkout/buy/521660a9-eb79-4591-ad64-a17a485f2f67";
const EXTENDED_CHECKOUT_LINK =
  "https://rangeclarity.lemonsqueezy.com/checkout/buy/cb19a9f5-5379-4c27-a437-49f6be9dad8e";

export type PlanConfig = {
  id: SelectedPlan;
  label: string;
  price: string;
  /** true => a paid plan that needs a payment link / manual confirmation. */
  paid: boolean;
  /** Hosted checkout link returned by the manual beta flow. */
  manualPaymentLink: string | null;
  blurb: string;
};

/**
 * The three live tiers. Paid checkout links are fixed here so stale local or
 * deployed env values cannot point customers to old Lemon Squeezy products.
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
    label: "Beta Access — Standard",
    price: "$29.90",
    paid: true,
    manualPaymentLink: STANDARD_CHECKOUT_LINK,
    blurb:
      "Core beta access to the RangeClarity TradingView indicator.",
  },
  pro_beta_49: {
    id: "pro_beta_49",
    label: "Extended Access",
    price: "$49.90",
    paid: true,
    manualPaymentLink: EXTENDED_CHECKOUT_LINK,
    blurb:
      "Extended beta access with priority updates, deeper setup guidance, and early access to upcoming RangeClarity improvements.",
  },
};

export const DEFAULT_PLAN: SelectedPlan = "beta_29";

export function normalizePlan(raw: unknown): SelectedPlan {
  return raw === "free_preview" || raw === "beta_29" || raw === "pro_beta_49"
    ? raw
    : DEFAULT_PLAN;
}
