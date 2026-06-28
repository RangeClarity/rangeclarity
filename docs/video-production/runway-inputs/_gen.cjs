const sharp = require('sharp');
const fs = require('fs');
const path = __dirname;

const C = { acid:'#b6ff3c', cyan:'#38e1ff', violet:'#b07bff', rose:'#ff5c87',
  fog:'#eef3ff', mist:'#8a99bf', line:'#1c2740', line2:'#2a3a5c',
  panel:'#0e1626', bg:'#05070d', mint:'#34f5b0', mintc:'#2fffd6' };

const gridDefs = `
  <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
    <path d="M64 0H0V64" fill="none" stroke="rgba(124,160,220,0.06)" stroke-width="1"/>
  </pattern>`;

// gauge arc helper
function arc(cx,cy,r,sw,frac,gid){
  const Ccirc=2*Math.PI*r, dash=(frac*Ccirc).toFixed(1);
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.line}" stroke-width="${sw}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#${gid})" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${dash} ${Ccirc.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
}

// ---------- A2 : decision-map dashboard 2560x1440 ----------
const A2 = `<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1440" viewBox="0 0 2560 1440">
<defs>${gridDefs}
  <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.acid}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
  <linearGradient id="zf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.acid}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="40" stdDeviation="50" flood-color="#000" flood-opacity="0.6"/></filter>
</defs>
<rect width="2560" height="1440" fill="${C.bg}"/>
<rect width="2560" height="1440" fill="url(#grid)"/>
<rect width="2560" height="1440" fill="url(#vig)"/>
<radialGradient id="halo" cx="50%" cy="40%" r="55%"><stop offset="0" stop-color="rgba(56,225,255,0.10)"/><stop offset="1" stop-color="rgba(56,225,255,0)"/></radialGradient>
<rect width="2560" height="1440" fill="url(#halo)"/>
<g filter="url(#sh)"><rect x="430" y="300" width="1700" height="840" rx="28" fill="${C.panel}" stroke="${C.line2}" stroke-width="2"/></g>
<!-- header -->
<circle cx="495" cy="372" r="9" fill="${C.rose}"/><circle cx="525" cy="372" r="9" fill="${C.acid}"/><circle cx="555" cy="372" r="9" fill="${C.cyan}"/>
<text x="610" y="381" font-family="monospace" font-size="26" letter-spacing="4" fill="${C.mist}">DECISION MAP &#183; ASTS</text>
<rect x="1980" y="352" width="110" height="42" rx="8" fill="rgba(182,255,60,0.15)"/>
<text x="2035" y="380" font-family="monospace" font-size="24" letter-spacing="3" fill="${C.acid}" text-anchor="middle">LIVE</text>
<line x1="470" y1="418" x2="2090" y2="418" stroke="${C.line}"/>
<!-- left gauge -->
${arc(760,760,170,26,0.78,'g2')}
<text x="760" y="800" font-family="sans-serif" font-weight="800" font-size="150" fill="${C.fog}" text-anchor="middle">78</text>
<text x="760" y="858" font-family="monospace" font-size="26" letter-spacing="3" fill="${C.mist}" text-anchor="middle">RANGE SCORE</text>
<text x="760" y="985" font-family="monospace" font-size="24" letter-spacing="3" fill="${C.mist}" text-anchor="middle">UPPER RANGE</text>
<!-- right column -->
<text x="1100" y="560" font-family="monospace" font-size="26" letter-spacing="3" fill="${C.mist}">SUPPORT</text>
<text x="2060" y="560" font-family="monospace" font-size="26" letter-spacing="3" fill="${C.mist}" text-anchor="end">RESISTANCE</text>
<rect x="1100" y="586" width="960" height="22" rx="11" fill="#16233c"/>
<rect x="1100" y="586" width="749" height="22" rx="11" fill="url(#zf)" opacity="0.55"/>
<rect x="1843" y="576" width="12" height="42" rx="6" fill="${C.acid}"/>
<text x="1100" y="662" font-family="monospace" font-size="24" fill="${C.mist}">$28.50</text>
<text x="1580" y="662" font-family="monospace" font-size="24" fill="${C.acid}" text-anchor="middle">&#9679; $39.40</text>
<text x="2060" y="662" font-family="monospace" font-size="24" fill="${C.mist}" text-anchor="end">$42.00</text>
<rect x="1100" y="712" width="460" height="150" rx="14" fill="rgba(56,225,255,0.05)" stroke="rgba(56,225,255,0.28)"/>
<text x="1130" y="772" font-family="monospace" font-size="23" letter-spacing="2" fill="${C.mist}">MOMENTUM</text>
<text x="1130" y="828" font-family="sans-serif" font-weight="700" font-size="36" fill="${C.cyan}">Strong &#183; Extended</text>
<rect x="1600" y="712" width="460" height="150" rx="14" fill="rgba(176,123,255,0.05)" stroke="rgba(176,123,255,0.28)"/>
<text x="1630" y="772" font-family="monospace" font-size="23" letter-spacing="2" fill="${C.mist}">RISK / REWARD</text>
<text x="1630" y="828" font-family="sans-serif" font-weight="700" font-size="36" fill="${C.violet}">1 : 2.4</text>
<rect x="1100" y="912" width="960" height="120" rx="16" fill="rgba(182,255,60,0.08)" stroke="rgba(182,255,60,0.35)"/>
<text x="1130" y="985" font-family="monospace" font-size="24" letter-spacing="3" fill="${C.mist}">VERDICT</text>
<circle cx="1690" cy="977" r="7" fill="${C.acid}"/>
<text x="2030" y="990" font-family="sans-serif" font-weight="800" font-size="46" fill="${C.fog}" text-anchor="end">WAIT FOR PULLBACK</text>
</svg>`;

// ---------- A3 : Range Score + verdict close-up 1440x1440 ----------
const A3 = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1440" viewBox="0 0 1440 1440">
<defs>${gridDefs}
  <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.acid}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
  <radialGradient id="halo3" cx="50%" cy="38%" r="55%"><stop offset="0" stop-color="rgba(182,255,60,0.10)"/><stop offset="1" stop-color="rgba(182,255,60,0)"/></radialGradient>
</defs>
<rect width="1440" height="1440" fill="${C.bg}"/>
<rect width="1440" height="1440" fill="url(#grid)"/>
<rect width="1440" height="1440" fill="url(#halo3)"/>
${arc(720,560,240,34,0.78,'g3')}
<text x="720" y="612" font-family="sans-serif" font-weight="800" font-size="230" fill="${C.fog}" text-anchor="middle">78</text>
<text x="720" y="700" font-family="monospace" font-size="30" letter-spacing="4" fill="${C.mist}" text-anchor="middle">RANGE SCORE</text>
<text x="720" y="880" font-family="monospace" font-size="28" letter-spacing="4" fill="${C.mist}" text-anchor="middle">UPPER RANGE</text>
<rect x="240" y="1050" width="960" height="170" rx="18" fill="rgba(182,255,60,0.08)" stroke="rgba(182,255,60,0.4)"/>
<text x="720" y="1108" font-family="monospace" font-size="26" letter-spacing="5" fill="${C.acid}" text-anchor="middle">VERDICT</text>
<text x="720" y="1178" font-family="sans-serif" font-weight="800" font-size="64" fill="${C.fog}" text-anchor="middle">WAIT FOR PULLBACK</text>
</svg>`;

// ---------- A7 : logo lockup 2560x1440 ----------
const A7 = `<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1440" viewBox="0 0 2560 1440">
<defs>${gridDefs}
  <linearGradient id="uline" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgba(52,245,176,0)"/><stop offset="0.5" stop-color="${C.mint}"/><stop offset="1" stop-color="rgba(52,245,176,0)"/></linearGradient>
  <radialGradient id="halo7" cx="50%" cy="45%" r="50%"><stop offset="0" stop-color="rgba(52,245,176,0.10)"/><stop offset="1" stop-color="rgba(52,245,176,0)"/></radialGradient>
</defs>
<rect width="2560" height="1440" fill="#05060a"/>
<rect width="2560" height="1440" fill="url(#grid)"/>
<rect width="2560" height="1440" fill="url(#halo7)"/>
<!-- chart mark -->
<g transform="translate(1190 470)">
  <rect width="180" height="180" rx="40" fill="#0b0f18" stroke="rgba(47,255,214,0.45)" stroke-width="2"/>
  <rect x="34" y="66" width="112" height="52" rx="10" fill="none" stroke="${C.mintc}" stroke-width="3" opacity="0.45"/>
  <polyline points="32,118 64,88 92,98 120,60 150,74" fill="none" stroke="${C.mintc}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="150" cy="74" r="8" fill="${C.mintc}"/>
</g>
<!-- wordmark -->
<text x="1280" y="820" font-family="sans-serif" font-weight="800" font-size="150" letter-spacing="-3" text-anchor="middle"><tspan fill="#ffffff">Range</tspan><tspan fill="${C.mint}">Clarity</tspan></text>
<rect x="980" y="858" width="600" height="5" rx="2.5" fill="url(#uline)"/>
<text x="1280" y="940" font-family="monospace" font-size="32" letter-spacing="6" fill="${C.mist}" text-anchor="middle">SEE THE RANGE BEFORE YOU MOVE</text>
<text x="1280" y="1360" font-family="monospace" font-size="22" letter-spacing="2" fill="#5c668a" text-anchor="middle">Educational chart context. Not financial advice.</text>
</svg>`;

async function run(){
  const jobs = [['A2_dashboard.png',A2],['A3_rangescore.png',A3],['A7_logo.png',A7]];
  for (const [name,svg] of jobs){
    fs.writeFileSync(path+'/'+name.replace('.png','.svg'), svg);
    await sharp(Buffer.from(svg)).png().toFile(path+'/'+name);
    console.log('wrote', name);
  }
}
run().catch(e=>{console.error(e);process.exit(1);});
