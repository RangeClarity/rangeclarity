import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | RangeClarity",
  description: "How RangeClarity handles waitlist information during the MVP.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="container">
        <Link className="legal-nav" href="/">
          <span className="brand-mark" aria-hidden="true" />
          RangeClarity
        </Link>

        <article className="legal-content">
          <p className="section-eyebrow">Privacy</p>
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last updated June 15, 2026.</p>

          <p>
            RangeClarity is in MVP development. This policy explains the limited
            information collected by the current landing page and waitlist flow.
            It should be reviewed before a broader public launch.
          </p>

          <h2>Information We Collect</h2>
          <p>
            When you join the waitlist, we collect the email address you submit,
            the signup time, and a simple source label such as &ldquo;landing&rdquo;. We do
            not collect payment information in the current MVP.
          </p>

          <h2>How We Use It</h2>
          <ul>
            <li>To send RangeClarity launch and product-access updates.</li>
            <li>To understand waitlist interest before building paid features.</li>
            <li>To respond if you contact us directly.</li>
          </ul>

          <h2>Sharing</h2>
          <p>
            We do not sell waitlist information. If the project moves to a
            hosted email, waitlist, analytics, or payment provider, that provider
            may process information only to support RangeClarity operations.
          </p>

          <h2>Retention and Deletion</h2>
          <p>
            You can ask to be removed from the waitlist by emailing{" "}
            <a href="mailto:hello@rangeclarity.com">hello@rangeclarity.com</a>.
            We will delete or unsubscribe your email from the active waitlist.
          </p>

          <h2>Financial Disclaimer</h2>
          <p>
            RangeClarity is an educational chart-context tool. It does not
            provide financial advice, investment recommendations, trade
            signals, or guarantees of performance.
          </p>
        </article>
      </div>
    </main>
  );
}
