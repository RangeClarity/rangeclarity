import type { PaymentProvider, PaymentProviderId } from "./types";
import { manualProvider } from "./providers/manual";
import { lemonSqueezyProvider } from "./providers/lemonsqueezy";
import { paddleProvider } from "./providers/paddle";
import { whopProvider } from "./providers/whop";
import { stripeProvider } from "./providers/stripe";

export const providers: Record<PaymentProviderId, PaymentProvider> = {
  manual: manualProvider,
  lemonsqueezy: lemonSqueezyProvider,
  paddle: paddleProvider,
  whop: whopProvider,
  stripe: stripeProvider,
};

export function getPaymentProvider(): PaymentProvider {
  const id = (process.env.PAYMENT_PROVIDER ?? "manual") as PaymentProviderId;
  return providers[id] ?? manualProvider;
}

export function listProviderStatus(): {
  id: PaymentProviderId;
  label: string;
  configured: boolean;
  active: boolean;
}[] {
  const activeId = getPaymentProvider().id;
  return (Object.keys(providers) as PaymentProviderId[]).map((id) => ({
    id,
    label: providers[id].label,
    configured: providers[id].isConfigured(),
    active: id === activeId,
  }));
}

export * from "./types";
export * from "./plans";
