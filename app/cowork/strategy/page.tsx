import styles from "../cowork.module.css";
import { coworkFlags } from "@/lib/cowork/flags";

export default function CoworkStrategy() {
  const f = coworkFlags();
  return (
    <section className={styles.surface}>
      <h1 className={styles.h1}>Strategy</h1>
      <p className={styles.q}>A durable thinking space — decisions, research, sessions, trade-offs, open questions.</p>
      <div className={styles.placeholder}>
        <div className={styles.phRow}>Threads + council sessions <span>— empty shell (Step 5)</span></div>
        <div className={styles.phRow}>Decisions · research · rejected ideas · architecture reviews <span>— empty shell</span></div>
      </div>
      <p className={styles.flagNote}>surface flag COWORK_STRATEGY: {f.strategy ? "on" : "off (shell preview)"}</p>
    </section>
  );
}
