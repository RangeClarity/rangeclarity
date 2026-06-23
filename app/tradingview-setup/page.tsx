import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TradingViewCTA from "@/app/_components/TradingViewCTA";
import styles from "./tradingview-setup.module.css";

export const metadata: Metadata = {
  title: "Set Up TradingView for RangeClarity",
  description:
    "RangeClarity runs inside TradingView as an invite-only indicator. Create a TradingView account, send your exact username, and we add eligible users manually during beta.",
  robots: { index: false },
};

const STEPS = [
  {
    n: "1",
    t: "Create or open your TradingView account",
    d: "A free TradingView account is enough to start.",
  },
  {
    n: "2",
    t: "Copy your exact TradingView username",
    d: "It is usually different from your email. Spelling and capitalisation matter.",
  },
  {
    n: "3",
    t: "Request 7-Day Free Access",
    d: "Submit your email and TradingView username in the 7-Day Free Access form.",
  },
  {
    n: "4",
    t: "We add you manually",
    d: "We review requests and add eligible users to the invite-only RangeClarity indicator, usually within 24 hours during beta.",
  },
];

export default function TradingViewSetupPage() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link className={styles.brand} href="/">
            <Image className={styles.brandBadge} src="/brand/fox-badge.png" alt="" aria-hidden="true" width={24} height={24} />
            Range<span className={styles.g}>Clarity</span>
          </Link>
          <Link className={styles.back} href="/beta/free-access">
            Free access &rarr;
          </Link>
        </div>
      </header>

      <div className={styles.wrap}>
        <div className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          TradingView setup
        </div>
        <h1 className={styles.title}>Set up TradingView for RangeClarity</h1>
        <p className={styles.lead}>
          RangeClarity runs inside TradingView. To receive invite-only indicator access, make sure you
          have a TradingView account and send us your exact TradingView username.
        </p>

        <TradingViewCTA note="RangeClarity access is added manually after your request is reviewed." />

        <div className={styles.sectionLabel}>How it works</div>
        <ol className={styles.steps}>
          {STEPS.map((s) => (
            <li className={styles.step} key={s.n}>
              <span className={styles.stepNum} aria-hidden="true">{s.n}</span>
              <div className={styles.stepBody}>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <Link className={styles.cta} href="/beta/free-access">
          Try 7-Day Free Access <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link className={styles.ctaSecondary} href="/beta">
          See beta plans
        </Link>

        <div className={styles.compliance}>
          <p>
            RangeClarity is an educational market-structure visualization tool. It does not provide
            financial advice, buy/sell signals, predictions, or guaranteed results.
          </p>
          <p>
            TradingView is a separate platform. You need a TradingView account to receive invite-only
            indicator access.
          </p>
        </div>

        <p className={styles.disclosure}>
          RangeClarity runs on TradingView and is not affiliated with or endorsed by TradingView. The
          &ldquo;Open TradingView&rdquo; link may be an affiliate link.
        </p>
      </div>
    </main>
  );
}
