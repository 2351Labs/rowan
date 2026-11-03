/**
 * Catalog used by llms.txt and the MCP server.
 * Built from the public Custom Elements Manifest projection, token CSS, and
 * HTML/React excerpts in the docs and Storybook stories. No network.
 */

import { readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SOURCES, collectComponents } from "../generate-api-reference.mjs";
import { collectExampleSnippets, excerptsForComponent } from "./example-snippets.mjs";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const DOCS_ORIGIN = "https://2351labs.github.io/rowan";

const THEME_IDS = ["light", "dark", "lagoon", "ember", "slate", "midnight"];

const TOKEN_DECLARATION = /^\s*(--rowan-[\w-]+)\s*:\s*([^;]+);/;

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function exportTarget(value) {
  if (typeof value === "string") return value;
  if (value && typeof value.default === "string") return value.default;
  return "";
}

export function specifierFor(pkg, packageRelativePath) {
  const rel = packageRelativePath.replace(/^\.\//, "").replaceAll("\\", "/");
  for (const [key, value] of Object.entries(pkg.exports || {})) {
    if (key.includes("*")) continue;
    const target = exportTarget(value).replace(/^\.\//, "");
    if (target && target === rel) {
      return key === "." ? pkg.name : `${pkg.name}/${key.replace(/^\.\//, "")}`;
    }
  }
  for (const [key, value] of Object.entries(pkg.exports || {})) {
    if (!key.includes("*")) continue;
    const target = exportTarget(value).replace(/^\.\//, "");
    if (!target.includes("*")) continue;
    const star = target.indexOf("*");
    const prefix = target.slice(0, star);
    const suffix = target.slice(star + 1);
    if (!rel.startsWith(prefix) || !rel.endsWith(suffix)) continue;
    const matched = rel.slice(prefix.length, rel.length - suffix.length);
    const keyStar = key.indexOf("*");
    const keyPrefix = key.slice(0, keyStar).replace(/^\.\//, "");
    const keySuffix = key.slice(keyStar + 1);
    const subpath = `${keyPrefix}${matched}${keySuffix}`;
    return subpath ? `${pkg.name}/${subpath}` : pkg.name;
  }
  return "";
}

function packageIndexes() {
  return SOURCES.map((source) => {
    const pkg = readJson(join(source.packageRoot, "package.json"));
    const manifest = readJson(join(rootDir, source.manifest));
    const moduleByTag = new Map();
    for (const moduleEntry of manifest.modules || []) {
      for (const declaration of moduleEntry.declarations || []) {
        if (declaration.customElement !== true) continue;
        if (!declaration.tagName?.startsWith("rowan-")) continue;
        if (!moduleByTag.has(declaration.tagName)) {
          moduleByTag.set(declaration.tagName, moduleEntry.path.replaceAll("\\", "/"));
        }
      }
    }
    return { source, pkg, moduleByTag };
  });
}

function locate(indexes, tagName) {
  for (const index of indexes) {
    const modulePath = index.moduleByTag.get(tagName);
    if (modulePath) return { ...index, modulePath };
  }
  return null;
}

function parseLayeredTokens(source) {
  const layers = { primitive: [], semantic: [], component: [] };
  let currentLayer = "";
  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("/*")) {
      if (trimmed.includes("Primitive layer")) currentLayer = "primitive";
      else if (trimmed.includes("Semantic layer")) currentLayer = "semantic";
      else if (trimmed.includes("Component layer")) currentLayer = "component";
      continue;
    }
    const match = line.match(TOKEN_DECLARATION);
    if (!match || !currentLayer) continue;
    layers[currentLayer].push({
      name: match[1],
      value: match[2].trim().replace(/\s+/g, " "),
    });
  }
  for (const list of Object.values(layers)) {
    list.sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }));
  }
  return layers;
}

function parseDeclarations(source) {
  const tokens = new Map();
  for (const line of source.split("\n")) {
    const match = line.match(TOKEN_DECLARATION);
    if (!match) continue;
    tokens.set(match[1], match[2].trim().replace(/\s+/g, " "));
  }
  return tokens;
}

function htmlToJsx(usage, tagName, componentName) {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let jsx = usage.replace(new RegExp(`<${escaped}\\b`, "g"), `<${componentName}`);
  jsx = jsx.replace(new RegExp(`</${escaped}>`, "g"), `</${componentName}>`);
  jsx = jsx.replace(
    new RegExp(`<${componentName}([^>]*)></${componentName}>`, "g"),
    `<${componentName}$1 />`,
  );
  return jsx.trim();
}

function canonicalHtml(component) {
  const imports = [];
  if (component.packageName !== "@rowan-ui/icons") {
    imports.push('import "@rowan-ui/core/tokens";', 'import "@rowan-ui/core/tokens/light";');
  }
  if (component.tagName === "rowan-icon") {
    imports.push('import "@rowan-ui/icons/elements/check";');
  } else {
    imports.push(`import "${component.importPath}";`);
  }
  const markup =
    component.tagName === "rowan-icon" && !component.usage.includes("name=")
      ? '<rowan-icon name="check" label="Saved"></rowan-icon>'
      : component.usage;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${component.title}</title>
    <script type="module">
      ${imports.join("\n      ")}
    </script>
  </head>
  <body>
    ${markup}
  </body>
</html>`;
}

function canonicalReact(component) {
  const imports = [];
  if (component.packageName !== "@rowan-ui/icons") {
    imports.push('import "@rowan-ui/core/tokens";', 'import "@rowan-ui/core/tokens/light";');
  }
  imports.push(`import { ${component.react.component} } from "${component.react.importPath}";`);
  const jsx = htmlToJsx(component.usage, component.tagName, component.react.component);
  const eventHint = component.react.eventProps[0];
  const comment = eventHint
    ? `// ${component.react.component} maps ${eventHint.name} to the ${eventHint.event} event.\n`
    : "";
  const indented = jsx.split("\n").join("\n    ");
  return `${imports.join("\n")}

${comment}export function Example() {
  return (
    ${indented}
  );
}`;
}

function normalizeSlots(slots) {
  const byName = new Map();
  for (const slot of slots) {
    const dashed = slot.name.startsWith("- ");
    const name = dashed ? "(default)" : slot.name;
    const description = slot.description || (dashed ? slot.name.slice(2).trim() : "");
    const current = byName.get(name);
    if (!current) {
      byName.set(name, { ...slot, name, description });
      continue;
    }
    if (!current.description && description) current.description = description;
  }
  return [...byName.values()].sort((left, right) => left.name.localeCompare(right.name));
}

function importNoteFor(component) {
  if (component.tagName === "rowan-icon") {
    return 'Each glyph is its own module. `import "@rowan-ui/icons/elements/<name>"` registers `<rowan-icon>` and that name. `@rowan-ui/icons/element` registers the class only.';
  }
  if (component.packageName === "@rowan-ui/maplibre") {
    return "Install the `maplibre-gl` peer next to `@rowan-ui/maplibre`. The map registers from `@rowan-ui/maplibre/map`.";
  }
  return "";
}

function buildTheming(corePackage) {
  const tokensCss = readFileSync(join(rootDir, "src/tokens/tokens.css"), "utf8");
  const layers = parseLayeredTokens(tokensCss);
  const semanticNames = layers.semantic.map((token) => token.name);
  const themes = THEME_IDS.map((id) => {
    const fileName = `src/tokens/themes/${id}.css`;
    const declared = parseDeclarations(readFileSync(join(rootDir, fileName), "utf8"));
    const colors = semanticNames
      .filter((name) => declared.has(name))
      .map((name) => ({ name, value: declared.get(name) }));
    const specifier = specifierFor(corePackage, `src/tokens/themes/${id}.css`);
    if (!specifier) {
      throw new Error(`No package export for theme ${id}.`);
    }
    return {
      id,
      import: specifier,
      attribute: "data-theme",
      value: id,
      colors,
    };
  });

  const chartsImport = specifierFor(corePackage, "src/tokens/charts-vibrant.css");
  const tokensJson = specifierFor(corePackage, "tokens.json");
  const baseImport = specifierFor(corePackage, "src/tokens/tokens.css");
  if (!chartsImport || !tokensJson || !baseImport) {
    throw new Error("Token package exports are incomplete.");
  }

  return {
    summary:
      "Rowan themes are CSS custom properties on `:root` or a `[data-theme]` scope. Primitive tokens feed semantic tokens, and component hooks follow the semantic layer. There is no JavaScript theme provider.",
    baseImport,
    tokensJson,
    charts: {
      import: chartsImport,
      attribute: "data-rowan-charts",
      value: "vibrant",
      summary:
        "Buttons and navigation stay on the Rowan theme. The palette applies only inside the region that sets the attribute.",
    },
    themes,
    semantic: layers.semantic,
    primitive: layers.primitive,
    component: layers.component,
    guidance: [
      "Import the base tokens and one shipped theme, then set data-theme on the scope that should change.",
      "Product themes override semantic tokens (--rowan-color-bg, --rowan-color-fg, --rowan-color-accent, and the rest of that layer).",
      "Shipped theme files re-declare component aliases so a nested [data-theme] scope resolves those aliases again.",
      "CSS remains the runtime source of truth. @rowan-ui/core/tokens.json is a DTCG handoff for design tools.",
    ],
  };
}

function requireSpecifier(pkg, packageRelativePath, label) {
  const specifier = specifierFor(pkg, packageRelativePath);
  if (!specifier) {
    throw new Error(`No package export for ${label} (${packageRelativePath}).`);
  }
  return specifier;
}

export function buildAiCatalog() {
  const indexes = packageIndexes();
  const corePackage = indexes.find((index) => index.pkg.name === "@rowan-ui/core")?.pkg;
  if (!corePackage) throw new Error("Missing @rowan-ui/core package.");
  const mcpPackage = readJson(join(rootDir, "packages/mcp/package.json"));
  const snippets = collectExampleSnippets(rootDir);
  const components = collectComponents().map((entry) => {
    const located = locate(indexes, entry.tagName);
    if (!located) throw new Error(`No manifest source for ${entry.tagName}.`);
    const slug = entry.tagName.replace(/^rowan-/, "");
    const importPath = requireSpecifier(located.pkg, located.modulePath, entry.tagName);
    const reactRelative = relative(
      located.source.packageRoot,
      join(rootDir, located.source.reactDir, `${slug}.js`),
    ).replaceAll("\\", "/");
    const reactImport = requireSpecifier(
      located.pkg,
      reactRelative,
      `${entry.tagName} React wrapper`,
    );
    const component = {
      tagName: entry.tagName,
      slug,
      className: entry.className,
      title: entry.title,
      description: entry.description,
      packageName: located.pkg.name,
      packageVersion: located.pkg.version,
      importPath,
      modulePath: located.modulePath,
      docsUrl: `${DOCS_ORIGIN}/#${slug}`,
      importNote: "",
      attributes: entry.attributes,
      properties: entry.properties,
      events: entry.events,
      slots: normalizeSlots(entry.slots),
      cssParts: entry.cssParts,
      cssProperties: entry.cssProperties,
      methods: entry.methods,
      usage: entry.usage,
      react: {
        component: entry.react.component,
        importPath: reactImport,
        props: entry.react.props,
        eventProps: entry.react.eventProps,
      },
      examples: { html: "", react: "", excerpts: [] },
    };
    component.importNote = importNoteFor(component);
    component.examples = {
      html: canonicalHtml(component),
      react: canonicalReact(component),
      excerpts: excerptsForComponent(snippets, component).map((excerpt) => ({
        framework: excerpt.framework,
        source: excerpt.source,
        name: excerpt.name,
        text: excerpt.text,
      })),
    };
    return component;
  });

  const iconPackage = indexes.find((index) => index.pkg.name === "@rowan-ui/icons").pkg;
  const mapPackage = indexes.find((index) => index.pkg.name === "@rowan-ui/maplibre").pkg;
  const exceptions = components
    .filter((component) => component.importPath !== `@rowan-ui/core/${component.slug}`)
    .map((component) => ({
      tagName: component.tagName,
      importPath: component.importPath,
      note: component.importNote,
    }));

  return {
    docsOrigin: DOCS_ORIGIN,
    llmsUrl: `${DOCS_ORIGIN}/llms.txt`,
    llmsFullUrl: `${DOCS_ORIGIN}/llms-full.txt`,
    coreVersion: corePackage.version,
    mcpVersion: mcpPackage.version,
    install: {
      core: `npm install @rowan-ui/core@${corePackage.version}`,
      icons: `npm install @rowan-ui/icons@${iconPackage.version}`,
      maplibre: `npm install @rowan-ui/maplibre@${mapPackage.version}`,
      mcp: "npx -y @rowan-ui/mcp",
    },
    importPattern:
      'Import `@rowan-ui/core/tokens` and a theme, then import each component from its package subpath. The subpath is the tag without the `rowan-` prefix: `<rowan-button>` is `@rowan-ui/core/button`, and that module registers the element. `import "@rowan-ui/core"` registers the full core catalog.',
    exceptions,
    theming: buildTheming(corePackage),
    components,
  };
}
