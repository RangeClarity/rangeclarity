import { NextResponse } from "next/server";
import {
  getLinearErrorMessage,
  getLinearScopeLabel,
  listLinearIssues,
} from "@/lib/linear/client";

export const dynamic = "force-dynamic";

// Write mode is deferred until this internal route has authentication.
// This endpoint intentionally supports GET only.

export async function GET() {
  if (process.env.RC_INTERNAL_PAGES_ENABLED !== "true") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const issues = await listLinearIssues();

    return NextResponse.json({
      issues,
      scope: getLinearScopeLabel(),
      writeEnabled: false,
      writeMode: "deferred",
    });
  } catch (error) {
    return NextResponse.json(
      { error: getLinearErrorMessage(error) },
      { status: 500 },
    );
  }
}
