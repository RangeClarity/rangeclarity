import { NextResponse } from "next/server";
import { createBetaSignup, saveBetaSignup } from "@/lib/betaStore";
import type { BetaSignup } from "@/lib/betaStore";
import { saveSignupCapture } from "@/lib/betaSignupCapture";
import { notifyAdminBetaSignup, confirmUserBetaSignup } from "@/lib/notifyAdminEmail";
import type { SendResult } from "@/lib/notifyAdminEmail";

export const runtime = "nodejs";

type Payload = {
  name?: unknown;
  email?: unknown;
  tvUsername?: unknown;
  tradingViewUsername?: unknown;
  userType?: unknown;
  plan?: unknown;
  selectedPlan?: unknown;
  notes?: unknown;
  consent?: unknown;
  source?: unknown;
  company?: unknown; // honeypot
};

type StoreResult =
  | { status: "added" | "duplicate"; signup: BetaSignup; stored: true }
  | { status: "storage_failed"; signup: BetaSignup; stored: false; error: string };

function safeError(err: unknown) {
  if (err instanceof Error) {
    return {
      message: err.message,
      code: (err as NodeJS.ErrnoException).code,
    };
  }
  return { message: "unknown error" };
}

function runtimeEnvironment() {
  return (
    process.env.VERCEL_ENV ??
    process.env.NODE_ENV ??
    (process.env.VERCEL ? "vercel" : "unknown")
  );
}

/**
 * Presence-only snapshot of the server env this route depends on.
 * Logs BOOLEANS, never secret values. All read server-side (runtime = nodejs;
 * none are NEXT_PUBLIC_, so they never reach the browser).
 */
function emailEnvPresence() {
  return {
    hasResendKey: Boolean(process.env.RESEND_API_KEY?.trim()),
    hasEmailFrom: Boolean((process.env.EMAIL_FROM ?? process.env.RESEND_FROM)?.trim()),
    hasAdminEmail: Boolean(process.env.ADMIN_NOTIFICATION_EMAIL?.trim()), // a built-in default also exists
    hasSupabaseUrl: Boolean(process.env.SUPABASE_URL?.trim()),
    hasSupabaseKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
  };
}

function logResend(kind: "admin" | "user", signupId: string, result: SendResult) {
  if (result.sent) {
    console.log("[beta-signup] resend success", { kind, signupId });
  } else {
    console.warn("[beta-signup] resend failure", {
      kind,
      signupId,
      skipped: result.skipped,
      error: result.error,
    });
  }
}

async function tryStoreSignup(signup: BetaSignup): Promise<StoreResult> {
  try {
    const result = await saveBetaSignup(signup);
    return { ...result, stored: true };
  } catch (err) {
    const error = safeError(err);
    // Ephemeral .data file (best-effort on serverless); never gates success.
    console.error("[beta-signup] ephemeral store failed", {
      signupId: signup.id,
      code: error.code,
      message: error.message,
    });
    return {
      status: "storage_failed",
      signup,
      stored: false,
      error: error.message,
    };
  }
}

export async function POST(request: Request) {
  console.log("[beta-signup] start", { environment: runtimeEnvironment() });

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    console.warn("[beta-signup] returning failure", { reason: "invalid_json", status: 400 });
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.company === "string" && body.company.trim() !== "") {
    // Honeypot: bots (or aggressive browser autofill) fill this hidden field.
    // Return benign success and capture nothing. This is the ONE intentional
    // success-without-capture path; logged so it is diagnosable in Vercel.
    console.warn("[beta-signup] honeypot triggered; returning benign success without capture");
    return NextResponse.json({ ok: true, status: "added" });
  }

  console.log("[beta-signup] env check", emailEnvPresence());

  const planRaw =
    typeof body.selectedPlan === "string"
      ? body.selectedPlan
      : typeof body.plan === "string"
        ? body.plan
        : undefined;

  try {
    const signup = createBetaSignup({
      name: typeof body.name === "string" ? body.name : "",
      email: body.email,
      tradingViewUsername: body.tradingViewUsername ?? body.tvUsername,
      userType: typeof body.userType === "string" ? body.userType : "other",
      selectedPlan: planRaw,
      notes: typeof body.notes === "string" ? body.notes : undefined,
      consentAccepted: body.consent,
      source: typeof body.source === "string" ? body.source : "beta-landing",
      environment: runtimeEnvironment(),
      userAgent: request.headers.get("user-agent"),
    });

    const storeResult = await tryStoreSignup(signup);

    console.log("[beta-signup] sending user email", { signupId: signup.id });
    const userEmail = await confirmUserBetaSignup(signup);
    logResend("user", signup.id, userEmail);

    console.log("[beta-signup] sending admin email", { signupId: signup.id });
    const adminEmail = await notifyAdminBetaSignup(signup, {
      environment: runtimeEnvironment(),
      storedLocally: storeResult.stored,
      storageStatus: storeResult.status,
      userConfirmation: userEmail,
      userAgent: signup.userAgent,
    });
    logResend("admin", signup.id, adminEmail);

    const durableCapture = await saveSignupCapture({
      id: signup.id,
      email: signup.email,
      tradingViewUsername: signup.tradingViewUsername,
      fullName: signup.name,
      selectedPlan: signup.selectedPlan,
      signupType: signup.signupType,
      note: signup.notes,
      consent: signup.consentAccepted,
      source: signup.source,
      environment: signup.environment,
      userAgent: signup.userAgent,
      userEmail,
      adminEmail,
      createdAt: signup.createdAt,
    });
    if (!durableCapture.saved) {
      console.warn("[beta-signup] durable Supabase capture unavailable", {
        signupId: signup.id,
        skipped: "skipped" in durableCapture ? durableCapture.skipped : undefined,
        error: "error" in durableCapture ? durableCapture.error : undefined,
      });
    }

    // SUCCESS GATE (spec): success is impossible unless the lead is DURABLY captured —
    // admin email delivered to Resend OR row written to Supabase. The ephemeral .data
    // file and the user's confirmation email are best-effort and never gate success.
    const readyForSuccess = adminEmail.sent || durableCapture.saved;
    if (!readyForSuccess) {
      console.error("[beta-signup] capture failed: neither admin email nor Supabase succeeded", {
        signupId: signup.id,
        storageStatus: storeResult.status,
        storedLocally: storeResult.stored,
        durableCaptureSaved: durableCapture.saved,
        adminEmailSkipped: adminEmail.skipped,
        adminEmailError: adminEmail.error,
        userEmailSent: userEmail.sent,
        userEmailSkipped: userEmail.skipped,
        userEmailError: userEmail.error,
      });
      console.warn("[beta-signup] returning failure", { signupId: signup.id, status: 500 });
      return NextResponse.json(
        {
          ok: false,
          status: "partial_capture",
          error: "Something went wrong. Please try again, or contact support.",
        },
        { status: 500 },
      );
    }

    console.log("[beta-signup] returning success", {
      signupId: signup.id,
      capturedBy: durableCapture.saved ? "supabase" : "admin_email",
      userEmailSent: userEmail.sent,
    });
    return NextResponse.json({
      ok: true,
      status: storeResult.status,
      id: signup.id,
      plan: signup.selectedPlan,
      capturedBy: durableCapture.saved ? "supabase" : "admin_email",
    });
  } catch (err) {
    const code = err instanceof Error ? err.message : "error";
    if (code === "invalid_email") {
      console.warn("[beta-signup] returning failure", { reason: code, status: 422 });
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
    }
    if (code === "invalid_tv_username") {
      console.warn("[beta-signup] returning failure", { reason: code, status: 422 });
      return NextResponse.json({ ok: false, error: "Please enter your TradingView username." }, { status: 422 });
    }
    if (code === "invalid_name") {
      console.warn("[beta-signup] returning failure", { reason: code, status: 422 });
      return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 422 });
    }
    if (code === "missing_consent") {
      console.warn("[beta-signup] returning failure", { reason: code, status: 422 });
      return NextResponse.json(
        { ok: false, error: "Please confirm the access + disclaimer checkbox." },
        { status: 422 },
      );
    }

    console.error("[beta-signup] request failed", safeError(err));
    console.warn("[beta-signup] returning failure", { reason: "exception", status: 500 });
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again, or contact support." },
      { status: 500 },
    );
  }
}
