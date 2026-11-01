#!/usr/bin/env node
/**
 * Storybook is published at https://2351labs.github.io/rowan/storybook/.
 * The preview build must request scripts from /rowan/storybook/assets/.
 * A Vite base of /rowan/ requests /rowan/assets/ and the deployed Storybook never loads.
 * Manager URLs may be relative; resolved against the storybook page they still
 * have to land under /rowan/storybook/ and exist in the build output.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const storybookDir = join(rootDir, "storybook-static");
const PAGES_ORIGIN = "https://2351labs.github.io";
const PAGES_PREFIX = "/rowan/storybook/";
const STORYBOOK_PAGE = `${PAGES_ORIGIN}${PAGES_PREFIX}index.html`;
const IFRAME_PAGE = `${PAGES_ORIGIN}${PAGES_PREFIX}iframe.html`;
const TEXT_EXTENSIONS = new Set([".html", ".js", ".css"]);

const failures = [];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, files);
    else files.push(path);
  }
  return files;
}

function note(message) {
  failures.push(message);
  console.error(`❌ ${message}`);
}

function fileForPagesPath(pathname) {
  if (!pathname.startsWith(PAGES_PREFIX)) {
    return { ok: false, reason: `resolves to ${pathname}, outside ${PAGES_PREFIX}` };
  }

  const relative = decodeURIComponent(pathname.slice(PAGES_PREFIX.length));
  const assetPath = normalize(join(storybookDir, relative));
  if (assetPath !== storybookDir && !assetPath.startsWith(`${storybookDir}/`)) {
    return { ok: false, reason: `escapes the Storybook output (${pathname})` };
  }
  if (!existsSync(assetPath) || !statSync(assetPath).isFile()) {
    return { ok: false, reason: `missing file for ${pathname}` };
  }
  return { ok: true };
}

function localPath(pageUrl, raw) {
  if (
    !raw ||
    raw.includes("${") ||
    raw.includes(" ") ||
    raw.startsWith("data:") ||
    raw.startsWith("#") ||
    raw.startsWith("mailto:") ||
    raw.startsWith("javascript:")
  ) {
    return null;
  }

  let parsed;
  try {
    parsed = new URL(raw, pageUrl);
  } catch {
    return null;
  }
  if (parsed.origin !== PAGES_ORIGIN) return null;
  return parsed.pathname;
}

function checkUrl(label, pageUrl, raw) {
  const pathname = localPath(pageUrl, raw);
  if (!pathname) return false;
  const result = fileForPagesPath(pathname);
  if (!result.ok) note(`${label} asset ${raw} ${result.reason}`);
  return true;
}

if (!existsSync(join(storybookDir, "index.html")) || !existsSync(join(storybookDir, "iframe.html"))) {
  console.error(
    "Storybook not built. Run `npm run build-storybook` with STORYBOOK_BASE=/rowan/storybook/.",
  );
  process.exit(1);
}

const indexHtml = readFileSync(join(storybookDir, "index.html"), "utf8");
const iframeHtml = readFileSync(join(storybookDir, "iframe.html"), "utf8");

const htmlUrls = (html) => [
  ...[...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)].map((match) => match[1]),
  ...[...html.matchAll(/\bimport\s+["']([^"']+)["']/g)].map((match) => match[1]),
  ...[...html.matchAll(/\burl\(\s*["']?([^"')]+)["']?\s*\)/g)].map((match) => match[1]),
];

let checked = 0;
for (const url of htmlUrls(indexHtml)) {
  if (checkUrl("index.html", STORYBOOK_PAGE, url)) checked += 1;
}
for (const url of htmlUrls(iframeHtml)) {
  if (checkUrl("iframe.html", IFRAME_PAGE, url)) checked += 1;
}

if (!iframeHtml.includes(`${PAGES_PREFIX}assets/`)) {
  note(
    `iframe.html does not reference ${PAGES_PREFIX}assets/. Rebuild with STORYBOOK_BASE=${PAGES_PREFIX}`,
  );
}

for (const file of walk(storybookDir)) {
  if (!TEXT_EXTENSIONS.has(extname(file))) continue;
  const stat = statSync(file);
  if (stat.size > 8_000_000) continue;
  const text = readFileSync(file, "utf8");
  const relative = file.slice(storybookDir.length + 1);

  if (text.includes("/rowan/assets/")) {
    note(`${relative} references /rowan/assets/ (hosted under ${PAGES_PREFIX})`);
  }

  if (!relative.endsWith(".js") && !relative.endsWith(".css")) continue;
  for (const match of text.matchAll(/new URL\(\s*["'](\/[^"']+)["']/g)) {
    checked += 1;
    const result = fileForPagesPath(match[1].split(/[?#]/)[0]);
    if (!result.ok) note(`${relative} ${match[1]} ${result.reason}`);
  }
}

if (failures.length > 0) {
  console.error(
    `\n❌ Storybook Pages base check failed (${failures.length} problem${failures.length === 1 ? "" : "s"})\n`,
  );
  process.exit(1);
}

console.log(
  `✓ Storybook asset URLs resolve under ${PAGES_PREFIX} (${checked} URL${checked === 1 ? "" : "s"} checked)\n`,
);
