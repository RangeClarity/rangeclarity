"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "ok" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, source: "landing" }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        status?: string;
        error?: string;
      };

      if (res.ok && data.ok) {
        setStatus("ok");
        setEmail("");
        setMessage(
          data.status === "duplicate"
            ? "You're already on the list - we'll be in touch."
            : "You're on the list. We'll email you when Pro opens.",
        );
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
      <input
        type="email"
        name="email"
        inputMode="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        aria-label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "submitting"}
      />

      {/* Honeypot - visually hidden, ignored by humans. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Joining..." : "Join Pro Waitlist"}
      </button>

      <p
        className={`form-msg ${status === "ok" ? "ok" : status === "error" ? "err" : ""}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
