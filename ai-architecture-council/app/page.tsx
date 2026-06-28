import { AgentChips } from "./components/AgentChips";
import { PromptBox } from "./components/PromptBox";
import { AgentStatusPanel } from "./components/AgentStatusPanel";
import { ResultTabs } from "./components/ResultTabs";
import { listProviders } from "@/providers/registry";

/** Layout: top = "Consult with [chips]" + prompt; right = live agent status; bottom = result tabs.
 *  This is the wiring skeleton — client state (selected agents, weights, streaming events) is added
 *  per docs/IMPLEMENTATION-PLAN.md. */
export default function Page() {
  const providers = listProviders();
  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>AI Architecture <span style={{ color: "#7c9cff" }}>Council</span></h1>
      <p style={{ color: "#94a3b8", fontSize: 13 }}>One task → many expert agents → structured debate → one decision → Hermes plan → Linear preview. Nothing executes or writes to Linear without your approval.</p>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginTop: 16 }}>
        <div>
          <AgentChips providers={providers} />
          <PromptBox />
        </div>
        <AgentStatusPanel />
      </section>

      <ResultTabs />
    </main>
  );
}
