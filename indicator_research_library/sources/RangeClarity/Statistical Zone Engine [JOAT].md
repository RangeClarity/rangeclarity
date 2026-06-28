// This Pine Script® code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © officialjackofalltrades
//@version=6
indicator("Statistical Zone Engine [JOAT]", "SZE [JOAT]", overlay=true,
     max_boxes_count=500, max_labels_count=500)

// ─── Inputs ───────────────────────────────────────────────────────────────────
string G_ZONE = "Zone Detection"
string G_STAT = "Statistics"
string G_VIS  = "Visuals"

swingLen   = input.int  (10,    "Swing Length",            group=G_ZONE, minval=3,  maxval=30)
clusterTol = input.float(0.4,   "Cluster ATR Tolerance",  group=G_ZONE, minval=0.1,step=0.05, tooltip="Pivots within ATR * this are merged into one zone.")
zoneWidth  = input.float(0.35,  "Zone ATR Width",         group=G_ZONE, minval=0.1,step=0.05)
maxZones   = input.int  (12,    "Max Active Zones",       group=G_ZONE, minval=3,  maxval=25)
lookback   = input.int  (200,   "EV Lookback (bars)",     group=G_STAT, minval=50, maxval=500)
tpRR       = input.float(2.0,   "TP R:R Ratio",           group=G_STAT, minval=0.5,step=0.25)
slRR       = input.float(1.0,   "SL R:R Ratio",           group=G_STAT, minval=0.25,step=0.25)
minTouches = input.int  (2,     "Min Touches To Show",    group=G_ZONE, minval=1,  maxval=5)
showLbl    = input.bool (true,  "Show Zone Labels",       group=G_VIS)
showSweep  = input.bool (true,  "Show Sweep Labels",      group=G_VIS, tooltip="Mark when price sweeps through a zone with momentum.")
showDash   = input.bool (true,  "Show Dashboard",         group=G_VIS)
resCol     = input.color(#f97316, "Resistance Color",     group=G_VIS)
supCol     = input.color(#38bdf8, "Support Color",        group=G_VIS)

// ─── Color helpers ────────────────────────────────────────────────────────────
dashBg = color.new(#0f172a, 8)
dashHd = color.new(#1e293b, 0)
tPrim  = color.new(#e2e8f0, 0)
tSec   = color.new(#64748b, 0)

// ─── Custom type ──────────────────────────────────────────────────────────────
type SZone
    box    zBox
    label  zLbl
    float  mid
    float  top
    float  bot
    bool   isRes
    int    touches
    int    bounces
    int    breaks
    int    creationBar
    bool   mitigated

// ─── Arrays ───────────────────────────────────────────────────────────────────
var array<SZone> resZones = array.new<SZone>()
var array<SZone> supZones = array.new<SZone>()

// ─── Stats counters ────────────────────────────────────────────────────────────
var int totalSweeps  = 0
var int totalBounces = 0

// ─── ATR ──────────────────────────────────────────────────────────────────────
atrVal = ta.atr(14)
volSMA = ta.sma(volume, 20)

// ─── Tier logic ───────────────────────────────────────────────────────────────
tierBorderWidth(int t) =>
    t >= 6 ? 3 : t >= 4 ? 2 : 1

tierBgAlpha(float ev) =>
    // More positive EV = more opaque fill (higher confidence zone)
    ev > 1.0 ? 80 : ev > 0.5 ? 85 : ev > 0 ? 90 : 95

tierBorderAlpha(int t) =>
    t >= 6 ? 5 : t >= 4 ? 20 : t >= 3 ? 40 : 60

tierName(int t) =>
    t >= 6 ? "INSTITUTIONAL" : t >= 4 ? "STRONG" : t >= 3 ? "MODERATE" : "WEAK"

// ─── EV calculation ───────────────────────────────────────────────────────────
calcEV(float mid_, float half_) =>
    int   touchCnt  = 0
    int   bounceCnt = 0
    for i = 1 to math.min(lookback, bar_index - 1)
        hiBar = high[i]
        loBar = low[i]
        clBar = close[i]
        if hiBar >= mid_ - half_ and loBar <= mid_ + half_
            touchCnt += 1
            prevCl = close[i + 1]
            if clBar > mid_ + half_ or clBar < mid_ - half_
                bounceCnt += 1
    float wr = touchCnt > 0 ? float(bounceCnt) / float(touchCnt) : 0.5
    float ev = wr * tpRR - (1.0 - wr) * slRR
    [wr, ev, touchCnt]

// ─── Label text builder ───────────────────────────────────────────────────────
buildLbl(bool res, int t, float wr, float ev) =>
    str.format("{0}  {1} | T:{2} | WR:{3}% | EV:{4}R",
         res ? "RES" : "SUP",
         tierName(t),
         str.tostring(t),
         str.tostring(math.round(wr * 100)),
         str.tostring(math.round(ev * 100) / 100, "#.##"))

// ─── Proximity check ─────────────────────────────────────────────────────────
nearExisting(array<SZone> arr, float price) =>
    bool found = false
    for z in arr
        if math.abs(z.mid - price) < atrVal * clusterTol
            found := true
    found

// ─── Zone lifecycle ────────────────────────────────────────────────────────────
deleteZone(SZone z) =>
    box.delete(z.zBox)
    label.delete(z.zLbl)

trimZones(array<SZone> arr) =>
    while array.size(arr) > maxZones
        old = array.shift(arr)
        deleteZone(old)

// ─── Pivots ───────────────────────────────────────────────────────────────────
pivH = ta.pivothigh(high, swingLen, swingLen)
pivL = ta.pivotlow (low,  swingLen, swingLen)

// ─── Resistance zone from pivot high ──────────────────────────────────────────
if not na(pivH) and barstate.isconfirmed
    float mid_ = pivH
    if not nearExisting(resZones, mid_)
        float half_  = atrVal * zoneWidth
        float zTop_  = mid_ + half_
        float zBot_  = mid_ - half_
        int   cBar_  = bar_index - swingLen
        [wr_, ev_, tc_] = calcEV(mid_, half_)
        int   startT = math.max(tc_, 1)
        if startT >= minTouches
            int   bw_   = tierBorderWidth(startT)
            int   ba_   = tierBorderAlpha(startT)
            int   bgA_  = tierBgAlpha(ev_)
            b_  = box.new(cBar_, zTop_, bar_index + 30, zBot_,
                 bgcolor=color.new(resCol, bgA_),
                 border_color=color.new(resCol, ba_), border_width=bw_)
            lbl_= showLbl ? label.new(bar_index + 30, zTop_, buildLbl(true, startT, wr_, ev_),
                 style=label.style_label_left, color=color.new(resCol, 100),
                 textcolor=color.new(resCol, ba_), size=size.small) :
                 label.new(bar_index, zTop_, "", color=color.new(color.white, 100), textcolor=color.white)
            array.push(resZones, SZone.new(b_, lbl_, mid_, zTop_, zBot_, true, startT, 0, 0, cBar_, false))
            trimZones(resZones)

// ─── Support zone from pivot low ──────────────────────────────────────────────
if not na(pivL) and barstate.isconfirmed
    float mid_ = pivL
    if not nearExisting(supZones, mid_)
        float half_  = atrVal * zoneWidth
        float zTop_  = mid_ + half_
        float zBot_  = mid_ - half_
        int   cBar_  = bar_index - swingLen
        [wr_, ev_, tc_] = calcEV(mid_, half_)
        int   startT = math.max(tc_, 1)
        if startT >= minTouches
            int   bw_   = tierBorderWidth(startT)
            int   ba_   = tierBorderAlpha(startT)
            int   bgA_  = tierBgAlpha(ev_)
            b_  = box.new(cBar_, zTop_, bar_index + 30, zBot_,
                 bgcolor=color.new(supCol, bgA_),
                 border_color=color.new(supCol, ba_), border_width=bw_)
            lbl_= showLbl ? label.new(bar_index + 30, zBot_, buildLbl(false, startT, wr_, ev_),
                 style=label.style_label_left, color=color.new(supCol, 100),
                 textcolor=color.new(supCol, ba_), size=size.small) :
                 label.new(bar_index, zBot_, "", color=color.new(color.white, 100), textcolor=color.white)
            array.push(supZones, SZone.new(b_, lbl_, mid_, zTop_, zBot_, false, startT, 0, 0, cBar_, false))
            trimZones(supZones)

// ─── Per-bar update (returns new sweep count — can't modify global inside fn) ─
updateZones(array<SZone> arr) =>
    int newSweeps = 0
    int i = 0
    while i < array.size(arr)
        z = array.get(arr, i)
        box.set_right(z.zBox, bar_index + 30)

        bool inZone    = close >= z.bot and close <= z.top
        bool mitigated = z.isRes ? close > z.top : close < z.bot
        bool highMom   = volume > volSMA * 1.4

        if inZone
            z.touches += 1
            bw_ = tierBorderWidth(z.touches)
            ba_ = tierBorderAlpha(z.touches)
            box.set_border_width(z.zBox, bw_)
            box.set_border_color(z.zBox, color.new(z.isRes ? resCol : supCol, ba_))
            if showLbl and not na(z.zLbl)
                [wr_, ev_, _] = calcEV(z.mid, z.top - z.mid)
                label.set_x(z.zLbl, bar_index + 30)
                label.set_text(z.zLbl, buildLbl(z.isRes, z.touches, wr_, ev_))
                label.set_textcolor(z.zLbl, color.new(z.isRes ? resCol : supCol, ba_))
        else if showLbl and not na(z.zLbl)
            label.set_x(z.zLbl, bar_index + 30)

        if mitigated and not z.mitigated
            z.mitigated  := true
            z.breaks     += 1
            newSweeps    += 1
            box.set_bgcolor(z.zBox, color.new(z.isRes ? resCol : supCol, 97))
            box.set_border_color(z.zBox, color.new(z.isRes ? resCol : supCol, 85))
            if showSweep and highMom
                label.new(bar_index,
                     z.isRes ? z.top + atrVal * 0.4 : z.bot - atrVal * 0.4,
                     z.isRes ? "BREAK ↑" : "BREAK ↓",
                     style = z.isRes ? label.style_label_down : label.style_label_up,
                     color = color.new(z.isRes ? resCol : supCol, 15),
                     textcolor=color.new(#0f172a, 0), size=size.small)
        i += 1
    newSweeps

if barstate.isconfirmed
    totalSweeps += updateZones(resZones)
    totalSweeps += updateZones(supZones)

// ─── Proximity detection ──────────────────────────────────────────────────────
bool nearRes = false
bool nearSup = false
for z in resZones
    if close >= z.bot - atrVal * 0.15 and close <= z.top + atrVal * 0.15
        nearRes := true
for z in supZones
    if close >= z.bot - atrVal * 0.15 and close <= z.top + atrVal * 0.15
        nearSup := true

// Proximity markers on price
plotchar(nearRes and not nearRes[1] ? close : na, "Res Entry", "◆",
     location.absolute, color.new(resCol, 10), size=size.tiny)
plotchar(nearSup and not nearSup[1] ? close : na, "Sup Entry", "◆",
     location.absolute, color.new(supCol, 10), size=size.tiny)

// ─── Dashboard ────────────────────────────────────────────────────────────────
if showDash
    var table d = table.new(position.top_right, 2, 9,
         bgcolor=dashBg, border_color=color.new(#1e293b, 0), border_width=1,
         frame_color=color.new(#334155, 0), frame_width=1)
    table.cell(d, 0, 0, "SZE [JOAT]",  text_color=tPrim, text_size=size.small, bgcolor=dashHd)
    table.cell(d, 1, 0, syminfo.ticker + " " + timeframe.period, text_color=tSec,  text_size=size.small, bgcolor=dashHd)
    table.cell(d, 0, 1, "Res Zones",   text_color=tSec,  text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 1, 1, str.tostring(array.size(resZones)), text_color=resCol, text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 0, 2, "Sup Zones",   text_color=tSec,  text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 1, 2, str.tostring(array.size(supZones)), text_color=supCol, text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 0, 3, "Near Res",    text_color=tSec,  text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 1, 3, nearRes ? "ACTIVE" : "—", text_color=nearRes ? resCol : tSec, text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 0, 4, "Near Sup",    text_color=tSec,  text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 1, 4, nearSup ? "ACTIVE" : "—", text_color=nearSup ? supCol : tSec, text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 0, 5, "Total Sweeps",text_color=tSec,  text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 1, 5, str.tostring(totalSweeps), text_color=tPrim, text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 0, 6, "TP R:R",      text_color=tSec,  text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 1, 6, str.tostring(tpRR, "#.##") + "R", text_color=tPrim, text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 0, 7, "SL R:R",      text_color=tSec,  text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 1, 7, str.tostring(slRR, "#.##") + "R", text_color=tPrim, text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 0, 8, "ATR",         text_color=tSec,  text_size=size.small, bgcolor=color.new(#0f172a, 0))
    table.cell(d, 1, 8, str.tostring(atrVal, format.mintick), text_color=tPrim, text_size=size.small, bgcolor=color.new(#0f172a, 0))

// ─── Alerts ───────────────────────────────────────────────────────────────────
alertcondition(nearRes and not nearRes[1] and barstate.isconfirmed, "SZE: Price Entering Resistance", "Price entering statistical resistance zone")
alertcondition(nearSup and not nearSup[1] and barstate.isconfirmed, "SZE: Price Entering Support",    "Price entering statistical support zone")
alertcondition(not na(pivH) and barstate.isconfirmed,               "SZE: New Resistance Zone",       "New resistance zone created from pivot high")
alertcondition(not na(pivL) and barstate.isconfirmed,               "SZE: New Support Zone",          "New support zone created from pivot low")
