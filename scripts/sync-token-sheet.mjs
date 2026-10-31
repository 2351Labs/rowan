import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";

const sourceFile = new URL("../src/tokens/tokens.css", import.meta.url);
const sheetFile = new URL("../src/tokens/sheet.js", import.meta.url);
const foundationFile = new URL("../src/tokens/foundation.js", import.meta.url);
const legacySheetFile = new URL("../src/tokens/legacy-sheet.js", import.meta.url);
const tokenLoaderFile = new URL("../src/tokens/load-component-tokens.js", import.meta.url);
const partsDir = new URL("../src/tokens/parts/", import.meta.url);
const srcDir = new URL("../src/", import.meta.url);
const tokenJsonFile = new URL("../tokens.json", import.meta.url);
const sheetPath = fileURLToPath(sheetFile);
const GENERATED_BANNER =
  "// Generated from src/tokens/tokens.css by scripts/sync-token-sheet.mjs. Do not edit directly.";
const DOCUMENT_TOKEN_SENTINELS = [
  "--rowan-color-bg",
  "--rowan-color-fg",
  "--rowan-color-accent",
  "--rowan-color-border",
  "--rowan-font-family",
  "--rowan-space-1",
];
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

function collectComponentTokenPrefixes() {
  const prefixes = new Set();

  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === "tokens" || entry.name === "storybook" || entry.name === "react") continue;

      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (
        !entry.name.endsWith(".js") ||
        entry.name.endsWith(".test.js") ||
        entry.name.endsWith(".stories.js")
      ) {
        continue;
      }

      const source = readFileSync(fullPath, "utf8");
      for (const match of source.matchAll(/componentTokenPrefixes\s*=\s*\[([^\]]*)\]/g)) {
        for (const name of match[1].matchAll(/["'](--rowan-[\w-]+)["']/g)) {
          prefixes.add(name[1]);
        }
      }
    }
  }

  walk(fileURLToPath(srcDir));
  return [...prefixes].sort(
    (left, right) => right.length - left.length || left.localeCompare(right),
  );
}

function partIdForPrefix(prefix) {
  const id = prefix.replace(/^--rowan-/, "").replace(/-$/, "");
  if (!id || !/^[a-z0-9-]+$/.test(id)) {
    throw new Error(`Cannot derive a token part id from ${prefix}.`);
  }
  return id;
}

function longestPrefix(name, prefixes) {
  return prefixes.find((prefix) => name.startsWith(prefix)) ?? null;
}

function renderFoundation(propertyDefinitions) {
  return [
    GENERATED_BANNER,
    "export const tokenPropertyDefinitions = " + propertyDefinitions + ";",
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
    `export const documentTokenSentinels = ${formatStringArray(DOCUMENT_TOKEN_SENTINELS)};`,
    "",
  ].join("\n");
}

function renderLegacySheet(css, probeNames) {
  return [
    GENERATED_BANNER,
    "export const tokenCssText = `",
    escapeTemplateLiteral(css),
    "`;",
    "",
    `export const probeNames = ${formatStringArray(probeNames)};`,
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

function renderPart(prefix, declarations) {
  return [
    GENERATED_BANNER,
    `export const prefix = ${JSON.stringify(prefix)};`,
    `export const declarations = ${formatComponentTokenDeclarations(declarations)};`,
    "",
  ].join("\n");
}

function renderTokenLoader(parts) {
  const entries = parts
    .map(
      (part) =>
        `  [${JSON.stringify(part.prefix)}, () => import(${JSON.stringify(`./parts/${part.id}.js`)})],`,
    )
    .join("\n");

  return [
    GENERATED_BANNER,
    "// Per-prefix chunks. Basic controls import only the prefixes they declare.",
    "const partLoaders = [",
    entries,
    "];",
    "",
    "const resolvedStyles = new Map();",
    "const pendingStyles = new Map();",
    "",
    "function cacheKey(prefixes) {",
    '  return prefixes.join("\\0");',
    "}",
    "",
    "function cssForDeclarations(declarations) {",
    '  if (declarations.length === 0) return "";',
    '  const body = declarations.map(([name, value]) => "  " + name + ": " + value + ";").join("\\n");',
    '  return ":host {\\n" + body + "\\n}";',
    "}",
    "",
    "function styleFromModules(modules, prefixes) {",
    "  const declarations = modules",
    "    .flatMap((part) => part.declarations)",
    "    .filter(([name]) => prefixes.some((prefix) => name.startsWith(prefix)));",
    "  return {",
    "    names: declarations.map(([name]) => name),",
    "    cssText: cssForDeclarations(declarations),",
    "  };",
    "}",
    "",
    "export function componentTokensFromDeclarations(declarations, prefixes) {",
    "  const matched = declarations.filter(([name]) =>",
    "    prefixes.some((prefix) => name.startsWith(prefix)),",
    "  );",
    "  return {",
    "    names: matched.map(([name]) => name),",
    "    cssText: cssForDeclarations(matched),",
    "  };",
    "}",
    "",
    "export function peekComponentTokens(prefixes) {",
    "  return resolvedStyles.get(cacheKey(prefixes)) ?? null;",
    "}",
    "",
    "export function loadComponentTokens(prefixes) {",
    "  const key = cacheKey(prefixes);",
    "  const resolved = resolvedStyles.get(key);",
    "  if (resolved) return Promise.resolve(resolved);",
    "",
    "  const pending = pendingStyles.get(key);",
    "  if (pending) return pending;",
    "",
    "  const loaders = partLoaders.filter(([partPrefix]) =>",
    "    prefixes.some((prefix) => partPrefix.startsWith(prefix)),",
    "  );",
    "  const promise = Promise.all(loaders.map(([, load]) => load())).then((modules) => {",
    "    const style = styleFromModules(modules, prefixes);",
    "    resolvedStyles.set(key, style);",
    "    pendingStyles.delete(key);",
    "    return style;",
    "  });",
    "  pendingStyles.set(key, promise);",
    "  return promise;",
    "}",
    "",
  ].join("\n");
}

function renderSheet(parts) {
  const imports = parts
    .map((part) => `import * as ${part.binding} from ${JSON.stringify(`./parts/${part.id}.js`)};`)
    .join("\n");
  const list = parts.map((part) => part.binding).join(", ");

  return [
    GENERATED_BANNER,
    imports,
    'export { tokenPropertiesRegistered, tokenPropertyDefinitions } from "./foundation.js";',
    'export { probeNames, rowanTokenStyleSheet, tokenCssText } from "./legacy-sheet.js";',
    "",
    `const componentTokenParts = [${list}];`,
    "",
    "export const componentTokenDeclarations = componentTokenParts.flatMap((part) => part.declarations);",
    "",
    "export const unregisteredTokenNames = componentTokenDeclarations.map(([name]) => name);",
    "",
    "export function componentTokenCssFor(prefixes = []) {",
    "  const declarations = componentTokenDeclarations",
    "    .filter(([name]) => prefixes.some((prefix) => name.startsWith(prefix)))",
    '    .map(([name, value]) => "  " + name + ": " + value + ";");',
    "",
    '  return declarations.length === 0 ? "" : ":host {\\n" + declarations.join("\\n") + "\\n}";',
    "}",
    "",
  ].join("\n");
}

function bindingForPartId(id, index) {
  const base = id
    .split("-")
    .map((segment, segmentIndex) =>
      segmentIndex === 0 ? segment : `${segment.slice(0, 1).toUpperCase()}${segment.slice(1)}`,
    )
    .join("");
  return `${base}Tokens${index}`;
}

function buildTokenModules(css) {
  const tokenPropertyDefinitions = createTokenPropertyDefinitions(css);
  const componentDeclarations = createComponentTokenDeclarations(css);
  const prefixes = collectComponentTokenPrefixes();
  const grouped = new Map(prefixes.map((prefix) => [prefix, []]));
  const unscoped = [];

  for (const declaration of componentDeclarations) {
    const prefix = longestPrefix(declaration[0], prefixes);
    if (prefix) grouped.get(prefix).push(declaration);
    else unscoped.push(declaration);
  }

  const parts = [...grouped.entries()]
    .filter(([, declarations]) => declarations.length > 0)
    .map(([prefix, declarations], index) => {
      const id = partIdForPrefix(prefix);
      return { prefix, id, declarations, binding: bindingForPartId(id, index), loadable: true };
    });

  if (unscoped.length > 0) {
    parts.push({
      prefix: null,
      id: "shared",
      declarations: unscoped,
      binding: "sharedTokens",
      loadable: false,
    });
  }

  const ids = new Set();
  for (const part of parts) {
    if (ids.has(part.id)) throw new Error(`Duplicate token part id ${part.id}.`);
    ids.add(part.id);
  }

  const probeNames = [...DOCUMENT_TOKEN_SENTINELS, ...componentDeclarations.map(([name]) => name)];
  const loadableParts = parts.filter((part) => part.loadable);

  return {
    foundation: renderFoundation(formatPropertyDefinitions(tokenPropertyDefinitions)),
    legacy: renderLegacySheet(css, probeNames),
    loader: renderTokenLoader(loadableParts),
    sheet: renderSheet(parts),
    parts,
  };
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
async function formatModule(path, source) {
  return format(source, {
    ...prettierConfig,
    filepath: path,
    parser: "babel",
  });
}

const modules = buildTokenModules(expectedCss);
const expectedFiles = new Map([
  [sheetPath, await formatModule(sheetPath, modules.sheet)],
  [
    fileURLToPath(foundationFile),
    await formatModule(fileURLToPath(foundationFile), modules.foundation),
  ],
  [
    fileURLToPath(legacySheetFile),
    await formatModule(fileURLToPath(legacySheetFile), modules.legacy),
  ],
  [
    fileURLToPath(tokenLoaderFile),
    await formatModule(fileURLToPath(tokenLoaderFile), modules.loader),
  ],
]);

for (const part of modules.parts) {
  const partPath = fileURLToPath(new URL(`./${part.id}.js`, partsDir));
  expectedFiles.set(
    partPath,
    await formatModule(partPath, renderPart(part.prefix, part.declarations)),
  );
}

const partsPath = fileURLToPath(partsDir);
const existingPartFiles = existsSync(partsPath)
  ? readdirSync(partsPath)
      .filter((name) => name.endsWith(".js"))
      .map((name) => join(partsPath, name))
  : [];
const expectedTokenJson = createTokenJson(baseCss);
const currentTokenJson = existsSync(tokenJsonPath) ? readFileSync(tokenJsonFile, "utf8") : null;
const currentCss = rawCss;

function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

if (shouldCheck) {
  let isOutOfSync = false;

  if (currentCss !== expectedCss) {
    console.error("src/tokens/tokens.css nested theme aliases are out of sync.");
    isOutOfSync = true;
  }

  for (const [path, expected] of expectedFiles) {
    if (readIfExists(path) !== expected) {
      console.error(`${path} is out of sync with src/tokens/tokens.css.`);
      isOutOfSync = true;
    }
  }

  for (const path of existingPartFiles) {
    if (!expectedFiles.has(path)) {
      console.error(`${path} is no longer generated from src/tokens/tokens.css.`);
      isOutOfSync = true;
    }
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

  mkdirSync(partsPath, { recursive: true });
  for (const [path, expected] of expectedFiles) {
    if (readIfExists(path) !== expected) writeFileSync(path, expected);
  }

  for (const path of existingPartFiles) {
    if (!expectedFiles.has(path)) rmSync(path);
  }

  if (currentTokenJson !== expectedTokenJson) {
    writeFileSync(tokenJsonFile, expectedTokenJson);
  }
}
