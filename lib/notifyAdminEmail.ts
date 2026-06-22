/**
 * Best-effort email via the Resend HTTP API (no SDK dependency).
 * If RESEND_API_KEY / ADMIN_NOTIFICATION_EMAIL are not set, this NO-OPS (dry-run)
 * and never throws — sending email must never block or break a signup.
 */
import type { FreeAccessRequest } from "@/lib/freeAccessStore";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SendResult = { sent: boolean; skipped?: string; error?: string };

async function send(to: string, subject: string, text: string): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "RangeClarity <onboarding@resend.dev>";
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
  const admin = process.env.ADMIN_NOTIFICATION_EMAIL ?? "";
  if (!admin) return Promise.resolve({ sent: false, skipped: "ADMIN_NOTIFICATION_EMAIL not set (dry-run)" });
  const body = [
    "New RangeClarity 7-Day Free Access request.",
    "",
    `Email: ${req.email}`,
    `TradingView username: ${req.tradingViewUsername}`,
    `Full name: ${req.fullName ?? "(not provided)"}`,
    `Note: ${req.note ?? "(none)"}`,
    `Timestamp: ${req.createdAt}`,
    `Source: ${req.source ?? "free-access"}`,
    "",
    "ACTION: Manually add this TradingView username to the RangeClarity invite-only TradingView indicator.",
  ].join("\n");
  return send(admin, "New RangeClarity 7-Day Free Access Request", body);
}

export function confirmUserFreeAccess(req: FreeAccessRequest): Promise<SendResult> {
  const body = [
    "Thanks - your RangeClarity 7-Day Free Access request was received.",
    "",
    "We review TradingView usernames and manually add eligible users to the",
    "RangeClarity invite-only TradingView indicator. Access may take up to 24-48",
    "hours during beta. Please make sure your TradingView username is exact:",
    `  ${req.tradingViewUsername}`,
    "",
    "RangeClarity is an educational market-structure visualization tool. It does not",
    "provide financial advice, buy/sell signals, predictions, or guaranteed results.",
  ].join("\n");
  return send(req.email, "RangeClarity - request received", body);
}
