import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";

const sourceFile = new URL("../src/tokens/tokens.css", import.meta.url);
const sheetFile = new URL("../src/tokens/sheet.js", import.meta.url);
const tokenJsonFile = new URL("../tokens.json", import.meta.url);
const sheetPath = fileURLToPath(sheetFile);
const tokenJsonPath = fileURLToPath(tokenJsonFile);
const shouldCheck = process.argv.includes("--check");
const TOKEN_DECLARATION = /(--rowan-[\w-]+)\s*:\s*([^;]+);/g;
const COMPONENT_LAYER_MARKER = "/* Component layer */";
const NESTED_THEME_ALIAS_START = "/* Nested theme aliases */";
const NESTED_THEME_ALIAS_END = "/* End nested theme aliases */";
const TOKEN_LAYERS = [
  { id: "primitive", marker: "/* Primitive layer */" },
  { id: "semantic", marker: "/* Semantic layer */" },
  { id: "component", marker: COMPONENT_LAYER_MARKER },
];

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

function sourceWithoutNestedAliases(source) {
  const index = source.indexOf(NESTED_THEME_ALIAS_START);
  return (index === -1 ? source : source.slice(0, index)).trimEnd() + "\n";
}

function createComponentTokenDeclarations(source) {
  const componentLayerIndex = source.indexOf(COMPONENT_LAYER_MARKER);

  if (componentLayerIndex === -1) {
    throw new Error("The component token layer is missing from src/tokens/tokens.css.");
  }

  const nestedIndex = source.indexOf(NESTED_THEME_ALIAS_START);
  const end = nestedIndex === -1 ? source.length : nestedIndex;
  return [...parseTokenDeclarations(source.slice(componentLayerIndex, end)).entries()];
}

function createNestedThemeAliasBlock(source) {
  const declarations = createComponentTokenDeclarations(source).filter(([, value]) =>
    /var\(\s*--rowan-/.test(value),
  );
  const body = declarations.map(([name, value]) => `  ${name}: ${value};`).join("\n");
  return `${NESTED_THEME_ALIAS_START}\n[data-theme] {\n${body}\n}\n${NESTED_THEME_ALIAS_END}\n`;
}

function tokenSegments(name) {
  return name.slice("--rowan-".length).split("-");
}

function isStrictPathPrefix(prefix, path) {
  return prefix.length < path.length && prefix.every((segment, index) => path[index] === segment);
}

function camelCaseSegments(segments) {
  return segments
    .map((segment, index) => {
      if (index === 0) return segment;
      return `${segment.slice(0, 1).toUpperCase()}${segment.slice(1)}`;
    })
    .join("");
}

function createTokenPaths(declarationsByLayer) {
  const rawPaths = new Map();

  for (const { layer, declarations } of declarationsByLayer) {
    for (const name of declarations.keys()) {
      rawPaths.set(name, [layer.id, ...tokenSegments(name)]);
    }
  }

  const paths = new Map();
  for (const [name, path] of rawPaths) {
    const prefix = [...rawPaths.entries()]
      .filter(([candidateName, candidatePath]) => {
        return candidateName !== name && isStrictPathPrefix(candidatePath, path);
      })
      .sort(([, leftPath], [, rightPath]) => leftPath.length - rightPath.length)[0]?.[1];

    if (!prefix) {
      paths.set(name, path);
      continue;
    }

    const leafIndex = prefix.length - 1;
    paths.set(name, [...path.slice(0, leafIndex), camelCaseSegments(path.slice(leafIndex))]);
  }

  for (const [name, path] of paths) {
    for (const [candidateName, candidatePath] of paths) {
      if (candidateName === name) continue;

      if (path.join(".") === candidatePath.join(".")) {
        throw new Error(`Token path collision: ${name} and ${candidateName}.`);
      }

      if (isStrictPathPrefix(path, candidatePath)) {
        throw new Error(`Token path is both a group and token: ${name} and ${candidateName}.`);
      }
    }
  }

  return paths;
}

function tokenReference(value, tokenPaths) {
  const reference = value.match(/^var\(\s*(--rowan-[\w-]+)\s*\)$/);
  if (!reference) return value;

  const path = tokenPaths.get(reference[1]);
  if (!path) throw new Error(`Unknown token reference: ${reference[1]}`);

  return `{${path.join(".")}}`;
}

function tokenType(name) {
  if (name.startsWith("--rowan-color-") || /-(?:bg|fg|border)$/.test(name)) {
    return "color";
  }

  if (name.includes("font-family")) {
    return "fontFamily";
  }

  if (name.includes("font-weight")) {
    return "fontWeight";
  }

  if (
    name.includes("font-size") ||
    name.startsWith("--rowan-space-") ||
    name.startsWith("--rowan-radius-") ||
    /-(?:gap|padding|margin|radius|size|width|height|offset)$/.test(name)
  ) {
    return "dimension";
  }

  if (name.includes("duration")) {
    return "duration";
  }

  if (name.includes("opacity") || name.includes("z-index") || name.includes("line-height")) {
    return "number";
  }

  return "custom";
}

function setTokenAtPath(target, path, token) {
  let group = target;

  for (const segment of path.slice(0, -1)) {
    if ("$value" in group) {
      throw new Error(`Cannot add token group ${path.join(".")} beneath a token.`);
    }
    group[segment] ||= {};
    group = group[segment];
  }

  if (group[path.at(-1)] !== undefined) {
    throw new Error(`Token path collision at ${path.join(".")}.`);
  }
  group[path.at(-1)] = token;
}

function createTokenJson(source) {
  const tokens = {
    $schema: "https://design-tokens.github.io/community-group/format/",
    $extensions: {
      "org.rowan": {
        source: "src/tokens/tokens.css",
      },
    },
  };
  const declarationsByLayer = [];

  for (const [index, layer] of TOKEN_LAYERS.entries()) {
    const nextLayer = TOKEN_LAYERS[index + 1];
    const start = source.indexOf(layer.marker);
    const end = nextLayer ? source.indexOf(nextLayer.marker) : source.length;

    if (start === -1 || end === -1) {
      throw new Error(`The ${layer.id} token layer is missing from src/tokens/tokens.css.`);
    }

    const declarations = parseTokenDeclarations(source.slice(start, end));
    declarationsByLayer.push({ layer, declarations });
    tokens[layer.id] = {};
  }

  const tokenPaths = createTokenPaths(declarationsByLayer);

  for (const { layer, declarations } of declarationsByLayer) {
    for (const [name, value] of declarations) {
      setTokenAtPath(tokens, tokenPaths.get(name), {
        $value: tokenReference(value, tokenPaths),
        $type: tokenType(name),
        $description: `CSS custom property ${name} from Rowan's ${layer.id} layer.`,
        $extensions: {
          "org.rowan": {
            cssName: name,
            cssValue: value,
            layer: layer.id,
          },
        },
      });
    }
  }

  return `${JSON.stringify(tokens, null, 2)}\n`;
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

function formatComponentTokenDeclarations(declarations) {
  return [
    "[",
    ...declarations.map(
      ([name, value]) => `  [${JSON.stringify(name)}, ${formatStringLiteral(value)}],`,
    ),
    "]",
  ].join("\n");
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
  const componentTokenDeclarations = formatComponentTokenDeclarations(
    createComponentTokenDeclarations(css),
  );

  return [
    "// Generated from src/tokens/tokens.css by scripts/sync-token-sheet.mjs. Do not edit directly.",
    "export const tokenCssText = `",
    escapeTemplateLiteral(css),
    "`;",
    "",
    `export const tokenPropertyDefinitions = ${propertyDefinitions};`,
    "",
    `export const unregisteredTokenNames = ${unregisteredTokenNames};`,
    "",
    `export const componentTokenDeclarations = ${componentTokenDeclarations};`,
    "",
    "export function componentTokenCssFor(prefixes = []) {",
    "  const declarations = componentTokenDeclarations",
    "    .filter(([name]) => prefixes.some((prefix) => name.startsWith(prefix)))",
    '    .map(([name, value]) => "  " + name + ": " + value + ";");',
    "",
    '  return declarations.length === 0 ? "" : ":host {\\n" + declarations.join("\\n") + "\\n}";',
    "}",
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
  ].join("\n");
}

const prettierConfig = (await resolveConfig(sheetPath)) ?? {};
const cssPath = fileURLToPath(sourceFile);
const cssPrettierConfig = (await resolveConfig(cssPath)) ?? {};
const rawCss = readFileSync(sourceFile, "utf8");
const baseCss = sourceWithoutNestedAliases(rawCss);
const expectedCss = await format(
  `${baseCss.trimEnd()}\n\n${createNestedThemeAliasBlock(baseCss)}`,
  {
    ...cssPrettierConfig,
    filepath: cssPath,
    parser: "css",
  },
);
const expected = await format(renderSheet(expectedCss), {
  ...prettierConfig,
  filepath: sheetPath,
  parser: "babel",
});
const current = readFileSync(sheetFile, "utf8");
const expectedTokenJson = createTokenJson(baseCss);
const currentTokenJson = existsSync(tokenJsonPath) ? readFileSync(tokenJsonFile, "utf8") : null;
const currentCss = rawCss;

if (shouldCheck) {
  let isOutOfSync = false;

  if (currentCss !== expectedCss) {
    console.error("src/tokens/tokens.css nested theme aliases are out of sync.");
    isOutOfSync = true;
  }

  if (current !== expected) {
    console.error("src/tokens/sheet.js is out of sync with src/tokens/tokens.css.");
    isOutOfSync = true;
  }

  if (currentTokenJson !== expectedTokenJson) {
    console.error("tokens.json is out of sync with src/tokens/tokens.css.");
    isOutOfSync = true;
  }

  if (isOutOfSync) {
    process.exitCode = 1;
  }
} else {
  if (currentCss !== expectedCss) {
    writeFileSync(sourceFile, expectedCss);
  }

  if (current !== expected) {
    writeFileSync(sheetFile, expected);
  }

  if (currentTokenJson !== expectedTokenJson) {
    writeFileSync(tokenJsonFile, expectedTokenJson);
  }
}
