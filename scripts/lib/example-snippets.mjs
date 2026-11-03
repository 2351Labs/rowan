/**
 * Pull HTML and React excerpts that contain Rowan tags out of docs and stories.
 * Page-sized templates are skipped; the caller ranks what remains per component.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const MAX_SNIPPET_LENGTH = 1600;

const ROOTS = ["src", "stories", "documentation", "packages/icons", "packages/maplibre"];

function walk(dir, files) {
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "documentation-static-check") continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".js")) continue;
    const repoRelative = fullPath.split("\\").join("/");
    const inDocumentation = repoRelative.includes("/documentation/");
    if (inDocumentation || entry.name.endsWith(".stories.js")) files.push(fullPath);
  }
}

function readString(source, start) {
  const quote = source[start];
  if (quote === "`") {
    const template = readTemplate(source, start);
    return template ? { end: template.end } : null;
  }
  if (quote !== "'" && quote !== '"') return null;
  let index = start + 1;
  while (index < source.length) {
    if (source[index] === "\\") {
      index += 2;
      continue;
    }
    if (source[index] === quote) return { end: index };
    index += 1;
  }
  return null;
}

function readBraces(source, openIndex) {
  let depth = 0;
  let index = openIndex;
  let inner = "";
  while (index < source.length) {
    const character = source[index];
    if (character === "'" || character === '"' || character === "`") {
      const literal = readString(source, index);
      if (!literal) return null;
      if (depth > 0) inner += source.slice(index, literal.end + 1);
      index = literal.end + 1;
      continue;
    }
    if (character === "{") {
      depth += 1;
      if (depth > 1) inner += character;
      index += 1;
      continue;
    }
    if (character === "}") {
      depth -= 1;
      if (depth === 0) return { inner, end: index };
      inner += character;
      index += 1;
      continue;
    }
    if (depth > 0) inner += character;
    index += 1;
  }
  return null;
}

function readTemplate(source, start) {
  let index = start + 1;
  let value = "";
  while (index < source.length) {
    const character = source[index];
    if (character === "\\") {
      value += source[index + 1] ?? "";
      index += 2;
      continue;
    }
    if (character === "`") return { value, end: index };
    if (character === "$" && source[index + 1] === "{") {
      const expression = readBraces(source, index + 1);
      if (!expression) return null;
      value += `\${${expression.inner}}`;
      index = expression.end + 1;
      continue;
    }
    value += character;
    index += 1;
  }
  return null;
}

function constNameBefore(source, index) {
  const prelude = source.slice(Math.max(0, index - 180), index);
  const match = prelude.match(/(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*$/);
  return match ? match[1] : "";
}

function frameworkFor(text) {
  if (
    /@rowan-[\w-]+\s*=|v-bind|v-on:|<script setup>|from "vue"|\(rowan-[\w-]+\)|from "@angular\/|on:rowan-/.test(
      text,
    )
  ) {
    return "";
  }
  if (
    /@rowan-ui\/(?:core|icons|maplibre)\/react\b|<Rowan[A-Z]|from "react"|onRowan[A-Z]|<[A-Za-z][^>]*\{/.test(
      text,
    )
  ) {
    return "react";
  }
  return "html";
}

function extractFromFile(rootDir, filePath) {
  const source = readFileSync(filePath, "utf8");
  const repoPath = relative(rootDir, filePath).split("\\").join("/");
  const snippets = [];
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] !== "`") continue;
    if (index > 0 && source[index - 1] === "\\") continue;
    const openIndex = index;
    const template = readTemplate(source, index);
    if (!template) break;
    index = template.end;
    const text = template.value.replace(/\r\n/g, "\n").trim();
    if (!text.includes("<rowan-")) continue;
    if (text.length > MAX_SNIPPET_LENGTH || text.length < 12) continue;
    if (text.includes("doc-section") || text.includes("data-doc-section")) continue;
    const framework = frameworkFor(text);
    if (!framework) continue;
    snippets.push({
      framework,
      source: repoPath,
      name: constNameBefore(source, openIndex),
      text,
    });
  }
  return snippets;
}

export function collectExampleSnippets(rootDir) {
  const files = [];
  for (const root of ROOTS) walk(join(rootDir, root), files);
  files.sort();
  const snippets = [];
  for (const filePath of files) snippets.push(...extractFromFile(rootDir, filePath));
  return snippets;
}

export function openingTags(text) {
  return [...text.matchAll(/<(rowan-[a-z0-9-]+)\b/g)].map((match) => match[1]);
}

export function nameMentionsSlug(name, slug) {
  if (!name || !slug) return false;
  const haystack = name.toLowerCase().replace(/_/g, "-");
  return new RegExp(`(?:^|-)${slug}(?:-|$)`).test(haystack);
}

export function storyFileMatches(source, slug) {
  return source.endsWith(`/${slug}.stories.js`);
}

/**
 * Keep excerpts that are actually about this component: the only tag in the
 * snippet, a story file for the component, or a named constant for its slug.
 */
export function excerptsForComponent(snippets, component) {
  const ranked = [];
  for (const excerpt of snippets) {
    const tags = openingTags(excerpt.text);
    if (!tags.includes(component.tagName)) continue;
    const unique = new Set(tags);
    const only = unique.size === 1;
    const named = nameMentionsSlug(excerpt.name, component.slug);
    const fileMatch = storyFileMatches(excerpt.source, component.slug);
    if (!only && !named && !fileMatch) continue;

    let score = 0;
    if (only) score += 30;
    if (named) score += 14;
    if (fileMatch) score += 16;
    if (excerpt.text.includes(component.importPath)) score += 8;
    if (excerpt.source.endsWith(".stories.js")) score += 4;
    if (excerpt.source.startsWith("documentation/")) score += 3;
    if (excerpt.text.length <= 1200) score += 2;
    ranked.push({ excerpt, score });
  }

  ranked.sort(
    (left, right) =>
      right.score - left.score ||
      left.excerpt.source.localeCompare(right.excerpt.source) ||
      left.excerpt.name.localeCompare(right.excerpt.name) ||
      left.excerpt.text.localeCompare(right.excerpt.text),
  );

  const chosen = [];
  const seen = new Set();
  let htmlCount = 0;
  let reactCount = 0;
  for (const item of ranked) {
    const key = `${item.excerpt.framework}\n${item.excerpt.text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (item.excerpt.framework === "html" && htmlCount < 2) {
      chosen.push(item.excerpt);
      htmlCount += 1;
    } else if (item.excerpt.framework === "react" && reactCount < 1) {
      chosen.push(item.excerpt);
      reactCount += 1;
    }
    if (htmlCount >= 2 && reactCount >= 1) break;
  }
  return chosen;
}
