import { notFound } from "next/navigation";

// Experimental Codex variant (mock copy + placeholder mascot) — internal-only.
// Hidden from public/production unless RC_INTERNAL_PAGES_ENABLED === "true".
export const dynamic = "force-dynamic";

export default function VariantCodexSectionLayout({ children }: { children: React.ReactNode }) {
  if (process.env.RC_INTERNAL_PAGES_ENABLED !== "true") notFound();
  return <>{children}</>;
}
