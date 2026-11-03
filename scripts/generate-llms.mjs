/**
 * Write llms.txt and llms-full.txt from the custom-element catalog.
 * `--check` fails when the committed files are stale.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAiCatalog } from "./lib/ai-catalog.mjs";
import { renderLlms, renderLlmsFull } from "./lib/llms-text.mjs";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function llmsOutputs(catalog = buildAiCatalog()) {
  return {
    "llms.txt": renderLlms(catalog),
    "llms-full.txt": renderLlmsFull(catalog),
  };
}

function main() {
  const check = process.argv.includes("--check");
  const outputs = llmsOutputs();
  const stale = [];
  for (const [name, contents] of Object.entries(outputs)) {
    const outputPath = join(rootDir, name);
    if (check) {
      let current = "";
      try {
        current = readFileSync(outputPath, "utf8");
      } catch {
        current = "";
      }
      if (current !== contents) stale.push(name);
      continue;
    }
    writeFileSync(outputPath, contents);
    console.log(`Wrote ${name} (${Buffer.byteLength(contents)} bytes)`);
  }
  if (check && stale.length > 0) {
    console.error(`${stale.join(" and ")} ${stale.length === 1 ? "is" : "are"} stale.`);
    console.error("Run: node scripts/generate-llms.mjs");
    process.exit(1);
  }
  if (check) {
    console.log("llms.txt and llms-full.txt are current.");
  }
}

const entry = process.argv[1] ? resolve(process.argv[1]) : "";
if (entry === fileURLToPath(import.meta.url)) {
  main();
}
