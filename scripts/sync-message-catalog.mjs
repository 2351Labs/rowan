import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";

const sourceDirectory = fileURLToPath(new URL("../src/", import.meta.url));
const catalogFile = fileURLToPath(new URL("../documentation/message-catalog.js", import.meta.url));
const shouldCheck = process.argv.includes("--check");
const START_MARKER = "const DEFAULT_MESSAGES = Object.freeze({";

async function jsFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await jsFiles(path)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".js") && !entry.name.endsWith(".test.js")) {
      files.push(path);
    }
  }

  return files;
}

function extractObjectLiteral(source, start) {
  const open = source.indexOf("{", start);
  if (open === -1) return null;

  let depth = 0;
  let quote = null;

  for (let index = open; index < source.length; index += 1) {
    const character = source[index];
    const previous = index > 0 ? source[index - 1] : "";

    if (quote) {
      if (character === quote && previous !== "\\") quote = null;
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }

    if (character === "{") depth += 1;
    if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open, index + 1);
    }
  }

  return null;
}

function extractKeys(objectLiteral) {
  return [...objectLiteral.matchAll(/(?:[{,])\s*([A-Za-z_][\w]*)\s*:/g)].map((match) => match[1]);
}

function extractTag(source) {
  return source.match(/@tag\s+(rowan-[\w-]+)/)?.[1] ?? null;
}

function moduleId(filePath) {
  return relative(sourceDirectory, dirname(filePath)).split(sep)[0];
}

const entries = [];

for (const filePath of await jsFiles(sourceDirectory)) {
  const source = await readFile(filePath, "utf8");
  const start = source.indexOf(START_MARKER);
  if (start === -1) continue;

  const tag = extractTag(source);
  if (!tag) continue;

  const objectLiteral = extractObjectLiteral(source, start);
  if (!objectLiteral) {
    throw new Error(`Could not parse DEFAULT_MESSAGES in ${relative(sourceDirectory, filePath)}.`);
  }

  const keys = [...new Set(extractKeys(objectLiteral))].sort((left, right) =>
    left.localeCompare(right),
  );
  entries.push({
    tag,
    module: moduleId(filePath),
    keys,
  });
}

entries.sort((left, right) => left.tag.localeCompare(right.tag));

const rendered = [
  "// Generated from src/** DEFAULT_MESSAGES by scripts/sync-message-catalog.mjs. Do not edit directly.",
  "export const ROWAN_MESSAGE_CATALOG = [",
  ...entries.flatMap((entry) => [
    "  {",
    `    tag: ${JSON.stringify(entry.tag)},`,
    `    module: ${JSON.stringify(entry.module)},`,
    `    keys: ${JSON.stringify(entry.keys)},`,
    "  },",
  ]),
  "];",
  "",
].join("\n");

const prettierConfig = (await resolveConfig(catalogFile)) ?? {};
const expected = await format(rendered, {
  ...prettierConfig,
  filepath: catalogFile,
  parser: "babel",
});

if (shouldCheck) {
  const current = await readFile(catalogFile, "utf8").catch(() => "");
  if (current !== expected) {
    console.error("documentation/message-catalog.js is out of sync with DEFAULT_MESSAGES.");
    process.exitCode = 1;
  }
} else {
  await writeFile(catalogFile, expected);
}
