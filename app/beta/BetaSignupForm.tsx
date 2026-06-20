"use client";

import { useState } from "react";
import Link from "next/link";
import type { SelectedPlan } from "@/lib/payments";
import styles from "./beta.module.css";

type Status = "idle" | "submitting" | "success" | "error";
type PlanLite = { id: SelectedPlan; label: string; price: string; paid: boolean };

const USER_TYPES: { value: string; label: string }[] = [
  { value: "swing_trader", label: "Swing trader" },
  { value: "investor", label: "Investor / position" },
  { value: "day_trader", label: "Day trader" },
  { value: "analyst", label: "Analyst / researcher" },
  { value: "other", label: "Other" },
];

export default function BetaSignupForm({
  initialPlan,
  plans,
}: {
  initialPlan: SelectedPlan;
  plans: PlanLite[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [plan, setPlan] = useState<SelectedPlan>(initialPlan);
  const [form, setForm] = useState({
    name: "",
    email: "",
    tvUsername: "",
    userType: "swing_trader",
    notes: "",
    company: "", // honeypot
  });

  const selected = plans.find((p) => p.id === plan);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/beta-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan, source: "beta-landing" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      let nextMessage =
        "You're registered. A founder will confirm your beta access shortly.";
      let link: string | null = null;
      try {
        const co = await fetch("/api/beta-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signupId: data.id }),
        });
        const coData = await co.json();
        if (coData?.result?.mode === "manual") {
          nextMessage = coData.result.message;
          link = coData.result.paymentLink ?? null;
        } else if (coData?.result?.mode === "redirect" && coData.result.url) {
          window.location.href = coData.result.url;
          return;
        } else if (coData?.error) {
          nextMessage = coData.error;
        }
      } catch {
        /* checkout is best-effort; the signup is already saved */
      }

      setMessage(nextMessage);
      setPaymentLink(link);
      setStatus("success");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    const isUrl = paymentLink ? /^https?:\/\//i.test(paymentLink) : false;
    return (
      <div className={styles.form}>
        <div className={styles.successCard}>
          <div className={styles.tick}>&#10003;</div>
          <h3>Your spot is reserved</h3>
          <p>{message}</p>
          {paymentLink && (
            <div style={{ marginTop: "0.9rem" }}>
              {isUrl ? (
                <a
                  href={paymentLink}
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.fullBtn}`}
                >
                  Complete payment &rarr;
                </a>
              ) : (
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.8rem",
                    color: "var(--fg-faint)",
                    border: "1px dashed var(--line-2)",
                    borderRadius: 8,
                    padding: "0.7rem",
                    wordBreak: "break-all",
                  }}
                >
                  {paymentLink}
                  <div style={{ marginTop: "0.4rem", color: "var(--fg-dim)" }}>
                    A founder will send your secure payment link here.
                  </div>
                </div>
              )}
            </div>
          )}
          <div className={styles.submitRow}>
            <Link
              href="/beta/onboarding"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.fullBtn}`}
            >
              How access works &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate id="join">
      <div className={styles.field}>
        <span className={styles.label}>Choose your plan</span>
        <div className={styles.planRow}>
          {plans.map((p) => (
            <button
              type="button"
              key={p.id}
              className={`${styles.planOpt} ${plan === p.id ? styles.planOptOn : ""}`}
              onClick={() => setPlan(p.id)}
              aria-pressed={plan === p.id}
            >
              <span className={styles.planPrice}>{p.price}</span>
              <span className={styles.planName}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Name</label>
          <input id="name" className={styles.input} value={form.name}
            onChange={(e) => update("name", e.target.value)} placeholder="Your name" autoComplete="name" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input id="email" type="email" className={styles.input} value={form.email}
            onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" autoComplete="email" required />
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="tv">TradingView username</label>
          <input id="tv" className={styles.input} value={form.tvUsername}
            onChange={(e) => update("tvUsername", e.target.value)} placeholder="e.g. range_reader" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="type">You are a&hellip;</label>
          <select id="type" className={styles.select} value={form.userType}
            onChange={(e) => update("userType", e.target.value)}>
            {USER_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="notes">What do you want clarity on? (optional)</label>
        <textarea id="notes" className={styles.textarea} value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Markets / timeframes you watch, what you'd test first…" />
      </div>

      <div className={styles.hp} aria-hidden="true">
        <label>Company
          <input tabIndex={-1} autoComplete="off" value={form.company}
            onChange={(e) => update("company", e.target.value)} />
        </label>
      </div>

      {status === "error" && <div className={styles.error}>{error}</div>}

      <div className={styles.submitRow}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.fullBtn}`}
          disabled={status === "submitting"}>
          {status === "submitting"
            ? "Reserving your spot…"
            : selected && selected.paid
              ? `Request ${selected.label} (${selected.price})`
              : "Join the free preview"}
        </button>
      </div>
      <p className={styles.consent}>
        We&rsquo;ll only use your details to run the private beta. No spam, no signals,
        no financial advice. Your TradingView username lets us grant invite-only access.
      </p>
    </form>
  );
}
