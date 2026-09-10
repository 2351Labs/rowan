import baseTokenSource from "./tokens.css?raw";
import darkThemeSource from "./themes/dark.css?raw";
import lightThemeSource from "./themes/light.css?raw";

const TOKEN_DECLARATION = /^\s*(--rowan-[\w-]+)\s*:\s*([^;]+);/;

function normalizeValue(value) {
  return value.trim().replace(/\s+/g, " ");
}

function parseLayeredTokens(source) {
  const layers = {
    primitive: [],
    semantic: [],
    component: [],
  };

  let currentLayer = null;

  for (const line of source.split("\n")) {
    const trimmed = line.trim();

    if (trimmed.startsWith("/*")) {
      if (trimmed.includes("Primitive layer")) {
        currentLayer = "primitive";
      } else if (trimmed.includes("Semantic layer")) {
        currentLayer = "semantic";
      } else if (trimmed.includes("Component layer")) {
        currentLayer = "component";
      }

      continue;
    }

    const tokenMatch = line.match(TOKEN_DECLARATION);
    if (!tokenMatch || !currentLayer) {
      continue;
    }

    const [, name, rawValue] = tokenMatch;
    layers[currentLayer].push({
      name,
      value: normalizeValue(rawValue),
    });
  }

  return layers;
}

function parseThemeTokens(source) {
  const tokenMap = new Map();

  for (const line of source.split("\n")) {
    const tokenMatch = line.match(TOKEN_DECLARATION);
    if (!tokenMatch) {
      continue;
    }

    const [, name, rawValue] = tokenMatch;
    tokenMap.set(name, normalizeValue(rawValue));
  }

  return tokenMap;
}

function byNameSort(left, right) {
  return left.name.localeCompare(right.name, undefined, { numeric: true });
}

function filterByPrefix(tokens, prefix) {
  return tokens.filter((token) => token.name.startsWith(prefix));
}

function filterByOneOfPrefixes(tokens, prefixes) {
  return tokens.filter((token) => prefixes.some((prefix) => token.name.startsWith(prefix)));
}

const baseLayers = parseLayeredTokens(baseTokenSource);
const lightThemeTokens = parseThemeTokens(lightThemeSource);
const darkThemeTokens = parseThemeTokens(darkThemeSource);

const primitiveTokens = [...baseLayers.primitive];

export const primitiveColorTokens = filterByPrefix(primitiveTokens, "--rowan-color-").sort(byNameSort);
export const primitiveSpaceTokens = filterByPrefix(primitiveTokens, "--rowan-space-").sort(byNameSort);
export const primitiveRadiusTokens = filterByPrefix(primitiveTokens, "--rowan-radius-").sort(byNameSort);
export const primitiveTypographyTokens = filterByOneOfPrefixes(primitiveTokens, [
  "--rowan-font-",
  "--rowan-line-height",
]).sort(byNameSort);
export const primitiveStructuralTokens = filterByPrefix(primitiveTokens, "--rowan-border-").sort(
  byNameSort,
);

export const semanticTokens = [...baseLayers.semantic].sort(byNameSort);
export const componentTokens = [...baseLayers.component].sort(byNameSort);

const themeTokenNames = [...new Set([...lightThemeTokens.keys(), ...darkThemeTokens.keys()])].sort((a, b) =>
  a.localeCompare(b, undefined, { numeric: true }),
);

export const themeComparisonTokens = themeTokenNames.map((name) => ({
  name,
  light: lightThemeTokens.get(name) || "-",
  dark: darkThemeTokens.get(name) || "-",
}));

export const tokenSourcePaths = [
  "src/tokens/tokens.css",
  "src/tokens/themes/light.css",
  "src/tokens/themes/dark.css",
];
