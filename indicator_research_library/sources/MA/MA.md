//@version=4

study(title="20 / 50 / 100 / 150 / 200 Moving Averages", shorttitle="20/50/100/150/200 MA", overlay=true, linktoseries=true)

plot(sma(close, 20), title="20 SMA", color=#68ff33, linewidth=1, transp=0)
plot(sma(close, 50), title="50 SMA", color=#baff70, linewidth=1, transp=0)
plot(ema(close, 100), title="100 SMA", color=#ffc900, linewidth=1, transp=0)
plot(ema(close, 150), title="150 SMA", color=#ff8b00, linewidth=1, transp=0)
plot(sma(close, 200), title="200 SMA", color=#f00000, linewidth=1, transp=0)