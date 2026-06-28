"use client";
import { useEffect, useState } from "react";
import styles from "./cowork.module.css";

/** ⌘K shell. Opens an empty palette (no actions/search wired — Step 6). Previews regardless of the
 *  COWORK_CMDK flag; the flag indicates whether live actions are enabled (currently none). */
export function CommandPalette({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <button type="button" className={styles.cmdkBtn} onClick={() => setOpen(true)}>
        <span>Search &amp; actions</span><kbd className={styles.kbd}>⌘K</kbd>
      </button>
      {open && (
        <div className={styles.overlay} role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
            <input className={styles.paletteInput} placeholder="Search or run a command…" autoFocus />
            <div className={styles.paletteHint}>
              {enabled
                ? "Command palette — shell ready (no actions wired yet)."
                : "Command palette is gated by COWORK_CMDK (off). Showing the shell preview."}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
