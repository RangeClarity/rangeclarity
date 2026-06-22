import { NextResponse } from "next/server";
import { createFreeAccessRequest, saveFreeAccessRequest } from "@/lib/freeAccessStore";
import type { FreeAccessRequest } from "@/lib/freeAccessStore";
import { saveSignupCapture } from "@/lib/betaSignupCapture";
import { notifyAdminFreeAccess, confirmUserFreeAccess } from "@/lib/notifyAdminEmail";
import type { SendResult } from "@/lib/notifyAdminEmail";

export const runtime = "nodejs";

type Payload = {
  email?: unknown;
  tradingViewUsername?: unknown;
  tvUsername?: unknown;
  fullName?: unknown;
  note?: unknown;
  consent?: unknown;
  source?: unknown;
  company?: unknown; // honeypot
};

type StoreResult =
  | { status: "added" | "duplicate"; request: FreeAccessRequest; stored: true }
  | { status: "storage_failed"; request: FreeAccessRequest; stored: false; error: string };

function safeError(err: unknown) {
  if (err instanceof Error) {
    return {
      message: err.message,
      code: (err as NodeJS.ErrnoException).code,
    };
  }
  return { message: "unknown error" };
}

function logEmailResult(kind: "admin" | "user", requestId: string, result: SendResult) {
  if (result.sent) return;
  console.warn(`free-access: ${kind} email not sent`, {
    requestId,
    skipped: result.skipped,
    error: result.error,
  });
}

function runtimeEnvironment() {
  return (
    process.env.VERCEL_ENV ??
    process.env.NODE_ENV ??
    (process.env.VERCEL ? "vercel" : "unknown")
  );
}

async function tryStoreRequest(request: FreeAccessRequest): Promise<StoreResult> {
  try {
    const result = await saveFreeAccessRequest(request);
    return { ...result, stored: true };
  } catch (err) {
    const error = safeError(err);
    console.error("free-access: storage failed", {
      requestId: request.id,
      code: error.code,
      message: error.message,
    });
    return {
      status: "storage_failed",
      request,
      stored: false,
      error: error.message,
    };
  }
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill this; pretend success.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true, status: "added" });
  }

  if (body.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Please confirm the access + disclaimer checkbox." },
      { status: 422 },
    );
  }

  const tv = body.tradingViewUsername ?? body.tvUsername;
  try {
    const freeAccessRequest = createFreeAccessRequest({
      email: body.email,
      tradingViewUsername: tv,
      fullName: body.fullName,
      note: body.note,
      consentAccepted: body.consent,
      source: typeof body.source === "string" ? body.source : "free-access",
      environment: runtimeEnvironment(),
      userAgent: request.headers.get("user-agent"),
    });

    const storeResult = await tryStoreRequest(freeAccessRequest);
    const requestForEmail = freeAccessRequest;

    const userEmail = await confirmUserFreeAccess(requestForEmail);
    logEmailResult("user", requestForEmail.id, userEmail);

    const adminEmail = await notifyAdminFreeAccess(requestForEmail, {
      environment: runtimeEnvironment(),
      storedLocally: storeResult.stored,
      storageStatus: storeResult.status,
      userConfirmation: userEmail,
      userAgent: requestForEmail.userAgent,
    });
    logEmailResult("admin", requestForEmail.id, adminEmail);

    const durableCapture = await saveSignupCapture({
      id: requestForEmail.id,
      email: requestForEmail.email,
      tradingViewUsername: requestForEmail.tradingViewUsername,
      fullName: requestForEmail.fullName,
      selectedPlan: requestForEmail.selectedPlan,
      signupType: requestForEmail.signupType,
      note: requestForEmail.note,
      consent: requestForEmail.consentAccepted,
      source: requestForEmail.source,
      environment: requestForEmail.environment,
      userAgent: requestForEmail.userAgent,
      userEmail,
      adminEmail,
      createdAt: requestForEmail.createdAt,
    });
    if (!durableCapture.saved) {
      console.warn("free-access: durable Supabase capture unavailable", {
        requestId: requestForEmail.id,
        skipped: "skipped" in durableCapture ? durableCapture.skipped : undefined,
        error: "error" in durableCapture ? durableCapture.error : undefined,
      });
    }

    const captured = adminEmail.sent || durableCapture.saved;
    const readyForSuccess = captured && userEmail.sent;
    if (!readyForSuccess) {
      console.error("free-access: required email capture failed", {
        requestId: requestForEmail.id,
        storageStatus: storeResult.status,
        storedLocally: storeResult.stored,
        durableCaptureSaved: durableCapture.saved,
        adminEmailSkipped: adminEmail.skipped,
        adminEmailError: adminEmail.error,
        userEmailSkipped: userEmail.skipped,
        userEmailError: userEmail.error,
      });
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again, or contact support." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      status: storeResult.status,
      id: requestForEmail.id,
      capturedBy: durableCapture.saved ? "supabase" : "admin_email",
    });
  } catch (err) {
    const code = err instanceof Error ? err.message : "error";
    if (code === "invalid_email") {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
    }
    if (code === "invalid_tv_username") {
      return NextResponse.json({ ok: false, error: "Please enter your exact TradingView username." }, { status: 422 });
    }
    if (code === "missing_consent") {
      return NextResponse.json(
        { ok: false, error: "Please confirm the access + disclaimer checkbox." },
        { status: 422 },
      );
    }

    console.error("free-access: request failed", safeError(err));
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again, or contact support." },
      { status: 500 },
    );
  }
}
