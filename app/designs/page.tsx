import type { Metadata } from "next";
import Link from "next/link";
import s from "./designs.module.css";

export const metadata: Metadata = {
  title: "RangeClarity — Design Versions",
  robots: { index: false, follow: false },
};

/* ============================================================
   /designs — internal design selector.
   Status badges: Current homepage | Candidate | Experimental |
   Archived | Missing / needs recovery.
   All routes below exist on disk except those marked `missing`.
   No homepage changes; mock visuals only.
   ============================================================ */

type Status = "current" | "candidate" | "experimental" | "archived" | "missing";

const BADGE: Record<Status, { label: string; cls: string }> = {
  current: { label: "Current homepage", cls: "tagLive" },
  candidate: { label: "Candidate", cls: "tagCandidate" },
  experimental: { label: "Experimental", cls: "tagExperimental" },
  archived: { label: "Archived", cls: "tagArchived" },
  missing: { label: "Missing / needs recovery", cls: "tagMissing" },
};

type Design = {
  href: string;
  status: Status;
  title: string;
  desc: string;
  path: string;
  preview: string;
  recommended?: boolean;
  missingNote?: string;
};

const designs: Design[] = [
  {
    href: "/",
    status: "current",
    title: "Codex Premium Hero — live homepage",
    desc: "The RangeBot full-bleed hero from the previous Codex project: premium TradingView indicator suite, meme-fintech command-center energy, and early-access CTA.",
    path: "/",
    preview:
      "linear-gradient(135deg, #05070d, #07111f), radial-gradient(circle at 72% 38%, rgba(159,211,255,0.28), transparent 36%), radial-gradient(circle at 88% 74%, rgba(217,180,108,0.22), transparent 38%)",
  },
  {
    href: "/designs/codex-premium-hero",
    status: "candidate",
    title: "Codex Premium Hero (source route)",
    desc: "The full-bleed RangeBot hero served by the homepage, kept as a source route for easy comparison and rollback.",
    path: "/designs/codex-premium-hero",
    preview:
      "linear-gradient(135deg, #05070d, #07111f), radial-gradient(circle at 72% 38%, rgba(159,211,255,0.28), transparent 36%), radial-gradient(circle at 88% 74%, rgba(217,180,108,0.22), transparent 38%)",
  },
  {
    href: "/designs/meme-fintech",
    status: "archived",
    title: "Meme-Fintech (previous homepage)",
    desc: "The prior homepage — neon command-center toolkit with collectible reads and pricing. Preserved unchanged for reference and rollback.",
    path: "/designs/meme-fintech",
    preview:
      "linear-gradient(135deg, #05060a, #0e1120), radial-gradient(circle at 30% 20%, rgba(47,255,214,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,79,216,0.3), transparent 45%)",
  },
  {
    href: "/designs/previous-pro",
    status: "candidate",
    title: "Previous Pro",
    desc: "The clean, professional baseline — Range Command V2 before the meme microcopy and mascot. Premium dark fintech, mock TradingView chart, module cards, pricing, FAQ.",
    path: "/designs/previous-pro",
    preview:
      "linear-gradient(135deg, #060a12, #0c1322), radial-gradient(circle at 26% 28%, rgba(52,245,176,0.28), transparent 45%), radial-gradient(circle at 80% 66%, rgba(56,225,255,0.26), transparent 45%)",
  },
  {
    href: "/designs/range-command-v2",
    status: "candidate",
    title: "Range Command V2 (source route)",
    desc: "The previous approved homepage candidate. Preserved as its own route for comparison and rollback.",
    path: "/designs/range-command-v2",
    preview:
      "linear-gradient(135deg, #060a12, #111a2d), radial-gradient(circle at 25% 30%, rgba(52,245,176,0.32), transparent 45%), radial-gradient(circle at 82% 65%, rgba(255,207,92,0.3), transparent 45%)",
  },
  {
    href: "/designs/premium-fintech",
    status: "candidate",
    title: "Premium Fintech (Codex)",
    desc: "The Codex design recreated in vanilla CSS — acid/cyan/violet decision-map dashboard and toolkit cards.",
    path: "/designs/premium-fintech",
    preview:
      "linear-gradient(135deg, #05070d, #0c1322), radial-gradient(circle at 25% 25%, rgba(182,255,60,0.3), transparent 45%), radial-gradient(circle at 80% 60%, rgba(56,225,255,0.28), transparent 45%)",
  },
  {
    href: "/designs/nft-character-toolkit",
    status: "experimental",
    title: "NFT Character Toolkit",
    desc: "Collectible-character branding — Range Ronin, Momentum Beast, Risk Goblin, Oracle Bot — over the real indicator suite. The boldest, most meme-forward direction.",
    path: "/designs/nft-character-toolkit",
    preview:
      "linear-gradient(135deg, #05070e, #111a2e), radial-gradient(circle at 22% 25%, rgba(155,107,255,0.32), transparent 45%), radial-gradient(circle at 82% 68%, rgba(52,245,176,0.3), transparent 45%)",
  },
  {
    href: "/designs/product-vision",
    status: "missing",
    title: "Product Vision",
    desc: "A route you mentioned, but no files for it exist in the project (and it isn't in any backup or git history here).",
    path: "/designs/product-vision",
    preview:
      "linear-gradient(135deg, #0a0d15, #11151f), radial-gradient(circle at 30% 30%, rgba(255,122,138,0.12), transparent 50%)",
    missingNote:
      "Never built, or not part of this upload. Left as a placeholder rather than a broken link. Tell me what it should contain and I can create it.",
  },
];

export default function DesignsPage() {
  return (
    <div className={s.page}>
      <div className={s.wrap}>
        <span className={s.eyebrow}>Internal · Compare &amp; choose</span>
        <h1 className={s.h1}>RangeClarity design versions</h1>
        <p className={s.lead}>
          Every landing-page version, side by side. Open each, then pick which should become the
          production homepage. The current homepage stays live until you choose.
        </p>
        <p className={s.note}>Internal comparison page · not linked from production · noindex.</p>

        <div className={s.grid}>
          {designs.map((d) => {
            const badge = BADGE[d.status];
            const inner = (
              <>
                <div className={s.tagRow}>
                  <span className={`${s.tag} ${s[badge.cls]}`}>{badge.label}</span>
                  {d.recommended ? <span className={s.recommend}>★ Recommended</span> : null}
                </div>
                <div className={s.preview} style={{ backgroundImage: d.preview }} aria-hidden="true" />
                <h2 className={s.cardTitle}>{d.title}</h2>
                <p className={s.cardDesc}>{d.desc}</p>
                <span className={s.path}>{d.path}</span>
                {d.status === "missing" ? (
                  <p className={s.missingNote}>{d.missingNote}</p>
                ) : (
                  <span className={s.cardCta}>View design →</span>
                )}
              </>
            );

            return d.status === "missing" ? (
              <div key={d.path} className={`${s.card} ${s.cardMissing} ${s.cardDisabled}`}>
                {inner}
              </div>
            ) : (
              <Link key={d.path} href={d.href} className={s.card}>
                {inner}
              </Link>
            );
          })}
        </div>

        <div className={s.refSection}>
          <span className={s.refTitle}>Also in this project (not homepage candidates)</span>
          <div className={s.refRow}>
            <Link href="/indicator-guide" className={s.refLink}>
              <span className={s.refLinkTitle}>Indicator Visual Guide</span>
              <span className={s.refLinkPath}>/indicator-guide</span>
            </Link>
            <Link href="/indicator-guide/print" className={s.refLink}>
              <span className={s.refLinkTitle}>Indicator Guide — Print / PDF</span>
              <span className={s.refLinkPath}>/indicator-guide/print</span>
            </Link>
          </div>
        </div>

        <Link href="/" className={s.back}>← Back to current homepage</Link>
      </div>
    </div>
  );
}
