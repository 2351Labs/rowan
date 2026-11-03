import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { buildAiCatalog } from "../scripts/lib/ai-catalog.mjs";
import { renderLlms, renderLlmsFull } from "../scripts/lib/llms-text.mjs";
import { catalogText } from "../packages/mcp/scripts/build-catalog.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = buildAiCatalog();
const llms = renderLlms(catalog);
const full = renderLlmsFull(catalog);
const button = catalog.components.find((component) => component.tagName === "rowan-button");

describe("llms generator", () => {
  it("follows the llms.txt header shape", () => {
    assert.match(llms, /^# Rowan\n\n> Rowan /);
    assert.match(llms, /^## Install$/m);
    assert.match(llms, /^## Imports$/m);
    assert.match(llms, /^## Theming$/m);
    assert.match(llms, /^## Components$/m);
    assert.match(llms, /^## Optional$/m);
  });

  it("includes install, per-component imports, and theming basics", () => {
    assert.match(llms, /npm install @rowan-ui\/core@/);
    assert.match(llms, /@rowan-ui\/core\/button/);
    assert.match(llms, /@rowan-ui\/core\/react\/button/);
    assert.match(llms, /data-theme="dark"/);
    assert.match(llms, /--rowan-color-accent/);
    assert.match(llms, /@rowan-ui\/core\/tokens\/midnight/);
    assert.match(llms, /@rowan-ui\/icons\/element/);
    assert.match(llms, /@rowan-ui\/maplibre\/map/);
  });

  it("summarizes every component API", () => {
    const missing = [];
    for (const component of catalog.components) {
      const blockStart = llms.indexOf(`- [${component.tagName}](`);
      if (blockStart < 0) {
        missing.push(component.tagName);
        continue;
      }
      const block = llms.slice(blockStart, blockStart + 2500);
      for (const label of ["Attributes:", "Properties:", "Events:", "Slots:", "Parts:"]) {
        if (!block.includes(label)) missing.push(`${component.tagName} ${label}`);
      }
      if (!block.includes(component.importPath)) missing.push(`${component.tagName} import`);
    }
    assert.deepEqual(missing, []);
    assert.match(llms, /rowan-click/);
    assert.match(llms, /`disabled` boolean/);
    assert.match(llms, /`prefix`/);
    assert.match(llms, /`spinner`/);
    assert.equal(
      button.slots.some((slot) => slot.name.startsWith("- ")),
      false,
    );
  });

  it("puts descriptions, methods, and examples in llms-full.txt", () => {
    assert.ok(full.length > llms.length);
    assert.ok(full.includes(`## rowan-button\n\n${button.description}`));
    assert.match(full, /import "@rowan-ui\/core\/button"/);
    assert.match(full, /### Primitive tokens/);
    assert.match(full, /### Component tokens/);
    assert.match(full, /Excerpt from documentation\/app\.js \(BUTTON_SNIPPET\)/);
  });

  it("matches the committed llms files and MCP catalog", () => {
    assert.equal(readFileSync(join(rootDir, "llms.txt"), "utf8"), llms);
    assert.equal(readFileSync(join(rootDir, "llms-full.txt"), "utf8"), full);
    assert.equal(
      readFileSync(join(rootDir, "packages/mcp/data/catalog.json"), "utf8"),
      catalogText(catalog),
    );
  });

  it("is listed on the core package and the docs build copies both files", () => {
    const core = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8"));
    assert.ok(core.files.includes("llms.txt"));
    assert.ok(core.files.includes("llms-full.txt"));
    const vite = readFileSync(join(rootDir, "documentation/vite.build.mjs"), "utf8");
    assert.match(vite, /llms\.txt/);
    assert.match(vite, /llms-full\.txt/);
  });
});
