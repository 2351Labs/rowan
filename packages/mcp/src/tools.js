/**
 * Tool handlers for the Rowan MCP server.
 * They read the catalog bundled in this package and do not touch the network.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const catalogPath = join(dirname(fileURLToPath(import.meta.url)), "../data/catalog.json");

export const TOOL_NAMES = [
  "list_components",
  "get_component",
  "search_components",
  "get_example",
  "get_theming",
];

function oneLine(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function loadCatalog(path = catalogPath) {
  const catalog = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(catalog?.components) || !catalog.theming) {
    throw new Error("Rowan MCP catalog is missing components or theming.");
  }
  return catalog;
}

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function resolveComponent(catalog, value) {
  const query = normalize(value);
  if (!query) return { status: "empty", matches: [] };
  const exact = catalog.components.filter((component) => {
    return (
      component.tagName === query ||
      component.slug === query ||
      component.className.toLowerCase() === query ||
      component.importPath.toLowerCase() === query ||
      component.react.importPath.toLowerCase() === query
    );
  });
  if (exact.length === 1) return { status: "one", component: exact[0], matches: exact };
  if (exact.length > 1) return { status: "many", matches: exact };
  return { status: "none", matches: [] };
}

function memberLine(item) {
  const details = [];
  if (item.type) details.push(oneLine(item.type));
  if (item.default) details.push(`default ${oneLine(item.default)}`);
  if (item.reflects) details.push("reflects");
  if (item.readonly) details.push("readonly");
  const suffix = details.length ? ` (${details.join(", ")})` : "";
  const description = oneLine(item.description);
  return `- \`${item.name}\`${suffix}${description ? ` — ${description}` : ""}`;
}

function section(title, items, render) {
  if (!items?.length) return `## ${title}\n\nNone.\n`;
  return `## ${title}\n\n${items.map(render).join("\n")}\n`;
}

function formatComponent(component) {
  const note = component.importNote ? `\n${component.importNote}\n` : "";
  return `# ${component.tagName}

${oneLine(component.description)}

- Package: \`${component.packageName}@${component.packageVersion}\`
- Import: \`${component.importPath}\`
- React: \`${component.react.component}\` from \`${component.react.importPath}\`
- Docs: ${component.docsUrl}
- Module: \`${component.modulePath}\`
${note}
${section("Attributes", component.attributes, memberLine)}
${section("Properties", component.properties, memberLine)}
${section("Events", component.events, (item) => {
  const detail = oneLine(item.detail);
  const description = oneLine(item.description);
  return `- \`${item.name}\`${detail ? ` — detail ${detail}` : ""}${description ? ` — ${description}` : ""}`;
})}
${section("Slots", component.slots, (item) => {
  const description = oneLine(item.description);
  return `- \`${item.name}\`${description ? ` — ${description}` : ""}`;
})}
${section("CSS parts", component.cssParts, (item) => {
  const description = oneLine(item.description);
  return `- \`${item.name}\`${description ? ` — ${description}` : ""}`;
})}
${section("CSS properties", component.cssProperties, (item) => {
  const description = oneLine(item.description);
  return `- \`${item.name}\`${description ? ` — ${description}` : ""}`;
})}
${section("Methods", component.methods, (item) => {
  const parameters = item.parameters?.length ? item.parameters.join(", ") : "";
  const description = oneLine(item.description);
  return `- \`${item.name}(${parameters})\`${description ? ` — ${description}` : ""}`;
})}`;
}

function suggestionText(catalog, query) {
  const matches = searchComponents(catalog, { query, limit: 5 });
  if (matches.isError) return "Call list_components to see every tag.";
  return matches.text;
}

export function listComponents(catalog) {
  const lines = catalog.components.map((component) => {
    return `- ${component.tagName} (\`${component.importPath}\`) — ${oneLine(component.description)}`;
  });
  return {
    text: `${catalog.components.length} Rowan components in @rowan-ui/core@${catalog.coreVersion}. Import \`${catalog.theming.baseImport}\` and a theme, then import the component subpath. Call get_component for the full API.\n\n${lines.join("\n")}`,
  };
}

export function getComponent(catalog, args = {}) {
  const resolved = resolveComponent(catalog, args.component);
  if (resolved.status === "empty") {
    return {
      isError: true,
      text: 'Pass component as a tag, slug, class, or import path. Example: "rowan-button".',
    };
  }
  if (resolved.status === "one") return { text: formatComponent(resolved.component) };
  const query = oneLine(args.component);
  return {
    isError: true,
    text: `No single Rowan component matches "${query}".\n\n${suggestionText(catalog, query)}`,
  };
}

function searchScore(component, query) {
  const haystacks = [
    component.tagName,
    component.slug,
    component.title,
    component.className,
    component.description,
    component.importPath,
    ...component.attributes.map((item) => item.name),
    ...component.properties.map((item) => item.name),
    ...component.events.map((item) => `${item.name} ${item.description}`),
    ...component.slots.map((item) => item.name),
    ...component.cssParts.map((item) => item.name),
  ].map((value) => String(value).toLowerCase());
  const blob = haystacks.join(" ");
  let score = 0;
  if (component.tagName === query || component.slug === query) score += 200;
  if (component.slug.startsWith(query) || component.tagName.startsWith(query)) score += 80;
  if (component.tagName.includes(query) || component.slug.includes(query)) score += 40;
  if (component.title.toLowerCase().includes(query)) score += 30;
  if (component.description.toLowerCase().includes(query)) score += 12;
  for (const token of query.split(/\s+/).filter(Boolean)) {
    if (blob.includes(token)) score += 8;
  }
  return score;
}

export function searchComponents(catalog, args = {}) {
  const query = normalize(args.query);
  if (!query) {
    return { isError: true, text: 'Pass a query, for example "date" or "rowan-click".' };
  }
  const limit = Number.isInteger(args.limit) ? Math.min(Math.max(args.limit, 1), 25) : 8;
  const ranked = catalog.components
    .map((component) => ({ component, score: searchScore(component, query) }))
    .filter((item) => item.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.component.tagName.localeCompare(right.component.tagName),
    )
    .slice(0, limit);
  if (ranked.length === 0) {
    return {
      isError: true,
      text: `No components match "${oneLine(args.query)}". Call list_components for the full set.`,
    };
  }
  const lines = ranked.map(({ component }) => {
    return `- ${component.tagName} (\`${component.importPath}\`) — ${oneLine(component.description)}`;
  });
  return {
    text: `${ranked.length} match${ranked.length === 1 ? "" : "es"} for "${oneLine(args.query)}". Call get_component or get_example with the tag.\n\n${lines.join("\n")}`,
  };
}

function fence(language, code) {
  return `\`\`\`${language}\n${code.trim()}\n\`\`\``;
}

export function getExample(catalog, args = {}) {
  const resolved = resolveComponent(catalog, args.component);
  if (resolved.status !== "one") {
    const query = oneLine(args.component);
    if (!query) {
      return { isError: true, text: 'Pass component, for example "button".' };
    }
    return {
      isError: true,
      text: `No single Rowan component matches "${query}".\n\n${suggestionText(catalog, query)}`,
    };
  }
  const framework = args.framework ? normalize(args.framework) : "";
  if (framework && framework !== "html" && framework !== "react") {
    return { isError: true, text: 'framework must be "html" or "react". Omit it to return both.' };
  }
  const component = resolved.component;
  const blocks = [`# ${component.tagName} examples`, ""];
  if (component.importNote) blocks.push(component.importNote, "");
  if (framework !== "react") {
    blocks.push("## HTML", "", fence("html", component.examples.html), "");
  }
  if (framework !== "html") {
    blocks.push("## React", "", fence("tsx", component.examples.react), "");
  }
  const excerpts = component.examples.excerpts.filter((excerpt) => {
    return !framework || excerpt.framework === framework;
  });
  if (excerpts.length === 0) {
    blocks.push(
      "No matching excerpt is checked into the docs or Storybook stories. The snippet above is a working example built from the public API.",
    );
  } else {
    blocks.push("## Excerpts from docs and stories", "");
    for (const excerpt of excerpts) {
      const label = excerpt.name ? `${excerpt.source} (${excerpt.name})` : excerpt.source;
      const language = excerpt.framework === "react" ? "tsx" : "html";
      blocks.push(`### ${label}`, "", fence(language, excerpt.text), "");
    }
  }
  return { text: blocks.join("\n").trim() };
}

function tokenLines(tokens) {
  if (!tokens?.length) return "None.";
  return tokens.map((token) => `- \`${token.name}\`: \`${token.value}\``).join("\n");
}

export function getTheming(catalog, args = {}) {
  const theming = catalog.theming;
  const layer = args.layer ? normalize(args.layer) : "overview";
  const allowed = new Set(["overview", "semantic", "primitive", "component", "all"]);
  if (!allowed.has(layer)) {
    return {
      isError: true,
      text: 'layer must be "overview", "semantic", "primitive", "component", or "all".',
    };
  }
  const themeId = args.theme ? normalize(args.theme) : "";
  const theme = themeId ? theming.themes.find((item) => item.id === themeId) : null;
  if (themeId && !theme) {
    const names = theming.themes.map((item) => item.id).join(", ");
    return {
      isError: true,
      text: `Unknown theme "${oneLine(args.theme)}". Shipped themes: ${names}.`,
    };
  }

  const lines = [
    "# Rowan theming",
    "",
    theming.summary,
    "",
    "```js",
    `import "${theming.baseImport}";`,
    'import "@rowan-ui/core/tokens/light";',
    "",
    'document.documentElement.dataset.theme = "light";',
    "```",
    "",
    ...theming.guidance.map((item) => `- ${item}`),
    "",
    "## Shipped themes",
    "",
    ...theming.themes.map(
      (item) =>
        `- \`${item.id}\`: import \`${item.import}\` and set \`${item.attribute}="${item.value}"\`.`,
    ),
    "",
  ];

  if (theme) {
    lines.push(`## ${theme.id}`, "", tokenLines(theme.colors), "");
  }

  if (layer === "overview" || layer === "semantic" || layer === "all") {
    lines.push("## Semantic tokens", "", tokenLines(theming.semantic), "");
  }
  if (layer === "primitive" || layer === "all") {
    lines.push("## Primitive tokens", "", tokenLines(theming.primitive), "");
  }
  if (layer === "component" || layer === "all") {
    lines.push("## Component tokens", "", tokenLines(theming.component), "");
  }

  lines.push(
    "## Charts",
    "",
    `Import \`${theming.charts.import}\` and set \`${theming.charts.attribute}="${theming.charts.value}"\`. ${theming.charts.summary}`,
    "",
    `Design-tool handoff: \`${theming.tokensJson}\`.`,
  );
  return { text: lines.join("\n").trim() };
}

export const toolHandlers = {
  list_components: listComponents,
  get_component: getComponent,
  search_components: searchComponents,
  get_example: getExample,
  get_theming: getTheming,
};
