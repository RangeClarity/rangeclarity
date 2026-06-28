const fs=require('fs');
const W=2560,H=1440;
const C={bg:'#060a12',panel:'#0c1322',panel2:'#111a2d',line:'#1b2740',line2:'#2a3a5c',fog:'#e8eefc',mist:'#93a1c4',faint:'#5d6a8c',green:'#34f5b0',teal:'#2fe9d6',cyan:'#38e1ff',blue:'#5b8cff',violet:'#b07bff',gold:'#ffcf5c',rose:'#ff5d7a'};
const defsCommon=`
<pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="rgba(124,160,220,0.06)" stroke-width="1"/></pattern>
<radialGradient id="glowG" cx="50%" cy="-10%" r="60%"><stop offset="0" stop-color="rgba(52,245,176,0.13)"/><stop offset="1" stop-color="rgba(52,245,176,0)"/></radialGradient>
<radialGradient id="glowD" cx="90%" cy="8%" r="55%"><stop offset="0" stop-color="rgba(255,207,92,0.10)"/><stop offset="1" stop-color="rgba(255,207,92,0)"/></radialGradient>
<linearGradient id="grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#34f5b0"/><stop offset="0.55" stop-color="#bfe9ff"/><stop offset="1" stop-color="#ffcf5c"/></linearGradient>
<radialGradient id="mv-halo" cx="50%" cy="42%" r="55%"><stop offset="0" stop-color="rgba(52,245,176,0.20)"/><stop offset="1" stop-color="rgba(52,245,176,0)"/></radialGradient>`;
const bgRects=`<rect width="${W}" height="${H}" fill="${C.bg}"/><rect width="${W}" height="${H}" fill="url(#grid)"/><rect width="${W}" height="${H}" fill="url(#glowG)"/><rect width="${W}" height="${H}" fill="url(#glowD)"/>`;

// ---- mascot (clean RangeBot) inner content, drawn at translate/scale by caller ----
const mascot=`
<ellipse cx="170" cy="168" rx="150" ry="150" fill="url(#mv-halo)"/>
<ellipse cx="170" cy="338" rx="92" ry="15" fill="#34f5b0" opacity="0.12"/>
<ellipse cx="170" cy="336" rx="78" ry="11" fill="#04070d" opacity="0.55"/>
<g transform="translate(54 26)">
<path d="M70 70 C70 18 158 18 158 70 L168 150 L60 150 Z" fill="#0d1626" stroke="#243a59" stroke-width="2"/>
<path d="M64 78 C64 24 164 24 164 78" fill="none" stroke="#1a2740" stroke-width="9" stroke-linecap="round"/>
<path d="M82 58 C82 26 146 26 146 58 L146 64 L82 64 Z" fill="#0c1322" stroke="#26384f" stroke-width="2"/>
<path d="M82 62 C70 62 58 66 52 72 C66 70 78 68 96 68 Z" fill="#0c1322" stroke="#26384f" stroke-width="2"/>
<circle cx="114" cy="34" r="2.6" fill="#34f5b0"/>
<ellipse cx="114" cy="86" rx="40" ry="40" fill="#eef3ff"/>
<path d="M92 80 L108 86 L92 92 Z" fill="#0a0f1a"/><path d="M136 80 L120 86 L136 92 Z" fill="#0a0f1a"/>
<circle cx="70" cy="88" r="16" fill="#0c1322" stroke="#2a3a5c" stroke-width="2"/>
<circle cx="158" cy="88" r="16" fill="#0c1322" stroke="#2a3a5c" stroke-width="2"/>
<rect x="151" y="84" width="2.4" height="8" rx="1" fill="#34f5b0"/><rect x="155" y="81" width="2.4" height="14" rx="1" fill="#34f5b0"/><rect x="159" y="83" width="2.4" height="10" rx="1" fill="#34f5b0"/><rect x="163" y="80" width="2.4" height="16" rx="1" fill="#34f5b0"/>
<path d="M56 150 C56 138 70 132 114 132 C158 132 172 138 172 150 L184 268 C184 280 60 280 44 268 Z" fill="#0f1828" stroke="#243a59" stroke-width="2"/>
<path d="M86 134 C96 150 132 150 142 134" fill="none" stroke="#243a59" stroke-width="2"/>
<line x1="114" y1="138" x2="114" y2="262" stroke="#1a2740" stroke-width="3"/>
<path d="M104 140 C104 156 100 168 96 178" fill="none" stroke="#34f5b0" stroke-width="2.5" stroke-linecap="round"/>
<path d="M124 140 C124 156 128 168 132 178" fill="none" stroke="#34f5b0" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="96" cy="180" r="2.6" fill="#34f5b0"/><circle cx="132" cy="180" r="2.6" fill="#34f5b0"/>
<path d="M52 196 C92 182 150 182 186 208 C150 224 96 226 60 224 C50 220 48 204 52 196 Z" fill="#11203a" stroke="#243a59" stroke-width="2"/>
<path d="M188 200 C150 188 96 190 58 214 C96 230 150 230 184 220 C194 216 194 206 188 200 Z" fill="#0e1a30" stroke="#243a59" stroke-width="2"/>
<ellipse cx="60" cy="222" rx="12" ry="10" fill="#eef3ff"/><ellipse cx="184" cy="214" rx="12" ry="10" fill="#eef3ff"/>
<path d="M150 168 l-10 12 6 1 -7 12 18 -16 -7 -1 7 -9 z" fill="#34f5b0" opacity="0.95"/>
</g>`;

function T(x,y,txt,{size=32,fill=C.fog,w=400,anchor='start',mono=false,ls=0}={}){
  return `<text x="${x}" y="${y}" font-family="${mono?'monospace':'sans-serif'}" font-weight="${w}" font-size="${size}" fill="${fill}" text-anchor="${anchor}"${ls?` letter-spacing="${ls}"`:''}>${txt}</text>`;
}

// ===================== A1 HERO =====================
let a1=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defsCommon}</defs>${bgRects}`;
a1+=`<rect x="160" y="322" width="1080" height="56" rx="28" fill="rgba(12,19,34,0.6)" stroke="${C.line2}"/>`;
a1+=`<circle cx="200" cy="350" r="7" fill="${C.green}"/>`;
a1+=T(228,359,'TRADINGVIEW INDICATOR SUITE &#183; EARLY ACCESS',{size:22,fill:C.mist,mono:true,ls:3});
a1+=T(160,500,'TradingView indicators',{size:112,w:800,fill:'#ffffff',ls:0});
a1+=T(160,612,'that show the',{size:112,w:800,fill:'#ffffff',ls:0});
a1+=T(160,724,'range before you',{size:112,w:800,fill:'url(#grad)',ls:0});
a1+=T(160,836,'make the move.',{size:112,w:800,fill:'url(#grad)',ls:0});
a1+=T(160,952,'RangeClarity overlays support, resistance, momentum, entry',{size:34,fill:C.mist});
a1+=T(160,1000,'quality, and risk zones directly on your TradingView chart.',{size:34,fill:C.mist});
a1+=`<rect x="160" y="1080" width="372" height="88" rx="14" fill="${C.green}"/>`+T(346,1135,'Join Early Access  &#8594;',{size:30,w:800,fill:'#04130d',anchor:'middle'});
a1+=`<rect x="556" y="1080" width="330" height="88" rx="14" fill="rgba(12,19,34,0.6)" stroke="${C.line2}"/>`+T(721,1135,'See a sample read',{size:30,w:700,fill:'#ffffff',anchor:'middle'});
a1+=T(160,1230,'No signal-bot hype. No candle-chasing. Just cleaner chart structure.',{size:24,fill:C.faint,mono:true,ls:1});
const chips=['&#9679; Support / Resistance','&#9679; Momentum lifecycle','&#9679; Risk / Reward'];
let cx=160; chips.forEach(t=>{const wid=t.length*13+40; a1+=`<rect x="${cx}" y="1276" width="${wid}" height="52" rx="26" fill="rgba(12,19,34,0.5)" stroke="${C.line2}"/>`+T(cx+22,1309,t,{size:21,fill:C.mist,mono:true,ls:1}); cx+=wid+18;});
a1+=`<g transform="translate(1600 350) scale(2)">${mascot}</g>`;
a1+=`</svg>`;
fs.writeFileSync('A1_hero.svg',a1);

// ===================== A4 TOOLKIT =====================
const mods=[
 {pill:'THE RANGE',chip:'MAPS THE TERRAIN',title:'Range Map Overlay',tag:'Reads the battlefield before you click buy.',stats:[['0–100','Range Score'],['3','Key Zones'],['1','Decision Map']],c:C.green,vis:'range'},
 {pill:'THE MOMENTUM',chip:'HYPE DETECTOR',title:'Momentum Engine',tag:'Tells you when the move has juice.',stats:[['10','Stages'],['5','Inputs'],['LIVE','Trend State']],c:C.cyan,vis:'momentum'},
 {pill:'THE RISK',chip:'ANTI-FOMO',title:'Risk Radar',tag:'Quietly says: this entry is too hot.',stats:[['R / R','Risk / Reward'],['A–F','Entry Grade'],['3','Alert Zones']],c:C.violet,vis:'radar'},
];
function miniVisual(x,y,w,h,c,vis){
 let g=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#070b14" stroke="${c}33"/>`;
 if(vis==='range'){
   g+=`<rect x="${x}" y="${y+30}" width="${w}" height="22" fill="${c}14"/><line x1="${x}" y1="${y+41}" x2="${x+w}" y2="${y+41}" stroke="${c}" stroke-dasharray="6 6" opacity="0.6"/>`;
   g+=`<rect x="${x}" y="${y+h-52}" width="${w}" height="22" fill="${c}14"/><line x1="${x}" y1="${y+h-41}" x2="${x+w}" y2="${y+h-41}" stroke="${c}" stroke-dasharray="6 6" opacity="0.6"/>`;
   const hs=[34,28,42,50,44,56,62,70,66,76]; hs.forEach((hv,i)=>{const bx=x+34+i*((w-60)/10); const top=y+h-50-hv*1.1; g+=`<rect x="${bx-5}" y="${top}" width="10" height="${Math.max(hv*0.7,8)}" rx="2" fill="${c}" opacity="0.8"/>`;});
 } else if(vis==='momentum'){
   g+=`<polyline points="${x+20},${y+h-40} ${x+w*0.25},${y+h-70} ${x+w*0.5},${y+h-55} ${x+w*0.75},${y+h-95} ${x+w-20},${y+30}" fill="none" stroke="${c}" stroke-width="3" opacity="0.9"/>`;
   const bs=[26,40,56,72,64,84,70,52,36,80]; bs.forEach((hv,i)=>{const bx=x+24+i*((w-48)/10); g+=`<rect x="${bx}" y="${y+h-30-hv*0.7}" width="13" height="${hv*0.7}" rx="2" fill="${c}" opacity="${0.25+i*0.06}"/>`;});
 } else {
   const ccx=x+w*0.32, ccy=y+h*0.55;
   [26,48,70,92].forEach(r=>g+=`<circle cx="${ccx}" cy="${ccy}" r="${r}" fill="none" stroke="${c}" stroke-width="1" opacity="0.25"/>`);
   g+=`<path d="M${ccx} ${ccy} L${ccx+92} ${ccy} A92 92 0 0 0 ${ccx+65} ${ccy-65} Z" fill="${c}40"/><line x1="${ccx}" y1="${ccy}" x2="${ccx+92}" y2="${ccy}" stroke="${c}" stroke-width="2"/>`;
   for(let i=0;i<4;i++){const bw=[80,52,92,40][i]; g+=`<rect x="${x+w*0.6}" y="${y+30+i*26}" width="${bw}" height="13" rx="3" fill="${c}" opacity="${[0.9,0.7,0.8,0.6][i]}"/>`;}
 }
 return g;
}
let a4=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defsCommon}</defs>${bgRects}`;
a4+=T(W/2,210,'THE TOOLKIT',{size:26,fill:C.green,mono:true,ls:6,anchor:'middle'});
a4+=T(W/2,300,'Three modules. One clear call.',{size:78,w:800,fill:'#ffffff',anchor:'middle',ls:0});
a4+=T(W/2,366,'Each module is a collectible panel in your market command center — built to answer one question well.',{size:30,fill:C.mist,anchor:'middle'});
const cw=720,ch=720,gap=60; let sx=(W-(cw*3+gap*2))/2; const cy0=470;
mods.forEach((m,idx)=>{const x=sx+idx*(cw+gap);
 a4+=`<rect x="${x}" y="${cy0}" width="${cw}" height="${ch}" rx="22" fill="${C.panel}" stroke="${C.line2}"/>`;
 a4+=`<rect x="${x}" y="${cy0}" width="${cw}" height="6" rx="3" fill="${m.c}"/>`;
 a4+=`<rect x="${x+cw-260}" y="${cy0+34}" width="230" height="42" rx="8" fill="${m.c}1a" stroke="${m.c}66"/>`+T(x+cw-145,cy0+62,m.chip,{size:20,fill:m.c,mono:true,ls:2,anchor:'middle'});
 a4+=miniVisual(x+40,cy0+100,cw-80,220,m.c,m.vis);
 a4+=`<rect x="${x+40}" y="${cy0+346}" width="${m.pill.length*15+44}" height="44" rx="10" fill="${m.c}1a" stroke="${m.c}55"/>`+T(x+62,cy0+375,m.pill,{size:22,fill:m.c,mono:true,ls:2});
 a4+=T(x+40,cy0+452,m.title,{size:44,w:800,fill:'#ffffff'});
 a4+=T(x+40,cy0+502,m.tag,{size:26,fill:m.c});
 m.stats.forEach((st,i)=>{const stx=x+40+i*((cw-80)/3)+((cw-80)/6); a4+=T(stx,cy0+600,st[0],{size:40,w:800,fill:m.c,anchor:'middle'})+T(stx,cy0+640,st[1],{size:20,fill:C.mist,mono:true,anchor:'middle'});});
});
a4+=`</svg>`;
fs.writeFileSync('A4_toolkit.svg',a4);

// ===================== A6 CTA =====================
let a6=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defsCommon}
<radialGradient id="ctaglow" cx="50%" cy="40%" r="55%"><stop offset="0" stop-color="rgba(52,245,176,0.12)"/><stop offset="1" stop-color="rgba(52,245,176,0)"/></radialGradient></defs>${bgRects}<rect width="${W}" height="${H}" fill="url(#ctaglow)"/>`;
const Cx=W/2, cardW=1600, cardH=720, cardX=(W-cardW)/2, cardY=(H-cardH)/2;
a6+=`<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="28" fill="${C.panel}" stroke="${C.line2}"/>`;
a6+=`<rect x="${Cx-370}" y="${cardY+70}" width="740" height="52" rx="26" fill="rgba(52,245,176,0.1)" stroke="${C.green}55"/>`;
a6+=`<circle cx="${Cx-330}" cy="${cardY+96}" r="7" fill="${C.green}"/>`+T(Cx+20,cardY+105,'EARLY ACCESS &#183; LIMITED SEATS',{size:22,fill:C.green,mono:true,ls:3,anchor:'middle'});
a6+=T(Cx,cardY+250,'Stop chasing candles.',{size:78,w:800,fill:'#ffffff',anchor:'middle',ls:0});
a6+=T(Cx,cardY+345,'Start reading the range.',{size:78,w:800,fill:'url(#grad)',anchor:'middle',ls:0});
a6+=`<rect x="${Cx-470}" y="${cardY+430}" width="600" height="86" rx="14" fill="#0a1120" stroke="${C.line2}"/>`+T(Cx-440,cardY+483,'you@portfolio.com',{size:30,fill:C.faint});
a6+=`<rect x="${Cx+150}" y="${cardY+430}" width="320" height="86" rx="14" fill="${C.green}"/>`+T(Cx+310,cardY+483,'Join Early Access  &#8594;',{size:28,w:800,fill:'#04130d',anchor:'middle'});
a6+=T(Cx,cardY+600,'No spam. No signals-for-hire. Just the range, clearly.',{size:24,fill:C.faint,mono:true,ls:1,anchor:'middle'});
a6+=`</svg>`;
fs.writeFileSync('A6_cta.svg',a6);

console.log('wrote A1_hero.svg A4_toolkit.svg A6_cta.svg');
