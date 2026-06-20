import { NextResponse } from "next/server";
import { findById, markCheckoutPending } from "@/lib/betaStore";
import { getPaymentProvider } from "@/lib/payments";

export const runtime = "nodejs";

/**
 * Start a checkout through the active provider (default: manual). Free preview
 * stays lead-capture (unpaid); paid plans ($29/$49) move to payment_pending and
 * receive the manual payment-link placeholder. No live payment is processed.
 */
export async function POST(request: Request) {
  let body: { signupId?: unknown };
  try {
    body = (await request.json()) as { signupId?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const id = typeof body.signupId === "string" ? body.signupId : "";
  const signup = id ? await findById(id) : null;
  if (!signup) {
    return NextResponse.json({ ok: false, error: "Unknown signup. Please register first." }, { status: 404 });
  }

  const provider = getPaymentProvider();
  try {
    const result = await provider.createCheckout({
      signupId: signup.id,
      email: signup.email,
      plan: signup.selectedPlan,
    });
    if (signup.selectedPlan !== "free_preview") {
      await markCheckoutPending(signup.id, provider.id);
    }
    return NextResponse.json({ ok: true, provider: provider.id, result });
  } catch (err) {
    console.error("beta-checkout: provider error", err);
    return NextResponse.json(
      {
        ok: false,
        provider: provider.id,
        error: "This checkout provider is not connected yet. Your spot is saved — a founder will reach out to confirm access.",
      },
      { status: 503 },
    );
  }
}
