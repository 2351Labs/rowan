/**
 * llms.txt and llms-full.txt, following https://llmstxt.org/
 * H1, a blockquote summary, then H2 sections. The compact file is the index
 * an agent can read first. The full file repeats that overview and adds the
 * per-component reference, examples, and token lists.
 */

const COMPACT_LINE_LIMIT = 1800;

function oneLine(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function cell(value) {
  return oneLine(value).replace(/\|/g, "\\|");
}

function memberToken(item) {
  const parts = [`\`${item.name}\``];
  if (item.type) parts.push(oneLine(item.type));
  if (item.default) parts.push(`default ${oneLine(item.default)}`);
  return parts.join(" ");
}

function compactMembers(label, items) {
  if (!items?.length) return `${label}: none`;
  let line = `${label}: ${items.map(memberToken).join("; ")}`;
  if (line.length > COMPACT_LINE_LIMIT) {
    line = `${line.slice(0, COMPACT_LINE_LIMIT - 1).trimEnd()}…`;
  }
  return line;
}

function fence(language, code) {
  const runs = code.match(/`+/g) || [];
  const longest = runs.reduce((max, run) => Math.max(max, run.length), 0);
  const ticks = "`".repeat(Math.max(3, longest + 1));
  return `${ticks}${language}\n${code.trim()}\n${ticks}`;
}

function table(headers, rows) {
  if (rows.length === 0) return "None.\n";
  const head = `| ${headers.join(" | ")} |`;
  const rule = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(cell).join(" | ")} |`).join("\n");
  return `${head}\n${rule}\n${body}\n`;
}

function renderHeader(catalog) {
  return `# Rowan

> Rowan ${catalog.coreVersion} is a vanilla Web Components design system: custom elements, Shadow DOM, and CSS tokens, with no framework runtime. The host owns data.

Documentation: ${catalog.docsOrigin}/
Compact context: ${catalog.llmsUrl}
Full context: ${catalog.llmsFullUrl}
MCP server: \`${catalog.install.mcp}\` (\`@rowan-ui/mcp@${catalog.mcpVersion}\`)

`;
}

function renderInstall(catalog) {
  return `## Install

\`\`\`bash
${catalog.install.core}
\`\`\`

\`@rowan-ui/icons\` is the optional icon set. \`@rowan-ui/maplibre\` is the optional MapLibre map.

\`\`\`bash
${catalog.install.icons}
${catalog.install.maplibre}
\`\`\`

The host keeps rows, locale, and routing. Components do not request them.

`;
}

function renderImports(catalog) {
  const exceptions =
    catalog.exceptions.length === 0
      ? ""
      : `${catalog.exceptions
          .map((item) => {
            const note = item.note ? ` ${item.note}` : "";
            return `- \`${item.tagName}\` imports \`${item.importPath}\`.${note}`;
          })
          .join("\n")}\n\n`;
  return `## Imports

${catalog.importPattern}

\`\`\`js
import "@rowan-ui/core/tokens";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/button";

document.documentElement.dataset.theme = "light";
\`\`\`

React wrappers are generated per component. \`RowanButton\` comes from \`@rowan-ui/core/react/button\` and maps \`onRowanClick\` to \`rowan-click\`. Vue, Angular, and Svelte use the custom element and the same subpath import.

Subpaths that differ from \`@rowan-ui/core/<slug>\`:

${exceptions}`;
}

function renderThemes(catalog) {
  return catalog.theming.themes
    .map(
      (theme) =>
        `- \`${theme.id}\`: import \`${theme.import}\` and set \`${theme.attribute}="${theme.value}"\`.`,
    )
    .join("\n");
}

function renderTokenLines(tokens) {
  if (!tokens.length) return "None.\n";
  return `${tokens.map((token) => `- \`${token.name}\`: \`${token.value}\``).join("\n")}\n`;
}

function renderTheming(catalog, { full }) {
  const theming = catalog.theming;
  const extra = full
    ? `### Primitive tokens

${renderTokenLines(theming.primitive)}
### Component tokens

${renderTokenLines(theming.component)}`
    : `Component hooks such as \`--rowan-button-bg\` follow the semantic layer. The full primitive and component lists are in ${catalog.llmsFullUrl}.

`;
  return `## Theming

${theming.summary}

\`\`\`js
import "${theming.baseImport}";
import "@rowan-ui/core/tokens/light";
import "@rowan-ui/core/tokens/dark";

document.documentElement.dataset.theme = "dark";
\`\`\`

${theming.guidance.map((line) => `- ${line}`).join("\n")}

### Shipped themes

${renderThemes(catalog)}

### Semantic tokens

${renderTokenLines(theming.semantic)}
Chart plots can opt into a separate palette: import \`${theming.charts.import}\` and set \`${theming.charts.attribute}="${theming.charts.value}"\`. ${theming.charts.summary}

Design-tool handoff: \`${theming.tokensJson}\`.

${extra}`;
}

function renderCompactComponents(catalog) {
  const items = catalog.components
    .map((component) => {
      const react = `React \`${component.react.component}\` from \`${component.react.importPath}\`.`;
      const note = component.importNote ? ` ${component.importNote}` : "";
      return `- [${component.tagName}](${component.docsUrl}): ${oneLine(component.description)} Import \`${component.importPath}\`. ${react}${note}

  ${compactMembers("Attributes", component.attributes)}
  ${compactMembers("Properties", component.properties)}
  ${compactMembers("Events", component.events)}
  ${compactMembers("Slots", component.slots)}
  ${compactMembers("Parts", component.cssParts)}`;
    })
    .join("\n\n");
  return `## Components

${catalog.components.length} custom elements. Each block is the public API summary (attributes, properties, events, slots, and CSS parts).

${items}
`;
}

function renderExamples(component) {
  const excerpts = component.examples.excerpts
    .map((excerpt) => {
      const label = excerpt.name ? `${excerpt.source} (${excerpt.name})` : excerpt.source;
      const language = excerpt.framework === "react" ? "tsx" : "html";
      return `### Excerpt from ${label}

${fence(language, excerpt.text)}
`;
    })
    .join("\n");
  return `### HTML

${fence("html", component.examples.html)}

### React

${fence("tsx", component.examples.react)}
${excerpts ? `\n${excerpts}` : ""}`;
}

function renderFullComponent(component) {
  const note = component.importNote ? `${component.importNote}\n\n` : "";
  const methods = component.methods.map((method) => ({
    ...method,
    signature: method.parameters?.length
      ? `${method.name}(${method.parameters.join(", ")})`
      : `${method.name}()`,
  }));
  return `## ${component.tagName}

${oneLine(component.description)}

- Package: \`${component.packageName}@${component.packageVersion}\`
- Import: \`${component.importPath}\`
- React: \`${component.react.component}\` from \`${component.react.importPath}\`
- Docs: ${component.docsUrl}
- Module: \`${component.modulePath}\`

${note}### Attributes

${table(
  ["Name", "Type", "Default", "Reflects", "Description"],
  component.attributes.map((item) => [
    item.name,
    item.type,
    item.default,
    item.reflects ? "yes" : "",
    item.description,
  ]),
)}
### Properties

${table(
  ["Name", "Type", "Default", "Reflects", "Readonly", "Description"],
  component.properties.map((item) => [
    item.name,
    item.type,
    item.default,
    item.reflects ? "yes" : "",
    item.readonly ? "yes" : "",
    item.description,
  ]),
)}
### Events

${table(
  ["Name", "Detail", "Description"],
  component.events.map((item) => [item.name, item.detail, item.description]),
)}
### Slots

${table(
  ["Name", "Description"],
  component.slots.map((item) => [item.name, item.description]),
)}
### CSS parts

${table(
  ["Name", "Description"],
  component.cssParts.map((item) => [item.name, item.description]),
)}
### CSS properties

${table(
  ["Name", "Description"],
  component.cssProperties.map((item) => [item.name, item.description]),
)}
### Methods

${table(
  ["Name", "Description"],
  methods.map((item) => [item.signature, item.description]),
)}
### Examples

${renderExamples(component)}
`;
}

function renderFullComponents(catalog) {
  return catalog.components.map(renderFullComponent).join("\n");
}

export function renderLlms(catalog) {
  return `${renderHeader(catalog)}${renderInstall(catalog)}${renderImports(catalog)}${renderTheming(catalog, { full: false })}${renderCompactComponents(catalog)}
## Optional

- [Documentation](${catalog.docsOrigin}/): guides and per-component pages
- [Storybook](${catalog.docsOrigin}/storybook/): interactive examples
- [llms-full.txt](${catalog.llmsFullUrl}): descriptions, methods, CSS properties, tokens, and copy-paste examples
- [Use Rowan with AI tools](${catalog.docsOrigin}/#ai-tools): Cursor, Claude Code, and VS Code setup
`;
}

export function renderLlmsFull(catalog) {
  return `${renderHeader(catalog)}${renderInstall(catalog)}${renderImports(catalog)}${renderTheming(catalog, { full: true })}${renderFullComponents(catalog)}`;
}
