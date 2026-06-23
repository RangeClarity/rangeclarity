import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OpsPage from "../ops/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Command Center - RangeClarity",
  description:
    "Internal RangeClarity command center. Disabled unless explicitly enabled.",
};

export default function CommandCenterPage() {
  if (process.env.RC_INTERNAL_PAGES_ENABLED !== "true") {
    notFound();
  }

  return <OpsPage />;
}
