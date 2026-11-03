#!/usr/bin/env node
/**
 * Fail when a public component has no docs page and no curated example.
 * This script used to inject `<rowan-card></rowan-card>` placeholders.
 * Add a real entry to documentation/component-examples.js instead.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPONENT_EXAMPLE_BY_TAG } from "../documentation/component-examples.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const cem = JSON.parse(readFileSync(join(rootDir, "custom-elements.json"), "utf8"));
const appSource = readFileSync(join(rootDir, "documentation/app.js"), "utf8");

const tags = cem.modules
  .flatMap((moduleEntry) => moduleEntry.declarations?.filter((declaration) => declaration.customElement) || [])
  .map((declaration) => declaration.tagName)
  .filter((tag) => tag?.startsWith("rowan-"));

const missing = [];
for (const tag of tags) {
  const curated = COMPONENT_EXAMPLE_BY_TAG.has(tag);
  const referenced = curated || appSource.includes(tag);
  const bareDemo = appSource.includes(`<${tag}></${tag}>`);
  if (bareDemo) missing.push(`${tag}: app.js still contains an empty <${tag}></${tag}> demo`);
  if (!referenced) missing.push(`${tag}: add a curated example before generating a docs page`);
}

if (appSource.includes("compose ") && appSource.includes("patterns in your application")) {
  missing.push("app.js still contains generated placeholder copy");
}

if (missing.length > 0) {
  console.error("Refusing to emit empty component docs:");
  for (const problem of missing) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`Component docs examples cover ${tags.length} core elements with no empty placeholders.`);
