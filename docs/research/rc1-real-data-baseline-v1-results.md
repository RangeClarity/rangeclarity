# RC-1 Real Data Baseline v1 - REAL RESULTS (auto)

> REAL data run. The frozen SYNTHETIC reference is in rc1-real-data-baseline-v1-comparison.md - do NOT conflate the two.

> Conviction stays RED until human-labeled review exists. RC Score is permission, not prediction. No scoring config was changed by this run.


## rc1_autonomous_model (real)
```
[rc1] loading 20 symbols ...
[rc1] data source = local
[rc1] parameter sweep ...
[rc1] configs=8 best=config_3 windows=1419
[rc1] ablation ...
[rc1] hunting false-highs + building founder queues ...

[stderr]
Traceback (most recent call last):
  File "C:\Users\USER\Claude\Projects\RangeClarity\research\rc1_autonomous_model\run_research.py", line 46, in <module>
    main()
  File "C:\Users\USER\Claude\Projects\RangeClarity\research\rc1_autonomous_model\run_research.py", line 32, in main
    rdir, m, conv, conv_label = write_all(cfg, source, symbols, ranked, best_params, best_df, abl, hunted)
                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\USER\Claude\Projects\RangeClarity\research\rc1_autonomous_model\report.py", line 96, in write_all
    open(os.path.join(rdir, "run_summary.md"), "w").write("\n".join(lines))
  File "C:\Users\USER\AppData\Local\Programs\Python\Python311\Lib\encodings\cp1252.py", line 19, in encode
    return codecs.charmap_encode(input,self.errors,encoding_table)[0]
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
UnicodeEncodeError: 'charmap' codec can't encode character '\u2192' in position 3858: character maps to <undefined>
```


## rc1_ultimate_offline_indicator (real)
```
[rc1] loading 20 symbols ...
[rc1] source=mixed (19/20 real CSV)
[rc1] configs=8 best=config_2 windows=1793

=== RC-1 ULTIMATE OFFLINE INDICATOR ===
source           : mixed (19/20 real)
windows          : 1793
states           : {'HighClarity': 0, 'Clear': 0, 'Mixed': 742, 'Unclear': 1051, 'Insufficient': 0}
HighClarity rare : 0.0  Clear+: 0.0
false-high self  : 0.0  fatal_self: 0
cap_accuracy     : 1.0  stability: 0.9977  objective: 0.9748
caps fired most  : ['agree3', 'broken', 'severe']
earns place      : ['-chop', '-zone', '-extension', '-hysteresis']
no effect here   : ['-location', '-agreement', '-trend']
reports -> C:\Users\USER\Claude\Projects\RangeClarity\research\rc1_ultimate_offline_indicator\reports
conviction       : RED (synthetic/no-labels => not validated)
```


## Interpretation rules

- 0 Clear / 0 HighClarity on real data => LIKELY OVER-REJECTION, not validation.

- High Clarity rare is good ONLY if real clean charts still reach Clear sometimes.

- Compare each package's reports/ (state_distribution, cap_distribution, ablation_results, founder_review_queue). Paste this file + both founder_review_queue.csv back.
