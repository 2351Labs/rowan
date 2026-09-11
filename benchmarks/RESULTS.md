# Benchmark Results

Generated: 2026-09-11T15:38:09.843Z

## Environment

- Node: v24.15.0
- Platform: darwin (arm64)
- Operating system: 25.6.0
- CPU: Apple M4 Pro
- Browser: chromium 153.0.8010.12
- User agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.8010.12 Safari/537.36
- Packages: Rowan 0.1.0; Lit 3.3.3; FAST Element 3.0.3; Web Awesome 3.12.0; Playwright 1.63.0
- Samples per adapter: 15
- Table workload: 100 rows; 50 rows per page

## Shared Control Workload

Each adapter imports and defines one button, checkbox, and switch, mounts the three controls, then disconnects and reconnects the same control tree. Values are p50 / p95.

| Adapter      | Import and definition (ms) | Transfer (bytes) | First render (ms) | Reconnect (ms) | Reconnect shadow DOM reuse (%) | Import heap growth (bytes) | First render heap growth (bytes) | Reconnect heap growth (bytes) |
| ------------ | -------------------------: | ---------------: | ----------------: | -------------: | -----------------------------: | -------------------------: | -------------------------------: | ----------------------------: |
| Rowan        |                 7.3 / 8.86 |  154317 / 154317 |        0.7 / 1.46 |      0.1 / 0.2 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |
| Lit          |                 6.4 / 6.82 |    88536 / 88536 |        0.8 / 0.93 |      0.1 / 0.1 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |
| FAST Element |                  6.7 / 7.5 |  224363 / 224363 |        0.7 / 1.19 |        0 / 0.1 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |
| Web Awesome  |                 8.4 / 9.47 |  269387 / 269387 |        4.1 / 5.11 |     0.2 / 0.33 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |

## Rowan Table Workload

The table uses its public configuration API with text/number columns, multiple selection, a 100-row initial view, ascending sort, and a 50-row page transition. Row reuse compares actual `<tr>` node identity before and after each operation. Values are p50 / p95.

| Metric                      | Duration (ms) | Import transfer (bytes) | Row reuse (%) | Heap growth (bytes) |
| --------------------------- | ------------: | ----------------------: | ------------: | ------------------: |
| Table import and definition |  10.2 / 13.96 |         355941 / 355941 |           n/a |               0 / 0 |
| First render                |    7.1 / 8.93 |                     n/a |           n/a |               0 / 0 |
| Selection                   |     0.3 / 0.4 |                     n/a |     100 / 100 |               0 / 0 |
| Sort                        |    1.4 / 1.83 |                     n/a |     100 / 100 |               0 / 0 |
| Page transition             |    2.1 / 2.33 |                     n/a |         0 / 0 |               0 / 0 |

## Scope Notes

Lit and FAST Element are authoring runtimes, so their adapters are minimal comparable custom elements rather than third-party design-system controls. Web Awesome uses its direct button, checkbox, and switch modules. Reconnect reuse compares internal shadow-DOM element identity after detach/reappend. No verified Web Awesome table component was available for this release, and the harness intentionally does not claim a cross-library table comparison. Heap measurements use Chromium's non-standard `performance.memory` API when available; unsupported engines report no heap values, and a zero result can reflect measurement granularity or collection timing.

See [README.md](README.md) for workload, cache, timing, and interpretation details. Raw per-sample measurements are in [results/latest.json](results/latest.json).
