/**
 * Read the Istanbul summary produced by `npm run coverage`, write
 * docs/TEST_COVERAGE.md, and fail when src/ coverage drops below
 * scripts/coverage-floors.json.
 *
 * The floor is global (lines, statements, functions, branches) so a
 * regression in any of those metrics fails CI. The per-component table
 * is the readable breakdown; gap score ranks where new tests help most.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const summaryPath = join(rootDir, "coverage", "coverage-summary.json");
const floorsPath = join(rootDir, "scripts", "coverage-floors.json");
const docsPath = join(rootDir, "docs", "TEST_COVERAGE.md");
const prettierBin = join(rootDir, "node_modules", "prettier", "bin", "prettier.cjs");

const METRICS = ["lines", "statements", "functions", "branches"];

/** Higher weight means uncovered lines and branches rank as a larger gap. */
const CATEGORIES = {
  form: {
    weight: 3,
    label: "Form",
    components: [
      "button",
      "icon-button",
      "checkbox",
      "radio",
      "radio-group",
      "switch",
      "text-field",
      "textarea",
      "number-field",
      "select",
      "combobox",
      "multi-select-combobox",
      "slider",
      "color-picker",
      "date-picker",
      "date-range-picker",
      "time-picker",
      "file-upload",
      "dropzone",
      "file-item",
      "form-field",
      "form-layout",
      "form-wizard",
      "rating",
      "rich-text-editor",
      "listbox",
      "option",
      "segmented-control",
      "calendar",
      "filter-builder",
      "validation-summary",
    ],
  },
  overlay: {
    weight: 3,
    label: "Overlay",
    components: [
      "dialog",
      "confirm-dialog",
      "drawer",
      "dropdown",
      "popover",
      "tooltip",
      "toast",
      "toaster",
      "context-menu",
      "menu",
      "menu-item",
      "command-palette",
      "command-item",
    ],
  },
  navigation: {
    weight: 2.5,
    label: "Navigation",
    components: [
      "accordion",
      "breadcrumb",
      "link",
      "pagination",
      "side-nav",
      "side-nav-item",
      "side-nav-section",
      "stepper",
      "tabs",
      "tab",
      "tab-panel",
      "tree",
      "tree-item",
      "app-layout",
      "carousel",
      "split-pane",
    ],
  },
  data: {
    weight: 2,
    label: "Data display",
    components: [
      "avatar",
      "badge",
      "card",
      "chip",
      "data-state",
      "empty-state",
      "image",
      "kpi-card",
      "progress",
      "skeleton",
      "spinner",
      "status-indicator",
      "source-meta",
      "virtual-list",
      "dashboard-filters",
      "bulk-actions-bar",
      "row-details-panel",
      "divider",
      "alert",
    ],
  },
  table: {
    weight: 0.5,
    label: "Table",
    components: ["table", "table-csv", "table-quick-find", "table-toolbar", "table-view-state"],
  },
  chart: {
    weight: 0.4,
    label: "Chart",
    components: [
      "chart",
      "area-chart",
      "bar-chart",
      "box-plot-chart",
      "bullet-chart",
      "column-sparkline",
      "combo-chart",
      "donut-chart",
      "funnel-chart",
      "gauge-chart",
      "heatmap-chart",
      "histogram",
      "radar-chart",
      "range-chart",
      "scatter-chart",
      "sparkline",
      "stacked-area-chart",
      "stacked-bar-chart",
      "trend-chart",
      "waterfall-chart",
    ],
  },
  support: {
    weight: 1.5,
    label: "Support",
    components: ["lib", "tokens", "react"],
  },
};

const categoryByComponent = new Map();
for (const category of Object.values(CATEGORIES)) {
  for (const component of category.components) {
    categoryByComponent.set(component, category);
  }
}

function emptyMetric() {
  return { total: 0, covered: 0, skipped: 0, pct: 100 };
}

function addMetric(target, source) {
  target.total += source.total;
  target.covered += source.covered;
  target.skipped += source.skipped ?? 0;
  target.pct = target.total === 0 ? 100 : (target.covered / target.total) * 100;
}

function readMetric(block, metric) {
  const value = block?.[metric];
  if (!value || typeof value.total !== "number") return emptyMetric();
  const pct = value.total === 0 || value.pct === "Unknown" ? 100 : Number(value.pct);
  return {
    total: value.total,
    covered: value.covered,
    skipped: value.skipped ?? 0,
    pct: Number.isFinite(pct) ? pct : 0,
  };
}

function componentId(relativePath) {
  const [directory] = relativePath.split("/");
  if (!directory || directory.endsWith(".js")) return "package";
  return directory;
}

function classify(component) {
  return (
    categoryByComponent.get(component) ?? {
      weight: 1,
      label: "Other",
    }
  );
}

function formatPct(value) {
  return `${value.toFixed(2)}%`;
}

function formatCount(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function uncovered(metric) {
  return Math.max(0, metric.total - metric.covered);
}

/**
 * Barrels are re-exports. Generated React wrappers and the wrapper factory are
 * exercised by the bundled React test, which V8 attributes to the bundle.
 * Token data is loaded by the documentation app, not the unit suite.
 */
function isExpectedUnloaded(relativePath) {
  if (relativePath === "index.js" || relativePath.endsWith("/index.js")) return true;
  if (relativePath.startsWith("react/generated/")) return true;
  return (
    relativePath === "react/create-wrapper.js" ||
    relativePath === "react/use-rowan-element.js" ||
    relativePath === "tokens/token-data.js"
  );
}

function collectSourceFiles() {
  const files = [];

  function walk(directory) {
    for (const entry of readdirSync(directory)) {
      const fullPath = join(directory, entry);
      const stats = statSync(fullPath);
      if (stats.isDirectory()) {
        if (entry === "storybook") continue;
        walk(fullPath);
        continue;
      }
      if (!entry.endsWith(".js")) continue;
      if (entry.endsWith(".test.js") || entry.endsWith(".stories.js")) continue;
      files.push(relative(join(rootDir, "src"), fullPath).split("\\").join("/"));
    }
  }

  walk(join(rootDir, "src"));
  return files.sort();
}

function loadSummary() {
  if (!existsSync(summaryPath)) {
    console.error(`Missing ${relative(rootDir, summaryPath)}.`);
    console.error("Run `npm run coverage` so the test runner can write the Istanbul summary.");
    process.exit(1);
  }

  const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
  const files = new Map();

  for (const [filePath, block] of Object.entries(summary)) {
    if (filePath === "total") continue;
    const relativePath = relative(rootDir, filePath).split("\\").join("/");
    if (!relativePath.startsWith("src/") || relativePath.includes("/storybook/")) continue;
    if (relativePath.endsWith(".test.js") || relativePath.endsWith(".stories.js")) continue;
    files.set(relativePath.slice("src/".length), block);
  }

  return { summary, files };
}

function loadFloors() {
  const floors = JSON.parse(readFileSync(floorsPath, "utf8"));
  for (const metric of METRICS) {
    if (typeof floors[metric] !== "number" || floors[metric] < 0 || floors[metric] > 100) {
      console.error(`scripts/coverage-floors.json needs ${metric} as a number from 0 to 100.`);
      process.exit(1);
    }
  }
  return floors;
}

function buildRows(measuredFiles) {
  const rows = new Map();

  function rowFor(component) {
    let row = rows.get(component);
    if (!row) {
      const category = classify(component);
      row = {
        component,
        category: category.label,
        weight: category.weight,
        lines: emptyMetric(),
        statements: emptyMetric(),
        functions: emptyMetric(),
        branches: emptyMetric(),
        files: 0,
        missing: [],
      };
      rows.set(component, row);
    }
    return row;
  }

  for (const [relativePath, block] of measuredFiles) {
    const row = rowFor(componentId(relativePath));
    row.files += 1;
    for (const metric of METRICS) {
      addMetric(row[metric], readMetric(block, metric));
    }
  }

  const missing = [];
  for (const relativePath of collectSourceFiles()) {
    if (measuredFiles.has(relativePath)) continue;
    const component = componentId(relativePath);
    const row = rowFor(component);
    row.missing.push(relativePath);
    missing.push(relativePath);
  }

  return {
    rows: [...rows.values()].sort((left, right) => left.component.localeCompare(right.component)),
    missing: missing.sort(),
  };
}

function gapScore(row) {
  return row.weight * (uncovered(row.lines) + uncovered(row.branches));
}

function metricCell(metric) {
  return `${formatPct(metric.pct)} (${formatCount(uncovered(metric))} uncovered)`;
}

function renderMarkdown(overall, floors, rows, missing) {
  const ranked = [...rows].sort(
    (left, right) =>
      gapScore(right) - gapScore(left) || left.component.localeCompare(right.component),
  );
  const lines = [
    "# Test coverage",
    "",
    "Line, statement, function, and branch coverage for `src/`, measured with Chromium V8 coverage while the unit tests run.",
    "",
    "- Collect it with `npm run coverage`.",
    "- The test runner writes `coverage/coverage-summary.json` (gitignored).",
    "- This file is regenerated from that summary.",
    "- CI fails when any metric drops below the floor in `scripts/coverage-floors.json`.",
    "",
    "Firefox and WebKit still run the same tests in the browser-compatibility job. V8 coverage is collected from the Chromium unit run only.",
    "",
    "Gap score is `weight × (uncovered lines + uncovered branches)`. Form controls and overlays weigh 3, navigation 2.5, data display 2, support code 1.5, other code 1, tables 0.5, and charts 0.4. Tables and charts stay lower priority while they are under active development.",
    "",
    "## Overall",
    "",
    "| Metric | Covered | Total | Coverage | Floor |",
    "| --- | ---: | ---: | ---: | ---: |",
  ];

  for (const metric of METRICS) {
    const value = overall[metric];
    lines.push(
      `| ${metric} | ${formatCount(value.covered)} | ${formatCount(value.total)} | ${formatPct(value.pct)} | ${formatPct(floors[metric])} |`,
    );
  }

  lines.push(
    "",
    "## Largest gaps",
    "",
    "Ranked by gap score. Use this list to choose the next behavior tests.",
    "",
    "| Component | Category | Gap score | Lines | Branches | Functions |",
    "| --- | --- | ---: | ---: | ---: | ---: |",
  );

  for (const row of ranked.slice(0, 25)) {
    lines.push(
      `| \`${row.component}\` | ${row.category} | ${gapScore(row).toFixed(1)} | ${metricCell(row.lines)} | ${metricCell(row.branches)} | ${formatPct(row.functions.pct)} |`,
    );
  }

  lines.push(
    "",
    "## Per component",
    "",
    "| Component | Category | Files | Lines | Statements | Functions | Branches |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: |",
  );

  for (const row of rows) {
    lines.push(
      `| \`${row.component}\` | ${row.category} | ${row.files} | ${metricCell(row.lines)} | ${metricCell(row.statements)} | ${metricCell(row.functions)} | ${metricCell(row.branches)} |`,
    );
  }

  const unexpected = missing.filter((file) => !isExpectedUnloaded(file));
  const expected = missing.filter((file) => isExpectedUnloaded(file));

  lines.push("", "## Source files not loaded", "");
  if (unexpected.length === 0) {
    lines.push(
      "Every component and library module under `src/` was loaded during the unit test run.",
    );
  } else {
    lines.push(
      "These modules are outside the percentages above because V8 only reports scripts the browser executed. CI fails while any of them are unloaded.",
      "",
    );
    for (const file of unexpected) {
      lines.push(`- \`src/${file}\``);
    }
  }

  lines.push(
    "",
    `${expected.length} unloaded files are expected: package and component \`index.js\` barrels, generated React wrappers, the React wrapper modules (covered through the bundled React test), and \`src/tokens/token-data.js\` (documentation data).`,
  );

  lines.push("");
  return lines.join("\n");
}

function overallFromSummary(summary) {
  const overall = {};
  for (const metric of METRICS) {
    overall[metric] = readMetric(summary.total, metric);
  }
  return overall;
}

function enforce(overall, floors, missing) {
  const failures = [];
  for (const metric of METRICS) {
    const pct = overall[metric].pct;
    if (pct + 1e-9 < floors[metric]) {
      failures.push(`${metric} ${formatPct(pct)} is below the ${formatPct(floors[metric])} floor`);
    }
  }

  const unexpected = missing.filter((file) => !isExpectedUnloaded(file));
  if (unexpected.length > 0) {
    failures.push(
      `${unexpected.length} source file${unexpected.length === 1 ? "" : "s"} never loaded (see docs/TEST_COVERAGE.md)`,
    );
  }

  console.log("\nTest coverage");
  for (const metric of METRICS) {
    const value = overall[metric];
    console.log(
      `  ${metric.padEnd(10)} ${formatPct(value.pct).padStart(7)}  (${formatCount(value.covered)}/${formatCount(value.total)})  floor ${formatPct(floors[metric])}`,
    );
  }

  if (failures.length > 0) {
    console.error("\nTest coverage check failed:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log("\nTest coverage is at or above the floor.\n");
}

const floors = loadFloors();
const { summary, files } = loadSummary();
const overall = overallFromSummary(summary);
const { rows, missing } = buildRows(files);

writeFileSync(docsPath, renderMarkdown(overall, floors, rows, missing));
execFileSync(process.execPath, [prettierBin, "--write", docsPath], {
  cwd: rootDir,
  stdio: "inherit",
});

enforce(overall, floors, missing);
