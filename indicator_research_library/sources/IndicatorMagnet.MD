// This Pine Script® code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © officialjackofalltrades
//@version=6
indicator(title="Liquidity Magnet Pro [JOAT]", shorttitle="LMP [JOAT]", overlay=true, max_boxes_count=500, max_lines_count=500, max_labels_count=500, max_bars_back=5000)

// =============================================================================
//  SECTION 1 - INPUTS
// =============================================================================

// Box-drawing input groups
gDet    = "Liquidity Detection"
gEq     = "Equal H/L Clustering"
gDist   = "Distance Filter (Log-Scale)"
gScore  = "Probability Scoring (Weights)"
gVis    = "Visualization"
gHist   = "Historical Track"
gMag    = "Magnet Marker and Field Line"
gSweep  = "Sweep / Sweep-and-Reverse [JOAT]"
gSize   = "UI Sizing"
gAlert  = "Alerts"

// ---- Liquidity Detection ----------------------------------------------------
pivotLen      = input.int(10, "Pivot Lookback", minval=2, maxval=50, group=gDet, tooltip="Bars on each side required to confirm a swing point. Higher values produce fewer but more significant zones. Default 10 works well from 1H upward; try 5-7 for intraday scalping.")
maxPools      = input.int(25, "Max Active Pools", minval=5, maxval=50, group=gDet, tooltip="Maximum number of liquidity zones tracked at once. When exceeded, oldest pools are dropped. Higher values mean more cluttered charts but better historical coverage.")
minAge        = input.int(3, "Min Pool Age (bars)", minval=1, maxval=50, group=gDet, tooltip="Fresh pools below this age are scored lower. Reduces noise from just-formed pivots that haven't been tested yet.")
maxAge        = input.int(500, "Max Pool Age (bars)", minval=50, maxval=2000, group=gDet, tooltip="Pools older than this are removed from the active set. Prevents ancient zones from cluttering the chart.")

// ---- Equal H/L Clustering ---------------------------------------------------
autoEqTol     = input.bool(true, "Auto-Scale Tolerance by Timeframe", group=gEq, tooltip="When on, clustering tolerance auto-picks based on chart TF: 10% on 1W, 8% on 1D, 5% on 4H, 0.8% on 1H, 0.5% on 15m, 0.15% below.")
manualEqTol   = input.float(0.15, "Manual Tolerance %", minval=0.0, maxval=20.0, step=0.05, group=gEq, tooltip="Used when Auto-Scale is off. Pivots in the same direction within this percentage merge into a single equal-liquidity zone.")
eqBonus       = input.float(1.7, "Equal H/L Bonus Mult", minval=1.0, maxval=5.0, step=0.1, group=gEq, tooltip="Score multiplier applied to merged (equal-liquidity) zones. Higher values prioritize zones formed by multiple touches.")

// ---- Distance Filter (Log-Scale) -------------------------------------------
autoScale     = input.bool(true, "Auto-Scale by Timeframe", group=gDist, tooltip="When on, log-distance cap auto-picks based on chart TF: 0.95 on 1W, 0.65 on 1D, 0.45 on 4H, 0.30 on 1H, 0.18 on 15m, 0.10 below.")
manualLogD    = input.float(0.45, "Manual Log-Distance", minval=0.05, maxval=2.0, step=0.05, group=gDist, tooltip="Used when Auto-Scale is off. Maximum allowed distance in log space. Symmetric: 0.45 covers about plus/minus 57% from price, 0.95 covers plus/minus 160%.")

// ---- Probability Scoring Weights -------------------------------------------
wStrength     = input.float(1.0, "Strength Weight", minval=0.0, maxval=5.0, step=0.1, group=gScore, tooltip="Influence of volume at pivot formation on the score. Higher = pools formed on high-volume bars dominate the ranking.")
wProximity    = input.float(1.2, "Proximity Weight", minval=0.0, maxval=5.0, step=0.1, group=gScore, tooltip="Influence of distance from price. Higher = pools closer to current price get stronger preference.")
wAge          = input.float(0.6, "Age Decay Weight", minval=0.0, maxval=5.0, step=0.1, group=gScore, tooltip="Influence of pool age. Higher = the maturity curve has more impact (fresh pools weaker, mature pools stronger, ancient pools decay).")
wMomentum     = input.float(0.9, "Momentum Bias Weight", minval=0.0, maxval=5.0, step=0.1, group=gScore, tooltip="Influence of momentum alignment with direction toward each pool. Higher = current momentum direction biases the ranking more strongly.")

// ---- Visualization ----------------------------------------------------------
showZones     = input.bool(true,  "Show Liquidity Zones", group=gVis, tooltip="Master toggle for all zone boxes and lines on the chart.")
showTop       = input.bool(true,  "Highlight TOP MAGNET", group=gVis, tooltip="Draws the single highest-probability zone in the TOP color with a thicker line.")
animateTop    = input.bool(true,  "Animate TOP MAGNET (Pulse) [JOAT]", group=gVis, tooltip="JOAT enhancement: modulates transparency of the top zone via sin(bar_index*0.3) for a pulsing magnet effect.")
pulseAmplitude= input.int(25, "Pulse Amplitude", minval=0, maxval=50, group=gVis, tooltip="How strong the pulse oscillation is in transparency units. 0 = static, 25 = default, 50 = aggressive.")
pulseBase     = input.int(60, "Pulse Base Transparency", minval=20, maxval=85, group=gVis, tooltip="Center transparency around which the pulse oscillates. Lower = brighter overall.")
pulsePeriod   = input.float(0.3, "Pulse Period (rad/bar)", minval=0.05, maxval=2.0, step=0.05, group=gVis, tooltip="Speed of pulsation. Smaller = slower wave.")
showLabels    = input.bool(true,  "Show Probability Labels", group=gVis, tooltip="Shows percentage labels next to each zone on the right side of the chart.")
showDash      = input.bool(true,  "Show Dashboard", group=gVis, tooltip="Master toggle for the info panel.")
showStats     = input.bool(true,  "Show Touch Stats in Dashboard", group=gVis, tooltip="Shows Historical Touch percentage and pending count in the dashboard.")
showLegend    = input.bool(true,  "Show Marker Legend in Dashboard", group=gVis, tooltip="Adds a small legend row at the bottom of the dashboard explaining the marker symbols.")
showStatus    = input.bool(true,  "Show Status Dot in Dashboard", group=gVis, tooltip="Adds a colored dot in the dashboard header. Green when momentum aligns with the top magnet direction, orange when divergent, gray when neutral.")
showProgress  = input.bool(true,  "Show Distance Progress Bar", group=gVis, tooltip="Shows a visual proximity bar in the dashboard.")
showTop3      = input.bool(true,  "Show Top 3 Targets in Dashboard", group=gVis, tooltip="Adds the three highest-probability zones below the main metrics.")
showSweepRow  = input.bool(true,  "Show Sweep Rate Row [JOAT]", group=gVis, tooltip="JOAT enhancement: displays the percentage of historical touches that became actual sweeps.")
zoneExt       = input.int(20, "Zone Extension (bars right)", minval=0, maxval=100, group=gVis, tooltip="How far right of the current bar the zone boxes extend.")

// ---- Historical Track -------------------------------------------------------
showHistory      = input.bool(false, "Show Historical Top Magnets", group=gHist, tooltip="Off by default. When on, places small markers on the chart at the locations of previous top magnets, with their outcome.")
trackingWindow   = input.int(100, "Tracking Window (bars)", minval=20, maxval=500, group=gHist, tooltip="How many bars to wait for price to reach a former top magnet before marking it as expired.")
maxHistory       = input.int(100, "Max Historical Markers", minval=10, maxval=300, group=gHist, tooltip="Maximum number of historical markers kept on the chart.")
histMarkerSize   = input.string("Normal", "Historical Marker Size", options=["Tiny", "Small", "Normal", "Large", "Huge"], group=gHist)

// ---- Magnet Marker and Field Line -------------------------------------------
showMagnet     = input.bool(true, "Show Magnet Marker on TOP zone", group=gMag, tooltip="Shows a magnet symbol on top of the highest-probability zone.")
magnetSize     = input.string("Large", "Magnet Marker Size", options=["Tiny", "Small", "Normal", "Large", "Huge"], group=gMag)
showField      = input.bool(true, "Show Magnet Field Line", group=gMag, tooltip="Dashed line from the current price to the top magnet. Visualizes the directional pull.")
fieldStyle     = input.string("Diagonal", "Field Line Style", options=["Diagonal", "Vertical"], group=gMag)
fieldOffset    = input.int(20, "Diagonal Offset (bars right)", minval=10, maxval=100, group=gMag, tooltip="Used only for Diagonal style.")
showFieldArrow = input.bool(true, "Show Field Arrow Marker", group=gMag, tooltip="Adds a directional triangle on the top magnet end of the field line.")

// ---- Sweep / Sweep-and-Reverse [JOAT] --------------------------------------
enableSweep        = input.bool(true,  "Enable Sweep-on-Touch Detection", group=gSweep, tooltip="JOAT enhancement: when price touches the top magnet, monitor next N bars for a rejection wick and flag the outcome as a 'sweep'.")
sweepWindow        = input.int(8, "Sweep Window (bars)", minval=2, maxval=30, group=gSweep, tooltip="How many bars after touch to monitor for a sweep candle.")
wickAtrMultiplier  = input.float(0.8, "Min Wick Length (ATR mult)", minval=0.1, maxval=3.0, step=0.05, group=gSweep, tooltip="Minimum wick length, expressed as a multiple of ATR(14), to count as a sweep candle.")
wickRangeRatio     = input.float(0.35, "Min Wick / Range Ratio", minval=0.1, maxval=0.9, step=0.05, group=gSweep, tooltip="Minimum ratio of wick length to the total candle range.")
enableSR           = input.bool(true,  "Emit Sweep-and-Reverse Signal", group=gSweep, tooltip="JOAT enhancement: emit a label when sweep-on-touch occurs AND price closes back through the touched level.")
srLabelText        = input.string("SR", "Sweep-Reverse Label Text", group=gSweep, tooltip="Text body of the sweep-and-reverse label.")
srSignalCooldown   = input.int(5, "Sweep-Reverse Signal Cooldown (bars)", minval=1, maxval=50, group=gSweep, tooltip="Minimum bars between consecutive Sweep-Reverse signals.")
showSweepBg        = input.bool(true,  "Highlight Sweep Bars (bgcolor)", group=gSweep, tooltip="Tints the background of bars that triggered a sweep on the top magnet.")

// ---- UI Sizing --------------------------------------------------------------
dashPosStr     = input.string("Top Right", "Dashboard Position", options=["Top Right", "Top Left", "Top Center", "Bottom Right", "Bottom Left", "Bottom Center", "Middle Right", "Middle Left", "Middle Center"], group=gSize)
dashSizeStr    = input.string("Small",     "Dashboard Text Size", options=["Tiny", "Small", "Normal", "Large", "Huge"], group=gSize)
lblSizeStr     = input.string("Small",     "Zone Label Text Size", options=["Tiny", "Small", "Normal", "Large"], group=gSize)
topLblSizeStr  = input.string("Normal",    "TOP Label Text Size", options=["Small", "Normal", "Large", "Huge"], group=gSize)
srLblSizeStr   = input.string("Normal",    "SR Signal Label Size", options=["Tiny", "Small", "Normal", "Large", "Huge"], group=gSize)

// =============================================================================
//  SECTION 2 - COLOR PALETTE  (Royal Purple - locked)
// =============================================================================
// Curated palette - lavender bull / magenta bear, with gold reserved for
// the indicator's signature TOP MAGNET emphasis.
const color C_BULL   = #c5aff5                  // lavender (downside liquidity, bull magnet)
const color C_BEAR   = #D900FF                  // magenta (upside liquidity, bear magnet)
const color C_ACCENT = #f59e0b                  // gold (TOP MAGNET signature)
const color C_BG     = #0F0B1A                  // royal-night background
const color C_FRAME  = #241A3A                  // deep amethyst frame

// Downstream aliases (preserve original symbol names)
color colHigh      = C_BEAR
color colLow       = C_BULL
color colTop       = C_ACCENT
color colField     = C_BULL
color colDashBg    = C_BG
color colDashBdr   = C_FRAME
color colSr        = C_ACCENT

// Historical marker colors (palette-aligned: bull = touched, frame = expired, gold = swept)
color colHistOK    = C_BULL
color colHistFail  = C_FRAME
color colHistSwept = C_ACCENT

// =============================================================================
//  SECTION 3 - HELPER FUNCTIONS
// =============================================================================

// 3.1  Color gradient interpolation
f_colorGradient(float _ratio, color _colA, color _colB) =>
    rA = color.r(_colA)
    gA = color.g(_colA)
    bA = color.b(_colA)
    rB = color.r(_colB)
    gB = color.g(_colB)
    bB = color.b(_colB)
    rr = rA + int((rB - rA) * _ratio)
    rg = gA + int((gB - gA) * _ratio)
    rb = bA + int((bB - bA) * _ratio)
    color.rgb(rr, rg, rb, 0)

// 3.2  Clamp helper
f_clamp(float _x, float _min, float _max) =>
    math.max(_min, math.min(_x, _max))

// 3.3  Position resolver
strToPos(string s) =>
    switch s
        "Top Right"     => position.top_right
        "Top Left"      => position.top_left
        "Top Center"    => position.top_center
        "Bottom Right"  => position.bottom_right
        "Bottom Left"   => position.bottom_left
        "Bottom Center" => position.bottom_center
        "Middle Right"  => position.middle_right
        "Middle Left"   => position.middle_left
        "Middle Center" => position.middle_center
        =>               position.bottom_right

// 3.4  Size resolver
strToSize(string s) =>
    switch s
        "Tiny"   => size.tiny
        "Small"  => size.small
        "Normal" => size.normal
        "Large"  => size.large
        "Huge"   => size.huge
        =>          size.normal

// 3.5  Row gradient background
grad(color _base, int _row, int _rows, int _minT, int _maxT) =>
    float t = _rows <= 1 ? float(_minT) : (float(_minT) + float(_maxT - _minT) * (float(_row) / float(_rows - 1)))
    color.new(_base, int(t))

// 3.6  Format Volume to K/M/B
formatVolume(float v) =>
    string out = "0"
    if v >= 1e9
        out := str.tostring(v / 1e9, "#.##") + "B"
    else if v >= 1e6
        out := str.tostring(v / 1e6, "#.##") + "M"
    else if v >= 1e3
        out := str.tostring(v / 1e3, "#.##") + "K"
    else
        out := str.tostring(v, "#.##")
    out

// 3.7  Log distance
logDist(float a, float b) =>
    (a > 0 and b > 0) ? math.abs(math.log(a / b)) : 1e10

// 3.8  Safe-start bar
safeStartBar(int b) =>
    minSafe = bar_index - 4900
    b < minSafe ? minSafe : b

// 3.9  Pulse transparency for animated magnet (JOAT)
//      Returns transparency value modulated via sin(bar_index * pulsePeriod)
//      Centred on pulseBase, swing of +/-pulseAmplitude. Clamped to [0,100].
pulseTransp() =>
    int t = int(pulseBase + pulseAmplitude * math.sin(float(bar_index) * pulsePeriod))
    int(f_clamp(float(t), 0.0, 100.0))

// 3.10  Intensity transparency for non-top zones
intensityTransp(float pct) =>
    int(math.max(10.0, 85.0 - pct * 3.5))

// 3.11  Progress-bar glyph string
progressBarStr(float pct, int barLen) =>
    string out = ""
    int filled = int(math.round(pct / 100.0 * float(barLen)))
    for i = 0 to barLen - 1
        out += i < filled ? "█" : "░"
    out

// =============================================================================
//  SECTION 4 - CORE CALCULATIONS
// =============================================================================

// ATR for sweep / wick checks
atrV     = ta.atr(14)
atrLong  = ta.atr(50)
momRaw   = ta.ema(close, 8) - ta.ema(close, 21)
momFast  = ta.ema(close, 3) - ta.ema(close, 8)
volMa    = ta.sma(volume, 50)
volStd   = ta.stdev(volume, 50)

// Resolved sizes / positions
dashSize   = strToSize(dashSizeStr)
lblSize    = strToSize(lblSizeStr)
topLblSize = strToSize(topLblSizeStr)
magSize    = strToSize(magnetSize)
histSize   = strToSize(histMarkerSize)
srLblSize  = strToSize(srLblSizeStr)
dashPos    = strToPos(dashPosStr)

// ---- TF auto-scale ----
tfSec      = timeframe.in_seconds(timeframe.period)

float autoLogD = 0.30
if tfSec >= 604800
    autoLogD := 0.95
else if tfSec >= 86400
    autoLogD := 0.65
else if tfSec >= 14400
    autoLogD := 0.45
else if tfSec >= 3600
    autoLogD := 0.30
else if tfSec >= 900
    autoLogD := 0.18
else
    autoLogD := 0.10

logDistMax = autoScale ? autoLogD : manualLogD

float autoEqPct = 0.15
if tfSec >= 604800
    autoEqPct := 10.0
else if tfSec >= 86400
    autoEqPct := 8.0
else if tfSec >= 14400
    autoEqPct := 5.0
else if tfSec >= 3600
    autoEqPct := 0.8
else if tfSec >= 900
    autoEqPct := 0.5
else
    autoEqPct := 0.15

eqTolPct = (autoEqTol ? autoEqPct : manualEqTol) / 100.0

// =============================================================================
//  SECTION 5 - USER-DEFINED TYPES
// =============================================================================

// 5.1 Pool — primary liquidity zone
type Pool
    float price
    int   barIdx
    bool  isHigh
    bool  isEqual
    float volAt
    float score
    float probPct
    box   bx
    line  ln
    label lbl

// 5.2 HistMagnet — historical record (w/ swept status)
//     status: 0 pending, 1 touched, 2 expired, 3 swept (JOAT), 4 sweep-reverse (JOAT)
type HistMagnet
    float price
    int   recordedBar
    bool  isHigh
    int   status
    int   resolvedBar
    bool  wasSwept

// 5.3 RankedPool — for top-3 sub-table
type RankedPool
    float price
    float prob
    bool  isHigh
    bool  isEqual

// 5.4 ActiveTouch — JOAT: tracks an active touch awaiting sweep resolution
type ActiveTouch
    float price          // touched magnet price
    int   touchedBar     // bar of the touch
    bool  isHigh         // direction of magnet
    int   barsRemaining  // sweep window countdown
    bool  resolved       // already classified

// =============================================================================
//  SECTION 6 - STATE
// =============================================================================
var array<Pool>        pools         = array.new<Pool>()
var array<HistMagnet>  history       = array.new<HistMagnet>()
var array<label>       histLabels    = array.new<label>()
var array<RankedPool>  top3          = array.new<RankedPool>()
var array<ActiveTouch> activeTouches = array.new<ActiveTouch>()
var array<label>       srLabels      = array.new<label>()
var line               fieldLn       = na
var label              fieldArrow    = na
var label              magnetMarker  = na
var int                touchCount    = 0
var int                expiredCount  = 0
var int                sweepCount    = 0     // JOAT: how many touches turned into sweeps
var int                srCount       = 0     // JOAT: sweep-reverse signals fired
var int                lastSrBar     = -100
var float              prevTopPrice  = na
var bool               prevTopIsHigh = false

// =============================================================================
//  SECTION 7 - PIVOT DETECTION + EQUAL-POOL MERGING
// =============================================================================

// Confirmed pivots (returned `pivotLen` bars after they occurred)
ph = ta.pivothigh(high, pivotLen, pivotLen)
pl = ta.pivotlow (low,  pivotLen, pivotLen)

// Find the closest existing pool of the same direction within tolerance
findClosestPool(float newPrice, bool isHigh) =>
    int   idx     = -1
    float minDist = 1e10
    int   sz      = array.size(pools)
    if sz > 0
        for i = 0 to sz - 1
            p = array.get(pools, i)
            if p.isHigh == isHigh
                diff = math.abs(p.price - newPrice) / newPrice
                if diff <= eqTolPct and diff < minDist
                    minDist := diff
                    idx     := i
    idx

// Erase any drawing handles attached to a pool
clearPoolDraws(Pool p) =>
    if not na(p.bx)
        box.delete(p.bx)
    if not na(p.ln)
        line.delete(p.ln)
    if not na(p.lbl)
        label.delete(p.lbl)

// HIGH pivot
if not na(ph)
    int mIdx = findClosestPool(ph, true)
    if mIdx >= 0
        existing = array.get(pools, mIdx)
        existing.isEqual := true
        existing.price   := math.max(existing.price, ph)
        existing.volAt   := existing.volAt + nz(volume[pivotLen])
        array.set(pools, mIdx, existing)
    else
        Pool fresh = Pool.new(ph, bar_index - pivotLen, true, false, nz(volume[pivotLen]), 0.0, 0.0, na, na, na)
        array.push(pools, fresh)

// LOW pivot
if not na(pl)
    int mIdx = findClosestPool(pl, false)
    if mIdx >= 0
        existing = array.get(pools, mIdx)
        existing.isEqual := true
        existing.price   := math.min(existing.price, pl)
        existing.volAt   := existing.volAt + nz(volume[pivotLen])
        array.set(pools, mIdx, existing)
    else
        Pool fresh = Pool.new(pl, bar_index - pivotLen, false, false, nz(volume[pivotLen]), 0.0, 0.0, na, na, na)
        array.push(pools, fresh)

// =============================================================================
//  SECTION 8 - PRUNING (sweep / age / distance)
// =============================================================================

// Track if previous-bar top was swept this bar
bool prevTopWasSweptThisBar = false

int ii = array.size(pools) - 1
while ii >= 0
    if ii >= array.size(pools)
        ii -= 1
        continue
    p      = array.get(pools, ii)
    age    = bar_index - p.barIdx
    swept  = (p.isHigh and high > p.price) or (not p.isHigh and low < p.price)
    tooOld = age > maxAge
    lDist  = logDist(p.price, close)
    tooFar = lDist > logDistMax

    isPrevTop = not na(prevTopPrice) and math.abs(p.price - prevTopPrice) < syminfo.mintick * 5 and p.isHigh == prevTopIsHigh

    if swept
        if isPrevTop
            prevTopWasSweptThisBar := true
        clearPoolDraws(p)
        array.remove(pools, ii)
    else if tooOld
        clearPoolDraws(p)
        array.remove(pools, ii)
    else if tooFar
        clearPoolDraws(p)
        array.remove(pools, ii)
    ii -= 1

// Memory cap: shift oldest
while array.size(pools) > maxPools
    pShift = array.shift(pools)
    clearPoolDraws(pShift)

// =============================================================================
//  SECTION 9 - COMPOSITE SCORING
// =============================================================================

calcScore(Pool p) =>
    float age       = float(bar_index - p.barIdx)
    float lDist     = logDist(p.price, close)
    float volFactor = (na(p.volAt) or volMa <= 0) ? 1.0 : math.min(p.volAt / volMa, 3.0)
    float eqMult    = p.isEqual ? eqBonus : 1.0
    float strength  = volFactor * eqMult

    // Proximity bowl: peak just under price
    float prox = 0.0
    if lDist < 0.002
        prox := 0.3
    else if lDist < 0.05
        prox := math.max(0.5, 1.0 - math.abs(lDist - 0.02) * 10.0)
    else
        prox := math.max(0.05, 1.0 - (lDist - 0.05) * 3.0)

    // Age curve
    float ageScore = 0.0
    if age < float(minAge)
        ageScore := 0.5
    else if age < 50.0
        ageScore := 1.0
    else
        ageScore := math.max(0.1, 1.0 - (age - 50.0) / 450.0)

    // Momentum alignment toward this pool
    float dirToPool = p.price > close ? 1.0 : -1.0
    float momNorm   = close > 0 ? momRaw / close : 0.0
    float momAlign  = dirToPool * momNorm * 100.0
    float momScore  = 1.0 + math.max(-0.5, math.min(0.5, momAlign))

    float rawScore  = strength * wStrength + prox * wProximity + ageScore * wAge + momScore * wMomentum
    math.max(rawScore, 0.01)

// Apply scoring
float totalScore = 0.0
float scoreUp    = 0.0
float scoreDn    = 0.0
int   topIdx     = -1
float topScore   = -1.0

if array.size(pools) > 0
    for i = 0 to array.size(pools) - 1
        p = array.get(pools, i)
        p.score := calcScore(p)
        array.set(pools, i, p)
        totalScore += p.score
        if p.score > topScore
            topScore := p.score
            topIdx   := i

    if totalScore > 0
        for i = 0 to array.size(pools) - 1
            p = array.get(pools, i)
            p.probPct := (p.score / totalScore) * 100.0
            array.set(pools, i, p)
            if p.isHigh
                scoreUp += p.score
            else
                scoreDn += p.score

float topPrice  = (topIdx >= 0 and array.size(pools) > 0) ? array.get(pools, topIdx).price   : na
float topProb   = (topIdx >= 0 and array.size(pools) > 0) ? array.get(pools, topIdx).probPct : na
bool  topIsHigh = (topIdx >= 0 and array.size(pools) > 0) ? array.get(pools, topIdx).isHigh  : false

// =============================================================================
//  SECTION 10 - MAGNET PULL / BIAS
// =============================================================================
float biasMag = 0.0
if not na(topPrice) and totalScore > 0
    float sameSidePct = topIsHigh ? scoreUp / totalScore * 100.0 : scoreDn / totalScore * 100.0
    biasMag := sameSidePct
int   biasDir = topIsHigh ? 1 : -1
float bias    = biasMag * float(biasDir)

float distToTopPct = na(topPrice) ? na : (topPrice - close) / close * 100.0

// =============================================================================
//  SECTION 11 - TOP-3 RANKED EXTRACTION
// =============================================================================
array.clear(top3)

if array.size(pools) > 0
    array<float> tmpPrices = array.new<float>()
    array<float> tmpProbs  = array.new<float>()
    array<bool>  tmpHighs  = array.new<bool>()
    array<bool>  tmpEquals = array.new<bool>()
    for i = 0 to array.size(pools) - 1
        p = array.get(pools, i)
        array.push(tmpPrices, p.price)
        array.push(tmpProbs,  p.probPct)
        array.push(tmpHighs,  p.isHigh)
        array.push(tmpEquals, p.isEqual)

    int sz = array.size(tmpProbs)
    int n  = math.min(3, sz)
    if n > 0
        for k = 0 to n - 1
            int bestIdx = k
            if k + 1 <= sz - 1
                for j = k + 1 to sz - 1
                    if array.get(tmpProbs, j) > array.get(tmpProbs, bestIdx)
                        bestIdx := j
            if bestIdx != k
                tp = array.get(tmpPrices, k)
                array.set(tmpPrices, k, array.get(tmpPrices, bestIdx))
                array.set(tmpPrices, bestIdx, tp)
                tpr = array.get(tmpProbs, k)
                array.set(tmpProbs, k, array.get(tmpProbs, bestIdx))
                array.set(tmpProbs, bestIdx, tpr)
                th = array.get(tmpHighs, k)
                array.set(tmpHighs, k, array.get(tmpHighs, bestIdx))
                array.set(tmpHighs, bestIdx, th)
                te = array.get(tmpEquals, k)
                array.set(tmpEquals, k, array.get(tmpEquals, bestIdx))
                array.set(tmpEquals, bestIdx, te)
            array.push(top3, RankedPool.new(array.get(tmpPrices, k), array.get(tmpProbs, k), array.get(tmpHighs, k), array.get(tmpEquals, k)))

// =============================================================================
//  SECTION 12 - HISTORICAL TRACK + SWEEP-ON-TOUCH (JOAT)
// =============================================================================

// 12.1  When the current top changes or disappears, archive the old one
bool topActuallyChanged = not na(prevTopPrice) and not na(topPrice) and (math.abs(prevTopPrice - topPrice) > syminfo.mintick * 5 or prevTopIsHigh != topIsHigh)
bool topDisappeared     = not na(prevTopPrice) and na(topPrice)

if topActuallyChanged or topDisappeared
    int initialStatus = prevTopWasSweptThisBar ? 1 : 0
    int resBar        = prevTopWasSweptThisBar ? bar_index : int(na)
    HistMagnet hm = HistMagnet.new(prevTopPrice, bar_index, prevTopIsHigh, initialStatus, resBar, false)
    array.push(history, hm)
    if prevTopWasSweptThisBar
        touchCount += 1
        // Open an ActiveTouch entry to monitor for sweep behaviour
        if enableSweep
            ActiveTouch at = ActiveTouch.new(prevTopPrice, bar_index, prevTopIsHigh, sweepWindow, false)
            array.push(activeTouches, at)

// 12.2  Resolve pending history (touched / expired)
if array.size(history) > 0
    for i = 0 to array.size(history) - 1
        h = array.get(history, i)
        if h.status == 0
            int barsElapsed = bar_index - h.recordedBar
            bool touched    = (h.isHigh and high >= h.price) or (not h.isHigh and low <= h.price)
            if touched
                h.status      := 1
                h.resolvedBar := bar_index
                touchCount    += 1
                array.set(history, i, h)
                // Open an ActiveTouch entry for sweep monitoring
                if enableSweep
                    ActiveTouch at = ActiveTouch.new(h.price, bar_index, h.isHigh, sweepWindow, false)
                    array.push(activeTouches, at)
            else if barsElapsed >= trackingWindow
                h.status      := 2
                h.resolvedBar := bar_index
                expiredCount  += 1
                array.set(history, i, h)

while array.size(history) > maxHistory
    array.shift(history)

// 12.3  JOAT — Sweep-on-touch resolution
//       For each active touch, on every subsequent bar we check whether a
//       sweep candle has formed in the magnet's direction. A sweep candle
//       satisfies BOTH:
//           - wick on the relevant side >= wickAtrMultiplier * ATR(14)
//           - that wick is >= wickRangeRatio of total candle range
//       AND closes back through the level (rejection). When a sweep is
//       confirmed, we mark the parent HistMagnet as swept (status=3) and
//       optionally check for sweep-and-reverse (status=4).

bool sweepThisBar     = false   // any sweep on top magnet this bar -> bgcolor
bool srThisBar        = false   // sweep-and-reverse fired this bar
float srPrice         = na
bool  srIsBullReverse = false   // bull reversal off a HIGH magnet sweep, etc.

float candleRng = high - low
float upperWick = high - math.max(open, close)
float lowerWick = math.min(open, close) - low

if enableSweep and array.size(activeTouches) > 0
    int aIdx = array.size(activeTouches) - 1
    while aIdx >= 0
        if aIdx >= array.size(activeTouches)
            aIdx -= 1
            continue
        at = array.get(activeTouches, aIdx)
        if at.resolved
            array.remove(activeTouches, aIdx)
        else
            // Wick logic specific to magnet direction
            // For HIGH magnet: a sweep is upper wick poking above price level then closing back below
            // For LOW magnet : a sweep is lower wick poking below level then closing back above
            bool isSweepHi = at.isHigh and high > at.price and close < at.price and upperWick >= wickAtrMultiplier * atrV and (candleRng > 0 ? upperWick / candleRng : 0.0) >= wickRangeRatio
            bool isSweepLo = (not at.isHigh) and low < at.price and close > at.price and lowerWick >= wickAtrMultiplier * atrV and (candleRng > 0 ? lowerWick / candleRng : 0.0) >= wickRangeRatio
            bool sweptNow = isSweepHi or isSweepLo

            if sweptNow
                // Mark the most recent matching HistMagnet as swept (status 3)
                if array.size(history) > 0
                    int hI = array.size(history) - 1
                    while hI >= 0
                        hh = array.get(history, hI)
                        if math.abs(hh.price - at.price) < syminfo.mintick * 5 and hh.isHigh == at.isHigh and not hh.wasSwept
                            hh.wasSwept   := true
                            hh.status     := 3                      // JOAT swept
                            hh.resolvedBar:= bar_index
                            array.set(history, hI, hh)
                            sweepCount += 1
                            hI := -1
                        else
                            hI -= 1

                sweepThisBar := true
                at.resolved  := true
                array.set(activeTouches, aIdx, at)

                // ---- Sweep-and-Reverse trigger ----
                if enableSR and (bar_index - lastSrBar) >= srSignalCooldown
                    srThisBar       := true
                    srPrice         := at.price
                    srIsBullReverse := at.isHigh   // reverse DOWN (high sweep -> bear) but trade signal flips up if low
                    srCount         += 1
                    lastSrBar       := bar_index

                    // Tag the corresponding HistMagnet
                    if array.size(history) > 0
                        int hh2 = array.size(history) - 1
                        while hh2 >= 0
                            hm2 = array.get(history, hh2)
                            if math.abs(hm2.price - at.price) < syminfo.mintick * 5 and hm2.isHigh == at.isHigh
                                hm2.status := 4    // sweep-reverse
                                array.set(history, hh2, hm2)
                                hh2 := -1
                            else
                                hh2 -= 1

            else
                // Decrement window
                at.barsRemaining := at.barsRemaining - 1
                if at.barsRemaining <= 0
                    at.resolved := true
                array.set(activeTouches, aIdx, at)
            aIdx -= 1

// Carry top reference to the next bar
prevTopPrice  := topPrice
prevTopIsHigh := topIsHigh

// =============================================================================
//  SECTION 13 - SIGNAL ENGINE
// =============================================================================

// Sweep-and-Reverse label emission (JOAT)
if srThisBar and not na(srPrice)
    string txt = (srIsBullReverse ? "↻ " : "↻ ") + srLabelText
    // Label position: above bar for bull-reverse, below for bear-reverse
    label srLbl = label.new(bar_index, srIsBullReverse ? high + atrV * 0.5 : low - atrV * 0.5, txt,
                            style = srIsBullReverse ? label.style_label_down : label.style_label_up,
                            color = colSr,
                            textcolor = color.white,
                            size = srLblSize,
                            tooltip = "Sweep-and-Reverse: top magnet was swept and price closed back through.")
    array.push(srLabels, srLbl)
    while array.size(srLabels) > 50
        label.delete(array.shift(srLabels))

// Sweep bar background highlight
bgcolor(showSweepBg and sweepThisBar ? color.new(colSr, 80) : na, title="Sweep Bar BG")

// =============================================================================
//  SECTION 14 - VISUALIZATION (zones + lines + labels)
// =============================================================================

if barstate.islast and showZones and array.size(pools) > 0
    float atrH  = atrV * 0.04
    int   pulse = animateTop ? pulseTransp() : pulseBase
    for i = 0 to array.size(pools) - 1
        p = array.get(pools, i)
        clearPoolDraws(p)
        bool  isTop      = (i == topIdx) and showTop
        color baseC      = p.isHigh ? colHigh : colLow
        int   probTransp = intensityTransp(p.probPct)
        int   lineTransp = int(math.max(0.0, float(probTransp) - 30.0))
        color zoneC      = isTop ? colTop : color.new(baseC, probTransp)
        color lineC      = isTop ? colTop : color.new(baseC, lineTransp)
        int   lineW      = isTop ? 3 : 1
        lineStyleSel     = isTop ? line.style_solid : line.style_dotted

        // Pulsing transparency for top zone (JOAT)
        color zoneFill = isTop ? color.new(zoneC, pulse)                                 : color.new(zoneC, 70)
        color zoneBdr  = isTop ? color.new(zoneC, math.max(20, pulse - 30))              : color.new(zoneC, 80)

        int safeLeft = safeStartBar(p.barIdx)
        p.bx := box.new(safeLeft, p.price + atrH, bar_index + zoneExt, p.price - atrH, border_color=zoneBdr, bgcolor=zoneFill)
        p.ln := line.new(safeLeft, p.price, bar_index + zoneExt, p.price, color=lineC, width=lineW, style=lineStyleSel)

        if showLabels
            string eqMark  = p.isEqual ? " ⊜" : ""
            string topMark = isTop ? " ◆" : ""
            string lblTxt  = str.tostring(p.probPct, "#.0") + "%" + eqMark + topMark
            color  lblTxtCol = isTop ? color.white : color.new(color.white, 10)
            curLblSize = isTop ? topLblSize : lblSize
            p.lbl := label.new(bar_index + zoneExt, p.price, lblTxt,
                              style = label.style_label_left,
                              color = color.new(zoneC, isTop ? math.max(20, pulse - 25) : 40),
                              textcolor = lblTxtCol,
                              size = curLblSize)
        array.set(pools, i, p)

// =============================================================================
//  SECTION 15 - MAGNET MARKER + FIELD LINE
// =============================================================================

// Wipe stale handles
if not na(magnetMarker)
    label.delete(magnetMarker)
    magnetMarker := na
if not na(fieldLn)
    line.delete(fieldLn)
    fieldLn := na
if not na(fieldArrow)
    label.delete(fieldArrow)
    fieldArrow := na

if barstate.islast and not na(topPrice)
    int magPulse = animateTop ? pulseTransp() : 0
    if showMagnet
        magnetMarker := label.new(bar_index + zoneExt - 2, topPrice, "🧲",
                                  style = label.style_none,
                                  textcolor = color.new(colTop, magPulse / 4),
                                  size = magSize)
    if showField
        if fieldStyle == "Diagonal"
            int endX = bar_index + fieldOffset
            fieldLn := line.new(bar_index, close, endX, topPrice,
                                color = color.new(colField, math.max(15, math.min(60, magPulse))),
                                width = 2,
                                style = line.style_dashed)
        else
            fieldLn := line.new(bar_index, close, bar_index, topPrice,
                                color = color.new(colField, math.max(15, math.min(60, magPulse))),
                                width = 2,
                                style = line.style_dashed)
        if showFieldArrow
            fieldArrow := label.new(fieldStyle == "Diagonal" ? bar_index + fieldOffset : bar_index, topPrice,
                                    topIsHigh ? "▲" : "▼",
                                    style = label.style_none,
                                    textcolor = color.new(colField, 10),
                                    size = size.small)

// =============================================================================
//  SECTION 16 - HISTORICAL MARKERS
// =============================================================================
if barstate.isconfirmed or barstate.islast
    if array.size(histLabels) > 0
        for i = 0 to array.size(histLabels) - 1
            label.delete(array.get(histLabels, i))
        array.clear(histLabels)

    if showHistory and array.size(history) > 0
        for i = 0 to array.size(history) - 1
            h = array.get(history, i)
            if h.status > 0
                string mark = "✓"
                color  col  = colHistOK
                if h.status == 1
                    mark := "✓"
                    col  := colHistOK
                else if h.status == 2
                    mark := "✗"
                    col  := colHistFail
                else if h.status == 3
                    mark := "⚡"             // sweep
                    col  := colHistSwept
                else if h.status == 4
                    mark := "↻"             // sweep-reverse
                    col  := colSr
                label lbl = label.new(h.recordedBar, h.price, mark,
                                      style = label.style_none,
                                      textcolor = col,
                                      size = histSize)
                array.push(histLabels, lbl)

// =============================================================================
//  SECTION 17 - DASHBOARD (18+ rows)
// =============================================================================
var table dash = table.new(dashPos, 3, 22, bgcolor=colDashBg, border_color=colDashBdr, border_width=1, frame_color=colDashBdr, frame_width=1)
table.clear(dash, 0, 0, 2, 21)

if (barstate.isconfirmed or barstate.islast) and showDash
    float biasAbs = math.abs(bias)

    // ---- Pull text + colour ----
    string biasLabel = "NEUTRAL"
    if biasAbs > 60
        biasLabel := bias > 0 ? "STRONG BULL PULL" : "STRONG BEAR PULL"
    else if biasAbs > 40
        biasLabel := bias > 0 ? "BULL PULL" : "BEAR PULL"

    color biasCol = color.rgb(148, 163, 184)
    if bias > 40
        biasCol := colHigh
    else if bias < -40
        biasCol := colLow

    // ---- Status dot (alignment vs momentum) ----
    string statusDot = "●"
    color  statusCol = color.rgb(148, 163, 184)
    if not na(topPrice) and biasAbs > 40
        bool momPositive = momRaw > 0
        bool topUp       = topIsHigh
        bool aligned     = (topUp and momPositive) or (not topUp and not momPositive)
        if aligned and biasAbs > 60
            statusCol := #22c55e
        else if aligned
            statusCol := #84cc16
        else
            statusCol := #f97316

    // ---- Proximity progress ----
    float progressPct = 0.0
    if not na(topPrice)
        progressPct := math.max(0.0, math.min(100.0, 100.0 * (1.0 - logDist(close, topPrice) / logDistMax)))
    string progressBar = progressBarStr(progressPct, 10)

    // ---- Pulse intensity gauge (JOAT) ----
    int   pulseT  = animateTop ? pulseTransp() : pulseBase
    float pulseFr = 1.0 - float(pulseT) / 100.0
    string pulseBarStr = progressBarStr(pulseFr * 100.0, 8)

    // ---- Touch / Sweep stats ----
    int   totalRes  = touchCount + expiredCount
    float touchRate = totalRes > 0 ? float(touchCount) / float(totalRes) * 100.0 : na
    float sweepRate = touchCount > 0 ? float(sweepCount) / float(touchCount) * 100.0 : na

    int pendingCount = 0
    if array.size(history) > 0
        for i = 0 to array.size(history) - 1
            h = array.get(history, i)
            if h.status == 0
                pendingCount += 1

    // ---- Stringify ----
    string topPriceStr   = na(topPrice) ? "—" : str.tostring(topPrice, format.mintick)
    string topProbStr    = na(topProb)  ? "—" : str.tostring(topProb, "#.0") + "%"
    string distStr       = na(distToTopPct) ? "—" : str.tostring(distToTopPct, "+#.00") + "%"
    string intensityStr  = str.tostring(biasAbs, "#.0") + "%"
    string poolsStr      = str.tostring(array.size(pools))
    string touchRateStr  = na(touchRate) ? "—" : str.tostring(touchRate, "#.0") + "% (" + str.tostring(touchCount) + "/" + str.tostring(totalRes) + ")"
    string sweepRateStr  = na(sweepRate) ? "—" : str.tostring(sweepRate, "#.0") + "% (" + str.tostring(sweepCount) + "/" + str.tostring(touchCount) + ")"
    string srCountStr    = str.tostring(srCount) + " signal" + (srCount == 1 ? "" : "s")
    string logDistStr    = str.tostring(logDistMax, "#.00") + (autoScale ? " (auto)" : " (manual)")
    string eqTolStr      = str.tostring(eqTolPct * 100.0, "#.00") + "%" + (autoEqTol ? " (auto)" : " (manual)")

    color labelCol = color.rgb(148, 163, 184)
    color grayCol  = color.rgb(100, 116, 139)

    int row = 0

    // Row 0: Header
    table.cell(dash, 0, row, "LIQUIDITY MAGNET", text_color=colTop, bgcolor=grad(colDashBg, row, 18, 0, 5), text_size=dashSize, text_font_family=font.family_monospace)
    if showStatus
        table.cell(dash, 1, row, statusDot, text_color=statusCol, bgcolor=grad(colDashBg, row, 18, 0, 5), text_size=dashSize)
    table.cell(dash, 2, row, "v1.0 [JOAT]", text_color=grayCol, bgcolor=grad(colDashBg, row, 18, 0, 5), text_size=size.tiny)
    row += 1

    // Row 1: Magnet Pull
    table.cell(dash, 0, row, "Magnet Pull", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 8), text_size=dashSize)
    table.merge_cells(dash, 1, row, 2, row)
    table.cell(dash, 1, row, biasLabel, text_color=biasCol, bgcolor=grad(colDashBg, row, 18, 0, 8), text_size=dashSize)
    row += 1

    // Row 2: Pull Intensity
    table.cell(dash, 0, row, "Pull Intensity", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 10), text_size=dashSize)
    table.merge_cells(dash, 1, row, 2, row)
    table.cell(dash, 1, row, intensityStr, text_color=biasCol, bgcolor=grad(colDashBg, row, 18, 0, 10), text_size=dashSize)
    row += 1

    // Row 3: Top Target
    table.cell(dash, 0, row, "Top Target", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 12), text_size=dashSize)
    table.merge_cells(dash, 1, row, 2, row)
    table.cell(dash, 1, row, topPriceStr, text_color=colTop, bgcolor=grad(colDashBg, row, 18, 0, 12), text_size=dashSize)
    row += 1

    // Row 4: Probability
    table.cell(dash, 0, row, "Probability", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 14), text_size=dashSize)
    table.merge_cells(dash, 1, row, 2, row)
    table.cell(dash, 1, row, topProbStr, text_color=colTop, bgcolor=grad(colDashBg, row, 18, 0, 14), text_size=dashSize)
    row += 1

    // Row 5: Distance
    table.cell(dash, 0, row, "Distance", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 16), text_size=dashSize)
    table.merge_cells(dash, 1, row, 2, row)
    table.cell(dash, 1, row, distStr, text_color=color.white, bgcolor=grad(colDashBg, row, 18, 0, 16), text_size=dashSize)
    row += 1

    // Row 6: Proximity progress bar
    if showProgress and not na(topPrice)
        table.cell(dash, 0, row, "Proximity", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 18), text_size=dashSize)
        table.merge_cells(dash, 1, row, 2, row)
        color proxColor = progressPct > 70 ? colTop : progressPct > 40 ? color.rgb(132, 204, 22) : labelCol
        table.cell(dash, 1, row, progressBar + " " + str.tostring(progressPct, "#.0") + "%", text_color=proxColor, bgcolor=grad(colDashBg, row, 18, 0, 18), text_size=dashSize)
        row += 1

    // Row 7: Pulse intensity (JOAT)
    if animateTop
        table.cell(dash, 0, row, "Pulse [JOAT]", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 20), text_size=dashSize)
        table.merge_cells(dash, 1, row, 2, row)
        table.cell(dash, 1, row, pulseBarStr, text_color=colTop, bgcolor=grad(colDashBg, row, 18, 0, 20), text_size=dashSize)
        row += 1

    // Row 8: Active Pools
    table.cell(dash, 0, row, "Active Pools", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 22), text_size=dashSize)
    table.merge_cells(dash, 1, row, 2, row)
    table.cell(dash, 1, row, poolsStr, text_color=color.white, bgcolor=grad(colDashBg, row, 18, 0, 22), text_size=dashSize)
    row += 1

    // Row 9: Log-Dist Cap
    table.cell(dash, 0, row, "Log-Dist Cap", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 24), text_size=dashSize)
    table.merge_cells(dash, 1, row, 2, row)
    table.cell(dash, 1, row, logDistStr, text_color=color.white, bgcolor=grad(colDashBg, row, 18, 0, 24), text_size=dashSize)
    row += 1

    // Row 10: Equal Tol
    table.cell(dash, 0, row, "Equal Tol", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 26), text_size=dashSize)
    table.merge_cells(dash, 1, row, 2, row)
    table.cell(dash, 1, row, eqTolStr, text_color=color.white, bgcolor=grad(colDashBg, row, 18, 0, 26), text_size=dashSize)
    row += 1

    // Row 11: Top 3 sub-header
    if showTop3 and array.size(top3) > 0
        table.cell(dash, 0, row, "Top 3 Targets", text_color=grayCol, bgcolor=grad(colDashBg, row, 18, 0, 28), text_size=size.tiny)
        table.merge_cells(dash, 1, row, 2, row)
        table.cell(dash, 1, row, "price · prob", text_color=grayCol, bgcolor=grad(colDashBg, row, 18, 0, 28), text_size=size.tiny)
        row += 1
        // Rows 12-14: Top 3 entries
        for k = 0 to array.size(top3) - 1
            rp = array.get(top3, k)
            string arrow = rp.isHigh ? "▲" : "▼"
            color  arrowCol = rp.isHigh ? colHigh : colLow
            table.cell(dash, 0, row, arrow + " " + str.tostring(k + 1), text_color=arrowCol, bgcolor=grad(colDashBg, row, 18, 0, 30), text_size=dashSize)
            table.merge_cells(dash, 1, row, 2, row)
            string eqM = rp.isEqual ? " ⊜" : ""
            table.cell(dash, 1, row, str.tostring(rp.price, format.mintick) + "  " + str.tostring(rp.prob, "#.0") + "%" + eqM, text_color=color.white, bgcolor=grad(colDashBg, row, 18, 0, 30), text_size=dashSize)
            row += 1

    // Row 15-16: Touch stats
    if showStats
        table.cell(dash, 0, row, "Historical Touch %", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 32), text_size=dashSize)
        table.merge_cells(dash, 1, row, 2, row)
        table.cell(dash, 1, row, touchRateStr, text_color=color.white, bgcolor=grad(colDashBg, row, 18, 0, 32), text_size=dashSize)
        row += 1
        if pendingCount > 0
            table.cell(dash, 0, row, "Pending", text_color=labelCol, bgcolor=grad(colDashBg, row, 18, 0, 34), text_size=dashSize)
            table.merge_cells(dash, 1, row, 2, row)
            table.cell(dash, 1, row, str.tostring(pendingCount), text_color=grayCol, bgcolor=grad(colDashBg, row, 18, 0, 34), text_size=dashSize)
            row += 1

    // Row 17: Sweep Rate (JOAT)
    if showSweepRow
        table.cell(dash, 0, row, "Sweep Rate [JOAT]", text_color=colSr, bgcolor=grad(colDashBg, row, 18, 0, 36), text_size=dashSize)
        table.merge_cells(dash, 1, row, 2, row)
        table.cell(dash, 1, row, sweepRateStr, text_color=color.white, bgcolor=grad(colDashBg, row, 18, 0, 36), text_size=dashSize)
        row += 1

    // Row 18: SR signals fired (JOAT)
    if enableSR
        table.cell(dash, 0, row, "SR Signals [JOAT]", text_color=colSr, bgcolor=grad(colDashBg, row, 18, 0, 38), text_size=dashSize)
        table.merge_cells(dash, 1, row, 2, row)
        table.cell(dash, 1, row, srCountStr, text_color=color.white, bgcolor=grad(colDashBg, row, 18, 0, 38), text_size=dashSize)
        row += 1

    // Row 19: Legend footer
    if showLegend
        table.cell(dash, 0, row, "Legend", text_color=grayCol, bgcolor=grad(colDashBg, row, 18, 0, 40), text_size=size.tiny)
        table.merge_cells(dash, 1, row, 2, row)
        table.cell(dash, 1, row, "◆ Top  ⊜ Equal  ✓ Touched  ✗ Expired  ⚡ Swept  ↻ SR", text_color=grayCol, bgcolor=grad(colDashBg, row, 18, 0, 40), text_size=size.tiny)

// =============================================================================
//  SECTION 18 - ALERTS (5 original + JOAT additions)
// =============================================================================

bool newTopMagnet = ta.change(topPrice) != 0
bool nearTop      = not na(topPrice) and math.abs(close - topPrice) / close < 0.005
bool sweptTop     = not na(topPrice[1]) and ((topIsHigh[1] and high > topPrice[1]) or (not topIsHigh[1] and low < topPrice[1]))
bool biasFlipBull = bias > 50 and bias[1] <= 50
bool biasFlipBear = bias < -50 and bias[1] >= -50

alertcondition(newTopMagnet, "New Top Magnet",        "Liquidity Magnet Pro [JOAT]: new top target identified")
alertcondition(nearTop,      "Price Approaching Top", "Liquidity Magnet Pro [JOAT]: price near top target")
alertcondition(sweptTop,     "Top Magnet Touched",    "Liquidity Magnet Pro [JOAT]: top target touched")
alertcondition(biasFlipBull, "Bull Bias Shift",       "Liquidity Magnet Pro [JOAT]: bias shifted to bullish")
alertcondition(biasFlipBear, "Bear Bias Shift",       "Liquidity Magnet Pro [JOAT]: bias shifted to bearish")

// JOAT additions
alertcondition(sweepThisBar,            "Sweep on Top Magnet",   "Liquidity Magnet Pro [JOAT]: sweep candle on a touched magnet")
alertcondition(srThisBar,               "Sweep-and-Reverse",     "Liquidity Magnet Pro [JOAT]: sweep-and-reverse signal fired")
alertcondition(srThisBar and not srIsBullReverse, "SR Bull",     "Liquidity Magnet Pro [JOAT]: bullish sweep-and-reverse (low magnet swept)")
alertcondition(srThisBar and srIsBullReverse,     "SR Bear",     "Liquidity Magnet Pro [JOAT]: bearish sweep-and-reverse (high magnet swept)")

// =============================================================================
//  END OF Liquidity Magnet Pro [JOAT]
// =============================================================================
