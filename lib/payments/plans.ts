import type { SelectedPlan } from "./types";

const DEFAULT_BETA_29_PAYMENT_LINK =
  "https://rangeclarity.lemonsqueezy.com/checkout/buy/0f5fcd29-b83d-421c-aafb-1c1357ecb484";
const DEFAULT_PRO_BETA_49_PAYMENT_LINK =
  "https://rangeclarity.lemonsqueezy.com/checkout/buy/5a6c5b6a-3222-47b1-9bd2-761767438f17";

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
    label: "Beta Access — Standard",
    price: "$29.90",
    paid: true,
    manualPaymentLink:
      process.env.MANUAL_PAYMENT_LINK_29 ?? DEFAULT_BETA_29_PAYMENT_LINK,
    blurb:
      "Core beta access to the RangeClarity TradingView indicator.",
  },
  pro_beta_49: {
    id: "pro_beta_49",
    label: "Extended Access",
    price: "$49.90",
    paid: true,
    manualPaymentLink:
      process.env.MANUAL_PAYMENT_LINK_49 ?? DEFAULT_PRO_BETA_49_PAYMENT_LINK,
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
