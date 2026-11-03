/**
 * Bundle the Rowan catalog into packages/mcp/data/catalog.json.
 * The published MCP server reads this file and does not fetch anything.
 * `--check` fails when the committed catalog is stale.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAiCatalog } from "../../../scripts/lib/ai-catalog.mjs";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(packageDir, "data/catalog.json");

export function catalogText(catalog = buildAiCatalog()) {
  return `${JSON.stringify(catalog, null, 2)}\n`;
}

function main() {
  const check = process.argv.includes("--check");
  const next = catalogText();
  if (check) {
    let current = "";
    try {
      current = readFileSync(outputPath, "utf8");
    } catch {
      current = "";
    }
    if (current !== next) {
      console.error("packages/mcp/data/catalog.json is stale.");
      console.error("Run: node packages/mcp/scripts/build-catalog.mjs");
      process.exit(1);
    }
    console.log("MCP catalog is current.");
    return;
  }
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, next);
  console.log(`Wrote ${outputPath} (${Buffer.byteLength(next)} bytes)`);
}

const entry = process.argv[1] ? resolve(process.argv[1]) : "";
if (entry === fileURLToPath(import.meta.url)) {
  main();
}
