import { NextResponse } from "next/server";
import { addSignup, normalizeEmail, normalizeTvUsername } from "@/lib/betaStore";

export const runtime = "nodejs";

type Payload = {
  name?: unknown;
  email?: unknown;
  tvUsername?: unknown;          // wire name from the form
  tradingViewUsername?: unknown; // accept either
  userType?: unknown;
  plan?: unknown;                // wire name from the form
  selectedPlan?: unknown;        // accept either
  notes?: unknown;
  source?: unknown;
  company?: unknown;             // honeypot
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true, status: "added" });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
  }
  const tvRaw = body.tradingViewUsername ?? body.tvUsername;
  const tradingViewUsername = normalizeTvUsername(tvRaw);
  if (!tradingViewUsername) {
    return NextResponse.json({ ok: false, error: "Please enter your TradingView username." }, { status: 422 });
  }
  if (typeof body.name !== "string" || body.name.trim() === "") {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 422 });
  }

  const planRaw =
    typeof body.selectedPlan === "string"
      ? body.selectedPlan
      : typeof body.plan === "string"
        ? body.plan
        : undefined;

  try {
    const res = await addSignup({
      name: body.name,
      email,
      tradingViewUsername,
      userType: typeof body.userType === "string" ? body.userType : "other",
      selectedPlan: planRaw,
      notes: typeof body.notes === "string" ? body.notes : undefined,
      source: typeof body.source === "string" ? body.source : "beta-landing",
    });
    return NextResponse.json({
      ok: true,
      status: res.status,
      id: res.signup.id,
      plan: res.signup.selectedPlan,
    });
  } catch (err) {
    console.error("beta-signup: failed to persist", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
