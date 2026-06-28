import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./cowork.module.css";
import { CommandPalette } from "./CommandPalette";
import type { CoworkFlags } from "@/lib/cowork/flags";

const b = (v: boolean) => (v ? "on" : "off");

/** The only navigation: a 3-item rail (Home · Projects · Strategy) + ⌘K. No tools-as-tabs. */
export function AppShell({ flags, children }: { flags: CoworkFlags; children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.rail}>
        <div className={styles.brand}>Co Work <span className={styles.tag}>shell</span></div>
        <nav className={styles.nav}>
          <Link href="/cowork" className={styles.navItem}>Home</Link>
          <Link href="/cowork/projects" className={styles.navItem}>Projects</Link>
          <Link href="/cowork/strategy" className={styles.navItem}>Strategy</Link>
        </nav>
        <CommandPalette enabled={flags.cmdk} />
        <div className={styles.flags}>
          <div className={styles.flagsTitle}>flags</div>
          V2 {b(flags.v2)} · Home {b(flags.home)} · Projects {b(flags.projects)} · Strategy {b(flags.strategy)} · ⌘K {b(flags.cmdk)}
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
