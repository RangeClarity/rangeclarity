import Image from "next/image";
import Link from "next/link";
import styles from "../beta.module.css";

/** Shared chrome (header + footer) for the beta doc routes. Server component. */
export default function BetaShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <Image className={styles.brandBadge} src="/brand/fox-badge.png" alt="" aria-hidden="true" width={24} height={24} />RangeClarity <small>Beta</small>
          </Link>
          <nav className={styles.headerNav}>
            <Link href="/beta/onboarding">Onboarding</Link>
            <Link href="/beta/how-to-use">How to use</Link>
            <Link href="/beta/tradingview-access">Access</Link>
            <Link href="/beta/faq">FAQ</Link>
            <Link href="/beta" className={`${styles.btn} ${styles.btnPrimary}`}>Join the beta</Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        {children}
        <footer className={styles.footer}>
          <div className={styles.footerRow}>
            <div>&copy; {new Date().getFullYear()} RangeClarity &middot; Simple chart. Complex engine.</div>
            <div className={styles.footerLinks}>
              <Link href="/beta/disclaimer">Disclaimer</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/beta/feedback">Feedback</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
