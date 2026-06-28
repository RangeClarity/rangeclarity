// ==============================================================================
// Auto Channel [SciQua]
// ------------------------------------------------------------------------------
// © 2025 SciQua - Joshua Danford
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
//
// This script is released as open source on TradingView for educational 
// and personal use only. Commercial use, redistribution, or integration 
// into paid products or services is strictly prohibited without prior 
// written permission from the author.
//
// Description:
// The Auto Channel [SciQua] indicator automatically detects parallel price 
// channels using recent ZigZag pivots. It evaluates candidate channels, 
// scores their fit, and plots the best channel in real time. Breakouts 
// above or below the channel are highlighted with markers and can be 
// captured with alerts.
// ==============================================================================


//@version=6
indicator("Auto Channel [SciQua]", overlay = true, max_lines_count = 500)

import TradingView/ZigZag/7 as ZigZagLib

// === ZigZag Settings ===
var zigZag = ZigZagLib.newInstance(
     ZigZagLib.Settings.new(
         input.float(0.2, "Price deviation for reversals (%)", 0.00001, 100.0, 0.5, group = "ZigZag"),
         input.int(2, "Pivot legs", 2, group = "ZigZag"),
         input(color.blue, "ZigZag Color", group = "ZigZag"),
         true,
         false,
         false,
         false,
         "Percent",
         true
     )
 )
zigZag.update()

// === Parameters ===
int lookback = input.int(12, "Number of recent pivots to consider", 4, 50, group = "Channel")
float slopeTol = input.float(0.0005, "Max slope difference for parallel", 0.0, group = "Channel")
float tolerance = input.float(0.0, "Max price tolerance outside channel", 0.0, 100.0, 0.1, group = "Channel")
float minInRatio = input.float(1, "Minimum inside to outside pivots ratio for valid channel (0.00–1.00)", 0.0, 1.0, 0.05, group = "Channel")

// === Color Inputs ===
color upperLineColor = input.color(color.red, "Upper Line Color", group = "Colors")
color lowerLineColor = input.color(color.green, "Lower Line Color", group = "Colors")

color breakoutUpColor   = input.color(color.lime, "Breakout Above Color", group = "Colors")
color breakoutDownColor = input.color(color.red, "Breakout Below Color", group = "Colors")

// === Collect recent pivots ===
int pivotCount = zigZag.pivots.size()
var line upperLine = na
var line lowerLine = na

if barstate.isconfirmed and pivotCount >= 4
    // Gather last N pivots
    int startIndex = math.max(0, pivotCount - lookback)
    ZigZagLib.Pivot[] highs = array.new<ZigZagLib.Pivot>()
    ZigZagLib.Pivot[] lows  = array.new<ZigZagLib.Pivot>()

    for i = pivotCount - 1 to startIndex
        ZigZagLib.Pivot p = zigZag.pivots.get(i)
        if p.isHigh
            array.push(highs, p)
        else
            array.push(lows, p)

    int highsSize = array.size(highs)
    int lowsSize  = array.size(lows)

    // Ensure enough points
    if highsSize >= 2 and lowsSize >= 2
        float bestInRatio = na
        float bestViolation = na
        float bestWidth = na
        ZigZagLib.Pivot bestHigh1 = na
        ZigZagLib.Pivot bestHigh2 = na
        ZigZagLib.Pivot bestLow1  = na
        ZigZagLib.Pivot bestLow2  = na

        // Try all combinations of 2 highs x 2 lows
        for hi1 = 0 to highsSize - 2
            ZigZagLib.Pivot H1 = array.get(highs, hi1)
            for hi2 = hi1 + 1 to highsSize - 1
                ZigZagLib.Pivot H2 = array.get(highs, hi2)

                float dxH = float(H2.end.index - H1.end.index)
                if dxH == 0.0
                    continue
                float slopeHigh = (H2.end.price - H1.end.price) / dxH

                for lo1 = 0 to lowsSize - 2
                    ZigZagLib.Pivot L1 = array.get(lows, lo1)
                    for lo2 = lo1 + 1 to lowsSize - 1
                        ZigZagLib.Pivot L2 = array.get(lows, lo2)

                        float dxL = float(L2.end.index - L1.end.index)
                        if dxL == 0.0
                            continue
                        float slopeLow = (L2.end.price - L1.end.price) / dxL

                        // Check slopes are nearly parallel
                        if math.abs(slopeHigh - slopeLow) <= slopeTol
                            // Earliest anchor among H1, H2, L1, L2
                            int earliestAnchor = math.min(math.min(H1.end.index, H2.end.index), math.min(L1.end.index, L2.end.index))

                            // Validate against pivots and compute fit score
                            int checkedCount = 0
                            int inCount = 0
                            float violationSum = 0.0  // magnitude of breaches beyond tolerance

                            for i = pivotCount - 1 to startIndex
                                ZigZagLib.Pivot p = zigZag.pivots.get(i)

                                // Determine pivot segment extremes and their indices
                                float pivotHigh = na
                                float pivotLow = na
                                int pivotHighIndex = na
                                int pivotLowIndex = na

                                if p.start.price > p.end.price
                                    pivotHigh := p.start.price
                                    pivotHighIndex := p.start.index
                                    pivotLow := p.end.price
                                    pivotLowIndex := p.end.index
                                else
                                    pivotHigh := p.end.price
                                    pivotHighIndex := p.end.index
                                    pivotLow := p.start.price
                                    pivotLowIndex := p.start.index

                                // Skip segments fully before anchors
                                if pivotHighIndex < earliestAnchor and pivotLowIndex < earliestAnchor
                                    continue

                                // Use the end points’ indices for projection checks
                                // This keeps it consistent and fast; you can also check both ends separately
                                int tHigh = pivotHighIndex
                                int tLow  = pivotLowIndex

                                float yHighAt = H1.end.price + slopeHigh * float(tHigh - H1.end.index)
                                float yLowAt  = L1.end.price + slopeLow  * float(tLow  - L1.end.index)

                                checkedCount += 1

                                bool isInside = true

                                if pivotHigh > yHighAt + tolerance
                                    isInside := false
                                    violationSum += pivotHigh - (yHighAt + tolerance)

                                if pivotLow < yLowAt - tolerance
                                    isInside := false
                                    violationSum += (yLowAt - tolerance) - pivotLow

                                if isInside
                                    inCount += 1

                            // Require at least a few pivots checked to be meaningful
                            bool validCheck = checkedCount >= 2
                            if validCheck
                                float inRatio = checkedCount > 0 ? float(inCount) / float(checkedCount) : 0.0

                                if inRatio < minInRatio
                                    continue
                                    
                                // Channel width at current bar
                                int endBar = bar_index
                                float topY = H1.end.price + slopeHigh * float(endBar - H1.end.index)
                                float botY = L1.end.price + slopeLow  * float(endBar - L1.end.index)
                                float width = topY - botY

                                // Selection: maximize inRatio, then width, then minimize violationSum
                                bool isBetter = false
                                if na(bestWidth)
                                    isBetter := true
                                else
                                    // Compute best channel’s current score references
                                    // We store bestInRatio and bestViolation in vars outside this loop
                                    if inRatio > bestInRatio
                                        isBetter := true
                                    else
                                        if inRatio == bestInRatio
                                            if width > bestWidth
                                                isBetter := true
                                            else
                                                if width == bestWidth
                                                    if violationSum < bestViolation
                                                        isBetter := true

                                if isBetter
                                    bestWidth := width
                                    bestHigh1 := H1
                                    bestHigh2 := H2
                                    bestLow1  := L1
                                    bestLow2  := L2
                                    bestInRatio := inRatio
                                    bestViolation := violationSum

        // Draw the best channel if found
        if not na(bestWidth)
            if na(upperLine)
                upperLine := line.new(bestHigh1.end.index, bestHigh1.end.price,
                                     bestHigh2.end.index, bestHigh2.end.price,
                                     xloc.bar_index, extend.left, color=upperLineColor, width=2)
                lowerLine := line.new(bestLow1.end.index, bestLow1.end.price,
                                     bestLow2.end.index, bestLow2.end.price,
                                     xloc.bar_index, extend.left, color=lowerLineColor, width=2)
            else
                line.set_xy1(upperLine, bestHigh1.end.index, bestHigh1.end.price)
                line.set_xy2(upperLine, bestHigh2.end.index, bestHigh2.end.price)
                line.set_xy1(lowerLine, bestLow1.end.index, bestLow1.end.price)
                line.set_xy2(lowerLine, bestLow2.end.index, bestLow2.end.price)
                line.set_color(upperLine, upperLineColor)
                line.set_color(lowerLine, lowerLineColor)
        else
            if not na(upperLine)
                line.delete(upperLine)
                upperLine := na
            if not na(lowerLine)
                line.delete(lowerLine)
                lowerLine := na

// === Compute current projected channel boundaries ===
float upperPrice = na
float lowerPrice = na

if not na(upperLine) and not na(lowerLine)
    float x1U = line.get_x1(upperLine)
    float y1U = line.get_y1(upperLine)
    float x2U = line.get_x2(upperLine)
    float y2U = line.get_y2(upperLine)

    float x1L = line.get_x1(lowerLine)
    float y1L = line.get_y1(lowerLine)
    float x2L = line.get_x2(lowerLine)
    float y2L = line.get_y2(lowerLine)

    // Compute slope for each line
    float slopeU = (y2U - y1U) / (x2U - x1U)
    float slopeL = (y2L - y1L) / (x2L - x1L)

    // Project to current bar_index
    upperPrice := y1U + slopeU * (bar_index - x1U)
    lowerPrice := y1L + slopeL * (bar_index - x1L)

// === Breakout detection ===
bool upBreak = not na(upperPrice) and close > upperPrice + tolerance
bool dnBreak = not na(lowerPrice) and close < lowerPrice - tolerance
bool newBreakUp = upBreak and barstate.isconfirmed and barstate.islast
bool newBreakDown = dnBreak and barstate.isconfirmed and barstate.islast

plotshape(newBreakUp, title="Close Above Channel", style=shape.triangleup, location=location.abovebar, size=size.tiny, color=color.new(color.green, 0))
plotshape(newBreakDown, title="Close Below Channel", style=shape.triangledown, location=location.belowbar, size=size.tiny, color=color.new(color.red, 0))

alertcondition(newBreakUp and barstate.isconfirmed, "Close Above Channel", "Price closed above the channel.")
alertcondition(newBreakDown and barstate.isconfirmed, "Close Below Channel", "Price closed below the channel.")

//        SSSSSSSSSSSSSSS                         iiii        QQQQQQQQQ                                                                                       █████████████                                           
//      SS:::::::::::::::S                       i::::i     QQ:::::::::QQ                                                                           ████████████████████████████████                                  
//     S:::::SSSSSS::::::S                        iiii    QQ:::::::::::::QQ                                                                   █████████         ████████          ████████                            
//     S:::::S     SSSSSSS                               Q:::::::QQQ:::::::Q                                                             ████████      █   ██████████████████           ███████                       
//     S:::::S                 cccccccccccccccc iiiiiii  Q::::::O   Q::::::Q uuuuuu    uuuuuu     aaaaaaaaaaaaa                      ███████     █████  ████████████████████████  █████     ███████                   
//     S:::::S               cc:::::::::::::::c i:::::i  Q:::::O     Q:::::Q u::::u    u::::u     a::::::::::::a                  ██████     ████████  ████████       ███  ██████  ████████     ██████                
//      S::::SSSS           c:::::::::::::::::c  i::::i  Q:::::O     Q:::::Q u::::u    u::::u     aaaaaaaaa:::::a            ███████     ███████████  ███████   ██████    ████████  ███████████     ███████           
//       SS::::::SSSSS     c:::::::cccccc:::::c  i::::i  Q:::::O     Q:::::Q u::::u    u::::u              a::::a       ████████    ████████████████  ██████  █████████  █████████  ████████████████    ████████      
//         SSS::::::::SS   c::::::c     ccccccc  i::::i  Q:::::O     Q:::::Q u::::u    u::::u       aaaaaaa:::::a       ████████    ████████████████  ██████  ████████  ██████████  ███████████████     ████████      
//            SSSSSS::::S  c:::::c               i::::i  Q:::::O     Q:::::Q u::::u    u::::u     aa::::::::::::a            ███████    ████████████  ██████  ██████  █  █████████  ████████████     ██████           
//                 S:::::S c:::::c               i::::i  Q:::::O  QQQQ:::::Q u::::u    u::::u    a::::aaaa::::::a                ██████     █████████  ███████     █████   ██████  █████████     ██████               
//                 S:::::S c::::::c     ccccccc  i::::i  Q::::::O Q::::::::Q u:::::uuuu:::::u   a::::a    a:::::a                    ██████      █████  ████████████████████████  ██████     ██████                   
//     SSSSSSS     S:::::S c:::::::cccccc:::::c i::::::i Q:::::::QQ::::::::Q u:::::::::::::::uu a::::a    a:::::a                       ████████      ██   ██████████████████    █      ████████                     
//     S::::::SSSSSS:::::S  c:::::::::::::::::c i::::::i  QQ::::::::::::::Q   u:::::::::::::::u a:::::aaaa::::::a                            █████████          █████████          ████████                           
//     S:::::::::::::::SS    cc:::::::::::::::c i::::::i    QQ:::::::::::Q     uu::::::::uu:::u  a::::::::::aa:::a                                 ██████████████████████████████████                             
//      SSSSSSSSSSSSSSS        cccccccccccccccc iiiiiiii      QQQQQQQQ::::QQ     uuuuuuuu  uuuu   aaaaaaaaaa  aaaa                                          █████████████████                                         
//                                                                  Q:::::Q                                    
//                                                                   QQQQQQ                                                                                                                                           