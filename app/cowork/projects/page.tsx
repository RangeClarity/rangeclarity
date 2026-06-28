import styles from "../cowork.module.css";
import { coworkFlags } from "@/lib/cowork/flags";

export default function CoworkProjects() {
  const f = coworkFlags();
  return (
    <section className={styles.surface}>
      <h1 className={styles.h1}>Projects</h1>
      <p className={styles.q}>The operating object — everything lives in a project.</p>
      <div className={styles.placeholder}>
        <div className={styles.phRow}>Project list + switcher <span>— empty shell (Step 4)</span></div>
        <div className={styles.phRow}>Inside a project: Work · Knowledge · Progress · History <span>— contextual, not tabs</span></div>
      </div>
      <p className={styles.flagNote}>surface flag COWORK_PROJECTS: {f.projects ? "on" : "off (shell preview)"}</p>
    </section>
  );
}
