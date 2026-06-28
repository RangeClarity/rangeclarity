"use client";

import { useState } from "react";
import { rcTrack } from "@/lib/analytics";

type Row = {
  id: string;
  email: string;
  tradingview_username: string;
  selected_plan: string;
  status: string | null;
  invited_at: string | null;
  email_error: string | null;
  created_at: string;
};

const PLAN: Record<string, string> = {
  free_preview: "Free $0",
  beta_29: "RangeClarity Beta $29/mo",
  pro_beta_49: "RangeClarity Pro Beta $49/mo",
};

export default function GrantConsole() {
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState("");

  async function load() {
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch(`/api/admin/beta/grant?token=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Unauthorized.");
        setRows(null);
      } else {
        setRows(data.signups as Row[]);
        setInfo(`${(data.signups as Row[]).length} signups loaded.`);
      }
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function grant(id: string) {
    setBusyId(id);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/admin/beta/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ signupId: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? data.message ?? "Grant failed.");
      } else {
        setInfo(data.message ?? "Done.");
        if (data.granted) rcTrack("access_granted_click");
        setRows((prev) =>
          prev ? prev.map((r) => (r.id === id ? { ...r, status: "granted" } : r)) : prev,
        );
      }
    } catch {
      setError("Network error.");
    } finally {
      setBusyId("");
    }
  }

  const cell: React.CSSProperties = {
    padding: "0.5rem 0.55rem",
    borderBottom: "1px solid #1e2a3f",
    fontSize: "0.8rem",
    verticalAlign: "top",
    color: "#d8e6f4",
  };
  const th: React.CSSProperties = {
    ...cell,
    fontSize: "0.62rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#8aa0b8",
    textAlign: "left",
  };
  const btnPrimary: React.CSSProperties = {
    padding: "0.4rem 0.7rem",
    borderRadius: 8,
    border: "1px solid #2a3a52",
    background: "#34f5b0",
    color: "#04210f",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "0.72rem",
  };
  const input: React.CSSProperties = {
    padding: "0.55rem 0.7rem",
    borderRadius: 8,
    border: "1px solid #2a3a52",
    background: "rgba(255,255,255,0.04)",
    color: "#e8f2fb",
    fontSize: "0.85rem",
    minWidth: 220,
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          style={input}
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ADMIN_ACCESS_TOKEN"
        />
        <button
          style={{ ...btnPrimary, background: "#1b2740", color: "#e8f2fb" }}
          onClick={load}
          disabled={busy || !token}
        >
          {busy ? "Loading…" : "Load signups"}
        </button>
      </div>

      {error && <div style={{ marginTop: "0.7rem", color: "#f0a8b8", fontSize: "0.82rem" }}>{error}</div>}
      {info && <div style={{ marginTop: "0.7rem", color: "#34f5b0", fontSize: "0.82rem" }}>{info}</div>}

      {rows && (
        <div style={{ marginTop: "1rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Created</th>
                <th style={th}>Email</th>
                <th style={th}>TradingView</th>
                <th style={th}>Plan</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td style={cell}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td style={cell}>{r.email}</td>
                  <td style={cell}>{r.tradingview_username}</td>
                  <td style={cell}>{PLAN[r.selected_plan] ?? r.selected_plan}</td>
                  <td style={{ ...cell, color: r.status === "granted" ? "#34f5b0" : "#e6b95f" }}>
                    {r.status ?? "pending"}
                  </td>
                  <td style={cell}>
                    {r.status === "granted" ? (
                      <span style={{ color: "#8aa0b8" }}>
                        granted{r.email_error ? " · email failed" : ""}
                      </span>
                    ) : (
                      <button style={btnPrimary} onClick={() => grant(r.id)} disabled={busyId === r.id}>
                        {busyId === r.id ? "Working…" : "Mark as Granted + Send Email"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
