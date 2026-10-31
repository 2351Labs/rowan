#!/usr/bin/env node
/**
 * Inline shared chart CSS into each chart stylesheet.
 * A shadow <link> does not keep @import "../chart/*.css" working after a
 * bundler moves the file to /assets. The shared rules ship inside the file.
 *
 *   node scripts/inline-chart-styles.mjs
 *   node scripts/inline-chart-styles.mjs --check
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const check = process.argv.includes("--check");
const start = "/* rowan-chart-shared:start */";
const end = "/* rowan-chart-shared:end */";

const hover = readFileSync(join(rootDir, "src/chart/hover.css"), "utf8").trim();
const pointControls = readFileSync(join(rootDir, "src/chart/point-controls.css"), "utf8").trim();

const withPoints = [
  "area-chart",
  "bar-chart",
  "box-plot-chart",
  "combo-chart",
  "funnel-chart",
  "heatmap-chart",
  "radar-chart",
  "range-chart",
  "scatter-chart",
  "stacked-area-chart",
  "stacked-bar-chart",
  "trend-chart",
  "waterfall-chart",
];

const hoverOnly = ["bullet-chart", "column-sparkline", "donut-chart", "gauge-chart", "sparkline"];

function sharedBlock(includePoints) {
  const parts = [hover];
  if (includePoints) parts.push(pointControls);
  return `${start}\n${parts.join("\n\n")}\n${end}\n`;
}

function stripShared(css) {
  return css
    .replace(/^(?:@import\s+"\.\.\/chart\/(?:hover|point-controls)\.css";\s*)+/, "")
    .replace(/^\/\* rowan-chart-shared:start \*\/[\s\S]*?\/\* rowan-chart-shared:end \*\/\s*/, "");
}

const mismatches = [];

for (const [name, includePoints] of [
  ...withPoints.map((name) => [name, true]),
  ...hoverOnly.map((name) => [name, false]),
]) {
  const path = join(rootDir, "src", name, `${name}.css`);
  const current = readFileSync(path, "utf8");
  const next = `${sharedBlock(includePoints)}${stripShared(current)}`;
  if (current !== next) {
    mismatches.push(path);
    if (!check) writeFileSync(path, next);
  }
}

if (mismatches.length > 0 && check) {
  console.error("Chart stylesheets are missing inlined shared CSS:\n");
  for (const path of mismatches) console.error(`  ${path}`);
  console.error("\nRun: node scripts/inline-chart-styles.mjs\n");
  process.exit(1);
}

if (check) {
  console.log("chart styles: shared hover and point-control CSS is inlined");
} else if (mismatches.length === 0) {
  console.log("chart styles: already inlined");
} else {
  console.log(`chart styles: inlined shared CSS into ${mismatches.length} stylesheet(s)`);
}
