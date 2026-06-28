// This Pine Script® code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © TradeSymbiotic
// If you are using (part of) this PineScript - please give credits with tag.

// ─────────────────────────────────────────────────────────────────────────────
//                Auto Parallel Channels (HTF)
//                ──────────────────────────────
//   Projects three configurable higher-timeframe parallel channels directly
//   onto the price chart.  Each channel is built from confirmed pivot highs
//   and lows on its own timeframe via request.security() — genuinely HTF
//   structure, not a longer window of chart-timeframe bars.
//
//   A channel is only drawn when two confirmed pivot highs and two confirmed
//   pivot lows form a geometrically parallel structure within the configured
//   slope tolerance.  When the lines diverge too far (triangle or wedge
//   geometry), the indicator stays silent rather than drawing a fabricated
//   channel through unstructured price.
//
//   Once active, channels extend to the right edge with right-edge price
//   labels at the upper, midline, and lower boundaries.  When price closes
//   outside the channel on its own HTF, the lines dim and stop extending —
//   same convention as the suite's other structural indicators.
//
//   Visual hierarchy follows the suite's one-color-per-TF, thin-to-thick
//   tier-weight convention: TF 1 carries the lightest lines, TF 3 the
//   heaviest, so the dominant higher timeframe always reads first.
//
//   Version: 1.0
// ─────────────────────────────────────────────────────────────────────────────

//@version=6
indicator("Auto Parallel Channels (HTF)", shorttitle="APCh", overlay=true, max_lines_count=30, max_labels_count=20)

// ── Inputs ───────────────────────────────────────────────────────────────────
pivot_len = input.int(9,   "Pivot length",      minval=2, maxval=50,  group="Detection", tooltip="Number of bars required on each side of a pivot high or low to confirm it as structural. Higher values find fewer, more significant pivots; lower values are more sensitive to minor swings.")
slope_tol = input.float(0.35, "Slope tolerance", minval=0.0, maxval=1.0, step=0.05, group="Detection", tooltip="How much the channel width can change over one channel-length before the structure is rejected as non-parallel. 0 = perfectly parallel only; 0.35 = up to 35% width change accepted (handles slight wedging). Raise to 0.5-0.7 if few channels are appearing.")

tf1_on = input.bool(true, "TF 1", group="Timeframes", inline="tf1")
tf1    = input.timeframe("240", "", group="Timeframes", inline="tf1")
tf2_on = input.bool(true, "TF 2", group="Timeframes", inline="tf2")
tf2    = input.timeframe("D",   "", group="Timeframes", inline="tf2")
tf3_on = input.bool(true, "TF 3", group="Timeframes", inline="tf3")
tf3    = input.timeframe("W",   "", group="Timeframes", inline="tf3")

tf1_col = input.color(#5c6bc0, "TF 1", group="Colors", inline="c1")
tf2_col = input.color(#f59e0b, "TF 2", group="Colors", inline="c2")
tf3_col = input.color(#26a69a, "TF 3", group="Colors", inline="c3")

show_mid    = input.bool(true, "Midline",             group="Display")
show_labels = input.bool(true, "Right-edge labels",   group="Display")

// ── Channel detection (runs inside each request.security context) ─────────────
f_ch() =>
    ph = ta.pivothigh(high, pivot_len, pivot_len)
    pl = ta.pivotlow(low,  pivot_len, pivot_len)

    var float ph1_p = na
    var float ph1_t = na
    var float ph2_p = na
    var float ph2_t = na
    var float pl1_p = na
    var float pl1_t = na
    var float pl2_p = na
    var float pl2_t = na
    var bool  brk   = false

    if not na(ph)
        ph2_p := ph1_p
        ph2_t := ph1_t
        ph1_p := ph
        ph1_t := float(time[pivot_len])
        brk   := false

    if not na(pl)
        pl2_p := pl1_p
        pl2_t := pl1_t
        pl1_p := pl
        pl1_t := float(time[pivot_len])
        brk   := false

    has_both = not na(ph1_p) and not na(ph2_p) and not na(pl1_p) and not na(pl2_p)

    slope_h = has_both ? (ph1_p - ph2_p) / math.max(ph1_t - ph2_t, 1.0) : float(na)
    slope_l = has_both ? (pl1_p - pl2_p) / math.max(pl1_t - pl2_t, 1.0) : float(na)

    is_valid = false
    if has_both and not na(slope_h) and not na(slope_l)
        proj_l_ref = pl1_p + slope_l * (ph1_t - pl1_t)
        ch_w_ref   = ph1_p - proj_l_ref
        span       = math.abs(ph1_t - ph2_t)
        ch_w_fut   = (ph1_p + slope_h * span) - (pl1_p + slope_l * (ph1_t + span - pl1_t))
        is_valid  := ch_w_ref > 0.0 and math.abs(ch_w_fut - ch_w_ref) / ch_w_ref < slope_tol

    if is_valid and not brk and not na(slope_h) and not na(slope_l)
        proj_h_now = ph1_p + slope_h * (float(time) - ph1_t)
        proj_l_now = pl1_p + slope_l * (float(time) - pl1_t)
        if close > proj_h_now or close < proj_l_now
            brk := true

    [ph1_p, ph1_t, ph2_p, ph2_t, pl1_p, pl1_t, pl2_p, pl2_t, is_valid, brk]

// ── Request HTF channel state ─────────────────────────────────────────────────
[tf1_ph1p, tf1_ph1t, tf1_ph2p, tf1_ph2t,
 tf1_pl1p, tf1_pl1t, tf1_pl2p, tf1_pl2t,
 tf1_valid, tf1_brk] = request.security(syminfo.tickerid, tf1, f_ch())

[tf2_ph1p, tf2_ph1t, tf2_ph2p, tf2_ph2t,
 tf2_pl1p, tf2_pl1t, tf2_pl2p, tf2_pl2t,
 tf2_valid, tf2_brk] = request.security(syminfo.tickerid, tf2, f_ch())

[tf3_ph1p, tf3_ph1t, tf3_ph2p, tf3_ph2t,
 tf3_pl1p, tf3_pl1t, tf3_pl2p, tf3_pl2t,
 tf3_valid, tf3_brk] = request.security(syminfo.tickerid, tf3, f_ch())

// ── Drawing registries ────────────────────────────────────────────────────────
var line[]  g_lns = array.new<line>(0)
var label[] g_lbs = array.new<label>(0)

// ── Per-TF channel draw ───────────────────────────────────────────────────────
f_draw(ph1p, ph1t, ph2p, ph2t, pl1p, pl1t, pl2p, pl2t, is_valid, brk, col, lw) =>
    if is_valid
        slope_h = (ph1p - ph2p) / math.max(ph1t - ph2t, 1.0)
        slope_l = (pl1p - pl2p) / math.max(pl1t - pl2t, 1.0)

        line_col = brk ? color.new(col, 72) : color.new(col, 15)
        mid_col  = brk ? color.new(col, 80) : color.new(col, 38)
        ext      = brk ? extend.none : extend.right

        array.push(g_lns, line.new(int(ph2t), ph2p, int(ph1t), ph1p, xloc=xloc.bar_time, extend=ext, color=line_col, width=lw))

        array.push(g_lns, line.new(int(pl2t), pl2p, int(pl1t), pl1p, xloc=xloc.bar_time, extend=ext, color=line_col, width=lw))

        if show_mid
            mid_at_ph2t = (ph2p + (pl1p + slope_l * (ph2t - pl1t))) / 2.0
            mid_at_ph1t = (ph1p + (pl1p + slope_l * (ph1t - pl1t))) / 2.0
            array.push(g_lns, line.new(int(ph2t), mid_at_ph2t, int(ph1t), mid_at_ph1t, xloc=xloc.bar_time, extend=ext, color=mid_col, width=1, style=line.style_dashed))

        if show_labels and not brk
            span      = ph1t - ph2t
            label_t   = int(ph1t + span)
            proj_h_lb = ph1p + slope_h * span
            proj_l_lb = pl1p + slope_l * (ph1t + span - pl1t)
            proj_m_lb = (proj_h_lb + proj_l_lb) / 2.0
            array.push(g_lbs, label.new(label_t, proj_h_lb, "▲  " + str.tostring(proj_h_lb, format.mintick), xloc=xloc.bar_time, style=label.style_label_left, color=color.new(col, 15), textcolor=color.white, size=size.small))
            array.push(g_lbs, label.new(label_t, proj_m_lb, "─  " + str.tostring(proj_m_lb, format.mintick), xloc=xloc.bar_time, style=label.style_label_left, color=color.new(col, 38), textcolor=color.white, size=size.small))
            array.push(g_lbs, label.new(label_t, proj_l_lb, "▼  " + str.tostring(proj_l_lb, format.mintick), xloc=xloc.bar_time, style=label.style_label_left, color=color.new(col, 15), textcolor=color.white, size=size.small))

// ── Rebuild all drawings at barstate.islast ───────────────────────────────────
if barstate.islast
    n_ln = array.size(g_lns)
    if n_ln > 0
        for i = 0 to n_ln - 1
            line.delete(array.get(g_lns, i))
    array.clear(g_lns)

    n_lb = array.size(g_lbs)
    if n_lb > 0
        for i = 0 to n_lb - 1
            label.delete(array.get(g_lbs, i))
    array.clear(g_lbs)

    if tf3_on and tf3_valid
        f_draw(tf3_ph1p, tf3_ph1t, tf3_ph2p, tf3_ph2t, tf3_pl1p, tf3_pl1t, tf3_pl2p, tf3_pl2t, tf3_valid, tf3_brk, tf3_col, 3)
    if tf2_on and tf2_valid
        f_draw(tf2_ph1p, tf2_ph1t, tf2_ph2p, tf2_ph2t, tf2_pl1p, tf2_pl1t, tf2_pl2p, tf2_pl2t, tf2_valid, tf2_brk, tf2_col, 2)
    if tf1_on and tf1_valid
        f_draw(tf1_ph1p, tf1_ph1t, tf1_ph2p, tf1_ph2t, tf1_pl1p, tf1_pl1t, tf1_pl2p, tf1_pl2t, tf1_valid, tf1_brk, tf1_col, 1)

// ── Alerts ────────────────────────────────────────────────────────────────────
tf1_new_ch  = tf1_on and tf1_valid and not tf1_valid[1]
tf2_new_ch  = tf2_on and tf2_valid and not tf2_valid[1]
tf3_new_ch  = tf3_on and tf3_valid and not tf3_valid[1]
tf1_new_brk = tf1_on and tf1_brk   and not tf1_brk[1]
tf2_new_brk = tf2_on and tf2_brk   and not tf2_brk[1]
tf3_new_brk = tf3_on and tf3_brk   and not tf3_brk[1]

alertcondition(tf1_new_ch or tf2_new_ch or tf3_new_ch,     "Channel formed",  "{{ticker}} — parallel channel formed on {{interval}}")
alertcondition(tf1_new_brk or tf2_new_brk or tf3_new_brk, "Channel broken",  "{{ticker}} — parallel channel broken on {{interval}}")
