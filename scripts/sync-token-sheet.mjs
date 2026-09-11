import { readFileSync, writeFileSync } from "node:fs";

const sourceFile = new URL("../src/tokens/tokens.css", import.meta.url);
const sheetFile = new URL("../src/tokens/sheet.js", import.meta.url);
const shouldCheck = process.argv.includes("--check");
const TOKEN_DECLARATION = /(--rowan-[\w-]+)\s*:\s*([^;]+);/g;
const COMPONENT_LAYER_MARKER = "/* Component layer */";

function parseTokenDeclarations(source) {
  const declarations = new Map();

  for (const match of source.matchAll(TOKEN_DECLARATION)) {
    const [, name, value] = match;
    declarations.set(name, value.trim());
  }

  return declarations;
}

function resolveTokenValue(name, declarations, ancestry = []) {
  if (ancestry.includes(name)) {
    throw new Error(`Circular token reference: ${[...ancestry, name].join(" -> ")}`);
  }

  const value = declarations.get(name);
  if (value === undefined) {
    throw new Error(`Unknown token reference: ${name}`);
  }

  return value.replace(/var\(\s*(--rowan-[\w-]+)\s*\)/g, (_match, reference) =>
    resolveTokenValue(reference, declarations, [...ancestry, name]),
  );
}

function createTokenPropertyDefinitions(source) {
  const componentLayerIndex = source.indexOf(COMPONENT_LAYER_MARKER);
  if (componentLayerIndex === -1) {
    throw new Error("The component token layer is missing from src/tokens/tokens.css.");
  }

  const declarations = parseTokenDeclarations(source.slice(0, componentLayerIndex));

  return [...declarations.keys()].map((name) => ({
    name,
    syntax: "*",
    inherits: true,
    initialValue: resolveTokenValue(name, declarations),
  }));
}

function createUnregisteredTokenNames(source, propertyDefinitions) {
  const registeredNames = new Set(propertyDefinitions.map(({ name }) => name));

  return [...parseTokenDeclarations(source).keys()].filter((name) => !registeredNames.has(name));
}

function extractComponentTokenCss(source) {
  const componentLayerIndex = source.indexOf(COMPONENT_LAYER_MARKER);
  const closingBraceIndex = source.lastIndexOf("}");

  if (componentLayerIndex === -1 || closingBraceIndex === -1) {
    throw new Error("Unable to extract the component token layer from src/tokens/tokens.css.");
  }

  return `:host {\n${source.slice(componentLayerIndex, closingBraceIndex)}\n}`;
}

function formatStringLiteral(value) {
  if (!value.includes('"') || value.includes("'")) {
    return JSON.stringify(value);
  }

  const escapedValue = value.replace(/[\\'\b\f\n\r\t\u2028\u2029]/g, (character) => {
    const escapes = {
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "'": "\\'",
      "\\": "\\\\",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029",
    };

    return escapes[character];
  });

  return `'${escapedValue}'`;
}

function formatPropertyDefinitions(definitions) {
  return [
    "[",
    ...definitions.flatMap(({ name, syntax, inherits, initialValue }) => [
      "  {",
      `    name: ${JSON.stringify(name)},`,
      `    syntax: ${JSON.stringify(syntax)},`,
      `    inherits: ${inherits},`,
      `    initialValue: ${formatStringLiteral(initialValue)},`,
      "  },",
    ]),
    "]",
  ].join("\n");
}

function formatStringArray(values) {
  return ["[", ...values.map((value) => `  ${JSON.stringify(value)},`), "]"].join("\n");
}

function escapeTemplateLiteral(value) {
  return value.replaceAll("\\", "\\\\").replaceAll("`", "\\`").replaceAll("${", "\\${");
}

function renderSheet(css) {
  const tokenPropertyDefinitions = createTokenPropertyDefinitions(css);
  const propertyDefinitions = formatPropertyDefinitions(tokenPropertyDefinitions);
  const unregisteredTokenNames = formatStringArray(
    createUnregisteredTokenNames(css, tokenPropertyDefinitions),
  );
  const componentTokenCss = extractComponentTokenCss(css);

  return [
    "// Generated from src/tokens/tokens.css by scripts/sync-token-sheet.mjs. Do not edit directly.",
    "export const tokenCssText = `",
    escapeTemplateLiteral(css),
    "`;",
    "",
    "export const componentTokenCssText = `",
    escapeTemplateLiteral(componentTokenCss),
    "`;",
    "",
    `export const tokenPropertyDefinitions = ${propertyDefinitions};`,
    "",
    `export const unregisteredTokenNames = ${unregisteredTokenNames};`,
    "",
    "function registerTokenProperties() {",
    '  if (typeof CSS === "undefined" || typeof CSS.registerProperty !== "function") {',
    "    return false;",
    "  }",
    "",
    "  for (const definition of tokenPropertyDefinitions) {",
    "    try {",
    "      CSS.registerProperty(definition);",
    "    } catch (error) {",
    '      if (error?.name !== "InvalidModificationError") {',
    "        return false;",
    "      }",
    "    }",
    "  }",
    "",
    "  return true;",
    "}",
    "",
    "export const tokenPropertiesRegistered = registerTokenProperties();",
    "",
    "export const rowanTokenStyleSheet =",
    '  typeof CSSStyleSheet === "undefined" ? null : new CSSStyleSheet();',
    "",
    "if (rowanTokenStyleSheet) {",
    "  rowanTokenStyleSheet.replaceSync(tokenCssText);",
    "}",
    "",
    "export const rowanComponentTokenStyleSheet =",
    '  typeof CSSStyleSheet === "undefined" ? null : new CSSStyleSheet();',
    "",
    "if (rowanComponentTokenStyleSheet) {",
    "  rowanComponentTokenStyleSheet.replaceSync(componentTokenCssText);",
    "}",
    "",
  ].join("\n");
}

const expected = renderSheet(readFileSync(sourceFile, "utf8"));
const current = readFileSync(sheetFile, "utf8");

if (shouldCheck) {
  if (current !== expected) {
    console.error("src/tokens/sheet.js is out of sync with src/tokens/tokens.css.");
    process.exitCode = 1;
  }
} else if (current !== expected) {
  writeFileSync(sheetFile, expected);
}
