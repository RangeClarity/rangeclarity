export function RangeLogo({ dark = true }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={
          dark
            ? "grid h-9 w-9 place-items-center rounded-lg border border-mint/35 bg-white text-[11px] font-black text-ink shadow-[0_0_18px_rgba(168,240,209,0.16)]"
            : "grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-ink text-[11px] font-black text-white"
        }
      >
        RC
      </div>
      <span className={dark ? "font-semibold text-white" : "font-semibold text-ink"}>
        RangeClarity
      </span>
    </div>
  );
}
