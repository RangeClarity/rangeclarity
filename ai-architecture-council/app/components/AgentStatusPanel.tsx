"use client";
/** Right panel: live per-agent status (Waiting / Running / Finished / Failed) + latency + confidence,
 *  driven by the /api/consult stream. */
const DOT: Record<string, string> = { waiting: "#64748b", running: "#facc15", finished: "#22c55e", failed: "#ef4444" };
export function AgentStatusPanel() {
  const demo = [
    { label: "Claude Code", status: "waiting" }, { label: "OpenAI Codex", status: "waiting" }, { label: "AntiGravity", status: "waiting" },
  ];
  return (
    <aside style={{ background: "#0b0f1a", border: "1px solid #1f2937", borderRadius: 12, padding: 12, height: "fit-content" }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".12em", color: "#94a3b8", marginBottom: 8 }}>Agent status</div>
      {demo.map((a) => (
        <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
          <span style={{ width: 9, height: 9, borderRadius: 999, background: DOT[a.status] }} />
          <span style={{ fontSize: 13 }}>{a.label}</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#64748b" }}>{a.status}</span>
        </div>
      ))}
    </aside>
  );
}
