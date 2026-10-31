#!/usr/bin/env node

/**
 * Analyze production bundle sizes for Rowan components.
 * Measures minified + gzip + brotli sizes for individual components and common scenarios.
 */

import { build } from "esbuild";
import { gzipSync, brotliCompressSync } from "zlib";
import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const tempDir = join(rootDir, ".bundle-analysis");

// Test scenarios
const scenarios = [
  {
    name: "three-controls",
    description: "Button + Checkbox + Switch (benchmark baseline)",
    code: `
      import "@rowan-ui/core/button";
      import "@rowan-ui/core/checkbox";
      import "@rowan-ui/core/switch";
    `,
  },
  {
    name: "button-only",
    description: "Single button component",
    code: `import "@rowan-ui/core/button";`,
  },
  {
    name: "checkbox-only",
    description: "Single checkbox component",
    code: `import "@rowan-ui/core/checkbox";`,
  },
  {
    name: "table-only",
    description: "Table component (includes many deps)",
    code: `import "@rowan-ui/core/table";`,
  },
  {
    name: "form-controls",
    description: "Common form controls",
    code: `
      import "@rowan-ui/core/button";
      import "@rowan-ui/core/text-field";
      import "@rowan-ui/core/checkbox";
      import "@rowan-ui/core/select";
      import "@rowan-ui/core/textarea";
    `,
  },
  {
    name: "chart-basic",
    description: "Single chart component",
    code: `import "@rowan-ui/core/trend-chart";`,
  },
  {
    name: "dashboard",
    description: "Dashboard components",
    code: `
      import "@rowan-ui/core/kpi-card";
      import "@rowan-ui/core/sparkline";
      import "@rowan-ui/core/table";
      import "@rowan-ui/core/button";
    `,
  },
  {
    name: "barrel-import",
    description: "Barrel import (should tree-shake)",
    code: `
      import { RowanButton, RowanCheckbox, RowanSwitch } from "@rowan-ui/core";
      // Prevent dead code elimination by "using" the classes
      const classes = [RowanButton, RowanCheckbox, RowanSwitch];
      if (typeof window !== 'undefined') window.__rowanTest = classes;
    `,
  },
];

// Individual components to measure
const components = [
  "button",
  "checkbox",
  "switch",
  "text-field",
  "select",
  "table",
  "badge",
  "chip",
  "alert",
  "dialog",
  "dropdown",
  "tooltip",
  "spinner",
  "progress",
  "trend-chart",
  "bar-chart",
  "sparkline",
];

/**
 * Build a bundle and return its size info
 */
async function analyzeBundle(name, code) {
  const entryFile = join(tempDir, `${name}.js`);
  const outFile = join(tempDir, `${name}.out.js`);

  writeFileSync(entryFile, code);

  try {
    const result = await build({
      entryPoints: [entryFile],
      bundle: true,
      minify: true,
      format: "esm",
      target: "es2020",
      outfile: outFile,
      write: true,
      metafile: true,
      external: [], // Bundle everything
      treeShaking: true,
    });

    const bundleContent = readFileSync(outFile);
    const minified = bundleContent.length;
    const gzipped = gzipSync(bundleContent, { level: 9 }).length;
    const brotli = brotliCompressSync(bundleContent).length;

    // Analyze what was included
    const inputs = Object.keys(result.metafile.inputs);
    const libFiles = inputs.filter((f) => f.includes("/lib/"));
    const componentFiles = inputs.filter((f) => f.includes("/src/") && !f.includes("/lib/"));

    return {
      minified,
      gzipped,
      brotli,
      inputs: inputs.length,
      libFiles: libFiles.length,
      componentFiles: componentFiles.length,
      topInputs: inputs
        .map((input) => ({
          path: input,
          bytes: result.metafile.inputs[input].bytes,
        }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 10),
    };
  } catch (error) {
    console.error(`Error analyzing ${name}:`, error.message);
    return null;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

async function main() {
  console.log("🔍 Analyzing Rowan bundle sizes...\n");

  // Clean and create temp directory
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true });
  }
  mkdirSync(tempDir, { recursive: true });

  const results = {
    scenarios: {},
    components: {},
    baseline: null,
  };

  // Analyze scenarios
  console.log("📊 Analyzing test scenarios...\n");
  for (const scenario of scenarios) {
    process.stdout.write(`  ${scenario.name}...`);
    const result = await analyzeBundle(scenario.name, scenario.code);
    if (result) {
      results.scenarios[scenario.name] = { ...scenario, ...result };
      console.log(` ✓`);
    } else {
      console.log(` ✗`);
    }
  }

  // Store baseline
  results.baseline = results.scenarios["three-controls"];

  // Analyze individual components
  console.log("\n📦 Analyzing individual components...\n");
  for (const component of components) {
    process.stdout.write(`  ${component}...`);
    const code = `import "@rowan-ui/core/${component}";`;
    const result = await analyzeBundle(`component-${component}`, code);
    if (result) {
      results.components[component] = result;
      console.log(` ✓`);
    } else {
      console.log(` ✗`);
    }
  }

  // Generate report
  console.log("\n" + "=".repeat(80));
  console.log("BUNDLE SIZE ANALYSIS REPORT");
  console.log("=".repeat(80) + "\n");

  // Scenarios summary
  console.log("TEST SCENARIOS\n");
  console.log(
    "Scenario".padEnd(25) +
      "Minified".padStart(12) +
      "Gzip".padStart(12) +
      "Brotli".padStart(12) +
      "Files".padStart(8)
  );
  console.log("-".repeat(69));

  for (const [name, data] of Object.entries(results.scenarios)) {
    if (!data.minified) continue;
    console.log(
      name.padEnd(25) +
        formatBytes(data.minified).padStart(12) +
        formatBytes(data.gzipped).padStart(12) +
        formatBytes(data.brotli).padStart(12) +
        data.inputs.toString().padStart(8)
    );
  }

  // Components summary
  console.log("\n\nINDIVIDUAL COMPONENTS (sorted by gzipped size)\n");
  console.log(
    "Component".padEnd(20) +
      "Minified".padStart(12) +
      "Gzip".padStart(12) +
      "Brotli".padStart(12) +
      "Files".padStart(8)
  );
  console.log("-".repeat(64));

  const sortedComponents = Object.entries(results.components).sort(
    ([, a], [, b]) => b.gzipped - a.gzipped
  );

  for (const [name, data] of sortedComponents) {
    console.log(
      name.padEnd(20) +
        formatBytes(data.minified).padStart(12) +
        formatBytes(data.gzipped).padStart(12) +
        formatBytes(data.brotli).padStart(12) +
        data.inputs.toString().padStart(8)
    );
  }

  // Comparison with benchmark
  if (results.baseline) {
    console.log("\n\nCOMPARISON WITH BENCHMARK BASELINE\n");
    console.log("The benchmark measures unminified ESM transfer size: 703 KB");
    console.log(
      `Production three-controls bundle (minified + gzip): ${formatBytes(results.baseline.gzipped)}`
    );
    const reduction = 1 - results.baseline.gzipped / 703182;
    console.log(`Size reduction from minification + compression: ${formatPercent(reduction)}`);
  }

  // Tree-shaking analysis
  const directImport = results.scenarios["three-controls"];
  const barrelImport = results.scenarios["barrel-import"];

  if (directImport && barrelImport) {
    console.log("\n\nTREE-SHAKING EFFECTIVENESS\n");
    console.log(`Direct imports (import "@rowan-ui/core/button"): ${formatBytes(directImport.gzipped)}`);
    console.log(
      `Barrel imports (import { RowanButton } from "@rowan-ui/core"): ${formatBytes(barrelImport.gzipped)}`
    );

    if (Math.abs(directImport.gzipped - barrelImport.gzipped) < 1024) {
      console.log("✓ Tree-shaking is working correctly (sizes are nearly identical)");
    } else {
      const bloat = barrelImport.gzipped - directImport.gzipped;
      console.log(
        `⚠ Barrel import is ${formatBytes(bloat)} larger (${formatPercent(bloat / directImport.gzipped)} increase)`
      );
    }
  }

  // Top contributors for baseline
  if (results.baseline?.topInputs) {
    console.log("\n\nTOP 10 LARGEST SOURCE FILES (three-controls scenario)\n");
    console.log("File".padEnd(50) + "Size".padStart(12));
    console.log("-".repeat(62));

    for (const input of results.baseline.topInputs) {
      const shortPath = input.path.replace(/.*\/rowan\//, "");
      console.log(shortPath.padEnd(50) + formatBytes(input.bytes).padStart(12));
    }
  }

  // Save JSON report
  const jsonReport = {
    timestamp: new Date().toISOString(),
    scenarios: results.scenarios,
    components: results.components,
    baseline: results.baseline,
  };

  const reportPath = join(rootDir, ".bundle-analysis", "report.json");
  writeFileSync(reportPath, JSON.stringify(jsonReport, null, 2));
  console.log(`\n\n📄 Full report saved to: .bundle-analysis/report.json`);

  // Generate markdown report
  const mdReport = generateMarkdownReport(jsonReport);
  const mdPath = join(rootDir, ".bundle-analysis", "REPORT.md");
  writeFileSync(mdPath, mdReport);
  console.log(`📄 Markdown report saved to: .bundle-analysis/REPORT.md`);

  console.log("\n✓ Analysis complete!\n");
}

function generateMarkdownReport(data) {
  let md = "# Bundle Size Analysis Report\n\n";
  md += `Generated: ${new Date(data.timestamp).toLocaleString()}\n\n`;

  md += "## Test Scenarios\n\n";
  md += "| Scenario | Description | Minified | Gzip | Brotli | Files |\n";
  md += "|----------|-------------|----------|------|--------|-------|\n";

  for (const [name, scenario] of Object.entries(data.scenarios)) {
    if (!scenario.minified) continue;
    md += `| ${name} | ${scenario.description} | ${formatBytes(scenario.minified)} | ${formatBytes(scenario.gzipped)} | ${formatBytes(scenario.brotli)} | ${scenario.inputs} |\n`;
  }

  md += "\n## Individual Components (sorted by gzipped size)\n\n";
  md += "| Component | Minified | Gzip | Brotli | Files |\n";
  md += "|-----------|----------|------|--------|-------|\n";

  const sorted = Object.entries(data.components).sort(([, a], [, b]) => b.gzipped - a.gzipped);

  for (const [name, comp] of sorted) {
    md += `| ${name} | ${formatBytes(comp.minified)} | ${formatBytes(comp.gzipped)} | ${formatBytes(comp.brotli)} | ${comp.inputs} |\n`;
  }

  if (data.baseline) {
    md += "\n## Comparison with Benchmark\n\n";
    md += "- **Benchmark (unminified ESM)**: 703 KB\n";
    md += `- **Production (minified + gzip)**: ${formatBytes(data.baseline.gzipped)}\n`;
    const reduction = 1 - data.baseline.gzipped / 703182;
    md += `- **Reduction**: ${formatPercent(reduction)}\n`;
  }

  return md;
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
