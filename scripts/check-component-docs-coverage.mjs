/**
 * Verify every public Rowan component has a generated API reference and that
 * the built documentation bundle includes that component.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

const MANIFESTS = [
  "custom-elements.json",
  "packages/icons/custom-elements.json",
  "packages/maplibre/custom-elements.json",
];

function manifestTags(path) {
  const manifest = JSON.parse(readFileSync(join(rootDir, path), "utf8"));
  const tags = [];
  for (const moduleEntry of manifest.modules || []) {
    for (const declaration of moduleEntry.declarations || []) {
      if (declaration.customElement === true && declaration.tagName?.startsWith("rowan-")) {
        tags.push(declaration.tagName);
      }
    }
  }
  return tags;
}

const requiredTags = [...new Set(MANIFESTS.flatMap(manifestTags))].sort();
const catalog = JSON.parse(
  readFileSync(join(rootDir, "documentation/generated/api-reference.json"), "utf8"),
);
const documented = new Set((catalog.components || []).map((component) => component.tagName));

console.log(`\nChecking API references for ${requiredTags.length} components...\n`);

const missing = [];
for (const tagName of requiredTags) {
  const component = (catalog.components || []).find((entry) => entry.tagName === tagName);
  const complete = Boolean(
    component?.description &&
      component.usage &&
      component.react?.component &&
      Array.isArray(component.attributes) &&
      Array.isArray(component.properties) &&
      Array.isArray(component.events) &&
      Array.isArray(component.slots) &&
      Array.isArray(component.cssParts) &&
      Array.isArray(component.cssProperties) &&
      Array.isArray(component.methods) &&
      Array.isArray(component.react.props) &&
      Array.isArray(component.react.eventProps),
  );
  if (!documented.has(tagName) || !complete) {
    missing.push(tagName);
    console.error(`❌ ${tagName}: API reference missing or incomplete`);
  } else {
    console.log(`✓ ${tagName}: API reference complete`);
  }
}

const docsDir = join(rootDir, "documentation/documentation-static-check");
if (!existsSync(docsDir)) {
  console.error("\n❌ Documentation build not found: " + docsDir);
  console.error("   Run: npm run documentation:build");
  process.exit(1);
}

const assetsDir = join(docsDir, "assets");
const jsFiles = existsSync(assetsDir) ? readdirSync(assetsDir).filter((file) => file.endsWith(".js")) : [];
const bundle = jsFiles.map((file) => readFileSync(join(assetsDir, file), "utf8")).join("\n");
if (!bundle.includes("data-api-tag=") || !bundle.includes("React event props")) {
  console.error("\n❌ Built documentation is missing the generated API reference renderer");
  process.exit(1);
}

const missingFromBuild = requiredTags.filter((tagName) => !bundle.includes(tagName));
for (const tagName of missingFromBuild) {
  console.error(`❌ ${tagName}: not present in the built documentation`);
}

console.log(
  `\n${requiredTags.length - missing.length}/${requiredTags.length} components have a complete API reference`,
);

if (missing.length > 0 || missingFromBuild.length > 0) {
  console.error("\n❌ Documentation coverage check failed");
  console.error("Regenerate with: node scripts/generate-api-reference.mjs");
  process.exit(1);
}

console.log("\n✓ All components have API reference documentation\n");
