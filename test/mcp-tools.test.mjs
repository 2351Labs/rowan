import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { createRowanServer } from "../packages/mcp/src/server.js";
import {
  TOOL_NAMES,
  getComponent,
  getExample,
  getTheming,
  listComponents,
  loadCatalog,
  resolveComponent,
  searchComponents,
} from "../packages/mcp/src/tools.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = loadCatalog();

describe("MCP tool handlers", () => {
  it("loads the bundled catalog and resolves button by tag, slug, class, and import", () => {
    assert.equal(catalog.components.length > 0, true);
    assert.equal(catalog.mcpVersion, "0.23.2");
    for (const query of ["rowan-button", "button", "RowanButton", "@rowan-ui/core/button"]) {
      const resolved = resolveComponent(catalog, query);
      assert.equal(resolved.status, "one", query);
      assert.equal(resolved.component.tagName, "rowan-button");
    }
  });

  it("lists core, icon, and map components with import subpaths", () => {
    const listed = listComponents(catalog);
    assert.equal(listed.isError, undefined);
    assert.match(listed.text, new RegExp(`${catalog.components.length} Rowan components`));
    assert.match(listed.text, /rowan-button \(`@rowan-ui\/core\/button`\)/);
    assert.match(listed.text, /rowan-icon \(`@rowan-ui\/icons\/element`\)/);
    assert.match(listed.text, /rowan-maplibre-map \(`@rowan-ui\/maplibre\/map`\)/);
  });

  it("returns the full button API", () => {
    const result = getComponent(catalog, { component: "button" });
    assert.equal(result.isError, undefined);
    for (const heading of [
      "## Attributes",
      "## Properties",
      "## Events",
      "## Slots",
      "## CSS parts",
      "## CSS properties",
      "## Methods",
    ]) {
      assert.match(result.text, new RegExp(heading));
    }
    assert.match(result.text, /`disabled`/);
    assert.match(result.text, /`rowan-click`/);
    assert.match(result.text, /`prefix`/);
    assert.match(result.text, /`spinner`/);
    assert.match(result.text, /@rowan-ui\/core\/react\/button/);
  });

  it("rejects an unknown component and an empty search", () => {
    const missing = getComponent(catalog, { component: "not-a-rowan-widget" });
    assert.equal(missing.isError, true);
    assert.match(missing.text, /No single Rowan component/);
    const empty = searchComponents(catalog, { query: "   " });
    assert.equal(empty.isError, true);
  });

  it("ranks rowan-button first for a button query", () => {
    const result = searchComponents(catalog, { query: "button", limit: 5 });
    assert.equal(result.isError, undefined);
    assert.match(result.text, /^- rowan-button \(/m);
  });

  it("returns working HTML and React examples plus docs and story excerpts", () => {
    const both = getExample(catalog, { component: "rowan-button" });
    assert.match(both.text, /import "@rowan-ui\/core\/button"/);
    assert.match(both.text, /<rowan-button/);
    assert.match(both.text, /RowanButton/);
    assert.match(both.text, /@rowan-ui\/core\/react\/button/);
    assert.match(both.text, /documentation\/app\.js \(BUTTON_SNIPPET\)/);

    const html = getExample(catalog, { component: "button", framework: "html" });
    assert.match(html.text, /<!doctype html>/);
    assert.doesNotMatch(html.text, /export function Example/);

    const react = getExample(catalog, { component: "button", framework: "react" });
    assert.match(react.text, /export function Example/);
    assert.doesNotMatch(react.text, /<!doctype html>/);

    const iconButton = getExample(catalog, { component: "icon-button" });
    assert.match(iconButton.text, /src\/icon-button\/icon-button\.stories\.js/);
    assert.match(iconButton.text, /@rowan-ui\/core\/icon-button/);

    const badFramework = getExample(catalog, { component: "button", framework: "vue" });
    assert.equal(badFramework.isError, true);
  });

  it("returns semantic tokens and a named theme", () => {
    const overview = getTheming(catalog);
    assert.match(overview.text, /--rowan-color-accent/);
    assert.match(overview.text, /data-theme="light"/);
    assert.match(overview.text, /@rowan-ui\/core\/tokens\/dark/);
    assert.match(overview.text, /data-rowan-charts="vibrant"/);
    assert.doesNotMatch(overview.text, /## Primitive tokens/);

    const midnight = getTheming(catalog, { theme: "midnight" });
    assert.match(midnight.text, /## midnight/);
    assert.match(midnight.text, /@rowan-ui\/core\/tokens\/midnight/);

    const missing = getTheming(catalog, { theme: "neon" });
    assert.equal(missing.isError, true);
    assert.match(missing.text, /light, dark, lagoon, ember, slate, midnight/);
  });

  it("registers the five read-only tools on the official SDK server", () => {
    const server = createRowanServer(catalog);
    const registered = server._registeredTools;
    assert.deepEqual(Object.keys(registered).sort(), [...TOOL_NAMES].sort());
    for (const name of TOOL_NAMES) {
      assert.equal(registered[name].annotations?.readOnlyHint, true);
      assert.equal(registered[name].annotations?.openWorldHint, false);
    }
  });

  it("does not reach the network from the server sources", () => {
    const sources = ["src/index.js", "src/server.js", "src/tools.js"]
      .map((file) => readFileSync(join(rootDir, "packages/mcp", file), "utf8"))
      .join("\n");
    assert.doesNotMatch(sources, /\bfetch\s*\(|node:https|node:http|XMLHttpRequest|https\.request/);
    const pkg = JSON.parse(readFileSync(join(rootDir, "packages/mcp/package.json"), "utf8"));
    assert.equal(pkg.version, "0.23.2");
    assert.equal(pkg.peerDependencies["@rowan-ui/core"], "^0.23.0");
    assert.equal(pkg.dependencies["@modelcontextprotocol/sdk"] != null, true);
    assert.ok(pkg.files.includes("data/catalog.json"));
  });
});
