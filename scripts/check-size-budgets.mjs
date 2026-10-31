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

<<<<<<< HEAD
  // Table (large, includes many features + column resizing/reordering)
  table: 38 * 1024, // 38 KB (+1 KB for resize/reorder features)
=======
  // Table (large, includes many features)
  table: 37 * 1024, // 37 KB
>>>>>>> origin/main

  // Common scenarios
  "three-controls": 17 * 1024, // button + checkbox + switch
  "form-controls": 19 * 1024, // button + text-field + checkbox + select + textarea
};

async function measureBundle(name, code) {
  const entryFile = join(tempDir, `${name}.js`);
  const outFile = join(tempDir, `${name}.out.js`);

  writeFileSync(entryFile, code);

  try {
    await build({
      entryPoints: [entryFile],
      bundle: true,
      minify: true,
      format: "esm",
      target: "es2020",
      outfile: outFile,
      write: true,
      external: [],
      treeShaking: true,
      logLevel: "error",
    });

    const bundleContent = readFileSync(outFile);
    return gzipSync(bundleContent, { level: 9 }).length;
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
    } else {
      code = `import "@rowan-ui/core/${name}";`;
    }

    process.stdout.write(`  ${name.padEnd(20)}...`);
    const size = await measureBundle(name, code);

    if (size === null) {
      console.log(` ✗ Failed to build`);
      failed = true;
      continue;
    }

    const budgetMet = size <= budget;
    const status = budgetMet ? "✓" : "✗";
    const emoji = budgetMet ? " " : "💥";
    const percentage = ((size / budget) * 100).toFixed(0);

    console.log(
      ` ${status} ${formatBytes(size).padStart(10)} / ${formatBytes(budget)} (${percentage}%)${emoji}`
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
