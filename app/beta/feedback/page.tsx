import type { Metadata } from "next";
import Link from "next/link";
import styles from "../beta.module.css";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "RangeClarity — Beta Feedback",
  description: "Tell us what's clear and what's confusing. Your feedback shapes the build.",
  robots: { index: false },
};

export default function BetaFeedback() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark} />RangeClarity <small>Beta</small>
          </Link>
          <nav className={styles.headerNav}>
            <Link href="/beta">Beta home</Link>
            <Link href="/beta/welcome">Access</Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.hero} style={{ paddingBottom: "1rem" }}>
          <span className={styles.eyebrow}>Private beta feedback</span>
          <h1 className={styles.h1} style={{ maxWidth: "16ch" }}>
            Help us keep it <span className={styles.accent}>clear</span>.
          </h1>
          <p className={styles.heroSub} style={{ maxWidth: "56ch" }}>
            The whole product is clarity over noise. Tell us where it lands and where it
            doesn&rsquo;t — every note is read.
          </p>
        </section>
        <section className={styles.section}>
          <div className={styles.formWrap}>
            <FeedbackForm />
            <div className={styles.pay}>
              <div className={styles.kicker}>What helps most</div>
              <ul style={{ listStyle: "none", marginTop: "0.6rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li style={{ color: "var(--fg-dim)", fontSize: "0.9rem" }}>Which read landed instantly?</li>
                <li style={{ color: "var(--fg-dim)", fontSize: "0.9rem" }}>What needed a second look?</li>
                <li style={{ color: "var(--fg-dim)", fontSize: "0.9rem" }}>What would make the structure clearer?</li>
                <li style={{ color: "var(--fg-dim)", fontSize: "0.9rem" }}>Would you keep using it? Why / why not?</li>
              </ul>
              <p className={styles.payNote}>No detail is too small. Screenshots and ticker examples welcome by email.</p>
            </div>
          </div>
        </section>
        <footer className={styles.footer}>
          <div className={styles.footerRow}>
            <div>&copy; {new Date().getFullYear()} RangeClarity &middot; Simple chart. Complex engine.</div>
            <div className={styles.footerLinks}><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link></div>
          </div>
        </footer>
      </main>
    </div>
  );
}
