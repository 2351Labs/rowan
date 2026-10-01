# Benchmark Results

Generated: 2026-10-01T04:51:17.511Z

## Environment

- Node: v24.14.1
- Platform: darwin (arm64)
- Operating system: 25.6.0
- CPU: Apple M4 Pro
- Browser: chromium 153.0.8010.12
- User agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.8010.12 Safari/537.36
- Packages: Rowan 0.15.0; Lit 3.3.3; FAST Element 3.0.3; Web Awesome 3.12.0; Playwright 1.63.0
- Samples per adapter: 15
- Table workload: 100 rows; 50 rows per page

## Shared Control Workload

Each adapter imports and defines one button, checkbox, and switch, mounts the three controls, then disconnects and reconnects the same control tree. Values are p50 / p95.

| Adapter      | Import and definition (ms) | Transfer (bytes) | First render (ms) | Reconnect (ms) | Reconnect shadow DOM reuse (%) | Import heap growth (bytes) | First render heap growth (bytes) | Reconnect heap growth (bytes) |
| ------------ | -------------------------: | ---------------: | ----------------: | -------------: | -----------------------------: | -------------------------: | -------------------------------: | ----------------------------: |
| Rowan        |               11.6 / 14.48 |  703182 / 703182 |         1.2 / 1.4 |      0.4 / 0.5 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |
| Lit          |                 6.7 / 7.16 |    89179 / 89179 |         0.8 / 0.9 |       0 / 0.13 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |
| FAST Element |                 8.6 / 8.93 |  225007 / 225007 |         0.7 / 0.8 |        0 / 0.1 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |
| Web Awesome  |                9.3 / 10.36 |  270158 / 270158 |        4.2 / 4.53 |      0.2 / 0.3 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |

## Rowan Table Workload

The table uses its public configuration API with text/number columns, multiple selection, a 100-row initial view, ascending sort, and a 50-row page transition. Row reuse compares actual `<tr>` node identity before and after each operation. Values are p50 / p95.

| Metric                      | Duration (ms) | Import transfer (bytes) | Row reuse (%) | Heap growth (bytes) |
| --------------------------- | ------------: | ----------------------: | ------------: | ------------------: |
| Table import and definition |    13 / 20.61 |         792363 / 792363 |           n/a |               0 / 0 |
| First render                |  18.9 / 22.62 |                     n/a |           n/a |               0 / 0 |
| Selection                   |     2.7 / 2.9 |                     n/a |     100 / 100 |               0 / 0 |
| Sort                        |  10.5 / 11.33 |                     n/a |     100 / 100 |               0 / 0 |
| Page transition             |    6.7 / 7.33 |                     n/a |         0 / 0 |               0 / 0 |

## Scope Notes

Lit and FAST Element are authoring runtimes, so their adapters are minimal comparable custom elements rather than third-party design-system controls. Web Awesome uses its direct button, checkbox, and switch modules. Reconnect reuse compares internal shadow-DOM element identity after detach/reappend. No verified Web Awesome table component was available for this release, and the harness intentionally does not claim a cross-library table comparison. Heap measurements use Chromium's non-standard `performance.memory` API when available; unsupported engines report no heap values, and a zero result can reflect measurement granularity or collection timing.

See [README.md](README.md) for workload, cache, timing, and interpretation details. Raw per-sample measurements are in [results/latest.json](results/latest.json).
