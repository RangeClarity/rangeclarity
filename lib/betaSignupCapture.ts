import type { SendResult } from "@/lib/notifyAdminEmail";

const DEFAULT_TABLE = "beta_signups";

type CaptureEmailResult = Pick<SendResult, "sent" | "skipped" | "error">;

export type SignupCaptureInput = {
  id: string;
  email: string;
  tradingViewUsername: string;
  fullName?: string;
  selectedPlan: string;
  signupType: "paid_beta" | "free_preview" | "free_access";
  note?: string;
  consent: boolean;
  source?: string;
  environment?: string;
  userAgent?: string;
  userEmail: CaptureEmailResult;
  adminEmail: CaptureEmailResult;
  createdAt: string;
};

export type DurableCaptureResult =
  | { saved: true; provider: "supabase"; table: string }
  | { saved: false; provider: "supabase"; skipped: string }
  | { saved: false; provider: "supabase"; error: string };

function envValue(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function emailStatus(result: CaptureEmailResult) {
  if (result.sent) return "sent";
  return result.error ?? result.skipped ?? "not sent";
}

function emailError(input: SignupCaptureInput) {
  const errors = [
    input.userEmail.sent ? null : `user_email=${emailStatus(input.userEmail)}`,
    input.adminEmail.sent ? null : `admin_email=${emailStatus(input.adminEmail)}`,
  ].filter(Boolean);

  return errors.length ? errors.join("; ") : null;
}

export function hasSupabaseCaptureConfig() {
  return Boolean(envValue("SUPABASE_URL") && envValue("SUPABASE_SERVICE_ROLE_KEY"));
}

export async function saveSignupCapture(
  input: SignupCaptureInput,
): Promise<DurableCaptureResult> {
  const url = envValue("SUPABASE_URL");
  const key = envValue("SUPABASE_SERVICE_ROLE_KEY");
  const tableSetting = envValue("SUPABASE_BETA_SIGNUPS_TABLE") ?? DEFAULT_TABLE;

  if (!url || !key) {
    return {
      saved: false,
      provider: "supabase",
      skipped: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured",
    };
  }

  // Resolve schema + table from the setting (accept "beta_signups" or "public.beta_signups").
  const dot = tableSetting.indexOf(".");
  const schema = dot >= 0 ? tableSetting.slice(0, dot) : "public";
  const table = dot >= 0 ? tableSetting.slice(dot + 1) : tableSetting;
  // Accept either the Supabase project URL or a REST endpoint URL (strip trailing /rest/v1).
  const base = url.replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
  const endpoint = `${base}/rest/v1/${encodeURIComponent(table)}?on_conflict=id`;
  // Temporary diagnostics (safe: no secret values; the service key is only in headers).
  console.log(`[beta-signup] table=${table}`);
  console.log(`[beta-signup] schema=${schema}`);
  console.log(`[beta-signup] supabase endpoint=${endpoint}`);
  const row = {
    id: input.id,
    email: input.email,
    tradingview_username: input.tradingViewUsername,
    full_name: input.fullName ?? null,
    selected_plan: input.selectedPlan,
    signup_type: input.signupType,
    note: input.note ?? null,
    consent: input.consent,
    source: input.source ?? null,
    environment: input.environment ?? null,
    user_agent: input.userAgent ?? null,
    user_email_sent: input.userEmail.sent,
    admin_email_sent: input.adminEmail.sent,
    email_error: emailError(input),
    created_at: input.createdAt,
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Accept-Profile": schema,
        "Content-Profile": schema,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const detail = (await res.text().catch(() => "")).trim().slice(0, 500);
      return {
        saved: false,
        provider: "supabase",
        error: detail ? `Supabase HTTP ${res.status}: ${detail}` : `Supabase HTTP ${res.status}`,
      };
    }

    return { saved: true, provider: "supabase", table };
  } catch (err) {
    return {
      saved: false,
      provider: "supabase",
      error: err instanceof Error ? err.message : "Supabase save failed",
    };
  }
}
