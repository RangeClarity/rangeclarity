"use client";

import { useEffect, useState } from "react";
import styles from "./foxBrandHero.module.css";

/**
 * Mobile-only sticky conversion bar (≤767px). Renders the same two CTAs as before,
 * but fades out while the final "#join" CTA is on screen, so the page never shows two
 * identical "Get Beta Access" CTAs at once.
 *
 * SSR-safe: renders visible by default (matches the prior static markup; with JS
 * disabled it simply stays visible). Reduced-motion friendly: the slide/fade is a CSS
 * transition that prefers-reduced-motion disables.
 */
export function StickyCtaBar() {
  const [atFinalCta, setAtFinalCta] = useState(false);

  useEffect(() => {
    const target = document.getElementById("join");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => setAtFinalCta(entries[0]?.isIntersecting ?? false),
      { rootMargin: "0px 0px -96px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`${styles.mobileCta}${atFinalCta ? ` ${styles.mobileCtaHidden}` : ""}`}
      aria-hidden={atFinalCta || undefined}
    >
      <a className={styles.mCtaPrimary} href="/beta?plan=beta_29" tabIndex={atFinalCta ? -1 : undefined}>
        Get Beta Access <span aria-hidden="true">→</span>
      </a>
      <a className={styles.mCtaSecondary} href="/beta/free-access" tabIndex={atFinalCta ? -1 : undefined}>
        Try 7-Day Free Access
      </a>
    </div>
  );
}
