/**
 * RangeClarity funnel analytics — privacy-friendly events.
 *
 * NEVER pass PII or payment data here: no email, no TradingView username, no tokens,
 * no card / payment details. Only the fixed event names below plus low-cardinality,
 * non-sensitive props (e.g. a plan id like "beta_29", or a page "source").
 *
 * The @vercel/analytics dependency is intentionally NOT used for now (it was undeclared in
 * package.json and broke the Vercel build). rcTrack is a browser-safe wrapper: if Vercel Web
 * Analytics is present on the page (window.va) it forwards the event; otherwise it is a no-op.
 * It never throws and never breaks the product flow. The typed API below is unchanged, so
 * callers (TradingViewCTA, BetaSignupForm, GrantConsole) need no changes.
 */
export type RcEvent =
  | "join_beta_click"
  | "signup_started"
  | "signup_completed"
  | "tradingview_referral_click"
  | "access_granted_click";

export function rcTrack(event: RcEvent, props?: Record<string, string>): void {
  try {
    if (typeof window === "undefined") return;
    const va = (window as unknown as {
      va?: (name: "event", payload: { name: string; data?: Record<string, string> }) => void;
    }).va;
    va?.("event", { name: event, data: props });
  } catch {
    // Analytics must never break the product flow.
  }
}
