import Link from "next/link";
import type { ReactNode } from "react";

const baseClass =
  "inline-flex min-h-12 items-center justify-center rounded-lg px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-mint/60 focus:ring-offset-2 focus:ring-offset-[#05070d]";

const variants = {
  primary:
    "border border-mint/40 bg-mint text-[#041014] shadow-[0_0_28px_rgba(168,240,209,0.18)] hover:bg-[#c7f8e2]",
  secondary:
    "border border-white/16 bg-white/[0.055] text-white hover:border-white/32 hover:bg-white/[0.09]",
  ghost:
    "border border-signal/24 bg-signal/10 text-signal hover:border-signal/45 hover:bg-signal/15"
} as const;

export function LandingButton({
  href,
  children,
  variant = "primary",
  className = ""
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <Link href={href} className={`${baseClass} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
