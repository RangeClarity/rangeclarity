import { notFound } from "next/navigation";

// Experimental design variants are internal-only. Hidden from public/production
// unless RC_INTERNAL_PAGES_ENABLED === "true" (matches the /ops gate convention).
// The production homepage renders the fox-brand component directly at "/", so it is
// unaffected by this route gate.
export const dynamic = "force-dynamic";

export default function DesignsLayout({ children }: { children: React.ReactNode }) {
  if (process.env.RC_INTERNAL_PAGES_ENABLED !== "true") notFound();
  return <>{children}</>;
}
