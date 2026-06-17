import { NextResponse } from "next/server";
import { addEntry, normalizeEmail } from "@/lib/waitlist";

// File-based persistence requires the Node.js runtime (not Edge).
export const runtime = "nodejs";

type Payload = {
  email?: unknown;
  source?: unknown;
  // Honeypot: real users never fill this hidden field.
  company?: unknown;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Silently accept-and-ignore bots that trip the honeypot.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true, status: "added" });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 422 },
    );
  }

  const source = typeof body.source === "string" ? body.source.slice(0, 64) : "landing";

  try {
    const { status } = await addEntry(email, source);
    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("waitlist: failed to persist entry", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
