import styles from "./cowork.module.css";
import { coworkFlags } from "@/lib/cowork/flags";

export default function CoworkHome() {
  const f = coworkFlags();
  return (
    <section className={styles.surface}>
      <h1 className={styles.h1}>Home</h1>
      <p className={styles.q}>Continue where you stopped.</p>
      <div className={styles.placeholder}>
        <div className={styles.phRow}>Continue <span>— resume target (Step 3)</span></div>
        <div className={styles.phRow}>Focus · Blocker · Recommendation <span>— empty shell</span></div>
        <div className={styles.phRow}>Recent projects <span>— empty shell</span></div>
      </div>
      <p className={styles.flagNote}>surface flag COWORK_HOME: {f.home ? "on" : "off (shell preview)"}</p>
    </section>
  );
}
