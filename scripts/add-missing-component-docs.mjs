#!/usr/bin/env node
/**
 * Add documentation pages for all components missing from documentation/app.js
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Read custom-elements.json to get all components
const cem = JSON.parse(readFileSync(join(rootDir, "custom-elements.json"), "utf-8"));
const allComponents = cem.modules
  .flatMap((m) => m.declarations?.filter((d) => d.customElement) || [])
  .map((d) => ({ tag: d.tagName, name: d.name, summary: d.summary || "" }))
  .filter((c) => c.tag && c.tag.startsWith("rowan-"))
  .sort((a, b) => a.tag.localeCompare(b.tag));

// Read current documentation
const docPath = join(rootDir, "documentation/app.js");
let docContent = readFileSync(docPath, "utf-8");

// Find which components already have API references
const documented = [...docContent.matchAll(/renderApiReference\(["']([^"']+)["']\)/g)]
  .map((m) => m[1])
  .filter((v, i, a) => a.indexOf(v) === i);

const missing = allComponents.filter((c) => !documented.includes(c.tag));

console.log(`Total components: ${allComponents.length}`);
console.log(`Already documented: ${documented.length}`);
console.log(`Missing documentation: ${missing.length}`);

if (missing.length === 0) {
  console.log("All components are documented!");
  process.exit(0);
}

console.log("\nAdding pages for:");
missing.forEach((c) => console.log(`  - ${c.tag}`));

// Helper to generate a minimal component page
function generateComponentPage(component) {
  const { tag, summary } = component;
  const title = tag
    .replace("rowan-", "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return `  {
    id: "${tag.replace("rowan-", "")}",
    group: "Components",
    title: "Rowan ${title}",
    summary: "${summary || `${title} component for composable UI patterns.`}",
    tags: ["component"],
    keywords: ["${tag}", "${title.toLowerCase()}"],
    content: () => \`
      <section class="doc-section" data-doc-section id="${tag}-usage">
        <h2>${title} usage</h2>
        <p>${summary || `Use ${tag} to compose ${title.toLowerCase()} patterns in your application.`}</p>
        <div class="demo-row">
          <${tag}></${tag}>
        </div>
      </section>

      <section class="doc-section" data-doc-section id="${tag}-snippet">
        <h2>Basic example</h2>
        \${codeBlock(\`<${tag}></${tag}>\`, "html")}
      </section>

      \${renderApiReference("${tag}")}
    \`,
  }`;
}

// Find the last component page insertion point (before workflow pages)
// Look for the row-details-panel afterRender line, which is the last component page
const lastComponentMarker = "afterRender: setupRowDetailsPanelDemo,";
const lastComponentIndex = docContent.indexOf(lastComponentMarker);
if (lastComponentIndex === -1) {
  console.error("Could not find last component page marker");
  process.exit(1);
}

// Find the closing brace of that component page (the },  after the marker)
const componentSectionEnd = docContent.indexOf("  },", lastComponentIndex);
if (componentSectionEnd === -1) {
  console.error("Could not find component section end");
  process.exit(1);
}

// Generate new pages
const newPages = missing.map(generateComponentPage).join(",\n");

// Insert new pages
const before = docContent.slice(0, componentSectionEnd + 4);
const after = docContent.slice(componentSectionEnd + 4);
const updated = before + newPages + ",\n" + after;

// Write updated documentation
writeFileSync(docPath, updated, "utf-8");

console.log(`\n✓ Added ${missing.length} component pages to documentation/app.js`);
console.log("✓ All components now have API reference sections");
