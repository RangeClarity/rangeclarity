import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "../beta.module.css";
import FreeAccessForm from "./FreeAccessForm";

export const metadata: Metadata = {
  title: "RangeClarity — 7-Day Free Access",
  description:
    "Request 7-day free access to the RangeClarity invite-only TradingView indicator. Submit your email and TradingView username; eligible users are added manually.",
  robots: { index: false },
};

export default function FreeAccessPage() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <Image className={styles.brandBadge} src="/brand/fox-badge.png" alt="" aria-hidden="true" width={24} height={24} />RangeClarity <small>Beta</small>
          </Link>
          <nav className={styles.headerNav}>
            <Link href="/beta">Beta home</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section} style={{ borderTop: "none" }}>
          <span className={styles.eyebrow}>7-Day Free Access</span>
          <h1 className={styles.h2}>
            Try RangeClarity for <span style={{ color: "var(--accent)" }}>7 days</span>
          </h1>
          <p className={styles.lead}>
            Submit your email and TradingView username, and we&rsquo;ll manually add eligible users to
            the invite-only TradingView indicator. Access is reviewed by hand and may take up to
            24&ndash;48 hours during beta &mdash; no instant access, no automation.
          </p>
          <div className={styles.formWrap}>
            <FreeAccessForm />
          </div>
          <p className={styles.payNote} style={{ marginTop: "0.9rem" }}>
            Prefer paid beta access?{" "}
            <Link href="/beta?plan=beta_29" style={{ color: "var(--accent)" }}>
              View beta plans &rarr;
            </Link>
          </p>
          <p className={styles.payNote} style={{ marginTop: "0.9rem" }}>
            RangeClarity is an educational market-structure visualization tool. No financial advice,
            no buy/sell signals, no predictions, no guaranteed results.
          </p>
        </section>
      </main>
    </div>
  );
}
