//@Julien_Exe

//@version=6
indicator("Adaptive Trend Channel", overlay=true, max_bars_back=3000)

sourceInput = input.source(close, "Source", group="Channel Configuration")

bool shortChannel = input.bool(true, "Show Best Short-Term Channel", group="Channels")
bool longChannel = input.bool(true, "Show Best Long-Term Channel", group="Channels")
bool veryLongChannel = input.bool(false, "Show Best Very Long-Term Channel", tooltip="If the channel does not appear, load more historical bars by scrolling back on the chart or zooming out until more past data is available.", group="Channels")
color eligibleChannelColor = input.color(color.aqua, "Eligible Channel Color", group="Channels")
color ineligibleChannelColor = input.color(color.gray, "Ineligible Channel Color", group="Channels")

bool showMidline = input.bool(false, "Display Midline", group="Midline Settings", inline="Mid")
string midLineStyle = input.string("Dashed", "", options=["Dotted", "Solid", "Dashed"], group="Midline Settings", inline="Mid")
int midTransp = input.int(50, "Transp", minval=0, maxval=100, step=10, group="Midline Settings", inline="Mid")

bool isLog = input.bool(false, "Enable for logarithmic price scale", group="Channel Configuration")
float devMultiplier = input.float(2.0, "Display Deviation Multiplier", step=0.1, group="Channel Configuration", inline="Cfg1")
string lineStyle1 = input.string("Solid", "", options=["Solid", "Dotted", "Dashed"], group="Channel Configuration", inline="Cfg1")
string extendStyle = input.string("Extend Right", "", options=["Extend Right", "Extend Both", "Extend None", "Extend Left"], group="Channel Configuration", inline="Cfg1")
int channelTransparency = input.int(40, "Line Transp", minval=0, maxval=100, step=1, group="Channel Configuration", inline="Cfg2")
int fillTransparency = input.int(93, "Fill Transp", minval=0, maxval=100, step=1, group="Channel Configuration", inline="Cfg2")

string detectionMode = input.string("Robust Composite", "Best Channel Detection", options=["Pearson r", "Robust Composite"], group="Channel Selection")
float selectionDevMultiplier = input.float(2.0, "Selection Deviation Multiplier", step=0.1, group="Channel Selection")
float minAbsPearson = input.float(0.80, "Min |Pearson r|", minval=0.0, maxval=0.999, step=0.01, group="Channel Selection", inline="Sel2")
float minEligibleADX = input.float(20.0, "Min ADX", minval=0.0, maxval=100.0, step=0.5, group="Channel Selection", inline="Sel2")
float minContainment = input.float(0.85, "Min Containment", minval=0.0, maxval=1.0, step=0.01, group="Channel Selection", inline="Sel3")
float maxWidthPctAllowed = input.float(35.0, "Max Width %", minval=1.0, maxval=500.0, step=0.5, group="Channel Selection", inline="Sel3")
float widthPenaltyCapPct = input.float(40.0, "Width Penalty Cap %", minval=5.0, maxval=500.0, step=0.5, group="Channel Selection")
float trendEffHalfSat = input.float(1.0, "Trend Efficiency Half-Sat", minval=0.05, maxval=10.0, step=0.05, group="Channel Selection")

string tablePositionInput = input.string("Bottom Right", "Table Position", options=["Bottom Right","Bottom Left","Middle Right","Middle Left","Top Right","Top Left","Top Center","Bottom Center"], group="Table Data", inline="Disp")
string textSizeInput = input.string("Normal", "Text Size", options=["Normal", "Large", "Small"], group="Table Data", inline="Disp")

bool showBestPeriod = input.bool(false, "Show Best Length", group="Table Data")
bool showSelectionMetric = input.bool(false, "Show Selection Metric", group="Table Data")
bool showStability = input.bool(false, "Show Stability", group="Table Data")
bool showTrendEfficiency = input.bool(false, "Show Trend Efficiency", group="Table Data")
bool showTrendStrength = input.bool(false, "Show Pearson r", group="Table Data", inline="Str")
bool showPearsonOnly = input.bool(false, "Value Only", group="Table Data", inline="Str")
bool showADX = input.bool(false, "Show ADX", group="Table Data")
bool showAnnualizedChannelReturn = input.bool(false, "Show Annualized Channel Return", group="Table Data")
bool showAnnualizedChannelPriceReturn = input.bool(false, "Show Annualized Channel Price Return", group="Table Data")

f_getTablePos(_pos) =>
    switch _pos
        "Bottom Right" => position.bottom_right
        "Bottom Left" => position.bottom_left
        "Bottom Center" => position.bottom_center
        "Top Right" => position.top_right
        "Top Left" => position.top_left
        "Top Center" => position.top_center
        "Middle Right" => position.middle_right
        => position.middle_left

f_line_style(_s) =>
    switch _s
        "Dotted" => line.style_dotted
        "Dashed" => line.style_dashed
        => line.style_solid

f_extend_style(_s) =>
    switch _s
        "Extend Right" => extend.right
        "Extend Both" => extend.both
        "Extend None" => extend.none
        => extend.left

linearity_rating(abs_r) =>
    switch
        abs_r < 0.2 => "Extremely Low"
        abs_r < 0.3 => "Very Low"
        abs_r < 0.4 => "Low"
        abs_r < 0.5 => "Mostly Low"
        abs_r < 0.6 => "Fair"
        abs_r < 0.7 => "Moderate"
        abs_r < 0.8 => "Good"
        abs_r < 0.9 => "High"
        abs_r < 0.92 => "Very High"
        abs_r < 0.94 => "Strong"
        abs_r < 0.96 => "Very Strong"
        abs_r < 0.98 => "Excellent"
        => "Near-Perfect"

robust_metric_label(v) =>
    v < 35 ? "Weak" : v < 50 ? "Fair" : v < 65 ? "Good" : v < 75 ? "Strong" : "Exceptional"

trend_efficiency_score(_trendEff, _halfSat) =>
    na(_trendEff) ? na : _trendEff / (_trendEff + _halfSat)

adx_label(v) =>
    v < 15 ? "Very Weak" : v < 20 ? "Weak" : v < 25 ? "Neutral" : v < 35 ? "Strong" : v < 50 ? "Very Strong" : "Extreme"

trend_eff_label(v, _halfSat) =>
    float s = trend_efficiency_score(v, _halfSat)
    na(s) ? "N/A" : s < 0.15 ? "Very Low" : s < 0.30 ? "Low" : s < 0.45 ? "Moderate" : s < 0.60 ? "Good" : s < 0.75 ? "Strong" : "Exceptional"

stability_label(v) =>
    na(v) ? "N/A" : v < 0.25 ? "Very Unstable" : v < 0.45 ? "Unstable" : v < 0.60 ? "Fair" : v < 0.75 ? "Stable" : v < 0.90 ? "Strong" : "Very Strong"

adx_fmt(v) =>
    na(v) ? "N/A" : str.tostring(v, "#") + " (" + adx_label(v) + ")"

pearson_fmt(r, only_value) =>
    na(r) ? "N/A" : only_value ? str.tostring(r, "#.###") : str.tostring(r, "#.###") + " (" + linearity_rating(math.abs(r)) + ")"

signed_pct_fmt(v) =>
    na(v) ? "N/A" : (v > 0 ? "+" : "") + str.tostring(v, "#.#") + "%"

stability_fmt(v) =>
    na(v) ? "N/A" : str.tostring(v * 100.0, "#") + "% (" + stability_label(v) + ")"

selection_metric_fmt(_mode, _v) =>
    na(_v) ? "N/A" : _mode == "Robust Composite" ? str.tostring(_v, "#") + " (" + robust_metric_label(_v) + ")" : str.tostring(_v, "#.###") + " (" + linearity_rating(math.abs(_v)) + ")"

trend_eff_fmt(v, _halfSat) =>
    na(v) ? "N/A" : str.tostring(v, "#.##") + " (" + trend_eff_label(v, _halfSat) + ")"

is_valid_tf() =>
    timeframe.isdaily or timeframe.isweekly or timeframe.ismonthly

channel_width_pct(_upper, _lower, _mid) =>
    na(_upper) or na(_lower) or na(_mid) or math.abs(_mid) < syminfo.mintick ? na : ((_upper - _lower) / math.abs(_mid)) * 100.0

clamp_to_channel(_price, _lower, _upper) =>
    if na(_price) or na(_lower) or na(_upper) or _upper < _lower
        na
    else
        math.min(math.max(_price, _lower), _upper)

trend_efficiency_raw(_slope, _stdDev) =>
    na(_slope) or na(_stdDev) or _stdDev <= 0 ? na : math.abs(_slope) / _stdDev

f_channel_params(_rangeMode) =>
    float effSelectionDev = selectionDevMultiplier
    float effMinAbsPearson = minAbsPearson
    float effMinADX = minEligibleADX
    float effMinContainment = minContainment
    float effMaxWidthPctAllowed = maxWidthPctAllowed
    float effWidthPenaltyCapPct = widthPenaltyCapPct
    float effTrendEffHalfSat = trendEffHalfSat
    if _rangeMode == 1
        effSelectionDev += 0.10
        effMinADX := math.max(0.0, minEligibleADX - 2.0)
        effMinContainment := math.max(0.0, minContainment - 0.03)
        effMaxWidthPctAllowed += 10.0
        effWidthPenaltyCapPct += 15.0
        effTrendEffHalfSat *= 1.35
    else if _rangeMode == 2
        effSelectionDev += 0.25
        effMinAbsPearson := math.max(0.60, minAbsPearson - 0.05)
        effMinADX := math.max(10.0, minEligibleADX - 4.0)
        effMinContainment := math.max(0.60, minContainment - 0.08)
        effMaxWidthPctAllowed *= 1.50
        effWidthPenaltyCapPct *= 1.75
        effTrendEffHalfSat *= 1.80
    [effSelectionDev, effMinAbsPearson, effMinADX, effMinContainment, effMaxWidthPctAllowed, effWidthPenaltyCapPct, effTrendEffHalfSat]

robust_base_score(_trendEff, _absR, _adx, _widthPct, _containment, _halfSat, _widthPenaltyCapPct) =>
    if na(_trendEff) or na(_absR) or na(_adx) or na(_widthPct) or na(_containment)
        na
    else
        float teScore = trend_efficiency_score(_trendEff, _halfSat)
        float rScore = math.min(math.max(_absR, 0.0), 1.0)
        float adxScore = math.min(math.max((_adx - 15.0) / 25.0, 0.0), 1.0)
        float widthScore = 1.0 - math.min(math.max(_widthPct, 0.0), _widthPenaltyCapPct) / _widthPenaltyCapPct
        float containScore = math.min(math.max(_containment, 0.0), 1.0)
        100.0 * (0.40 * teScore + 0.25 * rScore + 0.10 * widthScore + 0.07 * containScore + 0.03 * adxScore)

stability_score(_prev, _curr, _next) =>
    if na(_curr) or _curr <= 0
        na
    else
        float acc = 0.0
        int cnt = 0
        if not na(_prev)
            acc += math.max(0.0, 1.0 - math.abs(_curr - _prev) / math.max(_curr, 1e-10))
            cnt += 1
        if not na(_next)
            acc += math.max(0.0, 1.0 - math.abs(_curr - _next) / math.max(_curr, 1e-10))
            cnt += 1
        cnt > 0 ? acc / cnt : 0.0

robust_final_score(_base, _stability) =>
    na(_base) or na(_stability) ? na : _base + 15.0 * _stability

calcDev(src, len) =>
    float base = isLog ? math.log(src) : src
    int n1 = len - 1
    if barstate.islast and bar_index >= len - 1
        float sumX = 0.0
        float sumXX = 0.0
        float sumYX = 0.0
        float sumY = 0.0
        for i = 1 to len by 1
            float val = base[i - 1]
            sumX += i
            sumXX += i * i
            sumYX += i * val
            sumY += val
        float slope = nz((len * sumYX - sumX * sumY) / (len * sumXX - sumX * sumX))
        float avg = sumY / len
        float intercept = avg - slope * sumX / len + slope
        float sumDev = 0.0
        float sumDxx = 0.0
        float sumDyy = 0.0
        float sumDyx = 0.0
        float reg = intercept + slope * n1 * 0.5
        float lineV = intercept
        for i = 0 to n1 by 1
            float v = base[i]
            float dxt = v - avg
            float dyt = lineV - reg
            v := v - lineV
            lineV += slope
            sumDxx += dxt * dxt
            sumDyy += dyt * dyt
            sumDyx += dxt * dyt
            sumDev += v * v
        int df = math.max(1, len - 2)
        float unStdDev = math.sqrt(sumDev / df)
        float divisor = sumDxx * sumDyy
        float r = divisor > 0 ? sumDyx / math.sqrt(divisor) : na
        [unStdDev, r, slope, intercept]
    else
        [na, na, na, na]

containment_ratio(src, len, slope, intercept, stdDev, bandMultiplier) =>
    float base = isLog ? math.log(src) : src
    if na(slope) or na(intercept) or na(stdDev) or stdDev <= 0 or bar_index < len - 1
        na
    else
        int inside = 0
        float band = bandMultiplier * stdDev
        float lineV = intercept
        for i = 0 to len - 1 by 1
            float v = base[i]
            if math.abs(v - lineV) <= band
                inside += 1
            lineV += slope
        inside / len

channel_prices(_period, _slope, _intercept, _stdDev, _bandMultiplier) =>
    int startBar = na
    float startPrice = na
    float endPrice = na
    float upperStart = na
    float upperEnd = na
    float lowerStart = na
    float lowerEnd = na
    if not na(_period) and not na(_slope) and not na(_intercept) and not na(_stdDev)
        startBar := bar_index - _period + 1
        startPrice := isLog ? math.exp(_intercept + _slope * (_period - 1)) : _intercept + _slope * (_period - 1)
        endPrice := isLog ? math.exp(_intercept) : _intercept
        upperStart := isLog ? startPrice * math.exp(_bandMultiplier * _stdDev) : startPrice + _bandMultiplier * _stdDev
        upperEnd := isLog ? endPrice * math.exp(_bandMultiplier * _stdDev) : endPrice + _bandMultiplier * _stdDev
        lowerStart := isLog ? startPrice / math.exp(_bandMultiplier * _stdDev) : startPrice - _bandMultiplier * _stdDev
        lowerEnd := isLog ? endPrice / math.exp(_bandMultiplier * _stdDev) : endPrice - _bandMultiplier * _stdDev
    [startBar, startPrice, endPrice, upperStart, upperEnd, lowerStart, lowerEnd]

trend_cagr(_period, _start, _end) =>
    float msPerYear = 365.0 * 24.0 * 60.0 * 60.0 * 1000.0
    if na(_period) or _period <= 1 or na(_start) or na(_end) or _start <= 0 or _end <= 0 or not is_valid_tf() or bar_index < _period - 1
        na
    else
        float years = (time - time[_period - 1]) / msPerYear
        years > 0 ? math.pow(_end / _start, 1.0 / years) - 1.0 : na

adx_profile(_diLen, _adxLen) =>
    float up = ta.change(high)
    float down = -ta.change(low)
    float plusDM = na(up) ? na : (up > down and up > 0 ? up : 0)
    float minusDM = na(down) ? na : (down > up and down > 0 ? down : 0)
    float truerng = ta.rma(ta.tr, _diLen)
    float plus = fixnan(100 * ta.rma(plusDM, _diLen) / truerng)
    float minus = fixnan(100 * ta.rma(minusDM, _diLen) / truerng)
    float sumPM = plus + minus
    float dx = sumPM == 0 ? 0.0 : 100.0 * math.abs(plus - minus) / sumPM
    float adx = ta.rma(dx, _adxLen)
    [adx, plus, minus]

[adxS1, plusS1, minusS1] = adx_profile(7, 5)
[adxS2, plusS2, minusS2] = adx_profile(10, 7)
[adxS3, plusS3, minusS3] = adx_profile(14, 7)
[adxS4, plusS4, minusS4] = adx_profile(20, 10)
[adxS5, plusS5, minusS5] = adx_profile(24, 12)
[adxS6, plusS6, minusS6] = adx_profile(28, 14)

[adxL1, plusL1, minusL1] = adx_profile(28, 14)
[adxL2, plusL2, minusL2] = adx_profile(35, 17)
[adxL3, plusL3, minusL3] = adx_profile(42, 21)
[adxL4, plusL4, minusL4] = adx_profile(50, 25)

[adxVL1, plusVL1, minusVL1] = adx_profile(56, 28)
[adxVL2, plusVL2, minusVL2] = adx_profile(70, 35)
[adxVL3, plusVL3, minusVL3] = adx_profile(84, 42)
[adxVL4, plusVL4, minusVL4] = adx_profile(100, 50)

get_adx_bundle(_len, _rangeMode) =>
    float adx = na
    float plus = na
    float minus = na
    if _rangeMode == 2
        if _len <= 1800
            adx := adxVL1
            plus := plusVL1
            minus := minusVL1
        else if _len <= 2200
            adx := adxVL2
            plus := plusVL2
            minus := minusVL2
        else if _len <= 2600
            adx := adxVL3
            plus := plusVL3
            minus := minusVL3
        else
            adx := adxVL4
            plus := plusVL4
            minus := minusVL4
    else if _rangeMode == 1
        if _len <= 450
            adx := adxL1
            plus := plusL1
            minus := minusL1
        else if _len <= 700
            adx := adxL2
            plus := plusL2
            minus := minusL2
        else if _len <= 950
            adx := adxL3
            plus := plusL3
            minus := minusL3
        else
            adx := adxL4
            plus := plusL4
            minus := minusL4
    else
        if _len <= 40
            adx := adxS1
            plus := plusS1
            minus := minusS1
        else if _len <= 60
            adx := adxS2
            plus := plusS2
            minus := minusS2
        else if _len <= 90
            adx := adxS3
            plus := plusS3
            minus := minusS3
        else if _len <= 130
            adx := adxS4
            plus := plusS4
            minus := minusS4
        else if _len <= 165
            adx := adxS5
            plus := plusS5
            minus := minusS5
        else
            adx := adxS6
            plus := plusS6
            minus := minusS6
    [adx, plus, minus]

select_channel(_from, _to, _step, _rangeMode) =>
    [effSelectionDev, effMinAbsPearson, effMinADX, effMinContainment, effMaxWidthPctAllowed, effWidthPenaltyCapPct, effTrendEffHalfSat] = f_channel_params(_rangeMode)

    array<int> lens = array.new_int()
    array<float> stds = array.new_float()
    array<float> rs = array.new_float()
    array<float> slopes = array.new_float()
    array<float> intercepts = array.new_float()
    array<float> adxs = array.new_float()
    array<float> pluses = array.new_float()
    array<float> minuses = array.new_float()
    array<float> widths = array.new_float()
    array<float> containments = array.new_float()
    array<float> trendEffs = array.new_float()
    array<float> baseQualities = array.new_float()
    array<float> stabilities = array.new_float()
    array<bool> eligibles = array.new_bool()

    for len = _from to _to by _step
        [sd, pr, sl, ic] = calcDev(sourceInput, len)
        [adx, plus, minus] = get_adx_bundle(len, _rangeMode)
        float contain = containment_ratio(sourceInput, len, sl, ic, sd, effSelectionDev)
        float mid = na(ic) ? na : (isLog ? math.exp(ic) : ic)
        float upperSel = na(mid) or na(sd) ? na : (isLog ? mid * math.exp(effSelectionDev * sd) : mid + effSelectionDev * sd)
        float lowerSel = na(mid) or na(sd) ? na : (isLog ? mid / math.exp(effSelectionDev * sd) : mid - effSelectionDev * sd)
        float widthPct = channel_width_pct(upperSel, lowerSel, mid)
        float absR = na(pr) ? na : math.abs(pr)
        float trendEff = trend_efficiency_raw(sl, sd)
        float baseQ = detectionMode == "Robust Composite" ? robust_base_score(trendEff, absR, adx, widthPct, contain, effTrendEffHalfSat, effWidthPenaltyCapPct) : absR
        bool eligible = not na(absR) and not na(adx) and not na(contain) and not na(widthPct) and absR >= effMinAbsPearson and adx >= effMinADX and contain >= effMinContainment and widthPct <= effMaxWidthPctAllowed
        array.push(lens, len)
        array.push(stds, sd)
        array.push(rs, pr)
        array.push(slopes, sl)
        array.push(intercepts, ic)
        array.push(adxs, adx)
        array.push(pluses, plus)
        array.push(minuses, minus)
        array.push(widths, widthPct)
        array.push(containments, contain)
        array.push(trendEffs, trendEff)
        array.push(baseQualities, baseQ)
        array.push(stabilities, na)
        array.push(eligibles, eligible)

    float bestEligible = na
    int bestEligibleIdx = na
    float bestAny = na
    int bestAnyIdx = na

    for idx = 0 to array.size(lens) - 1 by 1
        float baseQ = array.get(baseQualities, idx)
        float prevBase = idx > 0 ? array.get(baseQualities, idx - 1) : na
        float nextBase = idx < array.size(lens) - 1 ? array.get(baseQualities, idx + 1) : na
        float stab = stability_score(prevBase, baseQ, nextBase)
        array.set(stabilities, idx, stab)
        float finalQ = detectionMode == "Robust Composite" ? robust_final_score(baseQ, stab) : baseQ
        if not na(finalQ)
            if na(bestAny) or finalQ > bestAny
                bestAny := finalQ
                bestAnyIdx := idx
            if array.get(eligibles, idx)
                if na(bestEligible) or finalQ > bestEligible
                    bestEligible := finalQ
                    bestEligibleIdx := idx

    int selectedIdx = na
    bool selectedEligible = false
    if not na(bestEligibleIdx)
        selectedIdx := bestEligibleIdx
        selectedEligible := true
    else if not na(bestAnyIdx)
        selectedIdx := bestAnyIdx
        selectedEligible := false

    int selPeriod = na
    float selStd = na
    float selR = na
    float selSlope = na
    float selIntercept = na
    float selMetric = na
    float selADX = na
    float selPlus = na
    float selMinus = na
    float selContain = na
    float selWidth = na
    float selTrendEff = na
    float selStability = na

    if not na(selectedIdx)
        selPeriod := array.get(lens, selectedIdx)
        selStd := array.get(stds, selectedIdx)
        selR := array.get(rs, selectedIdx)
        selSlope := array.get(slopes, selectedIdx)
        selIntercept := array.get(intercepts, selectedIdx)
        selADX := array.get(adxs, selectedIdx)
        selPlus := array.get(pluses, selectedIdx)
        selMinus := array.get(minuses, selectedIdx)
        selContain := array.get(containments, selectedIdx)
        selWidth := array.get(widths, selectedIdx)
        selTrendEff := array.get(trendEffs, selectedIdx)
        selStability := array.get(stabilities, selectedIdx)
        float baseQ = array.get(baseQualities, selectedIdx)
        selMetric := detectionMode == "Robust Composite" ? robust_final_score(baseQ, selStability) : baseQ

    [selPeriod, selStd, selR, selSlope, selIntercept, selMetric, selADX, selPlus, selMinus, selContain, selWidth, selTrendEff, selStability, selectedEligible, effTrendEffHalfSat]

[shortPeriod, shortStdDev, shortPearson, shortSlope, shortIntercept, shortMetric, shortADX, shortPlus, shortMinus, shortContainment, shortSelectionWidthPct, shortTrendEff, shortStability, shortEligible, shortTrendEffHalfSatEff] = select_channel(20, 200, 10, 0)
[longPeriod, longStdDev, longPearson, longSlope, longIntercept, longMetric, longADX, longPlus, longMinus, longContainment, longSelectionWidthPct, longTrendEff, longStability, longEligible, longTrendEffHalfSatEff] = select_channel(300, 1200, 50, 1)
[veryLongPeriod, veryLongStdDev, veryLongPearson, veryLongSlope, veryLongIntercept, veryLongMetric, veryLongADX, veryLongPlus, veryLongMinus, veryLongContainment, veryLongSelectionWidthPct, veryLongTrendEff, veryLongStability, veryLongEligible, veryLongTrendEffHalfSatEff] = select_channel(1300, 3000, 100, 2)

[startBarS, startPriceS, endPriceS, upperStartS, upperEndS, lowerStartS, lowerEndS] = channel_prices(shortPeriod, shortSlope, shortIntercept, shortStdDev, devMultiplier)
[startBarL, startPriceL, endPriceL, upperStartL, upperEndL, lowerStartL, lowerEndL] = channel_prices(longPeriod, longSlope, longIntercept, longStdDev, devMultiplier)
[startBarVL, startPriceVL, endPriceVL, upperStartVL, upperEndVL, lowerStartVL, lowerEndVL] = channel_prices(veryLongPeriod, veryLongSlope, veryLongIntercept, veryLongStdDev, devMultiplier)

float cagrShort = trend_cagr(shortPeriod, startPriceS, endPriceS)
float cagrLong = trend_cagr(longPeriod, startPriceL, endPriceL)
float cagrVeryLong = trend_cagr(veryLongPeriod, startPriceVL, endPriceVL)

float shortSourceStart = not na(shortPeriod) and shortPeriod > 0 and bar_index >= shortPeriod - 1 ? sourceInput[shortPeriod - 1] : na
float shortSourceEnd = sourceInput
float longSourceStart = not na(longPeriod) and longPeriod > 0 and bar_index >= longPeriod - 1 ? sourceInput[longPeriod - 1] : na
float longSourceEnd = sourceInput
float veryLongSourceStart = not na(veryLongPeriod) and veryLongPeriod > 0 and bar_index >= veryLongPeriod - 1 ? sourceInput[veryLongPeriod - 1] : na
float veryLongSourceEnd = sourceInput

float shortChannelStartPrice = clamp_to_channel(shortSourceStart, lowerStartS, upperStartS)
float shortChannelEndPrice = clamp_to_channel(shortSourceEnd, lowerEndS, upperEndS)
float longChannelStartPrice = clamp_to_channel(longSourceStart, lowerStartL, upperStartL)
float longChannelEndPrice = clamp_to_channel(longSourceEnd, lowerEndL, upperEndL)
float veryLongChannelStartPrice = clamp_to_channel(veryLongSourceStart, lowerStartVL, upperStartVL)
float veryLongChannelEndPrice = clamp_to_channel(veryLongSourceEnd, lowerEndVL, upperEndVL)

float cagrShortChannelPrice = trend_cagr(shortPeriod, shortChannelStartPrice, shortChannelEndPrice)
float cagrLongChannelPrice = trend_cagr(longPeriod, longChannelStartPrice, longChannelEndPrice)
float cagrVeryLongChannelPrice = trend_cagr(veryLongPeriod, veryLongChannelStartPrice, veryLongChannelEndPrice)

bool hasShort = not na(shortPeriod) and not na(shortStdDev) and not na(shortSlope) and not na(shortIntercept)
bool hasLong = not na(longPeriod) and not na(longStdDev) and not na(longSlope) and not na(longIntercept)
bool hasVeryLong = not na(veryLongPeriod) and not na(veryLongStdDev) and not na(veryLongSlope) and not na(veryLongIntercept)

color effShortColor = hasShort ? (shortEligible ? eligibleChannelColor : ineligibleChannelColor) : ineligibleChannelColor
color effLongColor = hasLong ? (longEligible ? eligibleChannelColor : ineligibleChannelColor) : ineligibleChannelColor
color effVeryLongColor = hasVeryLong ? (veryLongEligible ? eligibleChannelColor : ineligibleChannelColor) : ineligibleChannelColor

styleMain = f_line_style(lineStyle1)
styleMid = f_line_style(midLineStyle)
extendMode = f_extend_style(extendStyle)

var line fillBaseLineShort = na
var line st_upperLine = na
var line st_lowerLine = na
var line dispMidLineShort = na
var linefill st_upperFill = na
var linefill st_lowerFill = na

var line fillBaseLineLong = na
var line lt_upperLine = na
var line lt_lowerLine = na
var line dispMidLineLong = na
var linefill lt_upperFill = na
var linefill lt_lowerFill = na

var line fillBaseLineVeryLong = na
var line vlt_upperLine = na
var line vlt_lowerLine = na
var line dispMidLineVeryLong = na
var linefill vlt_upperFill = na
var linefill vlt_lowerFill = na

if shortChannel and hasShort
    if na(fillBaseLineShort)
        fillBaseLineShort := line.new(startBarS, startPriceS, bar_index, endPriceS, width=0, color=color.new(effShortColor, 100), extend=extendMode)
    else
        line.set_xy1(fillBaseLineShort, startBarS, startPriceS)
        line.set_xy2(fillBaseLineShort, bar_index, endPriceS)
        line.set_extend(fillBaseLineShort, extendMode)

    if na(st_upperLine)
        st_upperLine := line.new(startBarS, upperStartS, bar_index, upperEndS, width=1, extend=extendMode, color=color.new(effShortColor, channelTransparency), style=styleMain)
    else
        line.set_xy1(st_upperLine, startBarS, upperStartS)
        line.set_xy2(st_upperLine, bar_index, upperEndS)
        line.set_color(st_upperLine, color.new(effShortColor, channelTransparency))
        line.set_extend(st_upperLine, extendMode)
        line.set_style(st_upperLine, styleMain)

    if na(st_lowerLine)
        st_lowerLine := line.new(startBarS, lowerStartS, bar_index, lowerEndS, width=1, extend=extendMode, color=color.new(effShortColor, channelTransparency), style=styleMain)
    else
        line.set_xy1(st_lowerLine, startBarS, lowerStartS)
        line.set_xy2(st_lowerLine, bar_index, lowerEndS)
        line.set_color(st_lowerLine, color.new(effShortColor, channelTransparency))
        line.set_extend(st_lowerLine, extendMode)
        line.set_style(st_lowerLine, styleMain)

    if na(st_upperFill)
        st_upperFill := linefill.new(st_upperLine, fillBaseLineShort, color=color.new(effShortColor, fillTransparency))
    else
        linefill.set_color(st_upperFill, color.new(effShortColor, fillTransparency))

    if na(st_lowerFill)
        st_lowerFill := linefill.new(fillBaseLineShort, st_lowerLine, color=color.new(effShortColor, fillTransparency))
    else
        linefill.set_color(st_lowerFill, color.new(effShortColor, fillTransparency))

    if showMidline
        if na(dispMidLineShort)
            dispMidLineShort := line.new(startBarS, startPriceS, bar_index, endPriceS, width=1, extend=extendMode, color=color.new(effShortColor, midTransp), style=styleMid)
        else
            line.set_xy1(dispMidLineShort, startBarS, startPriceS)
            line.set_xy2(dispMidLineShort, bar_index, endPriceS)
            line.set_color(dispMidLineShort, color.new(effShortColor, midTransp))
            line.set_extend(dispMidLineShort, extendMode)
            line.set_style(dispMidLineShort, styleMid)
    else
        if not na(dispMidLineShort)
            line.delete(dispMidLineShort)
            dispMidLineShort := na
else
    if not na(st_upperFill)
        linefill.delete(st_upperFill)
        st_upperFill := na
    if not na(st_lowerFill)
        linefill.delete(st_lowerFill)
        st_lowerFill := na
    if not na(st_upperLine)
        line.delete(st_upperLine)
        st_upperLine := na
    if not na(st_lowerLine)
        line.delete(st_lowerLine)
        st_lowerLine := na
    if not na(fillBaseLineShort)
        line.delete(fillBaseLineShort)
        fillBaseLineShort := na
    if not na(dispMidLineShort)
        line.delete(dispMidLineShort)
        dispMidLineShort := na

if longChannel and hasLong
    if na(fillBaseLineLong)
        fillBaseLineLong := line.new(startBarL, startPriceL, bar_index, endPriceL, width=0, color=color.new(effLongColor, 100), extend=extendMode)
    else
        line.set_xy1(fillBaseLineLong, startBarL, startPriceL)
        line.set_xy2(fillBaseLineLong, bar_index, endPriceL)
        line.set_extend(fillBaseLineLong, extendMode)

    if na(lt_upperLine)
        lt_upperLine := line.new(startBarL, upperStartL, bar_index, upperEndL, width=1, extend=extendMode, color=color.new(effLongColor, channelTransparency), style=styleMain)
    else
        line.set_xy1(lt_upperLine, startBarL, upperStartL)
        line.set_xy2(lt_upperLine, bar_index, upperEndL)
        line.set_color(lt_upperLine, color.new(effLongColor, channelTransparency))
        line.set_extend(lt_upperLine, extendMode)
        line.set_style(lt_upperLine, styleMain)

    if na(lt_lowerLine)
        lt_lowerLine := line.new(startBarL, lowerStartL, bar_index, lowerEndL, width=1, extend=extendMode, color=color.new(effLongColor, channelTransparency), style=styleMain)
    else
        line.set_xy1(lt_lowerLine, startBarL, lowerStartL)
        line.set_xy2(lt_lowerLine, bar_index, lowerEndL)
        line.set_color(lt_lowerLine, color.new(effLongColor, channelTransparency))
        line.set_extend(lt_lowerLine, extendMode)
        line.set_style(lt_lowerLine, styleMain)

    if na(lt_upperFill)
        lt_upperFill := linefill.new(lt_upperLine, fillBaseLineLong, color=color.new(effLongColor, fillTransparency))
    else
        linefill.set_color(lt_upperFill, color.new(effLongColor, fillTransparency))

    if na(lt_lowerFill)
        lt_lowerFill := linefill.new(fillBaseLineLong, lt_lowerLine, color=color.new(effLongColor, fillTransparency))
    else
        linefill.set_color(lt_lowerFill, color.new(effLongColor, fillTransparency))

    if showMidline
        if na(dispMidLineLong)
            dispMidLineLong := line.new(startBarL, startPriceL, bar_index, endPriceL, width=1, extend=extendMode, color=color.new(effLongColor, midTransp), style=styleMid)
        else
            line.set_xy1(dispMidLineLong, startBarL, startPriceL)
            line.set_xy2(dispMidLineLong, bar_index, endPriceL)
            line.set_color(dispMidLineLong, color.new(effLongColor, midTransp))
            line.set_extend(dispMidLineLong, extendMode)
            line.set_style(dispMidLineLong, styleMid)
    else
        if not na(dispMidLineLong)
            line.delete(dispMidLineLong)
            dispMidLineLong := na
else
    if not na(lt_upperFill)
        linefill.delete(lt_upperFill)
        lt_upperFill := na
    if not na(lt_lowerFill)
        linefill.delete(lt_lowerFill)
        lt_lowerFill := na
    if not na(lt_upperLine)
        line.delete(lt_upperLine)
        lt_upperLine := na
    if not na(lt_lowerLine)
        line.delete(lt_lowerLine)
        lt_lowerLine := na
    if not na(fillBaseLineLong)
        line.delete(fillBaseLineLong)
        fillBaseLineLong := na
    if not na(dispMidLineLong)
        line.delete(dispMidLineLong)
        dispMidLineLong := na

if veryLongChannel and hasVeryLong
    if na(fillBaseLineVeryLong)
        fillBaseLineVeryLong := line.new(startBarVL, startPriceVL, bar_index, endPriceVL, width=0, color=color.new(effVeryLongColor, 100), extend=extendMode)
    else
        line.set_xy1(fillBaseLineVeryLong, startBarVL, startPriceVL)
        line.set_xy2(fillBaseLineVeryLong, bar_index, endPriceVL)
        line.set_extend(fillBaseLineVeryLong, extendMode)

    if na(vlt_upperLine)
        vlt_upperLine := line.new(startBarVL, upperStartVL, bar_index, upperEndVL, width=1, extend=extendMode, color=color.new(effVeryLongColor, channelTransparency), style=styleMain)
    else
        line.set_xy1(vlt_upperLine, startBarVL, upperStartVL)
        line.set_xy2(vlt_upperLine, bar_index, upperEndVL)
        line.set_color(vlt_upperLine, color.new(effVeryLongColor, channelTransparency))
        line.set_extend(vlt_upperLine, extendMode)
        line.set_style(vlt_upperLine, styleMain)

    if na(vlt_lowerLine)
        vlt_lowerLine := line.new(startBarVL, lowerStartVL, bar_index, lowerEndVL, width=1, extend=extendMode, color=color.new(effVeryLongColor, channelTransparency), style=styleMain)
    else
        line.set_xy1(vlt_lowerLine, startBarVL, lowerStartVL)
        line.set_xy2(vlt_lowerLine, bar_index, lowerEndVL)
        line.set_color(vlt_lowerLine, color.new(effVeryLongColor, channelTransparency))
        line.set_extend(vlt_lowerLine, extendMode)
        line.set_style(vlt_lowerLine, styleMain)

    if na(vlt_upperFill)
        vlt_upperFill := linefill.new(vlt_upperLine, fillBaseLineVeryLong, color=color.new(effVeryLongColor, fillTransparency))
    else
        linefill.set_color(vlt_upperFill, color.new(effVeryLongColor, fillTransparency))

    if na(vlt_lowerFill)
        vlt_lowerFill := linefill.new(fillBaseLineVeryLong, vlt_lowerLine, color=color.new(effVeryLongColor, fillTransparency))
    else
        linefill.set_color(vlt_lowerFill, color.new(effVeryLongColor, fillTransparency))

    if showMidline
        if na(dispMidLineVeryLong)
            dispMidLineVeryLong := line.new(startBarVL, startPriceVL, bar_index, endPriceVL, width=1, extend=extendMode, color=color.new(effVeryLongColor, midTransp), style=styleMid)
        else
            line.set_xy1(dispMidLineVeryLong, startBarVL, startPriceVL)
            line.set_xy2(dispMidLineVeryLong, bar_index, endPriceVL)
            line.set_color(dispMidLineVeryLong, color.new(effVeryLongColor, midTransp))
            line.set_extend(dispMidLineVeryLong, extendMode)
            line.set_style(dispMidLineVeryLong, styleMid)
    else
        if not na(dispMidLineVeryLong)
            line.delete(dispMidLineVeryLong)
            dispMidLineVeryLong := na
else
    if not na(vlt_upperFill)
        linefill.delete(vlt_upperFill)
        vlt_upperFill := na
    if not na(vlt_lowerFill)
        linefill.delete(vlt_lowerFill)
        vlt_lowerFill := na
    if not na(vlt_upperLine)
        line.delete(vlt_upperLine)
        vlt_upperLine := na
    if not na(vlt_lowerLine)
        line.delete(vlt_lowerLine)
        vlt_lowerLine := na
    if not na(fillBaseLineVeryLong)
        line.delete(fillBaseLineVeryLong)
        fillBaseLineVeryLong := na
    if not na(dispMidLineVeryLong)
        line.delete(dispMidLineVeryLong)
        dispMidLineVeryLong := na

var table t = na
var string prevTablePos = na
var int prevRowsN = na
var int prevColsN = na

int dataRows = (showBestPeriod ? 1 : 0) + (showSelectionMetric ? 1 : 0) + (showStability ? 1 : 0) + (showTrendEfficiency ? 1 : 0) + (showTrendStrength ? 1 : 0) + (showADX ? 1 : 0) + (showAnnualizedChannelReturn ? 1 : 0) + (showAnnualizedChannelPriceReturn ? 1 : 0)
int rowsN = dataRows + 1
int colsN = (veryLongChannel ? 1 : 0) + (longChannel ? 1 : 0) + (shortChannel ? 1 : 0)
tblSize = textSizeInput == "Large" ? size.large : textSizeInput == "Small" ? size.small : size.normal
string currentPos = tablePositionInput
bool needTable = dataRows > 0 and (veryLongChannel or longChannel or shortChannel)
int COL_VERY_LONG = 0
int COL_LONG = (veryLongChannel ? 1 : 0)
int COL_SHORT = (veryLongChannel ? 1 : 0) + (longChannel ? 1 : 0)

if needTable
    bool recreateTable = na(t) or na(prevTablePos) or na(prevRowsN) or na(prevColsN) or prevTablePos != currentPos or prevRowsN != rowsN or prevColsN != colsN
    if recreateTable
        if not na(t)
            table.delete(t)
        t := table.new(f_getTablePos(currentPos), colsN, rowsN)
        prevTablePos := currentPos
        prevRowsN := rowsN
        prevColsN := colsN
    else
        table.clear(t, 0, 0, colsN - 1, rowsN - 1)

    if veryLongChannel
        table.cell(t, COL_VERY_LONG, 0, "Very Long-Term Channel", text_color=effVeryLongColor, text_size=tblSize, bgcolor=color.new(effVeryLongColor, 85))
    if longChannel
        table.cell(t, COL_LONG, 0, "Long-Term Channel", text_color=effLongColor, text_size=tblSize, bgcolor=color.new(effLongColor, 85))
    if shortChannel
        table.cell(t, COL_SHORT, 0, "Short-Term Channel", text_color=effShortColor, text_size=tblSize, bgcolor=color.new(effShortColor, 85))

    int vlt_row = 1
    if veryLongChannel
        if showBestPeriod
            table.cell(t, COL_VERY_LONG, vlt_row, "Best Length: " + (hasVeryLong ? str.tostring(veryLongPeriod) : "N/A"), text_color=effVeryLongColor, text_size=tblSize)
            vlt_row += 1
        if showSelectionMetric
            table.cell(t, COL_VERY_LONG, vlt_row, "Selection Metric: " + detectionMode + " " + selection_metric_fmt(detectionMode, veryLongMetric), text_color=effVeryLongColor, text_size=tblSize)
            vlt_row += 1
        if showStability
            table.cell(t, COL_VERY_LONG, vlt_row, "Stability: " + stability_fmt(veryLongStability), text_color=effVeryLongColor, text_size=tblSize)
            vlt_row += 1
        if showTrendEfficiency
            table.cell(t, COL_VERY_LONG, vlt_row, "Trend Efficiency: " + trend_eff_fmt(veryLongTrendEff, veryLongTrendEffHalfSatEff), text_color=effVeryLongColor, text_size=tblSize)
            vlt_row += 1
        if showTrendStrength
            table.cell(t, COL_VERY_LONG, vlt_row, "Pearson r: " + pearson_fmt(veryLongPearson, showPearsonOnly), text_color=effVeryLongColor, text_size=tblSize)
            vlt_row += 1
        if showADX
            table.cell(t, COL_VERY_LONG, vlt_row, "ADX: " + adx_fmt(veryLongADX), text_color=effVeryLongColor, text_size=tblSize)
            vlt_row += 1
        if showAnnualizedChannelReturn
            table.cell(t, COL_VERY_LONG, vlt_row, "Annualized Channel Return: " + (is_valid_tf() ? signed_pct_fmt(cagrVeryLong * 100.0) : "Daily/Weekly/Monthly only"), text_color=effVeryLongColor, text_size=tblSize)
            vlt_row += 1
        if showAnnualizedChannelPriceReturn
            table.cell(t, COL_VERY_LONG, vlt_row, "Annualized Channel Price Return: " + (is_valid_tf() ? signed_pct_fmt(cagrVeryLongChannelPrice * 100.0) : "Daily/Weekly/Monthly only"), text_color=effVeryLongColor, text_size=tblSize)
            vlt_row += 1

    int lt_row = 1
    if longChannel
        if showBestPeriod
            table.cell(t, COL_LONG, lt_row, "Best Length: " + (hasLong ? str.tostring(longPeriod) : "N/A"), text_color=effLongColor, text_size=tblSize)
            lt_row += 1
        if showSelectionMetric
            table.cell(t, COL_LONG, lt_row, "Selection Metric: " + detectionMode + " " + selection_metric_fmt(detectionMode, longMetric), text_color=effLongColor, text_size=tblSize)
            lt_row += 1
        if showStability
            table.cell(t, COL_LONG, lt_row, "Stability: " + stability_fmt(longStability), text_color=effLongColor, text_size=tblSize)
            lt_row += 1
        if showTrendEfficiency
            table.cell(t, COL_LONG, lt_row, "Trend Efficiency: " + trend_eff_fmt(longTrendEff, longTrendEffHalfSatEff), text_color=effLongColor, text_size=tblSize)
            lt_row += 1
        if showTrendStrength
            table.cell(t, COL_LONG, lt_row, "Pearson r: " + pearson_fmt(longPearson, showPearsonOnly), text_color=effLongColor, text_size=tblSize)
            lt_row += 1
        if showADX
            table.cell(t, COL_LONG, lt_row, "ADX: " + adx_fmt(longADX), text_color=effLongColor, text_size=tblSize)
            lt_row += 1
        if showAnnualizedChannelReturn
            table.cell(t, COL_LONG, lt_row, "Annualized Channel Return: " + (is_valid_tf() ? signed_pct_fmt(cagrLong * 100.0) : "Daily/Weekly/Monthly only"), text_color=effLongColor, text_size=tblSize)
            lt_row += 1
        if showAnnualizedChannelPriceReturn
            table.cell(t, COL_LONG, lt_row, "Annualized Channel Price Return: " + (is_valid_tf() ? signed_pct_fmt(cagrLongChannelPrice * 100.0) : "Daily/Weekly/Monthly only"), text_color=effLongColor, text_size=tblSize)
            lt_row += 1

    int st_row = 1
    if shortChannel
        if showBestPeriod
            table.cell(t, COL_SHORT, st_row, "Best Length: " + (hasShort ? str.tostring(shortPeriod) : "N/A"), text_color=effShortColor, text_size=tblSize)
            st_row += 1
        if showSelectionMetric
            table.cell(t, COL_SHORT, st_row, "Selection Metric: " + detectionMode + " " + selection_metric_fmt(detectionMode, shortMetric), text_color=effShortColor, text_size=tblSize)
            st_row += 1
        if showStability
            table.cell(t, COL_SHORT, st_row, "Stability: " + stability_fmt(shortStability), text_color=effShortColor, text_size=tblSize)
            st_row += 1
        if showTrendEfficiency
            table.cell(t, COL_SHORT, st_row, "Trend Efficiency: " + trend_eff_fmt(shortTrendEff, shortTrendEffHalfSatEff), text_color=effShortColor, text_size=tblSize)
            st_row += 1
        if showTrendStrength
            table.cell(t, COL_SHORT, st_row, "Pearson r: " + pearson_fmt(shortPearson, showPearsonOnly), text_color=effShortColor, text_size=tblSize)
            st_row += 1
        if showADX
            table.cell(t, COL_SHORT, st_row, "ADX: " + adx_fmt(shortADX), text_color=effShortColor, text_size=tblSize)
            st_row += 1
        if showAnnualizedChannelReturn
            table.cell(t, COL_SHORT, st_row, "Annualized Channel Return: " + (is_valid_tf() ? signed_pct_fmt(cagrShort * 100.0) : "Daily/Weekly/Monthly only"), text_color=effShortColor, text_size=tblSize)
            st_row += 1
        if showAnnualizedChannelPriceReturn
            table.cell(t, COL_SHORT, st_row, "Annualized Channel Price Return: " + (is_valid_tf() ? signed_pct_fmt(cagrShortChannelPrice * 100.0) : "Daily/Weekly/Monthly only"), text_color=effShortColor, text_size=tblSize)
            st_row += 1
else
    if not na(t)
        table.delete(t)
        t := na
        prevTablePos := na
        prevRowsN := na
        prevColsN := na