import Link from "next/link";

export function CTAButtons({
  variant = "dark"
}: {
  variant?: "dark" | "light" | "terminal";
}) {
  const primary =
    variant === "light"
      ? "bg-ink text-white hover:bg-slate-800"
      : variant === "terminal"
        ? "bg-signal text-ink hover:bg-[#c7e6ff]"
        : "bg-white text-ink hover:bg-platinum";

  const secondary =
    variant === "light"
      ? "border border-slate-300 text-ink hover:border-ink hover:bg-slate-100"
      : "border border-white/[0.18] text-white hover:border-white/[0.35] hover:bg-white/[0.08]";

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href="#early-access"
        className={`inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm font-semibold shadow-sm transition ${primary}`}
      >
        Join Early Access
      </Link>
      <Link
        href="#tradingview-preview"
        className={`inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm font-semibold transition ${secondary}`}
      >
        View Chart Preview
      </Link>
    </div>
  );
}
