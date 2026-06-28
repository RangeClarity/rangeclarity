//@version=6
// -------------------------------------------------------------------------------------------------
// Moving Average Ribbon Stress Meter [AGPro Series]
//
// Author  : AGProLabs | AGPro Series
// Version : 2.5
//
// Moving Average Ribbon Stress Meter reads the internal condition of a six-line moving average
// ribbon by tracking alignment, slope dispersion, width instability, curvature stress, and price
// stretch. The update adds stress memory zones so critical ribbon pressure leaves a visible reaction
// footprint, while the visual system stays clean, branded, and publication-ready for chart use.
// -------------------------------------------------------------------------------------------------
indicator("Moving Average Ribbon Stress Meter [AGPro Series]", shorttitle="AG Pro RSM", overlay=true, max_labels_count=300, max_boxes_count=40)

// -------------------------------------------------------------------------------------------------
// AGPro palette
// -------------------------------------------------------------------------------------------------
headerBg      = color.rgb(37, 99, 235)
headerText    = color.rgb(245, 247, 250)
panelBg       = color.rgb(15, 23, 42)
panelBorder   = color.rgb(51, 65, 85)
panelLabelCol = color.rgb(148, 163, 184)
panelValueCol = color.rgb(226, 232, 240)
bullColor     = color.rgb(34, 197, 166)
bearColor     = color.rgb(244, 114, 182)
neutralColor  = color.rgb(245, 189, 92)
accentColor   = color.rgb(129, 140, 248)
darkText      = color.rgb(15, 23, 42)

loadedColor    = neutralColor
strainedColor  = color.rgb(251, 146, 60)
criticalColor  = bearColor
fracturedColor = accentColor
recoveryColor  = color.rgb(56, 189, 248)

// -------------------------------------------------------------------------------------------------
// Input groups
// -------------------------------------------------------------------------------------------------
groupRibbon = "Ribbon Settings"
groupStress = "Stress Engine"
groupVisual = "Visuals"
groupZones  = "Stress Memory Zones"
groupEvents = "Events & Alerts"
groupPanel  = "Panel"

// -------------------------------------------------------------------------------------------------
// Inputs
// -------------------------------------------------------------------------------------------------
src = input.source(close, "Source", group=groupRibbon, tooltip="Source series used to build every moving average in the ribbon.")
maType = input.string("EMA", "MA Type", options=["EMA", "SMA", "RMA", "WMA"], group=groupRibbon, tooltip="Select the moving average family used by the ribbon engine.")

len1 = input.int(8, "Ribbon Length 1", minval=1, group=groupRibbon, tooltip="Fastest ribbon component.")
len2 = input.int(13, "Ribbon Length 2", minval=1, group=groupRibbon, tooltip="Second-fastest ribbon component.")
len3 = input.int(21, "Ribbon Length 3", minval=1, group=groupRibbon, tooltip="Third ribbon component.")
len4 = input.int(34, "Ribbon Length 4", minval=1, group=groupRibbon, tooltip="Fourth ribbon component.")
len5 = input.int(55, "Ribbon Length 5", minval=1, group=groupRibbon, tooltip="Fifth ribbon component.")
len6 = input.int(89, "Ribbon Length 6", minval=1, group=groupRibbon, tooltip="Slowest ribbon component.")

atrLen         = input.int(14, "ATR Length", minval=1, group=groupStress, tooltip="ATR normalization length used across the stress engine.")
slopeLen       = input.int(3, "Slope Lookback", minval=1, group=groupStress, tooltip="Lookback used to measure ribbon slope dispersion.")
widthLen       = input.int(10, "Width Stability Lookback", minval=3, group=groupStress, tooltip="Lookback used to evaluate ribbon width consistency.")
curveLen       = input.int(3, "Curvature Lookback", minval=1, group=groupStress, tooltip="Lookback used to detect turning pressure in the ribbon spine.")
scoreSmoothing = input.int(3, "Stress Score Smoothing", minval=1, group=groupStress, tooltip="EMA smoothing applied to the raw stress score.")

dispersionRef  = input.float(0.45, "Slope Dispersion Reference", minval=0.05, step=0.05, group=groupStress, tooltip="Higher values make slope disagreement less sensitive.")
widthDeltaRef  = input.float(0.20, "Width Delta Reference", minval=0.05, step=0.05, group=groupStress, tooltip="Reference scale for one-bar width expansion or contraction.")
widthVolRef    = input.float(0.35, "Width Volatility Reference", minval=0.05, step=0.05, group=groupStress, tooltip="Reference scale for ribbon width volatility.")
curvatureRef   = input.float(0.25, "Curvature Reference", minval=0.05, step=0.05, group=groupStress, tooltip="Reference scale for stress spine curvature.")
stretchFloor   = input.float(0.60, "Stretch Floor (ATR Multiple)", minval=0.10, step=0.05, group=groupStress, tooltip="Minimum ribbon size used before measuring price stretch.")
stretchCalm    = input.float(0.90, "Stretch Calm Threshold", minval=0.10, step=0.05, group=groupStress, tooltip="Stretch below this threshold is treated as calm.")
stretchExtreme = input.float(2.20, "Stretch Extreme Threshold", minval=0.20, step=0.05, group=groupStress, tooltip="Stretch above this threshold is treated as fully stressed.")

wOrder   = input.float(22.0, "Weight: Order Stress", minval=0.0, maxval=100.0, step=0.5, group=groupStress, tooltip="Weight given to moving average stack disorder.")
wSlope   = input.float(24.0, "Weight: Slope Dispersion", minval=0.0, maxval=100.0, step=0.5, group=groupStress, tooltip="Weight given to slope disagreement.")
wWidth   = input.float(18.0, "Weight: Width Instability", minval=0.0, maxval=100.0, step=0.5, group=groupStress, tooltip="Weight given to ribbon width instability.")
wCurve   = input.float(16.0, "Weight: Curvature Stress", minval=0.0, maxval=100.0, step=0.5, group=groupStress, tooltip="Weight given to turning pressure in the stress spine.")
wStretch = input.float(20.0, "Weight: Price Stretch", minval=0.0, maxval=100.0, step=0.5, group=groupStress, tooltip="Weight given to price displacement versus ribbon structure.")

loadedTh         = input.float(20.0, "Loaded Threshold", minval=0.0, maxval=100.0, step=0.5, group=groupStress, tooltip="Stress score threshold for the Loaded regime.")
strainedTh       = input.float(40.0, "Strained Threshold", minval=0.0, maxval=100.0, step=0.5, group=groupStress, tooltip="Stress score threshold for the Strained regime.")
criticalTh       = input.float(60.0, "Critical Threshold", minval=0.0, maxval=100.0, step=0.5, group=groupStress, tooltip="Stress score threshold for the Critical regime.")
fractureTh       = input.float(82.0, "Fracture Score Threshold", minval=0.0, maxval=100.0, step=0.5, group=groupStress, tooltip="Minimum score required before the ribbon is considered fractured.")
fractureOrderMin = input.float(70.0, "Fracture Order Stress Minimum", minval=0.0, maxval=100.0, step=0.5, group=groupStress, tooltip="Order stress gate that must confirm a fracture event.")
recoveryLookback = input.int(12, "Recovery Lookback", minval=2, group=groupStress, tooltip="Lookback used to confirm that stress is cooling from a higher peak.")
pulseRiseRef     = input.float(2.0, "Pulse Rise Reference", minval=0.1, step=0.1, group=groupStress, tooltip="Controls when stress pulse shifts from Stable to Rising.")
pulseSurgeRef    = input.float(6.0, "Pulse Surge Reference", minval=0.5, step=0.5, group=groupStress, tooltip="Controls when stress pulse is treated as a sharp acceleration.")

themePreset     = input.string("AG Pro Premium", "Theme Preset", options=["AG Pro Premium", "Institutional", "Neon Soft", "Monochrome Elite"], group=groupVisual, tooltip="Ribbon color language used by the overlay.")
focusMode       = input.string("Balanced", "Ribbon Focus Mode", options=["Balanced", "Inner Focus", "Outer Focus"], group=groupVisual, tooltip="Shifts line emphasis toward the inner or outer ribbon lines.")
showRibbon      = input.bool(true, "Show Ribbon", group=groupVisual, tooltip="Displays the six-line moving average ribbon.")
showCore        = input.bool(true, "Show Stress Spine", group=groupVisual, tooltip="Displays the central ribbon spine.")
showBands       = input.bool(true, "Show Ribbon Edge Bands", group=groupVisual, tooltip="Displays the upper and lower ribbon boundaries.")
showAura        = input.bool(true, "Show Stress Aura", group=groupVisual, tooltip="Adds background stress shading during higher-pressure states.")
showBarTint     = input.bool(false, "Tint Bars by State", group=groupVisual, tooltip="Tints candles with the active ribbon stress tone.")
baseLineOpacity = input.int(28, "MA Line Transparency", minval=0, maxval=100, group=groupVisual, tooltip="Higher values make the ribbon lines softer.")
fillBoost       = input.int(-8, "Fill Visibility Boost", minval=-20, maxval=20, group=groupVisual, tooltip="Negative values make the ribbon fill more restrained. Positive values make it bolder.")

showZones              = input.bool(true, "Show Stress Memory Zones", group=groupZones, tooltip="Projects recent critical or fractured ribbon stress areas forward as reaction memory zones.")
zoneTriggerMode        = input.string("Critical + Fractured", "Zone Trigger", options=["Critical + Fractured", "Fractured Only"], group=groupZones, tooltip="Controls whether zones are created on every critical transition or only on fractures.")
zoneAnchorMode         = input.string("Ribbon Envelope", "Zone Anchor", options=["Ribbon Envelope", "Core Buffer"], group=groupZones, tooltip="Ribbon Envelope uses the full ribbon span. Core Buffer creates a tighter box around the stress spine.")
zonePadAtr             = input.float(0.15, "Zone Buffer ATR", minval=0.0, step=0.05, group=groupZones, tooltip="Expands each zone slightly so it remains readable on volatile candles.")
zoneProjectionBars     = input.int(55, "Zone Projection Bars", minval=5, maxval=500, group=groupZones, tooltip="How far each visible zone extends to the right of the latest bar.")
zoneArchiveAfter       = input.int(60, "Archive After Bars", minval=5, maxval=500, group=groupZones, tooltip="After this many bars, a zone fades into archive mode instead of remaining dominant.")
zoneDeleteAfter        = input.int(150, "Delete After Bars", minval=10, maxval=1000, group=groupZones, tooltip="Deletes very old zones to keep the script efficient.")
maxVisibleZones        = input.int(3, "Maximum Visible Zones", minval=1, maxval=8, group=groupZones, tooltip="Limits how many stress memory zones are kept on the chart.")
zoneCooldownBars       = input.int(24, "Zone Cooldown Bars", minval=0, group=groupZones, tooltip="Minimum bars required between newly created zones.")
zoneTransparency       = input.int(86, "Active Zone Transparency", minval=0, maxval=100, group=groupZones, tooltip="Transparency of active stress memory zones.")
zoneArchiveTransparency = input.int(93, "Archived Zone Transparency", minval=0, maxval=100, group=groupZones, tooltip="Transparency of archived stress memory zones.")

showLabels            = input.bool(true, "Show Event Labels", group=groupEvents, tooltip="Displays selected stress transition labels on the chart.")
eventLabelMode        = input.string("Balanced", "Event Label Density", options=["Selective", "Balanced", "All"], group=groupEvents, tooltip="Controls how many label classes are allowed to print.")
labelCooldownBars     = input.int(12, "Minimum Bars Between Labels", minval=0, group=groupEvents, tooltip="Global spacing between repeated event labels.")
buildLabelCooldown    = input.int(24, "Build Label Cooldown", minval=0, group=groupEvents, tooltip="Spacing between early build labels.")
restoredLabelCooldown = input.int(28, "Restored Label Cooldown", minval=0, group=groupEvents, tooltip="Spacing between order-restored labels.")
majorLabelCooldown    = input.int(16, "Major Label Cooldown", minval=0, group=groupEvents, tooltip="Spacing between major transition labels.")
labelOffsetATR        = input.float(1.05, "Label Offset ATR", minval=0.10, step=0.05, group=groupEvents, tooltip="Offsets labels away from candles so they stay readable.")
labelSizeInput        = input.string("Normal", "Label Font Size", options=["Tiny", "Small", "Normal", "Large"], group=groupEvents, tooltip="Font size used by event labels.")
showShapes            = input.bool(false, "Show Event Markers", group=groupEvents, tooltip="Displays simple markers in addition to text labels.")

showPanel          = input.bool(true, "Show Panel", group=groupPanel, tooltip="Displays the AGPro summary panel with the next action readout and stress diagnostics.")
panelPosition      = input.string("Top Right", "Panel Position", options=["Top Right", "Top Left", "Middle Right", "Middle Left", "Bottom Right", "Bottom Left"], group=groupPanel, tooltip="Selects where the information panel is anchored.")
panelTheme         = input.string("Dark", "Panel Theme", options=["Dark", "Light"], group=groupPanel, tooltip="Changes the panel background and text balance without altering the ribbon logic.")
panelTextSizeInput = input.string("Normal", "Panel Font Size", options=["Tiny", "Small", "Normal", "Large"], group=groupPanel, tooltip="Font size used by the information panel.")

// -------------------------------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------------------------------
f_clamp(_x, _lo, _hi) =>
    math.max(_lo, math.min(_hi, _x))

f_text_on(_bg) =>
    _lum = 0.299 * color.r(_bg) + 0.587 * color.g(_bg) + 0.114 * color.b(_bg)
    _lum > 150 ? color.rgb(15, 23, 42) : color.rgb(245, 247, 250)

f_ma(_src, _len, _type) =>
    switch _type
        "EMA" => ta.ema(_src, _len)
        "SMA" => ta.sma(_src, _len)
        "RMA" => ta.rma(_src, _len)
        "WMA" => ta.wma(_src, _len)
        => ta.ema(_src, _len)

f_size(_s) =>
    switch _s
        "Tiny"  => size.tiny
        "Small" => size.small
        "Large" => size.large
        => size.normal

f_panel_pos(_pos) =>
    switch _pos
        "Top Left"     => position.top_left
        "Middle Right" => position.middle_right
        "Middle Left"  => position.middle_left
        "Bottom Right" => position.bottom_right
        "Bottom Left"  => position.bottom_left
        => position.top_right

f_panel_bg(_theme) =>
    _theme == "Light" ? color.rgb(248, 250, 252) : panelBg

f_panel_border(_theme) =>
    _theme == "Light" ? color.rgb(203, 213, 225) : panelBorder

f_panel_label(_theme) =>
    _theme == "Light" ? color.rgb(71, 85, 105) : panelLabelCol

f_panel_value(_theme) =>
    _theme == "Light" ? color.rgb(15, 23, 42) : panelValueCol

f_state_color(_state) =>
    switch _state
        "Calm"      => bullColor
        "Loaded"    => loadedColor
        "Strained"  => strainedColor
        "Critical"  => criticalColor
        "Fractured" => fracturedColor
        "Recovery"  => recoveryColor
        => panelLabelCol

f_state_text_color(_state) =>
    switch _state
        "Loaded" => darkText
        "Strained" => darkText
        => headerText

f_next_action(_state, _bias) =>
    if _state == "Calm"
        _bias > 0 ? "Follow Long - Trend Clean" : _bias < 0 ? "Follow Short - Trend Clean" : "Wait - No Ribbon Bias"
    else if _state == "Loaded"
        _bias > 0 ? "Hold Long - Stress Loaded" : _bias < 0 ? "Hold Short - Stress Loaded" : "Watch - Stress Loaded"
    else if _state == "Strained"
        "Tighten Stops - Structure Strained"
    else if _state == "Critical"
        "Reduce Risk - Critical Stress"
    else if _state == "Fractured"
        "Stand Aside - Ribbon Fractured"
    else
        "Watch Re-Entry - Stress Cooling"

f_bucket(_v, _a, _b, _c) =>
    if _v < _a
        "Low"
    else if _v < _b
        "Moderate"
    else if _v < _c
        "High"
    else
        "Extreme"

f_order_violation_bull(_a, _b) =>
    _a <= _b ? 1.0 : 0.0

f_order_violation_bear(_a, _b) =>
    _a >= _b ? 1.0 : 0.0

f_theme_line(_preset, _slot) =>
    if _preset == "Institutional"
        switch _slot
            1 => color.rgb(148, 163, 184)
            2 => color.rgb(56, 189, 248)
            3 => color.rgb(129, 140, 248)
            4 => color.rgb(245, 189, 92)
            5 => color.rgb(251, 146, 60)
            => color.rgb(244, 114, 182)
    else if _preset == "Neon Soft"
        switch _slot
            1 => color.rgb(34, 211, 238)
            2 => color.rgb(45, 212, 191)
            3 => color.rgb(167, 139, 250)
            4 => color.rgb(250, 204, 21)
            5 => color.rgb(251, 146, 60)
            => color.rgb(244, 114, 182)
    else if _preset == "Monochrome Elite"
        switch _slot
            1 => color.rgb(226, 232, 240)
            2 => color.rgb(203, 213, 225)
            3 => color.rgb(148, 163, 184)
            4 => color.rgb(120, 131, 153)
            5 => color.rgb(100, 116, 139)
            => color.rgb(71, 85, 105)
    else
        switch _slot
            1 => headerBg
            2 => bullColor
            3 => accentColor
            4 => neutralColor
            5 => strainedColor
            => bearColor

f_theme_bull(_preset) =>
    if _preset == "Institutional"
        color.rgb(94, 234, 212)
    else if _preset == "Neon Soft"
        color.rgb(45, 212, 191)
    else if _preset == "Monochrome Elite"
        color.rgb(203, 213, 225)
    else
        bullColor

f_theme_bear(_preset) =>
    if _preset == "Institutional"
        color.rgb(251, 146, 60)
    else if _preset == "Neon Soft"
        color.rgb(244, 114, 182)
    else if _preset == "Monochrome Elite"
        color.rgb(100, 116, 139)
    else
        bearColor

f_meter(_v) =>
    if _v < 20
        "1/5"
    else if _v < 40
        "2/5"
    else if _v < 60
        "3/5"
    else if _v < 80
        "4/5"
    else
        "5/5"

f_pulse_text(_v, _riseRef, _surgeRef) =>
    if _v >= _surgeRef
        "Surging"
    else if _v >= _riseRef
        "Rising"
    else if _v <= -_surgeRef
        "Cooling Fast"
    else if _v <= -_riseRef
        "Cooling"
    else
        "Stable"

f_pulse_state(_v, _riseRef, _surgeRef) =>
    if _v >= _surgeRef
        "Critical"
    else if _v >= _riseRef
        "Strained"
    else if _v <= -_surgeRef
        "Recovery"
    else if _v <= -_riseRef
        "Loaded"
    else
        "Calm"

// -------------------------------------------------------------------------------------------------
// Ribbon
// -------------------------------------------------------------------------------------------------
ma1 = f_ma(src, len1, maType)
ma2 = f_ma(src, len2, maType)
ma3 = f_ma(src, len3, maType)
ma4 = f_ma(src, len4, maType)
ma5 = f_ma(src, len5, maType)
ma6 = f_ma(src, len6, maType)

atr = ta.atr(atrLen)

ribbonHigh  = math.max(math.max(math.max(ma1, ma2), math.max(ma3, ma4)), math.max(ma5, ma6))
ribbonLow   = math.min(math.min(math.min(ma1, ma2), math.min(ma3, ma4)), math.min(ma5, ma6))
ribbonWidth = ribbonHigh - ribbonLow
core        = (ma1 + ma2 + ma3 + ma4 + ma5 + ma6) / 6.0
coreSlope1  = atr != 0.0 ? (core - core[1]) / atr : 0.0
trendBias   = coreSlope1 > 0.03 ? 1 : coreSlope1 < -0.03 ? -1 : 0

// -------------------------------------------------------------------------------------------------
// Stress engine
// -------------------------------------------------------------------------------------------------
pairs = 15.0

bullViol = 0.0
bullViol := bullViol + f_order_violation_bull(ma1, ma2)
bullViol := bullViol + f_order_violation_bull(ma1, ma3)
bullViol := bullViol + f_order_violation_bull(ma1, ma4)
bullViol := bullViol + f_order_violation_bull(ma1, ma5)
bullViol := bullViol + f_order_violation_bull(ma1, ma6)
bullViol := bullViol + f_order_violation_bull(ma2, ma3)
bullViol := bullViol + f_order_violation_bull(ma2, ma4)
bullViol := bullViol + f_order_violation_bull(ma2, ma5)
bullViol := bullViol + f_order_violation_bull(ma2, ma6)
bullViol := bullViol + f_order_violation_bull(ma3, ma4)
bullViol := bullViol + f_order_violation_bull(ma3, ma5)
bullViol := bullViol + f_order_violation_bull(ma3, ma6)
bullViol := bullViol + f_order_violation_bull(ma4, ma5)
bullViol := bullViol + f_order_violation_bull(ma4, ma6)
bullViol := bullViol + f_order_violation_bull(ma5, ma6)

bearViol = 0.0
bearViol := bearViol + f_order_violation_bear(ma1, ma2)
bearViol := bearViol + f_order_violation_bear(ma1, ma3)
bearViol := bearViol + f_order_violation_bear(ma1, ma4)
bearViol := bearViol + f_order_violation_bear(ma1, ma5)
bearViol := bearViol + f_order_violation_bear(ma1, ma6)
bearViol := bearViol + f_order_violation_bear(ma2, ma3)
bearViol := bearViol + f_order_violation_bear(ma2, ma4)
bearViol := bearViol + f_order_violation_bear(ma2, ma5)
bearViol := bearViol + f_order_violation_bear(ma2, ma6)
bearViol := bearViol + f_order_violation_bear(ma3, ma4)
bearViol := bearViol + f_order_violation_bear(ma3, ma5)
bearViol := bearViol + f_order_violation_bear(ma3, ma6)
bearViol := bearViol + f_order_violation_bear(ma4, ma5)
bearViol := bearViol + f_order_violation_bear(ma4, ma6)
bearViol := bearViol + f_order_violation_bear(ma5, ma6)

orderStress = 100.0 * math.min(bullViol, bearViol) / pairs

s1 = atr != 0.0 ? (ma1 - ma1[slopeLen]) / atr : 0.0
s2 = atr != 0.0 ? (ma2 - ma2[slopeLen]) / atr : 0.0
s3 = atr != 0.0 ? (ma3 - ma3[slopeLen]) / atr : 0.0
s4 = atr != 0.0 ? (ma4 - ma4[slopeLen]) / atr : 0.0
s5 = atr != 0.0 ? (ma5 - ma5[slopeLen]) / atr : 0.0
s6 = atr != 0.0 ? (ma6 - ma6[slopeLen]) / atr : 0.0

meanSlope = (s1 + s2 + s3 + s4 + s5 + s6) / 6.0
slopeStd  = math.sqrt(((s1 - meanSlope) * (s1 - meanSlope) + (s2 - meanSlope) * (s2 - meanSlope) + (s3 - meanSlope) * (s3 - meanSlope) + (s4 - meanSlope) * (s4 - meanSlope) + (s5 - meanSlope) * (s5 - meanSlope) + (s6 - meanSlope) * (s6 - meanSlope)) / 6.0)
signConsistency = math.abs(math.sign(s1) + math.sign(s2) + math.sign(s3) + math.sign(s4) + math.sign(s5) + math.sign(s6)) / 6.0
dispersionNorm  = f_clamp(slopeStd / dispersionRef, 0.0, 1.0)
slopeStress     = 100.0 * f_clamp(0.60 * (1.0 - signConsistency) + 0.40 * dispersionNorm, 0.0, 1.0)

widthDeltaN      = atr != 0.0 ? math.abs(ribbonWidth - ribbonWidth[1]) / atr : 0.0
widthVolN        = atr != 0.0 ? ta.stdev(ribbonWidth, widthLen) / atr : 0.0
widthInstability = 100.0 * f_clamp(0.55 * (widthDeltaN / widthDeltaRef) + 0.45 * (widthVolN / widthVolRef), 0.0, 1.0)

coreSlope       = atr != 0.0 ? (core - core[curveLen]) / atr : 0.0
curvatureN      = math.abs(coreSlope - coreSlope[1])
curvatureStress = 100.0 * f_clamp(curvatureN / curvatureRef, 0.0, 1.0)

stretchBase        = math.max(ribbonWidth, atr * stretchFloor)
stretchN           = stretchBase != 0.0 ? math.abs(close - core) / stretchBase : 0.0
priceStretchStress = 100.0 * f_clamp((stretchN - stretchCalm) / math.max(stretchExtreme - stretchCalm, 0.01), 0.0, 1.0)

weightSum = math.max(wOrder + wSlope + wWidth + wCurve + wStretch, 0.0001)
rawStressScore = 0.0
rawStressScore := rawStressScore + orderStress * wOrder
rawStressScore := rawStressScore + slopeStress * wSlope
rawStressScore := rawStressScore + widthInstability * wWidth
rawStressScore := rawStressScore + curvatureStress * wCurve
rawStressScore := rawStressScore + priceStretchStress * wStretch
rawStressScore := rawStressScore / weightSum

stressScore = ta.ema(rawStressScore, scoreSmoothing)
stressPulse = stressScore - nz(stressScore[1])

recentPeak = ta.highest(stressScore, recoveryLookback)
isRecovery = recentPeak > criticalTh and stressScore < criticalTh and stressScore < stressScore[1] and orderStress < orderStress[1]

state = "Calm"
if stressScore >= fractureTh and orderStress >= fractureOrderMin
    state := "Fractured"
else if isRecovery and stressScore >= loadedTh
    state := "Recovery"
else if stressScore >= criticalTh
    state := "Critical"
else if stressScore >= strainedTh
    state := "Strained"
else if stressScore >= loadedTh
    state := "Loaded"
else
    state := "Calm"

stateColor     = f_state_color(state)
stateTextColor = f_state_text_color(state)
nextActionText = f_next_action(state, trendBias)

// -------------------------------------------------------------------------------------------------
// Visual engine
// -------------------------------------------------------------------------------------------------
trendToneColor = trendBias >= 0 ? f_theme_bull(themePreset) : f_theme_bear(themePreset)
fillBaseColor  = (state == "Calm" or state == "Loaded") ? trendToneColor : stateColor

dynFillTransp = int(f_clamp(95.0 - stressScore * 0.38 - fillBoost, 64.0, 97.0))
lineTransp    = int(f_clamp(baseLineOpacity, 0.0, 100.0))

w1 = 1
w2 = 1
w3 = 1
w4 = 1
w5 = 1
w6 = 1

t1 = lineTransp
t2 = lineTransp
t3 = lineTransp
t4 = lineTransp
t5 = lineTransp
t6 = lineTransp

if focusMode == "Inner Focus"
    w1 := 2
    w2 := 2
    w3 := 2
    t1 := int(f_clamp(lineTransp - 10, 0, 100))
    t2 := int(f_clamp(lineTransp - 8, 0, 100))
    t3 := int(f_clamp(lineTransp - 4, 0, 100))
    t4 := int(f_clamp(lineTransp + 8, 0, 100))
    t5 := int(f_clamp(lineTransp + 16, 0, 100))
    t6 := int(f_clamp(lineTransp + 22, 0, 100))
else if focusMode == "Outer Focus"
    w4 := 2
    w5 := 2
    w6 := 2
    t1 := int(f_clamp(lineTransp + 22, 0, 100))
    t2 := int(f_clamp(lineTransp + 16, 0, 100))
    t3 := int(f_clamp(lineTransp + 8, 0, 100))
    t4 := int(f_clamp(lineTransp - 4, 0, 100))
    t5 := int(f_clamp(lineTransp - 8, 0, 100))
    t6 := int(f_clamp(lineTransp - 10, 0, 100))

lineColor1 = color.new(f_theme_line(themePreset, 1), t1)
lineColor2 = color.new(f_theme_line(themePreset, 2), t2)
lineColor3 = color.new(f_theme_line(themePreset, 3), t3)
lineColor4 = color.new(f_theme_line(themePreset, 4), t4)
lineColor5 = color.new(f_theme_line(themePreset, 5), t5)
lineColor6 = color.new(f_theme_line(themePreset, 6), t6)

p1 = plot(showRibbon ? ma1 : na, "Ribbon 1", color=lineColor1, linewidth=w1)
p2 = plot(showRibbon ? ma2 : na, "Ribbon 2", color=lineColor2, linewidth=w2)
p3 = plot(showRibbon ? ma3 : na, "Ribbon 3", color=lineColor3, linewidth=w3)
p4 = plot(showRibbon ? ma4 : na, "Ribbon 4", color=lineColor4, linewidth=w4)
p5 = plot(showRibbon ? ma5 : na, "Ribbon 5", color=lineColor5, linewidth=w5)
p6 = plot(showRibbon ? ma6 : na, "Ribbon 6", color=lineColor6, linewidth=w6)

fill(p1, p2, color=showRibbon ? color.new(fillBaseColor, dynFillTransp) : na)
fill(p2, p3, color=showRibbon ? color.new(fillBaseColor, int(f_clamp(dynFillTransp + 3, 0, 100))) : na)
fill(p3, p4, color=showRibbon ? color.new(fillBaseColor, int(f_clamp(dynFillTransp + 6, 0, 100))) : na)
fill(p4, p5, color=showRibbon ? color.new(fillBaseColor, int(f_clamp(dynFillTransp + 3, 0, 100))) : na)
fill(p5, p6, color=showRibbon ? color.new(fillBaseColor, dynFillTransp) : na)

coreGlowColor = color.new(stateColor, 88)
coreMidColor  = color.new(stateColor, 60)
coreMainColor = color.new(stateColor, 12)

plot(showCore ? core : na, "Stress Spine Glow", color=coreGlowColor, linewidth=7)
plot(showCore ? core : na, "Stress Spine Mid", color=coreMidColor, linewidth=4)
plot(showCore ? core : na, "Stress Spine", color=coreMainColor, linewidth=2)
plot(showBands ? ribbonHigh : na, "Ribbon High", color=color.new(fillBaseColor, 88), linewidth=1)
plot(showBands ? ribbonLow : na, "Ribbon Low", color=color.new(fillBaseColor, 88), linewidth=1)

color auraColor = na
if state == "Fractured"
    auraColor := color.new(fracturedColor, 95)
else if state == "Critical"
    auraColor := color.new(criticalColor, 96)
else if state == "Strained" and stressScore > strainedTh + 5
    auraColor := color.new(strainedColor, 97)
else
    auraColor := na

bgcolor(showAura ? auraColor : na)
barcolor(showBarTint ? color.new(fillBaseColor, 52) : na)

// -------------------------------------------------------------------------------------------------
// Events
// -------------------------------------------------------------------------------------------------
stressBuild    = ta.crossover(stressScore, loadedTh)
stressStrained = ta.crossover(stressScore, strainedTh)
stressCritical = ta.crossover(stressScore, criticalTh)
fractureEvent  = state == "Fractured" and state[1] != "Fractured"
stressReset    = state == "Recovery" and state[1] != "Recovery"
orderRestored  = orderStress < 20 and orderStress[1] >= 20

minorAboveY = high + atr * labelOffsetATR
majorAboveY = high + atr * (labelOffsetATR + 0.34)
belowY      = low - atr * (labelOffsetATR + 0.22)
labelSize   = f_size(labelSizeInput)

showBuildLabel    = eventLabelMode == "All"
showStrainedLabel = eventLabelMode == "Selective" or eventLabelMode == "Balanced" or eventLabelMode == "All"
showCriticalLabel = true
showFractureLabel = true
showResetLabel    = true
showRestoredLabel = eventLabelMode == "Balanced" or eventLabelMode == "All"

buildEvent    = stressBuild and not stressStrained and not stressCritical
strainedEvent = stressStrained and not stressCritical
criticalEvent = stressCritical
resetEvent    = stressReset
restoredEvent = orderRestored and not stressReset

recentStressContext = ta.highest(stressScore[1], 10) >= strainedTh or ta.highest(orderStress[1], 10) >= 35
strongBuildContext  = slopeStress >= 32 or widthInstability >= 30 or orderStress >= 28 or priceStretchStress >= 24

var int lastBuildLabelBar = na
var int lastStrainedLabelBar = na
var int lastCriticalLabelBar = na
var int lastFractureLabelBar = na
var int lastResetLabelBar = na
var int lastRestoredLabelBar = na

canPrintBuild    = showLabels and showBuildLabel and strongBuildContext and (na(lastBuildLabelBar) or bar_index - lastBuildLabelBar >= buildLabelCooldown)
canPrintStrained = showLabels and showStrainedLabel and (na(lastStrainedLabelBar) or bar_index - lastStrainedLabelBar >= labelCooldownBars)
canPrintCritical = showLabels and showCriticalLabel and (na(lastCriticalLabelBar) or bar_index - lastCriticalLabelBar >= majorLabelCooldown)
canPrintFracture = showLabels and showFractureLabel and (na(lastFractureLabelBar) or bar_index - lastFractureLabelBar >= majorLabelCooldown)
canPrintReset    = showLabels and showResetLabel and (na(lastResetLabelBar) or bar_index - lastResetLabelBar >= majorLabelCooldown)
canPrintRestored = showLabels and showRestoredLabel and recentStressContext and (na(lastRestoredLabelBar) or bar_index - lastRestoredLabelBar >= restoredLabelCooldown)

if canPrintFracture and fractureEvent
    label.new(bar_index, majorAboveY, "Ribbon Fracture", style=label.style_label_down, color=color.new(fracturedColor, 0), textcolor=headerText, size=labelSize)
    lastFractureLabelBar := bar_index
else if canPrintCritical and criticalEvent
    label.new(bar_index, majorAboveY, "Critical Load", style=label.style_label_down, color=color.new(criticalColor, 0), textcolor=headerText, size=labelSize)
    lastCriticalLabelBar := bar_index
else if canPrintReset and resetEvent
    label.new(bar_index, belowY, "Stress Reset", style=label.style_label_up, color=color.new(recoveryColor, 0), textcolor=headerText, size=labelSize)
    lastResetLabelBar := bar_index
else if canPrintStrained and strainedEvent
    label.new(bar_index, minorAboveY, "Structure Strained", style=label.style_label_down, color=color.new(strainedColor, 0), textcolor=darkText, size=labelSize)
    lastStrainedLabelBar := bar_index
else if canPrintBuild and buildEvent
    label.new(bar_index, minorAboveY, "Stress Build", style=label.style_label_down, color=color.new(loadedColor, 0), textcolor=darkText, size=labelSize)
    lastBuildLabelBar := bar_index
else if canPrintRestored and restoredEvent
    label.new(bar_index, belowY, "Order Restored", style=label.style_label_up, color=color.new(bullColor, 0), textcolor=headerText, size=labelSize)
    lastRestoredLabelBar := bar_index

showBuildShape    = eventLabelMode == "All"
showStrainedShape = eventLabelMode == "Selective" or eventLabelMode == "Balanced" or eventLabelMode == "All"

plotshape(showShapes and showBuildShape and buildEvent, title="Stress Build Marker", style=shape.circle, location=location.abovebar, size=size.tiny, color=color.new(loadedColor, 0), text="")
plotshape(showShapes and showStrainedShape and strainedEvent, title="Strained Marker", style=shape.circle, location=location.abovebar, size=size.tiny, color=color.new(strainedColor, 0), text="")
plotshape(showShapes and criticalEvent, title="Critical Stress Marker", style=shape.circle, location=location.abovebar, size=size.tiny, color=color.new(criticalColor, 0), text="")
plotshape(showShapes and fractureEvent, title="Fracture Marker", style=shape.diamond, location=location.abovebar, size=size.small, color=color.new(fracturedColor, 0), text="")
plotshape(showShapes and resetEvent, title="Stress Reset Marker", style=shape.circle, location=location.belowbar, size=size.tiny, color=color.new(recoveryColor, 0), text="")

// -------------------------------------------------------------------------------------------------
// Stress memory zones
// -------------------------------------------------------------------------------------------------
var box[] stressZones = array.new_box()
var int[] stressZoneStarts = array.new_int()
var color[] stressZoneColors = array.new_color()
var string[] stressZoneKinds = array.new_string()
var int lastZoneBar = na

canCreateZone = showZones and (na(lastZoneBar) or bar_index - lastZoneBar >= zoneCooldownBars)
criticalZoneEvent = state == "Critical" and state[1] != "Critical"
zoneEvent = canCreateZone and ((zoneTriggerMode == "Critical + Fractured" and (criticalZoneEvent or fractureEvent)) or (zoneTriggerMode == "Fractured Only" and fractureEvent))

if zoneEvent
    zoneTopBase = zoneAnchorMode == "Ribbon Envelope" ? ribbonHigh : core + atr * math.max(zonePadAtr, 0.25)
    zoneBottomBase = zoneAnchorMode == "Ribbon Envelope" ? ribbonLow : core - atr * math.max(zonePadAtr, 0.25)
    zoneTop = zoneTopBase + atr * zonePadAtr
    zoneBottom = zoneBottomBase - atr * zonePadAtr
    zoneColor = fractureEvent ? fracturedColor : trendBias > 0 ? bullColor : trendBias < 0 ? bearColor : neutralColor
    zoneKind = fractureEvent ? "Fracture" : "Critical"
    zoneBox = box.new(left=bar_index, top=zoneTop, right=bar_index + zoneProjectionBars, bottom=zoneBottom, bgcolor=color.new(zoneColor, zoneTransparency), border_color=color.new(zoneColor, 30))
    array.unshift(stressZones, zoneBox)
    array.unshift(stressZoneStarts, bar_index)
    array.unshift(stressZoneColors, zoneColor)
    array.unshift(stressZoneKinds, zoneKind)
    lastZoneBar := bar_index

activeZoneCount = 0
latestZoneKind = "None"

if array.size(stressZones) > 0
    zoneCount = array.size(stressZones)
    for idx = 0 to zoneCount - 1
        i = zoneCount - 1 - idx
        zoneBox = array.get(stressZones, i)
        zoneStart = array.get(stressZoneStarts, i)
        zoneColor = array.get(stressZoneColors, i)
        zoneKind = array.get(stressZoneKinds, i)
        zoneAge = bar_index - zoneStart
        zoneArchived = zoneAge >= zoneArchiveAfter

        if zoneAge >= zoneDeleteAfter or i >= maxVisibleZones
            box.delete(zoneBox)
            array.remove(stressZones, i)
            array.remove(stressZoneStarts, i)
            array.remove(stressZoneColors, i)
            array.remove(stressZoneKinds, i)
        else
            box.set_right(zoneBox, bar_index + zoneProjectionBars)
            box.set_bgcolor(zoneBox, color.new(zoneColor, zoneArchived ? zoneArchiveTransparency : zoneTransparency))
            box.set_border_color(zoneBox, color.new(zoneColor, zoneArchived ? 78 : 30))
            if not zoneArchived
                activeZoneCount := activeZoneCount + 1
            if i == 0
                latestZoneKind := zoneKind

zonePanelText = array.size(stressZones) == 0 ? "None" : latestZoneKind + " / " + str.tostring(activeZoneCount) + " active"
zonePanelState = latestZoneKind == "Fracture" ? "Fractured" : latestZoneKind == "Critical" ? "Critical" : "Calm"

// -------------------------------------------------------------------------------------------------
// Panel
// -------------------------------------------------------------------------------------------------
var table panel = table.new(f_panel_pos(panelPosition), 2, 12, border_width=1, frame_color=f_panel_border(panelTheme), border_color=f_panel_border(panelTheme))
panelBase = f_panel_bg(panelTheme)
panelLine = f_panel_border(panelTheme)
panelLabelText = f_panel_label(panelTheme)
panelValueText = f_panel_value(panelTheme)
panelTextSize = f_size(panelTextSizeInput)

if barstate.islast
    if showPanel
        orderBucketText = f_bucket(orderStress, 20.0, 45.0, 70.0)
        orderBucketState = orderStress < 20 ? "Calm" : orderStress < 45 ? "Loaded" : orderStress < 70 ? "Strained" : "Fractured"

        slopeSyncText = signConsistency > 0.80 ? "Aligned" : signConsistency > 0.55 ? "Mixed" : "Broken"
        slopeSyncState = signConsistency > 0.80 ? "Calm" : signConsistency > 0.55 ? "Loaded" : "Critical"

        widthText = widthInstability < 25 ? "Stable" : widthInstability < 55 ? "Adaptive" : widthInstability < 80 ? "Unstable" : "Chaotic"
        widthState = widthInstability < 25 ? "Calm" : widthInstability < 55 ? "Loaded" : widthInstability < 80 ? "Strained" : "Critical"

        stretchText = stretchN < stretchCalm ? "Normal" : stretchN < 1.4 ? "Extended" : stretchN < stretchExtreme ? "Stretched" : "Overstretched"
        stretchState = stretchN < stretchCalm ? "Calm" : stretchN < 1.4 ? "Loaded" : stretchN < stretchExtreme ? "Strained" : "Critical"

        pulseText = f_pulse_text(stressPulse, pulseRiseRef, pulseSurgeRef)
        pulseState = f_pulse_state(stressPulse, pulseRiseRef, pulseSurgeRef)

        meterText = f_meter(stressScore)
        biasText = trendBias > 0 ? "Bullish" : trendBias < 0 ? "Bearish" : "Neutral"
        biasBg = trendBias > 0 ? color.new(f_theme_bull(themePreset), 12) : trendBias < 0 ? color.new(f_theme_bear(themePreset), 12) : color.new(neutralColor, 16)

        table.set_frame_color(panel, panelLine)
        table.set_border_color(panel, panelLine)
        table.clear(panel, 0, 0, 1, 11)
        table.merge_cells(panel, 0, 0, 1, 0)

        table.cell(panel, 0, 0, "AG Pro Moving Average Ribbon Stress Meter", text_color=headerText, bgcolor=headerBg, text_size=panelTextSize, text_halign=text.align_center)

        table.cell(panel, 0, 1, "Next action", text_color=panelLabelText, bgcolor=panelBase, text_size=panelTextSize)
        table.cell(panel, 1, 1, nextActionText, text_color=f_text_on(headerBg), bgcolor=color.new(headerBg, 0), text_size=panelTextSize, text_halign=text.align_center)

        table.cell(panel, 0, 2, "State", text_color=panelLabelText, bgcolor=panelBase, text_size=panelTextSize)
        table.cell(panel, 1, 2, state, text_color=stateTextColor, bgcolor=color.new(stateColor, 4), text_size=panelTextSize, text_halign=text.align_center)

        table.cell(panel, 0, 3, "Stress score", text_color=panelLabelText, bgcolor=panelBase, text_size=panelTextSize)
        table.cell(panel, 1, 3, str.tostring(stressScore, "#.0"), text_color=headerText, bgcolor=color.new(stateColor, 12), text_size=panelTextSize, text_halign=text.align_center)

        table.cell(panel, 0, 4, "Stress meter", text_color=panelLabelText, bgcolor=panelBase, text_size=panelTextSize)
        table.cell(panel, 1, 4, meterText, text_color=headerText, bgcolor=color.new(stateColor, 18), text_size=panelTextSize, text_halign=text.align_center)

        table.cell(panel, 0, 5, "Ribbon bias", text_color=panelLabelText, bgcolor=panelBase, text_size=panelTextSize)
        table.cell(panel, 1, 5, biasText, text_color=trendBias == 0 ? color.rgb(78, 46, 0) : headerText, bgcolor=biasBg, text_size=panelTextSize, text_halign=text.align_center)

        table.cell(panel, 0, 6, "Order", text_color=panelLabelText, bgcolor=panelBase, text_size=panelTextSize)
        table.cell(panel, 1, 6, orderBucketText, text_color=f_state_text_color(orderBucketState), bgcolor=color.new(f_state_color(orderBucketState), 8), text_size=panelTextSize, text_halign=text.align_center)

        table.cell(panel, 0, 7, "Slope sync", text_color=panelLabelText, bgcolor=panelBase, text_size=panelTextSize)
        table.cell(panel, 1, 7, slopeSyncText, text_color=f_state_text_color(slopeSyncState), bgcolor=color.new(f_state_color(slopeSyncState), 8), text_size=panelTextSize, text_halign=text.align_center)

        table.cell(panel, 0, 8, "Width stability", text_color=panelLabelText, bgcolor=panelBase, text_size=panelTextSize)
        table.cell(panel, 1, 8, widthText, text_color=f_state_text_color(widthState), bgcolor=color.new(f_state_color(widthState), 8), text_size=panelTextSize, text_halign=text.align_center)

        table.cell(panel, 0, 9, "Price stretch", text_color=panelLabelText, bgcolor=panelBase, text_size=panelTextSize)
        table.cell(panel, 1, 9, stretchText, text_color=f_state_text_color(stretchState), bgcolor=color.new(f_state_color(stretchState), 8), text_size=panelTextSize, text_halign=text.align_center)

        table.cell(panel, 0, 10, "Stress pulse", text_color=panelLabelText, bgcolor=panelBase, text_size=panelTextSize)
        table.cell(panel, 1, 10, pulseText, text_color=f_state_text_color(pulseState), bgcolor=color.new(f_state_color(pulseState), 8), text_size=panelTextSize, text_halign=text.align_center)

        table.cell(panel, 0, 11, "Memory zones", text_color=panelLabelText, bgcolor=panelBase, text_size=panelTextSize)
        table.cell(panel, 1, 11, zonePanelText, text_color=f_state_text_color(zonePanelState), bgcolor=color.new(f_state_color(zonePanelState), 8), text_size=panelTextSize, text_halign=text.align_center)
    else
        table.clear(panel, 0, 0, 1, 11)

// -------------------------------------------------------------------------------------------------
// Alerts
// -------------------------------------------------------------------------------------------------
alertcondition(stressBuild, "Stress Build", "Ribbon stress entered the Loaded state.")
alertcondition(stressStrained, "Stress Enters Strained", "Ribbon stress entered the Strained state.")
alertcondition(stressCritical, "Critical Stress", "Ribbon stress entered the Critical state.")
alertcondition(fractureEvent, "Ribbon Fracture", "Ribbon stress entered the Fractured state.")
alertcondition(stressReset, "Stress Reset", "Ribbon stress entered the Recovery state.")
alertcondition(orderRestored, "Order Restored", "Ribbon order stress improved and the stack regained cleaner order.")
alertcondition(zoneEvent, "Stress Memory Zone", "Ribbon stress created a new stress memory zone.")

// -------------------------------------------------------------------------------------------------
// Data window
// -------------------------------------------------------------------------------------------------
plot(stressScore, "Stress Score", color=color.new(stateColor, 0), display=display.data_window)
plot(orderStress, "Order Stress", color=color.new(fracturedColor, 0), display=display.data_window)
plot(slopeStress, "Slope Dispersion Stress", color=color.new(strainedColor, 0), display=display.data_window)
plot(widthInstability, "Width Instability Stress", color=color.new(loadedColor, 0), display=display.data_window)
plot(curvatureStress, "Curvature Stress", color=color.new(criticalColor, 0), display=display.data_window)
plot(priceStretchStress, "Price Stretch Stress", color=color.new(recoveryColor, 0), display=display.data_window)
plot(stressPulse, "Stress Pulse", color=color.new(headerBg, 0), display=display.data_window)
plot(activeZoneCount, "Active Stress Memory Zones", color=color.new(accentColor, 0), display=display.data_window)
