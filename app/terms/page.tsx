import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | RangeClarity",
  description: "RangeClarity MVP terms for the landing page and waitlist.",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="container">
        <Link className="legal-nav" href="/">
          <span className="brand-mark" aria-hidden="true" />
          RangeClarity
        </Link>

        <article className="legal-content">
          <p className="section-eyebrow">Terms</p>
          <h1>Terms of Use</h1>
          <p className="legal-updated">Last updated June 15, 2026.</p>

          <p>
            These MVP terms cover the current RangeClarity landing page and
            waitlist. They should be reviewed before a paid product launch.
          </p>

          <h2>Educational Use Only</h2>
          <p>
            RangeClarity is intended to provide chart context and educational
            information. It does not provide financial advice, investment
            recommendations, trade signals, or guarantees of performance.
          </p>

          <h2>Your Responsibility</h2>
          <p>
            Trading and investing involve risk. You are responsible for your own
            research, risk management, and decisions. Do not rely on
            RangeClarity as the sole basis for any financial decision.
          </p>

          <h2>Waitlist Access</h2>
          <p>
            Joining the waitlist does not guarantee access to any future product,
            feature, price, or launch timeline. We may change or discontinue
            planned features as the product develops.
          </p>

          <h2>Acceptable Use</h2>
          <p>
            Do not misuse the site, interfere with its operation, submit false
            information, or attempt to access systems that are not public.
          </p>

          <h2>Contact</h2>
          <p>
            Questions can be sent to{" "}
            <a href="mailto:hello@rangeclarity.com">hello@rangeclarity.com</a>.
          </p>
        </article>
      </div>
    </main>
  );
}
