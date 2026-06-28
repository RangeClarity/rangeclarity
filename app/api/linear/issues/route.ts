import { NextResponse } from "next/server";
import {
  getLinearErrorMessage,
  getLinearScopeLabel,
  isLinearWriteEnabled,
  listLinearIssues,
  updateLinearIssueDueDate,
} from "@/lib/linear/client";

export const dynamic = "force-dynamic";

const TIMELESS_DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET() {
  try {
    const issues = await listLinearIssues();

    return NextResponse.json({
      issues,
      scope: getLinearScopeLabel(),
      writeEnabled: isLinearWriteEnabled(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: getLinearErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      issueId?: unknown;
      dueDate?: unknown;
    };

    if (typeof body.issueId !== "string" || body.issueId.length === 0) {
      return NextResponse.json(
        { error: "issueId is required." },
        { status: 400 },
      );
    }

    if (typeof body.dueDate !== "string" || !TIMELESS_DATE.test(body.dueDate)) {
      return NextResponse.json(
        { error: "dueDate must be a YYYY-MM-DD date." },
        { status: 400 },
      );
    }

    const issue = await updateLinearIssueDueDate(body.issueId, body.dueDate);

    return NextResponse.json({ issue });
  } catch (error) {
    return NextResponse.json(
      { error: getLinearErrorMessage(error) },
      { status: 500 },
    );
  }
}
