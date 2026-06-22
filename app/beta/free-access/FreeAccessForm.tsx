"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../beta.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export default function FreeAccessForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    tvUsername: "",
    fullName: "",
    note: "",
    consent: false,
    company: "", // honeypot
  });

  function set(patch: Partial<typeof form>) {
    setForm((f) => ({ ...f, ...patch }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.consent) {
      setError("Please confirm the access + disclaimer checkbox.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/free-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "free-access-page" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.form}>
        <div className={styles.successCard}>
          <div className={styles.tick}>&#10003;</div>
          <h3>Request received</h3>
          <p>
            We&rsquo;ll review your TradingView username and manually add eligible users to the
            RangeClarity invite-only indicator. Access may take up to 24&ndash;48 hours during beta.
          </p>
          <p style={{ marginTop: "0.6rem" }}>
            <b>Make sure your TradingView username is exact.</b>
          </p>
          <div className={styles.submitRow}>
            <Link
              href="/beta/tradingview-access"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.fullBtn}`}
            >
              How access works &rarr;
            </Link>
          </div>
          <p className={styles.consent} style={{ marginTop: "0.7rem" }}>
            Need a TradingView account?{" "}
            <Link href="/tradingview-setup" style={{ color: "var(--accent)" }}>
              See the TradingView setup &rarr;
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="fa-email">Email</label>
          <input
            id="fa-email"
            type="email"
            className={styles.input}
            value={form.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder="you@email.com"
            autoComplete="email"
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="fa-tv">TradingView username</label>
          <input
            id="fa-tv"
            className={styles.input}
            value={form.tvUsername}
            onChange={(e) => set({ tvUsername: e.target.value })}
            placeholder="e.g. range_reader"
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="fa-name">Full name (optional)</label>
        <input
          id="fa-name"
          className={styles.input}
          value={form.fullName}
          onChange={(e) => set({ fullName: e.target.value })}
          placeholder="Your name"
          autoComplete="name"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="fa-note">Short note (optional)</label>
        <textarea
          id="fa-note"
          className={styles.textarea}
          value={form.note}
          onChange={(e) => set({ note: e.target.value })}
          placeholder="Markets / timeframes you watch&hellip;"
        />
      </div>

      <div className={styles.hp} aria-hidden="true">
        <label>
          Company
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(e) => set({ company: e.target.value })}
          />
        </label>
      </div>

      <label
        className={styles.consent}
        style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", cursor: "pointer" }}
      >
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => set({ consent: e.target.checked })}
          style={{ marginTop: "0.2rem", flex: "none" }}
          required
        />
        <span>
          I understand that TradingView access is added manually and RangeClarity does not provide
          financial advice, buy/sell signals, predictions, or guaranteed results.
        </span>
      </label>

      {status === "error" && <div className={styles.error}>{error}</div>}

      <div className={styles.submitRow}>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary} ${styles.fullBtn}`}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending request…" : "Request Free Access"}
        </button>
      </div>
    </form>
  );
}
