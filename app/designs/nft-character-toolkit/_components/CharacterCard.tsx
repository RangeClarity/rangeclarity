import type { CSSProperties } from "react";
import type { Character } from "../data";
import s from "../nft.module.css";
import Emblem from "./Emblem";

export default function CharacterCard({ ch }: { ch: Character }) {
  const vars = {
    ["--cc" as string]: ch.c,
    ["--cc2" as string]: ch.c2,
    ["--cardc" as string]: `${ch.c}33`,
  } as CSSProperties;
  return (
    <article className={s.card} style={vars}>
      <div className={s.cardBar} />
      <div className={s.charArt}>
        <span className={s.idTag}>{ch.pill}</span>
        <span className={s.rarity}>{ch.rarity}</span>
        <Emblem kind={ch.emblem} c={ch.c} c2={ch.c2} className={s.fill} />
      </div>

      <h3 className={s.charName}>{ch.name}</h3>
      <div className={s.charIndicator}>{ch.indicator}</div>
      <p className={s.charDesc}>{ch.description}</p>

      <div className={s.traits}>
        {ch.traits.map((t) => (
          <span key={t} className={s.trait}>{t}</span>
        ))}
      </div>

      <div className={s.statRow}>
        {ch.stats.map((st) => (
          <div key={st.label} className={s.stat}>
            <div className={s.statV} style={{ color: ch.c }}>{st.value}</div>
            <div className={s.statL}>{st.label}</div>
          </div>
        ))}
      </div>

      <div className={s.meta}>
        <div className={s.metaItem}><span className={s.metaKey}>Shows</span><span className={s.metaVal}>{ch.shows}</span></div>
        <div className={s.metaItem}><span className={s.metaKey}>Avoids</span><span className={s.metaVal}>{ch.avoids}</span></div>
        <div className={s.metaItem}><span className={s.metaKey}>Best for</span><span className={s.metaVal}>{ch.bestFor}</span></div>
      </div>
    </article>
  );
}
