#!/usr/bin/env node
/**
 * Embed each component stylesheet in a JS module.
 *
 * Authors edit the .css file. This script minifies it into a sibling
 * `*.styles.js` module and points the component at `static styles`.
 * Bundlers then ship the CSS inside the JS graph, so a dev prebundle cannot
 * drop it by rewriting `new URL("./x.css", import.meta.url)`.
 *
 * Chart `@import`s are already inlined by scripts/inline-chart-styles.mjs.
 * Run that first. The .css files stay in the package for direct imports.
 *
 *   node scripts/sync-component-styles.mjs
 *   node scripts/sync-component-styles.mjs --check
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const check = process.argv.includes("--check");
const styleUrlPattern =
  /static styleUrl = new URL\("(\.\/[^"]+\.css)", import\.meta\.url\)\.href;/;

function minifyCss(css) {
  let out = css.replace(/\/\*[\s\S]*?\*\//g, "");
  out = out.replace(/\s+/g, " ").trim();
  // Keep the space before a colon so `.toolbar ::slotted(*)` stays a descendant.
  // Leave + alone. calc() requires whitespace around it, and so does the
  // sibling combinator when it sits next to a number.
  out = out.replace(/([{:;,>~])\s+/g, "$1");
  out = out.replace(/\s+([};,>~])/g, "$1");
  out = out.replace(/\s*\{\s*/g, "{");
  out = out.replace(/;}/g, "}");
  out = out.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3\b/g, "#$1$2$3");
  out = out.replace(/:0(px|em|rem|%)/g, ":0");
  out = out.replace(/\b0\.(?=\d)/g, ".");
  return out.trim();
}

// Button's long var() fallbacks repeat the token declarations already applied
// on the shadow root. Dropping only the long ones keeps short colors and
// leaves enough room in the form-controls size budget.
function shortenLongFallbacks(css) {
  let previous = "";
  let current = css;
  const pattern = /var\((--[a-z0-9-]+)\s*,\s*((?:[^()]|\([^()]*\))*)\)/g;
  while (current !== previous) {
    previous = current;
    current = current.replace(pattern, (match, name, fallback) =>
      fallback.trim().length > 18 ? `var(${name})` : match,
    );
  }
  return current;
}

function stylesModule(cssPath) {
  let css = readFileSync(cssPath, "utf8");
  if (cssPath.endsWith(`${join("button", "button.css")}`)) css = shortenLongFallbacks(css);
  css = minifyCss(css);
  return `// Generated from ${relative(rootDir, cssPath)}. Edit that file, then run: node scripts/sync-component-styles.mjs\nexport default ${JSON.stringify(css)};\n`;
}

function walk(dir, files) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name.startsWith(".")) continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path, files);
    else if (name.endsWith(".js") && !name.endsWith(".styles.js") && !name.endsWith(".test.js")) {
      files.push(path);
    }
  }
}

function hoistStyleImport(source, importLine) {
  const without = source.replace(`${importLine}\n`, "");
  const imports = [...without.matchAll(/^import .*;\n/gm)];
  if (imports.length === 0) return `${importLine}\n${without}`;
  const last = imports[imports.length - 1];
  const at = last.index + last[0].length;
  return `${without.slice(0, at)}${importLine}\n${without.slice(at)}`;
}

function expectedSource(source, cssSpecifier) {
  const base = cssSpecifier.slice(2, -4);
  const importLine = `import componentStyles from "./${base}.styles.js";`;
  let next = source.replace(styleUrlPattern, "static styles = componentStyles;");
  if (!next.includes(importLine)) next = hoistStyleImport(next, importLine);
  else if (!next.startsWith(importLine) && !next.includes(`\n${importLine}\n`)) {
    next = hoistStyleImport(next, importLine);
  }
  return next;
}

const extraCss = [
  "packages/icons/src/element.css",
  "packages/maplibre/src/map/map.css",
  "packages/maplibre/src/map/maplibre-gl.css",
  "src/table/table-columns.css",
];

const jsFiles = [];
walk(join(rootDir, "src"), jsFiles);
walk(join(rootDir, "packages"), jsFiles);

const problems = [];
const pairs = new Map();

function addPair(cssPath) {
  const stylesPath = cssPath.replace(/\.css$/, ".styles.js");
  pairs.set(stylesPath, cssPath);
}

for (const jsPath of jsFiles) {
  const source = readFileSync(jsPath, "utf8");
  const match = styleUrlPattern.exec(source);
  if (match) {
    const cssPath = join(dirname(jsPath), match[1]);
    addPair(cssPath);
    const nextSource = expectedSource(source, match[1]);
    if (check) {
      if (source !== nextSource) problems.push(relative(rootDir, jsPath));
    } else if (source !== nextSource) {
      writeFileSync(jsPath, nextSource);
    }
  }

  const embedded = source.matchAll(/import componentStyles from "(\.\/[^"]+\.styles\.js)";/g);
  for (const embeddedMatch of embedded) {
    addPair(join(dirname(jsPath), embeddedMatch[1].replace(/\.styles\.js$/, ".css")));
  }
}

for (const cssPath of extraCss) addPair(join(rootDir, cssPath));

for (const [stylesPath, cssPath] of pairs) {
  const stylesSource = stylesModule(cssPath);
  let current = "";
  try {
    current = readFileSync(stylesPath, "utf8");
  } catch {
    current = "";
  }
  if (current !== stylesSource) {
    if (check) problems.push(relative(rootDir, stylesPath));
    else writeFileSync(stylesPath, stylesSource);
  }
}

if (check && problems.length > 0) {
  console.error("Component style modules are out of date:\n");
  for (const path of problems) console.error(`  ${path}`);
  console.error("\nRun: node scripts/sync-component-styles.mjs\n");
  process.exit(1);
}

if (check) {
  console.log("component styles: JS modules match the CSS sources");
} else {
  console.log("component styles: embedded stylesheets into JS modules");
}
