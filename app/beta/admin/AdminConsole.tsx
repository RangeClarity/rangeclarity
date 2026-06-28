"use client";

import { useState } from "react";
import styles from "../beta.module.css";

type Signup = {
  id: string;
  name: string;
  email: string;
  tradingViewUsername: string;
  selectedPlan: string;
  paymentProvider: string;
  paymentStatus: string;
  accessStatus: string;
  betaEndDate?: string;
  adminNotes?: string;
  createdAt: string;
};

const PLAN_LABEL: Record<string, string> = {
  free_preview: "Free $0",
  beta_29: "RangeClarity Beta $29/mo",
  pro_beta_49: "RangeClarity Pro Beta $49/mo",
};

function overdue(s: Signup): boolean {
  return s.accessStatus === "granted" && !!s.betaEndDate && Date.parse(s.betaEndDate) < Date.now();
}

export default function AdminConsole() {
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<Signup[] | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [override, setOverride] = useState(false);

  async function load() {
    setBusy(true); setError(""); setInfo("");
    try {
      const res = await fetch(`/api/admin/beta?token=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok || !data.ok) { setError(data.error ?? "Unauthorized."); setRows(null); }
      else setRows(data.signups as Signup[]);
    } catch { setError("Network error."); }
    finally { setBusy(false); }
  }

  async function post(payload: Record<string, unknown>) {
    setBusy(true); setError(""); setInfo("");
    try {
      const res = await fetch("/api/admin/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setError(data.error ?? "Action failed."); return; }
      if (Array.isArray(data.signups)) {
        setRows(data.signups as Signup[]);
        setInfo(`Expiry sweep: ${data.expired} updated.`);
      } else if (data.signup) {
        setRows((prev) => prev ? prev.map((r) => (r.id === data.signup.id ? { ...r, ...data.signup } : r)) : prev);
      }
    } catch { setError("Network error."); }
    finally { setBusy(false); }
  }

  const cell: React.CSSProperties = { padding: "0.5rem 0.55rem", borderBottom: "1px solid var(--line)", fontSize: "0.8rem", verticalAlign: "top" };
  const th: React.CSSProperties = { ...cell, fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-faint)", textAlign: "left" };
  const btn: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: "0.64rem", padding: "0.28rem 0.45rem", borderRadius: 6, border: "1px solid var(--line-2)", background: "var(--bg-2)", color: "var(--fg-dim)", cursor: "pointer", marginRight: 4, marginBottom: 4 };

  function statusColor(s: string): string {
    if (s === "paid" || s === "granted") return "var(--bull)";
    if (s === "failed" || s === "revoked" || s === "refunded") return "var(--bear)";
    if (s === "expired") return "var(--warn, #ffce4d)";
    return "var(--fg-dim)";
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "flex-end" }}>
        <div className={styles.field} style={{ maxWidth: 360, marginTop: 0 }}>
          <label className={styles.label} htmlFor="tok">Admin token</label>
          <input id="tok" className={styles.input} value={token} type="password"
            onChange={(e) => setToken(e.target.value)} placeholder="ADMIN_TOKEN" />
        </div>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={load} disabled={busy || !token}>
          {busy ? "…" : "Load"}
        </button>
        {rows && (
          <>
            <button type="button" className={styles.btn} onClick={() => post({ action: "expire_overdue" })} disabled={busy}>
              Run expiry sweep
            </button>
            <label className={styles.consent} style={{ marginTop: 0, display: "inline-flex", gap: 6, alignItems: "center" }}>
              <input type="checkbox" checked={override} onChange={(e) => setOverride(e.target.checked)} />
              Override access guard
            </label>
          </>
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {info && <div className={styles.payNote}>{info}</div>}

      {rows && (
        <div style={{ marginTop: "1.1rem", overflowX: "auto" }}>
          <p className={styles.payNote} style={{ marginBottom: "0.6rem" }}>
            {rows.length} signup{rows.length === 1 ? "" : "s"}. Mark payment received, then grant TradingView access
            (guard requires a TV username + a paid $29/$49 plan unless override is on).
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
            <thead><tr>
              <th style={th}>Name / email</th><th style={th}>TV username</th><th style={th}>Plan</th>
              <th style={th}>Payment</th><th style={th}>Access</th><th style={th}>Beta ends</th><th style={th}>Actions</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td style={cell}><b style={{ color: "var(--fg)" }}>{r.name}</b><br /><span style={{ color: "var(--fg-faint)" }}>{r.email}</span></td>
                  <td style={{ ...cell, fontFamily: "var(--mono)" }}>{r.tradingViewUsername}</td>
                  <td style={cell}>
                    <select defaultValue={r.selectedPlan} onChange={(e) => post({ action: "set_plan", id: r.id, plan: e.target.value })}
                      style={{ ...btn, marginRight: 0 }}>
                      <option value="free_preview">Free $0</option>
                      <option value="beta_29">RangeClarity Beta $29/mo</option>
                      <option value="pro_beta_49">RangeClarity Pro Beta $49/mo</option>
                    </select>
                  </td>
                  <td style={{ ...cell, color: statusColor(r.paymentStatus) }}>{r.paymentStatus}</td>
                  <td style={{ ...cell, color: statusColor(r.accessStatus) }}>{r.accessStatus}{overdue(r) ? " (overdue)" : ""}</td>
                  <td style={{ ...cell, fontFamily: "var(--mono)", fontSize: "0.7rem" }}>{r.betaEndDate ? r.betaEndDate.slice(0, 10) : "—"}</td>
                  <td style={cell}>
                    <button style={btn} onClick={() => post({ action: "mark_paid", id: r.id })} disabled={busy}>Mark paid</button>
                    <button style={btn} onClick={() => post({ action: "grant_access", id: r.id, override })} disabled={busy}>Grant</button>
                    <button style={btn} onClick={() => post({ action: "revoke_access", id: r.id })} disabled={busy}>Revoke</button>
                    <button style={btn} onClick={() => post({ action: "refund", id: r.id })} disabled={busy}>Refund</button>
                    <button style={btn} onClick={() => post({ action: "mark_failed", id: r.id })} disabled={busy}>Failed</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (<tr><td style={cell} colSpan={7}>No signups yet.</td></tr>)}
            </tbody>
          </table>
          <p className={styles.payNote} style={{ marginTop: "0.7rem" }}>
            <b style={{ color: "var(--fg)" }}>PLAN_LABEL ref:</b>{" "}
            {Object.values(PLAN_LABEL).join(" · ")}. Changing the Plan dropdown performs a manual upgrade/downgrade.
          </p>
        </div>
      )}
    </div>
  );
}
