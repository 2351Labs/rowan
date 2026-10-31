#!/usr/bin/env node
/**
 * Keep the MapLibre stylesheet next to rowan-maplibre-map.
 * A shadow <link> needs a real URL. `import.meta.resolve` stays a bare
 * specifier under Vite 5, so the component loads this file instead.
 *
 *   node scripts/sync-maplibre-css.mjs
 *   node scripts/sync-maplibre-css.mjs --check
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const destination = join(rootDir, "packages/maplibre/src/map/maplibre-gl.css");
const check = process.argv.includes("--check");
const start = "/* rowan-vendor:maplibre-gl";
const end = "rowan-vendor:maplibre-gl:end */";

const upstream = readFileSync(require.resolve("maplibre-gl/dist/maplibre-gl.css"), "utf8");
const license = readFileSync(require.resolve("maplibre-gl/LICENSE.txt"), "utf8").trim();
const expected = `${start}\n${license}\n${end}\n${upstream.endsWith("\n") ? upstream : `${upstream}\n`}`;

const current = existsSync(destination) ? readFileSync(destination, "utf8") : "";

if (current === expected) {
  if (check) console.log("maplibre css: vendored stylesheet matches maplibre-gl");
  else console.log("maplibre css: already current");
} else if (check) {
  console.error("Vendored MapLibre CSS does not match maplibre-gl/dist/maplibre-gl.css.");
  console.error("Run: node scripts/sync-maplibre-css.mjs\n");
  process.exit(1);
} else {
  writeFileSync(destination, expected);
  console.log("maplibre css: updated packages/maplibre/src/map/maplibre-gl.css");
}
