import { NextResponse } from "next/server";
import { addFreeAccessRequest } from "@/lib/freeAccessStore";
import { notifyAdminFreeAccess, confirmUserFreeAccess } from "@/lib/notifyAdminEmail";

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

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // honeypot — bots fill this; pretend success
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
    const res = await addFreeAccessRequest({
      email: body.email,
      tradingViewUsername: tv,
      fullName: body.fullName,
      note: body.note,
      source: typeof body.source === "string" ? body.source : "free-access",
    });
    // best-effort notifications — they never throw and never block the request
    await notifyAdminFreeAccess(res.request);
    await confirmUserFreeAccess(res.request);
    return NextResponse.json({ ok: true, status: res.status, id: res.request.id });
  } catch (err) {
    const code = err instanceof Error ? err.message : "error";
    if (code === "invalid_email")
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
    if (code === "invalid_tv_username")
      return NextResponse.json({ ok: false, error: "Please enter your exact TradingView username." }, { status: 422 });
    console.error("free-access: failed to store request", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
