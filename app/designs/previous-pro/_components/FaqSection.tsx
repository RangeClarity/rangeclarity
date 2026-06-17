import { FAQS } from "../data";
import s from "../previous.module.css";

/* Native <details> accordion — accessible, no client JS needed. */
export default function FaqSection() {
  return (
    <section id="faq" className={s.section}>
      <div className={s.wrap}>
        <div className={`${s.head} ${s.headCenter}`}>
          <span className={s.eyebrow}>FAQ</span>
          <h2 className={s.h2}>Straight answers</h2>
        </div>
        <div className={s.faqWrap}>
          {FAQS.map((f) => (
            <details key={f.q} className={s.faq}>
              <summary>
                {f.q}
                <span className={s.faqMark} aria-hidden="true">+</span>
              </summary>
              <div className={s.faqBody}>{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
