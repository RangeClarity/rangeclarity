/**
 * Best-effort email via the Resend HTTP API (no SDK dependency).
 * If RESEND_API_KEY is not set, this NO-OPS (dry-run) and never throws.
 * Sending email must never block or break a signup.
 */
import type { FreeAccessRequest } from "@/lib/freeAccessStore";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_ADMIN_NOTIFICATION_EMAIL = "dean7lich@gmail.com";
const DEFAULT_EMAIL_FROM = "RangeClarity <onboarding@resend.dev>";

export type SendResult = { sent: boolean; skipped?: string; error?: string };

async function send(to: string, subject: string, text: string): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? process.env.RESEND_FROM ?? DEFAULT_EMAIL_FROM;
  if (!key) return { sent: false, skipped: "RESEND_API_KEY not set (dry-run)" };
  if (!to) return { sent: false, skipped: "recipient missing" };
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text }),
    });
    if (!res.ok) return { sent: false, error: `Resend HTTP ${res.status}` };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "send failed" };
  }
}

export function notifyAdminFreeAccess(req: FreeAccessRequest): Promise<SendResult> {
  const admin = process.env.ADMIN_NOTIFICATION_EMAIL ?? DEFAULT_ADMIN_NOTIFICATION_EMAIL;
  if (!admin) return Promise.resolve({ sent: false, skipped: "ADMIN_NOTIFICATION_EMAIL not set (dry-run)" });
  const body = [
    "New RangeClarity 7-Day Free Access request.",
    "",
    `User email: ${req.email}`,
    `TradingView username: ${req.tradingViewUsername}`,
    ...(req.fullName ? [`Full name: ${req.fullName}`] : []),
    ...(req.note ? [`Note: ${req.note}`] : []),
    `Timestamp: ${req.createdAt}`,
    `Source: ${req.source ?? "free-access"}`,
    "",
    "ACTION: Manually add this TradingView username to the RangeClarity invite-only TradingView indicator.",
  ].join("\n");
  return send(admin, "New RangeClarity 7-Day Free Access Request", body);
}

export function confirmUserFreeAccess(req: FreeAccessRequest): Promise<SendResult> {
  const body = [
    "Hi,",
    "",
    "Thanks for requesting 7-Day Free Access to RangeClarity.",
    "",
    "We received your TradingView username:",
    req.tradingViewUsername,
    "",
    "RangeClarity is an invite-only TradingView indicator, so access is added manually during beta.",
    "If your TradingView username is correct, we aim to activate your access within 24 hours.",
    "",
    "Please make sure your TradingView username is exact. If there is a mistake, reply to this email with the correct username.",
    "",
    "RangeClarity is a market-structure visualization tool. It does not provide financial advice, buy/sell signals, predictions, or guaranteed results.",
    "",
    "Thanks,",
    "RangeClarity",
  ].join("\n");
  return send(req.email, "RangeClarity Free Access Request Received", body);
}
