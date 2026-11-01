# Benchmark Results

Generated: 2026-10-31T21:26:52.076Z

Transfer bytes are unminified ESM from the local Vite dev server, including inline source maps. This is the same measurement as the historical three-control comparison. Production minified and gzip sizes are in [../docs/BUNDLE_SIZE.md](../docs/BUNDLE_SIZE.md).

## Environment

- Node: v22.23.4
- Platform: linux (x64)
- Operating system: 6.12.94+
- CPU: Intel(R) Xeon(R) Processor
- Browser: chromium 153.0.8010.12
- User agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.8010.12 Safari/537.36
- Packages: Rowan 0.22.0; Lit 3.3.3; FAST Element 3.0.3; Web Awesome 3.12.0; Playwright 1.63.0
- Samples per adapter: 15
- Table workload: 100 rows; 50 rows per page

## Shared Control Workload

Each adapter imports and defines one button, checkbox, and switch, mounts the three controls, then disconnects and reconnects the same control tree. Values are p50 / p95.

| Adapter      | Import and definition (ms) | Transfer (bytes) | First render (ms) | Reconnect (ms) | Reconnect shadow DOM reuse (%) | Import heap growth (bytes) | First render heap growth (bytes) | Reconnect heap growth (bytes) |
| ------------ | -------------------------: | ---------------: | ----------------: | -------------: | -----------------------------: | -------------------------: | -------------------------------: | ----------------------------: |
| Rowan        |               28.2 / 38.21 |  327179 / 327179 |        1.7 / 3.59 |     0.7 / 0.73 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |
| Lit          |                13.9 / 16.6 |    79770 / 79770 |        1.2 / 1.65 |       0 / 0.13 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |
| FAST Element |               16.6 / 19.61 |  215525 / 215525 |        1.1 / 1.48 |      0.1 / 0.2 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |
| Web Awesome  |               20.7 / 31.63 |  262930 / 262930 |        7.2 / 8.91 |     0.4 / 0.63 |                      100 / 100 |                      0 / 0 |                            0 / 0 |                         0 / 0 |

## Rowan Table Workload

The table uses its public configuration API with text/number columns, multiple selection, a 100-row initial view, ascending sort, and a 50-row page transition. Row reuse compares actual `<tr>` node identity before and after each operation. Values are p50 / p95.

| Metric                      | Duration (ms) | Import transfer (bytes) | Row reuse (%) | Heap growth (bytes) |
| --------------------------- | ------------: | ----------------------: | ------------: | ------------------: |
| Table import and definition |  54.2 / 76.31 |       1280505 / 1280505 |           n/a |               0 / 0 |
| First render                |  31.9 / 36.55 |                     n/a |           n/a |               0 / 0 |
| Selection                   |    5.7 / 6.62 |                     n/a |     100 / 100 |               0 / 0 |
| Sort                        |  18.8 / 21.65 |                     n/a |     100 / 100 |               0 / 0 |
| Page transition             |  12.3 / 13.63 |                     n/a |         0 / 0 |               0 / 0 |

## Scope Notes

Lit and FAST Element are authoring runtimes, so their adapters are minimal comparable custom elements rather than third-party design-system controls. Web Awesome uses its direct button, checkbox, and switch modules. Reconnect reuse compares internal shadow-DOM element identity after detach/reappend. No verified Web Awesome table component was available for this release, and the harness intentionally does not claim a cross-library table comparison. Heap measurements use Chromium's non-standard `performance.memory` API when available; unsupported engines report no heap values, and a zero result can reflect measurement granularity or collection timing.

See [README.md](README.md) for workload, cache, timing, and interpretation details. Raw per-sample measurements are in [results/latest.json](results/latest.json).
