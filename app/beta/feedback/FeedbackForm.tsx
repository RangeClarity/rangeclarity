"use client";

import { useState } from "react";
import styles from "../beta.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export default function FeedbackForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState({ email: "", message: "", company: "" });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/beta-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating: rating || undefined }),
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
          <h3>Thank you</h3>
          <p>Your feedback is logged and shapes what we build next. Clarity over noise.</p>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <span className={styles.label}>How clear was RangeClarity?</span>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n}
              className={`${styles.star} ${rating >= n ? styles.starOn : ""}`}
              aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRating(n)}>
              &#9733;
            </button>
          ))}
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="fmsg">What was clear, and what was confusing?</label>
        <textarea id="fmsg" className={styles.textarea} value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="What read instantly? What needed explaining? What would make the structure clearer?" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="femail">Email (optional)</label>
        <input id="femail" type="email" className={styles.input} value={form.email}
          onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" />
      </div>
      <div className={styles.hp} aria-hidden="true">
        <label>Company<input tabIndex={-1} autoComplete="off" value={form.company}
          onChange={(e) => update("company", e.target.value)} /></label>
      </div>
      {status === "error" && <div className={styles.error}>{error}</div>}
      <div className={styles.submitRow}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.fullBtn}`}
          disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send feedback"}
        </button>
      </div>
    </form>
  );
}
