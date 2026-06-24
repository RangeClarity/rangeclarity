import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./beta.module.css";
import TradingViewCTA from "@/app/_components/TradingViewCTA";
import BetaSignupForm from "./BetaSignupForm";
import { listProviderStatus, PLAN_CONFIG, normalizePlan } from "@/lib/payments";

export const metadata: Metadata = {
  title: "RangeClarity — Private Paid Beta",
  description:
    "Join the RangeClarity private beta. A clarity layer for reading market structure inside TradingView. Simple chart, complex engine. No signals, no noise, just structure.",
  openGraph: {
    title: "RangeClarity — Private Paid Beta",
    description:
      "A clarity layer for reading market structure inside TradingView. No signals. No noise. Just structure.",
    url: "/beta",
    siteName: "RangeClarity",
    type: "website",
  },
};


function RangeChart() {
  return (
    <div className={styles.frame}>
      <div className={styles.frameBar}>
        <b>BTCUSD</b><span>&middot;</span><span>1D</span>
        <span className={styles.frameLive}><span className={styles.dot} />STRUCTURE</span>
      </div>
      <svg viewBox="0 0 560 280" width="100%" role="img" aria-label="Market structure map">
        <defs>
          <linearGradient id="band" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#38e8ff" stopOpacity="0.10" />
            <stop offset="1" stopColor="#38e8ff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <rect x="0" y="78" width="560" height="120" fill="url(#band)" />
        <line x1="0" y1="78" x2="560" y2="78" stroke="#38e8ff" strokeDasharray="5 4" strokeOpacity="0.55" />
        <line x1="0" y1="198" x2="560" y2="198" stroke="#ff4fd8" strokeDasharray="5 4" strokeOpacity="0.5" />
        <line x1="0" y1="138" x2="560" y2="138" stroke="#9aa6c4" strokeDasharray="2 5" strokeOpacity="0.4" />
        <polyline points="0,170 50,150 95,176 140,120 185,142 230,96 275,118 320,150 365,108 410,128 455,84 500,112 560,98"
          fill="none" stroke="#2fffd6" strokeWidth="2.4" />
        <circle cx="230" cy="96" r="4.5" fill="#ffce4d" />
        <circle cx="455" cy="84" r="4.5" fill="#b6ff3c" />
        <text x="10" y="70" fill="#38e8ff" fontFamily="monospace" fontSize="11" letterSpacing="2">STRONG ZONE</text>
        <text x="10" y="218" fill="#ff4fd8" fontFamily="monospace" fontSize="11" letterSpacing="2">WEAK STRUCTURE</text>
        <text x="450" y="252" fill="#5c668a" fontFamily="monospace" fontSize="10" letterSpacing="2">KEY S/R</text>
      </svg>
      <div className={styles.frameBar} style={{ borderTop: "1px solid var(--line)", borderBottom: "none" }}>
        <span>BIAS</span> <b style={{ color: "#34f5b0" }}>CONSTRUCTIVE</b>
        <span>&middot;</span> <span>RANGE POSITION</span> <b>0.62</b>
        <span>&middot;</span> <span>CLARITY</span> <b style={{ color: "#2fffd6" }}>HIGH</b>
      </div>
    </div>
  );
}

export default async function BetaLanding({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const sp = await searchParams;
  const initialPlan = normalizePlan(sp.plan);
  const planList = (["free_preview", "beta_29", "pro_beta_49"] as const).map((id) => ({
    id,
    label: PLAN_CONFIG[id].label,
    price: PLAN_CONFIG[id].price,
    paid: PLAN_CONFIG[id].paid,
  }));
  const providers = listProviderStatus();
  const active = providers.find((p) => p.active);
  const selectedCfg = PLAN_CONFIG[initialPlan];

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <Image className={styles.brandBadge} src="/brand/fox-badge.png" alt="" aria-hidden="true" width={24} height={24} />RangeClarity <small>Beta</small>
          </Link>
          <nav className={styles.headerNav}>
            <a href="#how">How it works</a>
            <a href="#resources">TradingView</a>
            <a href="#faq">FAQ</a>
            <a href="#join" className={`${styles.btn} ${styles.btnPrimary}`}>Get Beta Access</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>Private paid beta &middot; invite-only</span>
              <h1 className={styles.h1}>
                Read the range before you make the <span className={styles.accent}>move</span>.
              </h1>
              <p className={styles.heroSub}>
                Simple chart, complex engine. A clarity layer for market structure inside
                TradingView — structure, bias, support and resistance, range position, and a
                clarity score. No signals. No noise. Just structure.
              </p>
              <div className={styles.ctaRow}>
                <a href="#join" className={`${styles.btn} ${styles.btnPrimary}`}>Get Beta Access</a>
                <a href="/beta/free-access" className={styles.btn}>7-Day Free Access</a>
              </div>
              <p className={styles.ctaNote}>
                Private beta &middot; TradingView username required &middot; manual invite.{" "}
                <Link href="/beta/free-access">Or try 7-Day Free Access &rarr;</Link>
              </p>
              <div className={styles.heroStats}>
                <div><div style={{ fontFamily: "var(--mono)", color: "var(--fg)" }}>Clarity</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-faint)" }}>over noise</div></div>
                <div><div style={{ fontFamily: "var(--mono)", color: "var(--fg)" }}>0 signals</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-faint)" }}>structure only</div></div>
                <div><div style={{ fontFamily: "var(--mono)", color: "var(--fg)" }}>TradingView</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-faint)" }}>invite-only</div></div>
              </div>
            </div>
            <RangeChart />
          </div>
        </section>

        <section className={styles.section} id="what">
          <span className={styles.eyebrow}>What it shows</span>
          <h2 className={styles.h2}>One clean overlay. A <span style={{ color: "var(--accent)" }}>complex engine</span> underneath.</h2>
          <p className={styles.lead}>RangeClarity reads four plain things on every chart — and never tells you to buy or sell.</p>
          <div className={styles.grid4}>
            <div className={styles.card}><div className={styles.kicker}>Structure &amp; bias</div><h3>Where price stands</h3><p>Bullish, bearish, sideways, or unclear — the structural read at a glance.</p></div>
            <div className={styles.card}><div className={styles.kicker}>Support &amp; resistance</div><h3>Levels that matter</h3><p>Local, Key, and Strong zones — tiered by how much structure backs them.</p></div>
            <div className={styles.card}><div className={styles.kicker}>Range position</div><h3>Where in the range</h3><p>How far price sits between the boundaries, and the channel state.</p></div>
            <div className={styles.card}><div className={styles.kicker}>Clarity score</div><h3>Is this clean?</h3><p>A single read on whether the chart is structurally clear or just chop.</p></div>
          </div>
        </section>

        <section className={styles.section} id="how">
          <span className={styles.eyebrow}>How access works</span>
          <h2 className={styles.h2}>Three steps to <span style={{ color: "var(--accent)" }}>invite-only</span> access</h2>
          <div className={styles.steps}>
            <div className={styles.step}><div className={styles.stepNum}>01</div><h3>Register</h3><p>Tell us your name, email, and TradingView username. That username is how we grant invite-only access to your chart.</p></div>
            <div className={styles.step}><div className={styles.stepNum}>02</div><h3>Confirm your spot</h3><p>The private beta is confirmed manually by a founder — no automated billing yet. You&rsquo;ll get a payment link and confirmation.</p></div>
            <div className={styles.step}><div className={styles.stepNum}>03</div><h3>Get access &amp; onboard</h3><p>We add the RangeClarity indicator to your TradingView account and walk you through reading the structure. Then you give feedback.</p></div>
          </div>
        </section>

        <section className={styles.section} id="join">
          <span className={styles.eyebrow}>Join the beta</span>
          <h2 className={styles.h2}>Request your <span style={{ color: "var(--accent)" }}>beta access</span></h2>
          <p className={styles.lead}>
            You selected <b style={{ color: "var(--fg)" }}>{selectedCfg.label} ({selectedCfg.price})</b> — {selectedCfg.blurb} You can switch plans below.
          </p>
          <div className={styles.formWrap}>
            <BetaSignupForm initialPlan={initialPlan} plans={planList} />
            <div className={styles.pay}>
              <div className={styles.payHead}>
                <div className={styles.kicker}>Payment</div>
                <span className={`${styles.tag} ${styles.tagOk}`}>Secure checkout</span>
              </div>
              <h3 style={{ marginTop: "0.5rem", fontSize: "1rem", fontWeight: 650 }}>
                {active ? active.label : "Manual (founder-confirmed)"}
              </h3>
              <p className={styles.payNote}>
                Secure checkout powered by Lemon Squeezy. The paid plans ($29/mo / $49/mo) open a
                hosted Lemon Squeezy checkout; the 7-day free option is a manual request.
              </p>
              <p className={styles.payNote}>
                TradingView access is fulfilled manually during beta &mdash; you&rsquo;ll receive access
                instructions after your purchase or request is reviewed (usually within 24&ndash;48 hours).
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section} id="resources">
          <span className={styles.eyebrow}>TradingView</span>
          <h2 className={styles.h2}>New to <span style={{ color: "var(--accent)" }}>TradingView</span>? Start here</h2>
          <p className={styles.lead}>RangeClarity lives inside TradingView as an invite-only indicator. You need a TradingView account to use it.</p>
          <div className={styles.resGrid}>
            <div className={styles.card}><div className={styles.kicker}>Step 1</div><h3>Create an account</h3>
              <p>A free TradingView account is enough to start.</p></div>
            <div className={styles.card}><div className={styles.kicker}>Step 2</div><h3>Share your username</h3>
              <p>Give us your exact TradingView username on signup — that&rsquo;s how invite-only access is granted.</p></div>
            <div className={styles.card}><div className={styles.kicker}>Step 3</div><h3>Add the indicator</h3>
              <p>Once approved, RangeClarity appears under your Invite-only scripts. Add it to any chart and the structure renders instantly.</p></div>
          </div>
          <TradingViewCTA note="This may be an affiliate link." />
        </section>

        <section className={styles.section} id="faq">
          <span className={styles.eyebrow}>FAQ</span>
          <h2 className={styles.h2}>Questions, <span style={{ color: "var(--accent)" }}>answered</span></h2>
          <div className={styles.faqList}>
            <details className={styles.faq}><summary>Is RangeClarity financial advice?</summary>
              <p>No. RangeClarity is an educational clarity layer that describes market structure. It does not give advice, recommendations, or buy/sell signals. You make your own decisions.</p></details>
            <details className={styles.faq}><summary>Does it predict price or guarantee results?</summary>
              <p>No. It does not predict direction, claim win rates, or promise outcomes. It reads the structure already on the chart — range, bias, support and resistance, and clarity.</p></details>
            <details className={styles.faq}><summary>What are the plans?</summary>
              <p>Three tiers: <b>7-Day Free Access ($0)</b> — a 7-day trial of the invite-only indicator, added manually after review; <b>RangeClarity Beta ($29/mo)</b> — the main paid beta with the full invite-only indicator; <b>RangeClarity Pro Beta ($49/mo)</b> — everything in RangeClarity Beta plus priority support, feedback, and early feature previews.</p></details>
            <details className={styles.faq}><summary>How do I get access?</summary>
              <p>Register with your TradingView username. A founder confirms your spot and grants invite-only access, then helps you onboard. It&rsquo;s manual on purpose during the private beta.</p></details>
            <details className={styles.faq}><summary>How does payment work right now?</summary>
              <p>No charge happens in the app — there are no live automated payments yet. Paid plans receive a manual payment link and personal confirmation from a founder.</p></details>
            <details className={styles.faq}><summary>Can I leave the beta?</summary>
              <p>Yes, anytime. Access is invite-only and managed by hand, so we can add or remove it on request.</p></details>
            <details className={styles.faq}><summary>How do I get TradingView access?</summary>
              <p>RangeClarity runs inside TradingView as an invite-only indicator. Create a TradingView account, then submit your exact username — eligible users are added manually, usually within 24 hours during beta. <Link href="/tradingview-setup" style={{ color: "var(--accent)" }}>See the TradingView setup &rarr;</Link></p></details>
          </div>
          <div className={styles.disclaimer}>
            <strong>Disclaimer.</strong> RangeClarity is provided for educational and informational purposes only and is not financial, investment, or trading advice. It does not generate buy or sell signals, predict prices, or guarantee any result. Markets carry risk; decisions and outcomes are your own. This is a private beta — features and access may change.
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerRow}>
            <div>&copy; {new Date().getFullYear()} RangeClarity &middot; Simple chart. Complex engine.</div>
            <div className={styles.footerLinks}>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/beta/feedback">Feedback</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
