import Link from "next/link";
import { designRoutes } from "@/lib/range-data";
import { RangeLogo } from "./RangeLogo";

export function DesignNav({
  current,
  theme = "dark"
}: {
  current?: string;
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";

  return (
    <header
      className={
        isDark
          ? "sticky top-0 z-40 border-b border-white/10 bg-[#05070d]/[0.88] backdrop-blur-xl"
          : "sticky top-0 z-40 border-b border-slate-200/80 bg-[#f7f4ed]/[0.88] backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/designs" aria-label="RangeClarity design index">
          <RangeLogo dark={isDark} />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Design routes">
          {designRoutes.map((route) => {
            const active = current === route.href.split("/").pop();
            return (
              <Link
                key={route.href}
                href={route.href}
                className={
                  active
                    ? isDark
                      ? "rounded-lg bg-white px-3 py-2 text-sm font-semibold text-ink"
                      : "rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white"
                    : isDark
                      ? "rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white"
                      : "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-900/5 hover:text-ink"
                }
              >
                {route.title}
              </Link>
            );
          })}
        </nav>
        <Link
          href="#early-access"
          className={
            isDark
              ? "rounded-lg border border-mint/35 bg-mint px-4 py-2.5 text-sm font-black text-ink shadow-[0_0_24px_rgba(168,240,209,0.14)] hover:bg-[#c7f8e2]"
              : "rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          }
        >
          Join Early Access
        </Link>
      </div>
    </header>
  );
}
