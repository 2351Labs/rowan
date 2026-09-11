# Benchmark Methodology

Run the repeatable local baseline with:

```sh
npm run benchmark
```

The command starts an ephemeral local Vite server, launches a headless Playwright browser, and writes raw measurements to `benchmarks/results/latest.json` plus a checked-in summary to `benchmarks/RESULTS.md`.

## Workloads

Every adapter receives one fresh Playwright browser context for each sample. The default is 15 samples. The report records the installed Rowan, peer-library, and Playwright versions alongside the host and browser environment. The browser loads source ESM modules through the local Vite server, so these results compare development-time module loading and browser DOM work; they are not a production-bundle size claim.

The shared-control workload imports and registers one button, checkbox, and switch; mounts the three controls; then disconnects and reconnects that same control tree. It records retained internal shadow-DOM element identity across reconnect. Rowan imports `rowan-button`, `rowan-checkbox`, and `rowan-switch`. The Lit and FAST Element adapters define equivalent minimal custom elements with a native button, checkbox, and switch. Web Awesome imports its direct `wa-button`, `wa-checkbox`, and `wa-switch` modules.

The Rowan-specific table workload creates a 100-row configuration with text and number columns, multiple selection, sorting, and 50-row paging. It measures table import/definition, first render, property-driven selection, `sortBy("name", "asc")`, and a public `.page` update. Reuse is the percentage of actual `<tr>` nodes present both before and after an operation, not an inferred renderer statistic.

## Metrics

- Duration ends when the expected DOM state is observable after microtask/frame settling.
- `p50` and `p95` use linear interpolation over the recorded samples.
- Transfer bytes are the sum of same-page script `PerformanceResourceTiming.transferSize` entries created during module loading.
- Heap growth is a best-effort difference from Chromium's non-standard `performance.memory.usedJSHeapSize`; unsupported engines report no value, while zero can reflect browser measurement granularity or collection timing.
- Use `ROWAN_BENCHMARK_BROWSER=firefox` or `webkit` for a different Playwright engine. Heap values are normally unavailable outside Chromium.

The harness keeps table results separate from the peer comparison. Lit and FAST Element are element-authoring runtimes, not comparable data-table products, and Web Awesome 3.12.0 has no verified table/data-table import. Rowan therefore makes no table-performance parity claim.

## Options

```sh
ROWAN_BENCHMARK_SAMPLES=30 npm run benchmark
ROWAN_BENCHMARK_ADAPTERS=rowan,webawesome npm run benchmark
ROWAN_BENCHMARK_BROWSER=firefox npm run benchmark
ROWAN_BENCHMARK_OUTPUT=benchmarks/results/firefox.json npm run benchmark
```

Run the default Chromium baseline before a release when changes affect rendering, lifecycle, module registration, or table reconciliation. Compare distributions and raw samples, not a single run in isolation.
