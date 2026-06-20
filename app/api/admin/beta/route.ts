import { NextResponse } from "next/server";
import {
  listSignups,
  markPaidManual,
  markFailed,
  markRefunded,
  grantAccessManual,
  revokeAccessManual,
  setPlan,
  setAdminNotes,
  expireOverdue,
  type BetaSignup,
} from "@/lib/betaStore";

export const runtime = "nodejs";

// Gate for the manual-fulfilment console. Set ADMIN_TOKEN in the environment
// for any shared/hosted use; the dev default is for local only.
const TOKEN = process.env.ADMIN_TOKEN ?? "rc-beta-admin-dev";

function authed(request: Request): boolean {
  const url = new URL(request.url);
  const provided =
    request.headers.get("x-admin-token") ?? url.searchParams.get("token") ?? "";
  return Boolean(TOKEN) && provided === TOKEN;
}

export async function GET(request: Request) {
  if (!authed(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, signups: await listSignups() });
}

export async function POST(request: Request) {
  if (!authed(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  let body: { action?: unknown; id?: unknown; override?: unknown; notes?: unknown; plan?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const action = typeof body.action === "string" ? body.action : "";

  // Global sweep needs no id.
  if (action === "expire_overdue") {
    const r = await expireOverdue();
    return NextResponse.json({ ok: true, expired: r.expired, signups: await listSignups() });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id." }, { status: 422 });
  }

  let updated: BetaSignup | null = null;
  switch (action) {
    case "mark_paid":
      updated = await markPaidManual(id);
      break;
    case "mark_failed":
      updated = await markFailed(id);
      break;
    case "refund":
      updated = await markRefunded(id);
      break;
    case "revoke_access":
      updated = await revokeAccessManual(id);
      break;
    case "set_plan":
      updated = await setPlan(id, typeof body.plan === "string" ? body.plan : "");
      break;
    case "set_notes":
      updated = await setAdminNotes(id, typeof body.notes === "string" ? body.notes : "");
      break;
    case "grant_access": {
      const g = await grantAccessManual(id, { override: body.override === true });
      if (g === null) {
        return NextResponse.json({ ok: false, error: "Signup not found." }, { status: 404 });
      }
      if (!g.ok) {
        return NextResponse.json({ ok: false, error: g.reason }, { status: 422 });
      }
      updated = g.signup;
      break;
    }
    default:
      return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 422 });
  }

  if (!updated) {
    return NextResponse.json({ ok: false, error: "Signup not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, signup: updated });
}
