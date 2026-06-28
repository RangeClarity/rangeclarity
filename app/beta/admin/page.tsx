import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "../beta.module.css";
import AdminConsole from "./AdminConsole";
import GrantConsole from "./GrantConsole";

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
            <Image className={styles.brandBadge} src="/brand/fox-badge.png" alt="" aria-hidden="true" width={24} height={24} />RangeClarity <small>Admin</small>
          </Link>
          <nav className={styles.headerNav}>
            <Link href="/beta">Beta home</Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.section} style={{ borderTop: "none" }}>
          <span className={styles.eyebrow}>Manual fulfilment · Supabase</span>
          <h2 className={styles.h2}>Access <span style={{ color: "var(--accent)" }}>grants</span></h2>
          <p className={styles.lead}>
            Source of truth: the <code>beta_signups</code> table. After adding a TradingView username to
            the invite-only script, mark the user granted to send the Access Granted email. Gated by{" "}
            <code>ADMIN_ACCESS_TOKEN</code>.
          </p>
          <div style={{ marginTop: "1.4rem" }}>
            <GrantConsole />
          </div>
        </section>
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
