#!/usr/bin/env node

/**
 * Check bundle size budgets to prevent regressions.
 * Fails CI if any bundle exceeds its budget.
 */

import { build } from "esbuild";
import { gzipSync } from "zlib";
import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const tempDir = join(rootDir, ".size-budget-check");

// Size budgets (in bytes, gzipped)
// Set slightly above current sizes to allow for small additions
const budgets = {
  // Individual components (small, commonly used)
  button: 15 * 1024, // 15 KB
  checkbox: 15 * 1024,
  switch: 15 * 1024,
  "text-field": 16 * 1024,
  alert: 15 * 1024,
  badge: 14 * 1024,
  chip: 14 * 1024,
  spinner: 14 * 1024,

  // Medium components
  select: 16 * 1024,
  dialog: 16 * 1024,
  dropdown: 17 * 1024,
  tooltip: 15 * 1024,
  progress: 15 * 1024,

  // Charts (larger due to SVG rendering logic)
  sparkline: 18 * 1024,
  "trend-chart": 20 * 1024,
  "bar-chart": 20 * 1024,

  // Table initial load: entry plus statically imported chunks.
  // Clipboard and workbook export load with table-export.js and are not counted here.
  table: 41 * 1024,

  // Lazy workbook/clipboard module, measured on its own (about 4.2 KB). 6 KB leaves headroom.
  "table-export": 6 * 1024,

  // Lazy chart interaction (legend, tooltip, zoom, resize, sync, brush, large series). About 5.2 KB.
  "chart-interaction": 6 * 1024,

  // Common scenarios
  "three-controls": 17 * 1024, // button + checkbox + switch
  "form-controls": 19 * 1024, // button + text-field + checkbox + select + textarea
};

function gzipFile(path) {
  return gzipSync(readFileSync(path), { level: 9 }).length;
}

/**
 * Sum gzipped outputs reachable from the entry.
 * `import-statement` edges are initial load. Chunks reached only through
 * `dynamic-import` are lazy and reported separately.
 */
function graphSizes(metafile, entryOutputKey) {
  const outputs = metafile.outputs;
  const initial = new Set();
  const initialQueue = [entryOutputKey];
  while (initialQueue.length > 0) {
    const key = initialQueue.pop();
    if (!key || initial.has(key)) continue;
    initial.add(key);
    for (const imported of outputs[key]?.imports || []) {
      if (imported.kind === "import-statement") initialQueue.push(imported.path);
    }
  }

  const reachable = new Set();
  const reachableQueue = [entryOutputKey];
  while (reachableQueue.length > 0) {
    const key = reachableQueue.pop();
    if (!key || reachable.has(key)) continue;
    reachable.add(key);
    for (const imported of outputs[key]?.imports || []) reachableQueue.push(imported.path);
  }

  let initialBytes = 0;
  for (const key of initial) initialBytes += gzipFile(key);

  let lazyBytes = 0;
  for (const key of reachable) {
    if (!initial.has(key)) lazyBytes += gzipFile(key);
  }

  return { initialBytes, lazyBytes };
}

async function measureBundle(name, code) {
  const entryFile = join(tempDir, `${name}.js`);
  const outDir = join(tempDir, `${name}-out`);

  writeFileSync(entryFile, code);

  try {
    mkdirSync(outDir, { recursive: true });
    const result = await build({
      entryPoints: [entryFile],
      bundle: true,
      minify: true,
      format: "esm",
      target: "es2020",
      outdir: outDir,
      write: true,
      splitting: true,
      treeShaking: true,
      metafile: true,
      logLevel: "error",
    });

    const entryOutputKey = Object.keys(result.metafile.outputs).find((outputPath) => {
      const entryPoint = result.metafile.outputs[outputPath].entryPoint || "";
      return entryPoint.endsWith(`/${name}.js`) && entryPoint.includes(".size-budget-check/");
    });
    if (!entryOutputKey) {
      throw new Error(`No entry output for ${name}`);
    }

    return graphSizes(result.metafile, entryOutputKey);
  } catch (error) {
    console.error(`Error building ${name}:`, error.message);
    return null;
  }
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

async function main() {
  console.log("📏 Checking bundle size budgets...\n");

  // Clean and create temp directory
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true });
  }
  mkdirSync(tempDir, { recursive: true });

  const results = [];
  let failed = false;

  // Check component budgets
  for (const [name, budget] of Object.entries(budgets)) {
    let code;

    if (name === "three-controls") {
      code = `
        import "@rowan-ui/core/button";
        import "@rowan-ui/core/checkbox";
        import "@rowan-ui/core/switch";
      `;
    } else if (name === "form-controls") {
      code = `
        import "@rowan-ui/core/button";
        import "@rowan-ui/core/text-field";
        import "@rowan-ui/core/checkbox";
        import "@rowan-ui/core/select";
        import "@rowan-ui/core/textarea";
      `;
    } else if (name === "table-export") {
      code = `
        import * as tableExport from "../src/table/table-export.js";
        globalThis.__tableExport = tableExport;
      `;
    } else if (name === "chart-interaction") {
      code = `
        import * as chartInteraction from "../src/chart/ix.js";
        globalThis.__chartInteraction = chartInteraction;
      `;
    } else {
      code = `import "@rowan-ui/core/${name}";`;
    }

    process.stdout.write(`  ${name.padEnd(20)}...`);
    const measured = await measureBundle(name, code);

    if (measured === null) {
      console.log(` ✗ Failed to build`);
      failed = true;
      continue;
    }

    const size = measured.initialBytes;
    const budgetMet = size <= budget;
    const status = budgetMet ? "✓" : "✗";
    const emoji = budgetMet ? " " : "💥";
    const percentage = ((size / budget) * 100).toFixed(0);
    const lazyNote = measured.lazyBytes > 0 ? `  lazy ${formatBytes(measured.lazyBytes)}` : "";

    console.log(
      ` ${status} ${formatBytes(size).padStart(10)} / ${formatBytes(budget)} (${percentage}%)${emoji}${lazyNote}`
    );

    results.push({
      name,
      size,
      budget,
      met: budgetMet,
    });

    if (!budgetMet) {
      failed = true;
    }
  }

  // Cleanup
  rmSync(tempDir, { recursive: true });

  // Summary
  console.log("\n" + "=".repeat(70));
  const passed = results.filter((r) => r.met).length;
  const total = results.length;

  if (failed) {
    console.log(`\n❌ FAILED: ${passed}/${total} budgets met\n`);
    console.log("Some bundles exceed their size budgets.");
    console.log("Either optimize the code or increase the budget if justified.\n");
    process.exit(1);
  } else {
    console.log(`\n✅ PASSED: All ${total} bundles within budget\n`);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
