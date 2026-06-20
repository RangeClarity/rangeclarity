import type { Metadata } from "next";
import BetaShell from "../_components/BetaShell";
import styles from "../beta.module.css";

export const metadata: Metadata = {
  title: "RangeClarity — Beta FAQ",
  description: "Frequently asked questions about the RangeClarity private beta.",
  robots: { index: false },
};

const FAQS: { q: string; a: string }[] = [
  { q: "Is RangeClarity financial advice?", a: "No. RangeClarity is an educational market-structure visualization tool. It does not give advice, recommendations, or buy/sell signals. You make your own decisions." },
  { q: "Does it predict price or guarantee results?", a: "No. It does not predict direction, claim win rates, or promise outcomes. It reads the structure already on the chart — range, bias, support and resistance, and clarity." },
  { q: "What are the plans?", a: "Free Preview ($0) — docs preview, updates, and a spot on the list, with no invite-only access unless manually approved. Beta Access ($29) — the main paid beta with the full invite-only indicator. Pro Beta ($49) — everything in Beta Access plus priority manual access review, priority support/feedback, and early feature previews when available." },
  { q: "What does the $49 Pro plan give me?", a: "Higher-intent support: priority access review, priority support and feedback, early feature previews, and the private feedback channel when available. It does not give better trades, better performance, signals, or any profit advantage — it is the same structure tool with priority service." },
  { q: "How do I get access?", a: "Register with your TradingView username. A founder confirms your spot and grants invite-only access by hand, then helps you onboard. It is manual on purpose during the private beta." },
  { q: "What do I need to use it?", a: "A TradingView account (the free tier is fine to start) and the username you register with." },
  { q: "How does payment work right now?", a: "No charge happens in the app — there are no live automated payments yet. Paid plans receive a manual payment link and personal confirmation from a founder." },
  { q: "What is the first use case?", a: "RangeClarity is built first for Daily/Weekly chart structure review — reading bias, support/resistance, range position, and clarity across your watchlist." },
  { q: "Can I leave the beta?", a: "Yes, anytime. Access is invite-only and managed by hand, so we can add or remove it on request. Refunds revoke access." },
];

export default function BetaFaq() {
  return (
    <BetaShell>
      <section className={styles.hero} style={{ paddingBottom: "0.6rem" }}>
        <span className={styles.eyebrow}>FAQ</span>
        <h1 className={styles.h1} style={{ maxWidth: "16ch" }}>
          Questions, <span className={styles.accent}>answered</span>.
        </h1>
      </section>
      <section className={styles.section} style={{ borderTop: "none", paddingTop: "0.5rem" }}>
        <div className={styles.faqList}>
          {FAQS.map((f) => (
            <details className={styles.faq} key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <div className={styles.disclaimer}>
          <strong>Disclaimer.</strong> RangeClarity is a market-structure visualization tool for educational
          purposes only. It does not provide buy/sell signals, price predictions, win-rate claims, or financial
          advice. Markets carry risk; decisions and outcomes are your own.
        </div>
      </section>
    </BetaShell>
  );
}
