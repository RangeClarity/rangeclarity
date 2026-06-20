import { PLANS, DISCLAIMER } from "../data";
import s from "../v2.module.css";

function Check() {
  return (
    <svg className={s.check} viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <path d="M3 8.4l3.1 3.1L13 4.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PricingSectionV2() {
  return (
    <section id="pricing" className={s.section}>
      <div className={s.wrap}>
        <div className={`${s.head} ${s.headCenter}`}>
          <span className={s.eyebrow}>Access</span>
          <h2 className={s.h2}>Simple access. <span className={s.gradGold}>Full range clarity.</span></h2>
          <p className={s.lead}>No hidden tiers. No signal-bot hype. Just premium TradingView indicators for reading structure.</p>
        </div>

        <div className={s.priceGrid}>
          {PLANS.map((p) => (
            <article key={p.id} className={`${s.priceCard} ${p.featured ? s.priceFeatured : ""}`}>
              <span className={`${s.priceBadge} ${p.featured ? s.priceBadgeGold : ""}`}>{p.badge}</span>
              <h3 className={s.priceName}>{p.name}</h3>
              <div className={s.priceAmt}>
                <span className={s.priceNum}>{p.price}</span>
                {p.cadence ? <span className={s.priceCadence}>{p.cadence}</span> : null}
              </div>
              <p className={s.priceBilling}>{p.billing}</p>
              <a href={p.href ?? "#join"} className={`${s.btnPrimary} ${s.priceCta}`}>{p.cta}</a>
              <ul className={s.priceFeats}>
                {p.features.map((f) => (
                  <li key={f}><Check /><span>{f}</span></li>
                ))}
              </ul>
              {p.note ? <p className={s.priceNote}>{p.note}</p> : null}
            </article>
          ))}
        </div>

        <p className={s.compliance}>{DISCLAIMER}</p>
      </div>
    </section>
  );
}
