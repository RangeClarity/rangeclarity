import { NextResponse } from "next/server";
import {
  listRecentSignups,
  getSignup,
  markGranted,
  recordGrantEmailError,
} from "@/lib/betaSupabaseAdmin";
import { sendAccessGrantedEmail } from "@/lib/notifyAdminEmail";

export const runtime = "nodejs";

// Gate the manual access-grant action. ADMIN_ACCESS_TOKEN is the documented var;
// falls back to ADMIN_TOKEN (the existing console) so one token works everywhere.
function adminToken(): string {
  return (
    process.env.ADMIN_ACCESS_TOKEN ??
    process.env.ADMIN_TOKEN ??
    "rc-beta-admin-dev"
  );
}

function authed(request: Request): boolean {
  const token = adminToken();
  const url = new URL(request.url);
  const provided =
    request.headers.get("x-admin-token") ?? url.searchParams.get("token") ?? "";
  return Boolean(token) && provided === token;
}

export async function GET(request: Request) {
  if (!authed(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  try {
    const signups = await listRecentSignups();
    return NextResponse.json({ ok: true, signups });
  } catch {
    console.error("[admin-grant] list failed");
    return NextResponse.json(
      { ok: false, error: "Could not load signups (check Supabase env + that the migration ran)." },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  if (!authed(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: { signupId?: unknown };
  try {
    body = (await request.json()) as { signupId?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const signupId = typeof body.signupId === "string" ? body.signupId.trim() : "";
  if (!signupId) {
    return NextResponse.json({ ok: false, error: "signupId is required." }, { status: 400 });
  }

  console.log("[admin-grant] start", { signupId });

  let signup;
  try {
    signup = await getSignup(signupId);
  } catch {
    console.error("[admin-grant] load failed", { signupId });
    return NextResponse.json({ ok: false, error: "Could not load signup from Supabase." }, { status: 502 });
  }
  if (!signup) {
    return NextResponse.json({ ok: false, error: "Signup not found." }, { status: 404 });
  }

  // Idempotency: never grant or email twice.
  if (signup.status === "granted") {
    console.log("[admin-grant] already granted", { signupId });
    return NextResponse.json({
      ok: true,
      alreadyGranted: true,
      status: "granted",
      message: "Already granted — no email sent.",
    });
  }

  // 1) Durable update first (the TradingView invite was added manually already).
  try {
    await markGranted(signupId);
  } catch {
    console.error("[admin-grant] grant update failed", { signupId });
    return NextResponse.json({ ok: false, error: "Could not update Supabase." }, { status: 502 });
  }

  // 2) Send the Access Granted email (best-effort; failure does not un-grant).
  const emailResult = await sendAccessGrantedEmail({
    email: signup.email,
    tradingViewUsername: signup.tradingview_username,
    selectedPlan: signup.selected_plan,
  });

  if (!emailResult.sent) {
    const err = emailResult.error ?? emailResult.skipped ?? "email not sent";
    await recordGrantEmailError(signupId, err);
    console.warn("[admin-grant] granted but email failed", { signupId, emailSent: false });
    return NextResponse.json({
      ok: true,
      granted: true,
      emailSent: false,
      status: "granted",
      error: err,
      message: "Marked as granted, but the email failed — see email_error. The user is still granted.",
    });
  }

  await recordGrantEmailError(signupId, null); // clear any prior error
  console.log("[admin-grant] granted + emailed", { signupId, emailSent: true });
  return NextResponse.json({
    ok: true,
    granted: true,
    emailSent: true,
    status: "granted",
    message: "Granted and Access Granted email sent.",
  });
}
