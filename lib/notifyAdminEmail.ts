/**
 * Email via the Resend HTTP API (no SDK dependency).
 * Missing or rejected email configuration is reported to the caller.
 */
import type { FreeAccessRequest } from "@/lib/freeAccessStore";
import type { BetaSignup } from "@/lib/betaStore";
import { PLAN_CONFIG } from "@/lib/payments/plans";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_ADMIN_NOTIFICATION_EMAIL = "dean7lich@gmail.com";
const DEFAULT_SITE_URL = "https://rangeclarity.com";

export type SendResult = { sent: boolean; skipped?: string; error?: string };

type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type AdminFreeAccessEmailContext = {
  environment: string;
  storedLocally: boolean;
  storageStatus: string;
  userConfirmation: SendResult;
  userAgent?: string;
};

function envValue(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function siteUrl() {
  const explicit = envValue("NEXT_PUBLIC_SITE_URL") ?? envValue("SITE_URL");
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercelUrl = envValue("VERCEL_URL");
  if (vercelUrl) return `https://${vercelUrl.replace(/\/+$/, "")}`;
  return DEFAULT_SITE_URL;
}

function emailLogoUrl() {
  return envValue("EMAIL_LOGO_URL") ?? `${siteUrl()}/brand/fox-badge.png`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function optional(value: string | undefined) {
  return value?.trim() || "(not provided)";
}

function sendResultLabel(result: SendResult) {
  if (result.sent) return "sent";
  return result.error ?? result.skipped ?? "not sent";
}

function planLabel(plan: string) {
  return plan in PLAN_CONFIG
    ? `${PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG].label} (${PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG].price})`
    : plan;
}

async function send({ to, subject, text, html }: EmailPayload): Promise<SendResult> {
  const key = envValue("RESEND_API_KEY");
  const from = envValue("EMAIL_FROM") ?? envValue("RESEND_FROM");
  if (!key) return { sent: false, skipped: "RESEND_API_KEY not set (dry-run)" };
  if (!from) return { sent: false, skipped: "EMAIL_FROM not set" };
  if (!to) return { sent: false, skipped: "recipient missing" };
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text, html }),
    });
    if (!res.ok) {
      const detail = (await res.text().catch(() => "")).trim().slice(0, 500);
      return {
        sent: false,
        error: detail ? `Resend HTTP ${res.status}: ${detail}` : `Resend HTTP ${res.status}`,
      };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "send failed" };
  }
}

export function notifyAdminFreeAccess(
  req: FreeAccessRequest,
  context: AdminFreeAccessEmailContext,
): Promise<SendResult> {
  const admin = envValue("ADMIN_NOTIFICATION_EMAIL") ?? DEFAULT_ADMIN_NOTIFICATION_EMAIL;
  const subject = "New RangeClarity 7-Day Free Access Request";
  const consent = req.consentAccepted ? "Yes" : "Unknown";
  const userConfirmationStatus = sendResultLabel(context.userConfirmation);
  const body = [
    "New RangeClarity 7-Day Free Access request.",
    "",
    `User email: ${req.email}`,
    `TradingView username: ${req.tradingViewUsername}`,
    `Full name: ${optional(req.fullName)}`,
    `Note: ${optional(req.note)}`,
    `Timestamp: ${req.createdAt}`,
    `Consent accepted: ${consent}`,
    `Source: ${req.source ?? "free-access"}`,
    `Selected plan: ${req.selectedPlan}`,
    `Signup type: ${req.signupType}`,
    `Environment: ${context.environment}`,
    `User agent: ${optional(context.userAgent ?? req.userAgent)}`,
    `Local dev audit record: ${context.storedLocally ? "written" : "not written"} (${context.storageStatus})`,
    `User confirmation email: ${userConfirmationStatus}`,
    "",
    "ACTION: Manually add this TradingView username to the RangeClarity invite-only TradingView indicator.",
  ].join("\n");
  const html = `
    <div style="margin:0;background:#05080d;color:#e7eef8;font-family:Inter,Arial,sans-serif;padding:28px;">
      <div style="max-width:640px;margin:0 auto;border:1px solid #173042;border-radius:18px;overflow:hidden;background:#080d15;">
        <div style="padding:24px 26px;border-bottom:1px solid #173042;">
          <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#35f0d0;">RangeClarity Admin</div>
          <h1 style="margin:10px 0 0;font-size:24px;line-height:1.25;color:#ffffff;">New free access request</h1>
        </div>
        <div style="padding:24px 26px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.55;">
            <tr><td style="padding:8px 0;color:#91a4b8;">Email</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(req.email)}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">TradingView username</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(req.tradingViewUsername)}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Full name</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(optional(req.fullName))}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Note</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(optional(req.note))}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Timestamp</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(req.createdAt)}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Consent accepted</td><td style="padding:8px 0;color:#ffffff;">${consent}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Source</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(req.source ?? "free-access")}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Selected plan</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(req.selectedPlan)}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Signup type</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(req.signupType)}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Environment</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(context.environment)}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">User agent</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(optional(context.userAgent ?? req.userAgent))}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Local dev audit record</td><td style="padding:8px 0;color:#ffffff;">${context.storedLocally ? "written" : "not written"} (${escapeHtml(context.storageStatus)})</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">User confirmation email</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(userConfirmationStatus)}</td></tr>
          </table>
          <p style="margin:22px 0 0;padding:14px 16px;border-radius:12px;background:#0e1724;color:#d8e7f5;">
            Action: manually add this TradingView username to the RangeClarity invite-only TradingView indicator.
          </p>
        </div>
      </div>
    </div>
  `;
  return send({ to: admin, subject, text: body, html });
}

export function confirmUserFreeAccess(req: FreeAccessRequest): Promise<SendResult> {
  const subject = "Welcome to RangeClarity — Request Received";
  const body = [
    "Hi,",
    "",
    "Thanks for requesting 7-Day Free Access to RangeClarity.",
    "",
    "We received your TradingView username:",
    req.tradingViewUsername,
    "",
    "RangeClarity is an invite-only TradingView indicator, so access is reviewed and added manually during beta.",
    "If your TradingView username is correct, we aim to review eligible requests within 24-48 hours.",
    "Your 7-day access begins once your TradingView invite is added.",
    "",
    "Please make sure your TradingView username is exact. If there is a mistake, reply to this email with the correct username.",
    "",
    "RangeClarity is a market-structure visualization tool. It does not provide financial advice, buy/sell signals, predictions, or guaranteed results.",
    "",
    "Thanks,",
    "RangeClarity",
  ].join("\n");
  const safeUsername = escapeHtml(req.tradingViewUsername);
  const html = `
    <div style="margin:0;background:#03070c;color:#e8f2fb;font-family:Inter,Arial,sans-serif;padding:32px 18px;">
      <div style="max-width:620px;margin:0 auto;border:1px solid #183348;border-radius:22px;overflow:hidden;background:linear-gradient(180deg,#0b121d 0%,#060a10 100%);">
        <div style="padding:30px 28px 20px;text-align:center;border-bottom:1px solid #183348;">
          <img src="${escapeHtml(emailLogoUrl())}" alt="RangeClarity" width="72" height="72" style="display:block;margin:0 auto 16px;border-radius:18px;" />
          <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#35f0d0;">Request received</div>
          <h1 style="margin:10px 0 0;font-size:28px;line-height:1.18;color:#ffffff;">Welcome to RangeClarity</h1>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#d7e5f2;">Thanks for requesting 7-Day Free Access to RangeClarity.</p>
          <div style="margin:18px 0;padding:16px;border-radius:14px;background:#0c1622;border:1px solid #1d3a50;">
            <div style="font-size:12px;letter-spacing:0.13em;text-transform:uppercase;color:#91a4b8;">TradingView username received</div>
            <div style="margin-top:6px;font-size:18px;color:#ffffff;font-weight:700;">${safeUsername}</div>
          </div>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#c8d6e3;">
            RangeClarity is an invite-only TradingView indicator. Access is reviewed manually during beta, and eligible users are usually added within 24-48 hours.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#c8d6e3;">
            Your 7-day access begins once your TradingView invite is added. If the username above is not exact, reply to this email with the correct TradingView username.
          </p>
          <p style="margin:20px 0 0;padding:14px 16px;border-radius:14px;background:#071018;color:#9fb1c3;font-size:13px;line-height:1.55;">
            RangeClarity is an educational market-structure visualization tool. No financial advice. No buy/sell signals. No predictions. No guaranteed results.
          </p>
        </div>
      </div>
    </div>
  `;
  return send({ to: req.email, subject, text: body, html });
}

export type AdminBetaSignupEmailContext = {
  environment: string;
  storedLocally: boolean;
  storageStatus: string;
  userConfirmation: SendResult;
  userAgent?: string;
};

export function confirmUserBetaSignup(signup: BetaSignup): Promise<SendResult> {
  const subject = "Welcome to RangeClarity — Request Received";
  const body = [
    "Hi,",
    "",
    "Thanks for requesting access to the RangeClarity beta.",
    "",
    `Selected plan: ${planLabel(signup.selectedPlan)}`,
    `TradingView username received: ${signup.tradingViewUsername}`,
    "",
    "RangeClarity beta access is reviewed manually.",
    "Eligible users are manually added within 24-48 hours during beta.",
    "Your TradingView access begins once your invite is added.",
    "",
    "RangeClarity is an educational market-structure visualization tool. No financial advice, no buy/sell signals, no predictions, no guaranteed results.",
    "",
    "Thanks,",
    "RangeClarity",
  ].join("\n");
  const html = `
    <div style="margin:0;background:#03070c;color:#e8f2fb;font-family:Inter,Arial,sans-serif;padding:32px 18px;">
      <div style="max-width:620px;margin:0 auto;border:1px solid #183348;border-radius:22px;overflow:hidden;background:linear-gradient(180deg,#0b121d 0%,#060a10 100%);">
        <div style="padding:30px 28px 20px;text-align:center;border-bottom:1px solid #183348;">
          <img src="${escapeHtml(emailLogoUrl())}" alt="RangeClarity" width="72" height="72" style="display:block;margin:0 auto 16px;border-radius:18px;" />
          <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#35f0d0;">Request received</div>
          <h1 style="margin:10px 0 0;font-size:28px;line-height:1.18;color:#ffffff;">Welcome to RangeClarity</h1>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#d7e5f2;">Thanks for requesting access to the RangeClarity beta.</p>
          <div style="margin:18px 0;padding:16px;border-radius:14px;background:#0c1622;border:1px solid #1d3a50;">
            <div style="font-size:12px;letter-spacing:0.13em;text-transform:uppercase;color:#91a4b8;">Selected plan</div>
            <div style="margin-top:6px;font-size:18px;color:#ffffff;font-weight:700;">${escapeHtml(planLabel(signup.selectedPlan))}</div>
            <div style="margin-top:14px;font-size:12px;letter-spacing:0.13em;text-transform:uppercase;color:#91a4b8;">TradingView username received</div>
            <div style="margin-top:6px;font-size:18px;color:#ffffff;font-weight:700;">${escapeHtml(signup.tradingViewUsername)}</div>
          </div>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#c8d6e3;">
            Access is reviewed manually during beta. Eligible users are manually added within 24-48 hours.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#c8d6e3;">
            Your TradingView access begins once your invite is added. If your TradingView username is not exact, reply to this email with the correct username.
          </p>
          <p style="margin:20px 0 0;padding:14px 16px;border-radius:14px;background:#071018;color:#9fb1c3;font-size:13px;line-height:1.55;">
            RangeClarity is an educational market-structure visualization tool. No financial advice. No buy/sell signals. No predictions. No guaranteed results.
          </p>
        </div>
      </div>
    </div>
  `;
  return send({ to: signup.email, subject, text: body, html });
}

export function notifyAdminBetaSignup(
  signup: BetaSignup,
  context: AdminBetaSignupEmailContext,
): Promise<SendResult> {
  const admin = envValue("ADMIN_NOTIFICATION_EMAIL") ?? DEFAULT_ADMIN_NOTIFICATION_EMAIL;
  const subject = "New RangeClarity Beta Signup";
  const consent = signup.consentAccepted ? "Yes" : "Unknown";
  const userConfirmationStatus = sendResultLabel(context.userConfirmation);
  const body = [
    "New RangeClarity beta signup.",
    "",
    `Email: ${signup.email}`,
    `TradingView username: ${signup.tradingViewUsername}`,
    `Full name: ${optional(signup.name)}`,
    `Selected plan: ${planLabel(signup.selectedPlan)}`,
    `Signup type: ${signup.signupType}`,
    `Note: ${optional(signup.notes)}`,
    `Timestamp: ${signup.createdAt}`,
    `Consent accepted: ${consent}`,
    `Source: ${signup.source ?? "beta-landing"}`,
    `Environment: ${context.environment}`,
    `User agent: ${optional(context.userAgent ?? signup.userAgent)}`,
    `Local dev audit record: ${context.storedLocally ? "written" : "not written"} (${context.storageStatus})`,
    `User confirmation email: ${userConfirmationStatus}`,
    "",
    "ACTION: manually review the signup and grant eligible TradingView invite-only access when appropriate.",
  ].join("\n");
  const html = `
    <div style="margin:0;background:#05080d;color:#e7eef8;font-family:Inter,Arial,sans-serif;padding:28px;">
      <div style="max-width:680px;margin:0 auto;border:1px solid #173042;border-radius:18px;overflow:hidden;background:#080d15;">
        <div style="padding:24px 26px;border-bottom:1px solid #173042;">
          <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#35f0d0;">RangeClarity Admin</div>
          <h1 style="margin:10px 0 0;font-size:24px;line-height:1.25;color:#ffffff;">New beta signup</h1>
        </div>
        <div style="padding:24px 26px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.55;">
            <tr><td style="padding:8px 0;color:#91a4b8;">Email</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(signup.email)}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">TradingView username</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(signup.tradingViewUsername)}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Full name</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(optional(signup.name))}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Selected plan</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(planLabel(signup.selectedPlan))}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Signup type</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(signup.signupType)}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Note</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(optional(signup.notes))}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Timestamp</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(signup.createdAt)}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Consent accepted</td><td style="padding:8px 0;color:#ffffff;">${consent}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Source</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(signup.source ?? "beta-landing")}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Environment</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(context.environment)}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">User agent</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(optional(context.userAgent ?? signup.userAgent))}</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">Local dev audit record</td><td style="padding:8px 0;color:#ffffff;">${context.storedLocally ? "written" : "not written"} (${escapeHtml(context.storageStatus)})</td></tr>
            <tr><td style="padding:8px 0;color:#91a4b8;">User confirmation email</td><td style="padding:8px 0;color:#ffffff;">${escapeHtml(userConfirmationStatus)}</td></tr>
          </table>
          <p style="margin:22px 0 0;padding:14px 16px;border-radius:12px;background:#0e1724;color:#d8e7f5;">
            Action: manually review the signup and grant eligible TradingView invite-only access when appropriate.
          </p>
        </div>
      </div>
    </div>
  `;
  return send({ to: admin, subject, text: body, html });
}
