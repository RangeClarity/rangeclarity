import { NextResponse } from "next/server";
import { addFeedback } from "@/lib/betaFeedback";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: {
    signupId?: unknown;
    email?: unknown;
    rating?: unknown;
    clarity?: unknown;
    message?: unknown;
    company?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json(
      { ok: false, error: "Please share a little feedback." },
      { status: 422 },
    );
  }
  const rating =
    typeof body.rating === "number" && body.rating >= 1 && body.rating <= 5
      ? body.rating
      : undefined;

  try {
    await addFeedback({
      signupId: typeof body.signupId === "string" ? body.signupId : undefined,
      email: typeof body.email === "string" ? body.email : undefined,
      rating,
      clarity:
        typeof body.clarity === "string" ? body.clarity.slice(0, 200) : undefined,
      message,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("beta-feedback: failed to persist", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
