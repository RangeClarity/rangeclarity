import Link from "next/link";
import { footerLinks } from "@/lib/range-data";
import { RangeLogo } from "@/components/RangeLogo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05070d] px-5 py-8 text-sm text-slate-500 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <RangeLogo />
          <p className="mt-3 max-w-xl leading-6">
            Premium TradingView indicators for range context, momentum, and risk. Not financial advice.
          </p>
        </div>

        <nav className="flex flex-wrap gap-3" aria-label="Landing sections">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-semibold text-slate-400 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
