import { mkdir, readFile, writeFile } from "node:fs/promises";
import { cpus, release } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultAdapters = ["rowan", "lit", "fast", "webawesome"];
const supportedAdapters = new Set(defaultAdapters);
const browserLaunchers = { chromium, firefox, webkit };
const browserName = process.env.ROWAN_BENCHMARK_BROWSER ?? "chromium";
const sampleCount = readPositiveInteger(process.env.ROWAN_BENCHMARK_SAMPLES, 15);
const adapterIds = readAdapters(process.env.ROWAN_BENCHMARK_ADAPTERS);
const outputPath = path.resolve(
  repositoryRoot,
  process.env.ROWAN_BENCHMARK_OUTPUT ?? "benchmarks/results/latest.json",
);
const markdownPath = path.join(repositoryRoot, "benchmarks", "RESULTS.md");

if (!browserLaunchers[browserName]) {
  throw new Error(`Unsupported ROWAN_BENCHMARK_BROWSER "${browserName}".`);
}

function readPositiveInteger(value, fallback) {
  if (value == null || value === "") return fallback;

  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw new Error("ROWAN_BENCHMARK_SAMPLES must be a positive integer.");
  }
  return number;
}

function readAdapters(value) {
  const adapters = value ? value.split(",").map((adapter) => adapter.trim()) : defaultAdapters;
  const unknown = adapters.filter((adapter) => !supportedAdapters.has(adapter));

  if (unknown.length) {
    throw new Error(`Unsupported benchmark adapter(s): ${unknown.join(", ")}.`);
  }
  return adapters;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function quantile(values, percentile) {
  if (!values.length) return null;

  const sorted = [...values].sort((left, right) => left - right);
  const position = (sorted.length - 1) * percentile;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const fraction = position - lower;
  return round(sorted[lower] + (sorted[upper] - sorted[lower]) * fraction);
}

function summarize(values) {
  const numericValues = values.filter((value) => Number.isFinite(value));
  if (!numericValues.length) return { count: 0, p50: null, p95: null };

  return {
    count: numericValues.length,
    p50: quantile(numericValues, 0.5),
    p95: quantile(numericValues, 0.95),
  };
}

function summarizeFoundation(samples) {
  return {
    importDefinitionMs: summarize(
      samples.map((sample) => sample.foundation.importDefinition.durationMs),
    ),
    importTransferBytes: summarize(
      samples.map((sample) => sample.foundation.importDefinition.transferBytes),
    ),
    importHeapGrowthBytes: summarize(
      samples.map((sample) => sample.foundation.importDefinition.heapGrowthBytes),
    ),
    firstRenderMs: summarize(samples.map((sample) => sample.foundation.firstRender.durationMs)),
    firstRenderHeapGrowthBytes: summarize(
      samples.map((sample) => sample.foundation.firstRender.heapGrowthBytes),
    ),
    reconnectMs: summarize(samples.map((sample) => sample.foundation.reconnect.durationMs)),
    reconnectShadowDomReusePercent: summarize(
      samples.map((sample) => sample.foundation.reconnect.shadowDomReusePercent),
    ),
    reconnectHeapGrowthBytes: summarize(
      samples.map((sample) => sample.foundation.reconnect.heapGrowthBytes),
    ),
  };
}

function summarizeTable(samples) {
  const supported = samples.filter((sample) => sample.table.supported);
  if (!supported.length) {
    return {
      supported: false,
      reason: samples[0]?.table.reason ?? "No table benchmark is available.",
    };
  }

  return {
    supported: true,
    rowCount: supported[0].table.rowCount,
    pageSize: supported[0].table.pageSize,
    importDefinitionMs: summarize(
      supported.map((sample) => sample.table.importDefinition.durationMs),
    ),
    importTransferBytes: summarize(
      supported.map((sample) => sample.table.importDefinition.transferBytes),
    ),
    importHeapGrowthBytes: summarize(
      supported.map((sample) => sample.table.importDefinition.heapGrowthBytes),
    ),
    firstRenderMs: summarize(supported.map((sample) => sample.table.firstRender.durationMs)),
    firstRenderHeapGrowthBytes: summarize(
      supported.map((sample) => sample.table.firstRender.heapGrowthBytes),
    ),
    selectionMs: summarize(supported.map((sample) => sample.table.selection.durationMs)),
    selectionReusePercent: summarize(
      supported.map((sample) => sample.table.selection.reusedRowsPercent),
    ),
    selectionHeapGrowthBytes: summarize(
      supported.map((sample) => sample.table.selection.heapGrowthBytes),
    ),
    sortMs: summarize(supported.map((sample) => sample.table.sort.durationMs)),
    sortReusePercent: summarize(supported.map((sample) => sample.table.sort.reusedRowsPercent)),
    sortHeapGrowthBytes: summarize(supported.map((sample) => sample.table.sort.heapGrowthBytes)),
    pageMs: summarize(supported.map((sample) => sample.table.page.durationMs)),
    pageReusePercent: summarize(supported.map((sample) => sample.table.page.reusedRowsPercent)),
    pageHeapGrowthBytes: summarize(supported.map((sample) => sample.table.page.heapGrowthBytes)),
  };
}

function summarizeAdapters(adapterResults) {
  return Object.fromEntries(
    Object.entries(adapterResults).map(([adapterId, samples]) => [
      adapterId,
      {
        label: samples[0].adapter.label,
        scope: samples[0].adapter.scope,
        foundation: summarizeFoundation(samples),
        table: summarizeTable(samples),
      },
    ]),
  );
}

function metricPair(metric, suffix = "") {
  if (!metric.count) return "n/a";
  return `${metric.p50}${suffix} / ${metric.p95}${suffix}`;
}

async function readPackageVersions() {
  const packagePaths = {
    rowan: "package.json",
    lit: "node_modules/lit/package.json",
    fastElement: "node_modules/@microsoft/fast-element/package.json",
    webAwesome: "node_modules/@awesome.me/webawesome/package.json",
    playwright: "node_modules/playwright/package.json",
  };
  const entries = await Promise.all(
    Object.entries(packagePaths).map(async ([packageName, packagePath]) => {
      const packageJson = JSON.parse(
        await readFile(path.join(repositoryRoot, packagePath), "utf8"),
      );
      return [packageName, packageJson.version];
    }),
  );

  return Object.fromEntries(entries);
}

function formatBenchmarkMarkdown(report) {
  const packageVersions = report.environment.packageVersions;
  const lines = [
    "# Benchmark Results",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Environment",
    "",
    `- Node: ${report.environment.node}`,
    `- Platform: ${report.environment.platform} (${report.environment.arch})`,
    `- Operating system: ${report.environment.operatingSystemVersion}`,
    `- CPU: ${report.environment.cpu}`,
    `- Browser: ${report.environment.browser.name} ${report.environment.browser.version}`,
    `- User agent: ${report.environment.browser.userAgent}`,
    `- Packages: Rowan ${packageVersions.rowan}; Lit ${packageVersions.lit}; FAST Element ${packageVersions.fastElement}; Web Awesome ${packageVersions.webAwesome}; Playwright ${packageVersions.playwright}`,
    `- Samples per adapter: ${report.workload.sampleCount}`,
    `- Table workload: ${report.workload.tableRowCount} rows; ${report.workload.tablePageSize} rows per page`,
    "",
    "## Shared Control Workload",
    "",
    "Each adapter imports and defines one button, checkbox, and switch, mounts the three controls, then disconnects and reconnects the same control tree. Values are p50 / p95.",
    "",
    "| Adapter | Import and definition (ms) | Transfer (bytes) | First render (ms) | Reconnect (ms) | Reconnect shadow DOM reuse (%) | Import heap growth (bytes) | First render heap growth (bytes) | Reconnect heap growth (bytes) |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const summary of Object.values(report.summary)) {
    const foundation = summary.foundation;
    lines.push(
      `| ${summary.label} | ${metricPair(foundation.importDefinitionMs)} | ${metricPair(foundation.importTransferBytes)} | ${metricPair(foundation.firstRenderMs)} | ${metricPair(foundation.reconnectMs)} | ${metricPair(foundation.reconnectShadowDomReusePercent)} | ${metricPair(foundation.importHeapGrowthBytes)} | ${metricPair(foundation.firstRenderHeapGrowthBytes)} | ${metricPair(foundation.reconnectHeapGrowthBytes)} |`,
    );
  }

  const rowanTable = report.summary.rowan?.table;
  if (rowanTable?.supported) {
    lines.push(
      "",
      "## Rowan Table Workload",
      "",
      "The table uses its public configuration API with text/number columns, multiple selection, a 100-row initial view, ascending sort, and a 50-row page transition. Row reuse compares actual `<tr>` node identity before and after each operation. Values are p50 / p95.",
      "",
      "| Metric | Duration (ms) | Import transfer (bytes) | Row reuse (%) | Heap growth (bytes) |",
      "| --- | ---: | ---: | ---: | ---: |",
      `| Table import and definition | ${metricPair(rowanTable.importDefinitionMs)} | ${metricPair(rowanTable.importTransferBytes)} | n/a | ${metricPair(rowanTable.importHeapGrowthBytes)} |`,
      `| First render | ${metricPair(rowanTable.firstRenderMs)} | n/a | n/a | ${metricPair(rowanTable.firstRenderHeapGrowthBytes)} |`,
      `| Selection | ${metricPair(rowanTable.selectionMs)} | n/a | ${metricPair(rowanTable.selectionReusePercent)} | ${metricPair(rowanTable.selectionHeapGrowthBytes)} |`,
      `| Sort | ${metricPair(rowanTable.sortMs)} | n/a | ${metricPair(rowanTable.sortReusePercent)} | ${metricPair(rowanTable.sortHeapGrowthBytes)} |`,
      `| Page transition | ${metricPair(rowanTable.pageMs)} | n/a | ${metricPair(rowanTable.pageReusePercent)} | ${metricPair(rowanTable.pageHeapGrowthBytes)} |`,
    );
  }

  lines.push(
    "",
    "## Scope Notes",
    "",
    "Lit and FAST Element are authoring runtimes, so their adapters are minimal comparable custom elements rather than third-party design-system controls. Web Awesome uses its direct button, checkbox, and switch modules. Reconnect reuse compares internal shadow-DOM element identity after detach/reappend. No verified Web Awesome table component was available for this release, and the harness intentionally does not claim a cross-library table comparison. Heap measurements use Chromium's non-standard `performance.memory` API when available; unsupported engines report no heap values, and a zero result can reflect measurement granularity or collection timing.",
    "",
    "See [README.md](README.md) for workload, cache, timing, and interpretation details. Raw per-sample measurements are in [results/latest.json](results/latest.json).",
    "",
  );

  return lines.join("\n");
}

async function collectSample(browser, origin, adapterId, index) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    const url = new URL("/benchmarks/runner.html", origin);
    url.searchParams.set("adapter", adapterId);
    url.searchParams.set("sample", String(index));
    await page.goto(url.href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => globalThis.__rowanBenchmarkResult !== undefined, {
      timeout: 60_000,
    });

    const response = await page.evaluate(() => globalThis.__rowanBenchmarkResult);
    if (!response.ok) throw new Error(response.error);
    if (pageErrors.length) throw new Error(pageErrors.join("\n"));
    return response.result;
  } finally {
    await context.close();
  }
}

async function main() {
  const packageVersions = await readPackageVersions();
  const server = await createServer({
    root: repositoryRoot,
    logLevel: "error",
    server: { host: "127.0.0.1", port: 0 },
  });
  let browser;

  try {
    await server.listen();
    const address = server.httpServer?.address();
    if (!address || typeof address === "string") {
      throw new Error("Unable to determine the benchmark server address.");
    }

    browser = await browserLaunchers[browserName].launch({ headless: true });
    const origin = `http://127.0.0.1:${address.port}`;
    const adapterResults = {};

    for (const adapterId of adapterIds) {
      adapterResults[adapterId] = [];
      for (let index = 0; index < sampleCount; index += 1) {
        adapterResults[adapterId].push(await collectSample(browser, origin, adapterId, index + 1));
      }
    }

    const firstSample = adapterResults[adapterIds[0]][0];
    const report = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        operatingSystemVersion: release(),
        cpu: cpus()[0]?.model ?? "unknown",
        packageVersions,
        browser: {
          name: browserName,
          version: browser.version(),
          userAgent: firstSample.userAgent,
        },
      },
      workload: {
        sampleCount,
        isolation: "One fresh Playwright browser context per sample.",
        tableRowCount: 100,
        tablePageSize: 50,
      },
      adapters: adapterResults,
      summary: summarizeAdapters(adapterResults),
    };

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    await writeFile(markdownPath, formatBenchmarkMarkdown(report));

    console.log(`Wrote benchmark results to ${path.relative(repositoryRoot, outputPath)}.`);
    console.log(`Wrote benchmark summary to ${path.relative(repositoryRoot, markdownPath)}.`);
  } finally {
    await browser?.close();
    await server.close();
  }
}

await main();
