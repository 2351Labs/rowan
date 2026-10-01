#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const tokenSourceFile = new URL("../src/tokens/tokens.css", import.meta.url);
const themes = ["light", "dark", "lagoon", "ember", "slate", "midnight"];
const tokenDeclaration = /(--rowan-[\w-]+)\s*:\s*([^;]+);/g;
const requiredSemanticTokens = [
  "--rowan-color-bg",
  "--rowan-color-fg",
  "--rowan-color-muted",
  "--rowan-color-accent",
  "--rowan-color-border",
  "--rowan-color-danger",
  "--rowan-color-success",
  "--rowan-color-warning",
  "--rowan-color-surface",
  "--rowan-color-accent-contrast",
];
const requiredComponentAliases = new Map([
  ["--rowan-button-bg", "--rowan-color-accent"],
  ["--rowan-button-fg", "--rowan-color-accent-contrast"],
  ["--rowan-button-secondary-bg", "--rowan-color-bg"],
  ["--rowan-button-secondary-fg", "--rowan-color-fg"],
  ["--rowan-field-bg", "--rowan-color-surface"],
  ["--rowan-field-fg", "--rowan-color-fg"],
  ["--rowan-field-border", "--rowan-color-border"],
  ["--rowan-card-bg", "--rowan-color-surface"],
  ["--rowan-card-border", "--rowan-color-border"],
  ["--rowan-dialog-bg", "--rowan-color-surface"],
  ["--rowan-calendar-fg", "--rowan-color-fg"],
  ["--rowan-calendar-muted", "--rowan-color-muted"],
  ["--rowan-calendar-accent", "--rowan-color-accent"],
  ["--rowan-calendar-accent-contrast", "--rowan-color-accent-contrast"],
  ["--rowan-segmented-control-active-fg", "--rowan-color-accent-contrast"],
]);
const contrastContracts = [
  ["--rowan-color-fg", "--rowan-color-bg", 4.5],
  ["--rowan-color-fg", "--rowan-color-surface", 4.5],
  ["--rowan-color-muted", "--rowan-color-bg", 4.5],
  ["--rowan-color-accent-contrast", "--rowan-color-accent", 4.5],
];

function parseTokens(source) {
  const tokens = new Map();

  for (const match of source.matchAll(tokenDeclaration)) {
    const [, name, value] = match;
    tokens.set(name, value.trim());
  }

  return tokens;
}

function resolveToken(name, tokens, ancestry = []) {
  if (ancestry.includes(name)) {
    throw new Error(`Circular token reference: ${[...ancestry, name].join(" -> ")}`);
  }

  const value = tokens.get(name);
  if (value === undefined) {
    throw new Error(`Missing token: ${name}`);
  }

  const reference = value.match(/^var\(\s*(--rowan-[\w-]+)\s*\)$/);
  return reference ? resolveToken(reference[1], tokens, [...ancestry, name]) : value;
}

function parseHexColor(value) {
  const match = value.match(/^#([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i);
  if (!match) {
    throw new Error(`Expected a resolved hex color, received ${value}.`);
  }

  const hex = match[1];
  const normalized = hex.length <= 4 ? [...hex].map((channel) => channel.repeat(2)).join("") : hex;
  return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16));
}

function relativeLuminance(value) {
  return parseHexColor(value)
    .map((channel) => channel / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
    .reduce(
      (luminance, channel, index) => luminance + channel * [0.2126, 0.7152, 0.0722][index],
      0,
    );
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (left, right) => right - left,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

const baseTokens = parseTokens(await readFile(tokenSourceFile, "utf8"));
const violations = [];

for (const theme of themes) {
  const themeFile = new URL(`../src/tokens/themes/${theme}.css`, import.meta.url);
  const themeTokens = parseTokens(await readFile(themeFile, "utf8"));
  const resolvedTokens = new Map(baseTokens);

  for (const [name, value] of themeTokens) {
    resolvedTokens.set(name, value);
  }

  for (const name of requiredSemanticTokens) {
    if (!themeTokens.has(name)) {
      violations.push(`${theme}: missing required semantic token ${name}`);
    }
  }

  for (const [name, reference] of requiredComponentAliases) {
    const expected = `var(${reference})`;
    if (themeTokens.get(name) !== expected) {
      violations.push(`${theme}: ${name} must alias ${expected}`);
    }
  }

  for (const [foregroundName, backgroundName, minimum] of contrastContracts) {
    try {
      const foreground = resolveToken(foregroundName, resolvedTokens);
      const background = resolveToken(backgroundName, resolvedTokens);
      const ratio = contrastRatio(foreground, background);

      if (ratio < minimum) {
        violations.push(
          `${theme}: ${foregroundName} on ${backgroundName} is ${ratio.toFixed(2)}:1; expected at least ${minimum}:1`,
        );
      }
    } catch (error) {
      violations.push(`${theme}: ${error.message}`);
    }
  }
}

if (violations.length > 0) {
  console.error(`Theme token validation failed (${violations.length} issue(s)):`);
  for (const violation of violations) {
    console.error(`  ${violation}`);
  }
  process.exitCode = 1;
} else {
  console.log(`theme tokens: ${themes.length} shipped themes satisfy aliases and contrast contracts`);
}