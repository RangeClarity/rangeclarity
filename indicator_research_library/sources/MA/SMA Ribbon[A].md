// © AndrinSchlegel

//@version=5

indicator("SMA Ribbon [A]", shorttitle="SMA Ribbon", overlay=true)

// Inputs for SMA lengths
src1 = close
len1 = input.int(20, minval=1, title="SMA Length")
src2 = close
len2 = input.int(50, minval=1, title="SMA Length")
src3 = close
len3 = input.int(100, minval=1, title="SMA Length")
src0 = close
len0 = input.int(200, minval=1, title="SMA Length")

// Original SMAs
sma1 = ta.sma(src1, len1)
sma2 = ta.sma(src2, len2)
sma3 = ta.sma(src3, len3)
sma0 = ta.sma(src0, len0)

// Option to enable daily average for MA200
useDailyMA = input.bool(false, title="Use Daily MA for MA200")

// Automatic disabling of the function on the daily chart (we want to be able to manually disable it)
// The switch can only be enabled if not on the daily chart
useDailyMA := (timeframe.isdaily == false and timeframe.isweekly == false and timeframe.ismonthly == false) and useDailyMA

// Daily SMAs with request.security
dailySma1 = request.security(syminfo.tickerid, "D", ta.sma(src1, len1))
dailySma2 = request.security(syminfo.tickerid, "D", ta.sma(src2, len2))
dailySma3 = request.security(syminfo.tickerid, "D", ta.sma(src3, len3))
dailySma0 = request.security(syminfo.tickerid, "D", ta.sma(src0, len0))

// Choosing the correct SMA based on the setting (only for MA200, the daily average is used)
finalSma1 = sma1  // MA20 remains in the current timeframe
finalSma2 = sma2  // MA50 remains in the current timeframe
finalSma3 = sma3  // MA100 remains in the current timeframe
finalSma0 = useDailyMA ? dailySma0 : sma0  // MA200 is adjusted when "useDailyMA" is enabled

// Color logic for MA20, MA50, MA100
plot_color1 = finalSma1 >= finalSma1[2] ? #a7c9ff : finalSma1 < finalSma1[2] ? #a7c9ff : na
plot_color2 = finalSma2 >= finalSma2[2] ? #d3e4ff : finalSma2 < finalSma2[2] ? #d3e4ff : na
plot_color3 = finalSma3 >= finalSma3[2] ? #ffee00 : finalSma3 < finalSma3[2] ? #ffee00 : na

// MA200 color logic
ma200_color = useDailyMA ? color.new(#3711c0, 0) : finalSma0 >= finalSma0[2] ? color.lime : color.red

// Plotting lines based on final SMAs
plot(finalSma1, title="SMA 20", style=plot.style_line, linewidth=1, color=plot_color1)
plot(finalSma2, title="SMA 50", style=plot.style_line, linewidth=2, color=plot_color2)
plot(finalSma3, title="SMA 100", style=plot.style_line, linewidth=3, color=plot_color3)
plot(finalSma0, title="SMA 200", style=plot.style_line, linewidth=3, color=ma200_color)

// The value [2] in finalSma1[2] means that the condition compares the current SMA value to the value from two bars ago, which helps to smooth out short-term fluctuations and reduce noise.
