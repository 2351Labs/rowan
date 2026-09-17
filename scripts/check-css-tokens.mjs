#!/usr/bin/env node
// Enforces F-02: component CSS may only reach a literal colour through a var() fallback.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const COLOUR_PROPERTIES =
  /^\s*(background|background-color|color|border|border-color|border-top|border-right|border-bottom|border-left|outline|outline-color|fill|stroke|box-shadow|text-shadow)\s*:/;
const HEX = /#[0-9a-fA-F]{3,8}\b/;

/** Removes every var() expression, innermost first, so only unguarded literals remain. */
function stripVarFallbacks(value) {
  let previous;
  let current = value;

  do {
    previous = current;
    current = current.replace(/var\([^()]*\)/g, "");
  } while (current !== previous);

  return current;
}

async function cssFilesUnder(root) {
  const files = [];
  const entries = await readdir(root, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(root, entry.name).replaceAll("\\", "/");

    if (entry.isDirectory()) {
      if (fullPath === "src/tokens") continue;
      files.push(...(await cssFilesUnder(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".css")) files.push(fullPath);
  }

  return files;
}

const violations = [];

for (const file of await cssFilesUnder("src")) {
  const source = await readFile(file, "utf8");
  const lines = source.split("\n");

  for (const [index, line] of lines.entries()) {
    if (!COLOUR_PROPERTIES.test(line)) continue;
    if (!HEX.test(stripVarFallbacks(line))) continue;

    violations.push(`${file}:${index + 1}  ${line.trim()}`);
  }
}

if (violations.length > 0) {
  console.error(
    `Found ${violations.length} unthemeable colour literal(s). Route each through a component token, for example:\n` +
      `  background: var(--rowan-switch-thumb-bg, var(--rowan-color-muted));\n`,
  );
  for (const violation of violations) console.error(`  ${violation}`);
  process.exit(1);
}

console.log("css tokens: no unthemeable colour literals");
