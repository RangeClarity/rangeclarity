import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { coworkFlags } from "@/lib/cowork/flags";
import { AppShell } from "./AppShell";

/* Co Work Workspace V2 — internal shell. Single master gate: when COWORK_WORKSPACE_V2 !== "true",
   the whole /cowork subtree 404s (nothing changes). No data, no integrations, no product impact. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata: Metadata = {
  title: "Co Work",
  description: "Co Work Workspace (internal shell).",
  robots: { index: false, follow: false },
};

export default function CoworkLayout({ children }: { children: ReactNode }) {
  const flags = coworkFlags();
  if (!flags.v2) notFound();
  return <AppShell flags={flags}>{children}</AppShell>;
}
