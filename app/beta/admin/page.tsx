import type { Metadata } from "next";
import Link from "next/link";
import styles from "../beta.module.css";
import AdminConsole from "./AdminConsole";

export const metadata: Metadata = {
  title: "RangeClarity — Beta Admin",
  description: "Manual beta fulfilment console.",
  robots: { index: false },
};

export default function BetaAdmin() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark} />RangeClarity <small>Admin</small>
          </Link>
          <nav className={styles.headerNav}>
            <Link href="/beta">Beta home</Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.section} style={{ borderTop: "none" }}>
          <span className={styles.eyebrow}>Manual fulfilment</span>
          <h2 className={styles.h2}>Beta access <span style={{ color: "var(--accent)" }}>console</span></h2>
          <p className={styles.lead}>
            Confirm payments and grant TradingView access by hand. Set <code>ADMIN_TOKEN</code> in
            your environment; this console is gated and never processes live payments.
          </p>
          <div style={{ marginTop: "1.4rem" }}>
            <AdminConsole />
          </div>
        </section>
      </main>
    </div>
  );
}
