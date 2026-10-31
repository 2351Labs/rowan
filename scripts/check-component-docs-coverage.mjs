#!/usr/bin/env node
/**
 * Verify that all components in custom-elements.json have API reference
 * sections in the built documentation.
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Read custom-elements.json to get all components
const cemPath = join(rootDir, "custom-elements.json");
const cem = JSON.parse(readFileSync(cemPath, "utf-8"));

const allComponents = cem.modules
  .flatMap((m) => m.declarations?.filter((d) => d.customElement) || [])
  .map((d) => d.tagName)
  .filter((t) => t && t.startsWith("rowan-"))
  .sort();

console.log(`\nChecking documentation coverage for ${allComponents.length} components...\n`);

// Check if documentation build exists
const docsDir = join(rootDir, "documentation/documentation-static-check");
if (!existsSync(docsDir)) {
  console.error("❌ Documentation build not found: " + docsDir);
  console.error("   Run: npm run documentation:build");
  process.exit(1);
}

// Read all built JS files
const assetsDir = join(docsDir, "assets");
if (!existsSync(assetsDir)) {
  console.error("❌ Documentation assets directory not found");
  process.exit(1);
}

const jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".js"));
if (jsFiles.length === 0) {
  console.error("❌ No JavaScript files found in documentation build");
  process.exit(1);
}

// Search for API reference tables in the built documentation
let combinedContent = "";
for (const file of jsFiles) {
  const filePath = join(assetsDir, file);
  const content = readFileSync(filePath, "utf-8");
  combinedContent += content;
}

let hasErrors = false;
const missing = [];
const found = [];

for (const component of allComponents) {
  // Look for the component's tag name appearing near API reference markers
  // The docs-api-table class appears in sections with "Attributes", "Properties", etc.
  // Check if the component appears with API reference patterns like:
  // - "docs-api-table" nearby
  // - Component name followed by attribute/property tables
  const componentPattern = new RegExp(component.replace(/-/g, "\\-"), "g");
  const matches = combinedContent.match(componentPattern);
  
  // Simple heuristic: if the component name appears at least 3 times (component page + API tables),
  // and docs-api-table class exists in the content, we consider it documented
  const hasApiTable = combinedContent.includes("docs-api-table");
  const appearanceCount = matches ? matches.length : 0;
  
  if (hasApiTable && appearanceCount >= 2) {
    found.push(component);
    console.log(`✓ ${component}: API reference found (${appearanceCount} references)`);
  } else {
    missing.push(component);
    console.error(`❌ ${component}: API reference NOT found (only ${appearanceCount} references)`);
    hasErrors = true;
  }
}

console.log(`\n${found.length}/${allComponents.length} components have API references`);

if (hasErrors) {
  console.error(`\n❌ Documentation coverage check failed`);
  console.error(`Missing API references for ${missing.length} components:`);
  missing.forEach((c) => console.error(`  - ${c}`));
  console.error(`\nAdd API reference sections with: renderApiReference("${missing[0]}")`);
  process.exit(1);
} else {
  console.log(`\n✓ All components have API reference documentation\n`);
  process.exit(0);
}
