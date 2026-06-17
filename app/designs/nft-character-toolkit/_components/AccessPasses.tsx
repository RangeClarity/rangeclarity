import { PASSES } from "../data";
import s from "../nft.module.css";

function Check() {
  return (
    <svg className={s.check} viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <path d="M3 8.4l3.1 3.1L13 4.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AccessPasses() {
  return (
    <section id="passes" className={s.section}>
      <div className={s.wrap}>
        <div className={`${s.head} ${s.headCenter}`}>
          <span className={s.eyebrow}>Access Passes</span>
          <h2 className={s.h2}>Pick your <span className={s.gradGold}>access pass</span>.</h2>
          <p className={s.lead}>
            Same simple pricing — framed as passes. No hidden tiers, no signal-bot hype.
          </p>
        </div>

        <div className={s.passGrid}>
          {PASSES.map((p) => (
            <article key={p.id} className={`${s.pass} ${p.featured ? s.passFeatured : ""}`}>
              <span className={`${s.passTier} ${p.featured ? s.passTierGold : ""}`}>{p.tier}</span>
              <h3 className={s.passName}>{p.name}</h3>
              <div className={s.passAmt}>
                <span className={s.passNum}>{p.price}</span>
                {p.cadence ? <span className={s.passCadence}>{p.cadence}</span> : null}
              </div>
              <p className={s.passBilling}>{p.billing}</p>
              <a href="#join" className={`${s.btnPrimary} ${s.passCta}`}>{p.cta}</a>
              <ul className={s.perks}>
                {p.perks.map((f) => (
                  <li key={f}><Check /><span>{f}</span></li>
                ))}
              </ul>
              {p.note ? <p className={s.passNote}>{p.note}</p> : null}
            </article>
          ))}
        </div>

        <p className={s.earlyNote}>
          Early-access pricing — indicative and subject to change before launch.
        </p>
      </div>
    </section>
  );
}
