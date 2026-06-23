"use client";

import { useState } from "react";
import styles from "./ops.module.css";

/**
 * Copy-to-clipboard button. The ONLY interactive behavior in the Ops Console:
 * it copies text (a command string or a prompt's contents) to the clipboard.
 * It never executes anything.
 */
export function CopyButton({
  text,
  label = "Copy",
  small = false,
}: {
  text: string;
  label?: string;
  small?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`${styles.copyBtn} ${small ? styles.copyBtnSm : ""}`}
      aria-live="polite"
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}
