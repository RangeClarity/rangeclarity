import { notFound } from "next/navigation";

// Experimental premium variant (mock LIVE/score visuals) — internal-only.
// Hidden from public/production unless RC_INTERNAL_PAGES_ENABLED === "true".
export const dynamic = "force-dynamic";

export default function RangeCommandPremiumLayout({ children }: { children: React.ReactNode }) {
  if (process.env.RC_INTERNAL_PAGES_ENABLED !== "true") notFound();
  return <>{children}</>;
}
