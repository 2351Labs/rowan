import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, extname, join, parse, resolve } from "node:path";
import { createRequire } from "node:module";
import { DOMParser } from "@xmldom/xmldom";
import { format } from "prettier";

const require = createRequire(import.meta.url);
const packageRoot = dirname(require.resolve("lucide-static/package.json"));
const sourceDirectory = resolve(packageRoot, "icons");
const outputDirectory = new URL("../src/icons/", import.meta.url);
const elementOutputDirectory = new URL("../src/elements/", import.meta.url);
const RESTRICTED_GLOBAL_EXPORT_NAMES = new Set(["Infinity"]);

function toExportName(name) {
  const parts = name.split(/[^a-zA-Z0-9]+/).filter(Boolean);

  return parts
    .map((part, index) => {
      const previous = parts[index - 1];
      const followsNumericPart = /^\d+$/.test(part) && /^\d+$/.test(previous || "");
      const prefix = followsNumericPart ? "To" : "";
      return `${prefix}${part.slice(0, 1).toUpperCase()}${part.slice(1)}`;
    })
    .join("");
}

function getImplementationName(exportName) {
  return RESTRICTED_GLOBAL_EXPORT_NAMES.has(exportName) ? `create${exportName}` : exportName;
}

function serializeNode(element) {
  const attributes = {};
  for (let index = 0; index < element.attributes.length; index += 1) {
    const attribute = element.attributes.item(index);
    if (attribute) attributes[attribute.name] = attribute.value;
  }

  const children = [];
  for (let index = 0; index < element.childNodes.length; index += 1) {
    const child = element.childNodes.item(index);
    if (child?.nodeType === 1) children.push(serializeNode(child));
  }

  return children.length > 0
    ? [element.tagName, attributes, children]
    : [element.tagName, attributes];
}

function readDefinition(fileName) {
  const source = readFileSync(join(sourceDirectory, fileName), "utf8");
  const document = new DOMParser().parseFromString(source, "image/svg+xml");
  const root = document.documentElement;

  if (root?.tagName !== "svg") {
    throw new Error(`Unable to parse ${fileName} as an SVG icon.`);
  }

  const nodes = [];
  for (let index = 0; index < root.childNodes.length; index += 1) {
    const child = root.childNodes.item(index);
    if (child?.nodeType === 1) nodes.push(serializeNode(child));
  }

  return {
    name: parse(fileName).name,
    nodes,
  };
}

async function writeIcon(fileName, definition, exportName) {
  const source = `import { createIcon } from "../icon.js";\n\nconst definition = ${JSON.stringify(
    definition,
    null,
    2,
  )};\n\n/**\n * Creates the ${definition.name} icon.\n * @param {import("../icon.js").IconOptions} [options]\n * @returns {SVGSVGElement}\n */\nexport function ${exportName}(options) {\n  return createIcon(definition, options);\n}\n\nexport default ${exportName};\n`;
  const implementationName = getImplementationName(exportName);
  const generatedSource =
    implementationName === exportName
      ? source
      : source
          .replace(`export function ${exportName}`, `function ${implementationName}`)
          .replace(
            `export default ${exportName};`,
            `export { ${implementationName} as ${exportName} };\n\nexport default ${implementationName};`,
          );
  const formatted = await format(generatedSource, { parser: "babel" });
  writeFileSync(new URL(fileName, outputDirectory), formatted);
}

async function writeElement(fileName, name) {
  const source = `import { registerIcon } from "../element.js";
import icon from "../icons/${fileName}";

registerIcon(${JSON.stringify(name)}, icon);
`;
  const formatted = await format(source, { parser: "babel" });
  writeFileSync(new URL(fileName, elementOutputDirectory), formatted);
}

const iconFiles = readdirSync(sourceDirectory)
  .filter((fileName) => extname(fileName) === ".svg")
  .sort((left, right) => left.localeCompare(right));

if (iconFiles.length === 0) {
  throw new Error("No Lucide SVG files were found.");
}

rmSync(outputDirectory, { force: true, recursive: true });
mkdirSync(outputDirectory, { recursive: true });
rmSync(elementOutputDirectory, { force: true, recursive: true });
mkdirSync(elementOutputDirectory, { recursive: true });

const exportNames = new Set();
const exports = [];
for (const fileName of iconFiles) {
  const definition = readDefinition(fileName);
  const exportName = toExportName(definition.name);

  if (!exportName || exportNames.has(exportName)) {
    throw new Error(`Cannot generate a unique export for ${fileName}.`);
  }

  exportNames.add(exportName);
  await writeIcon(`${definition.name}.js`, definition, exportName);
  await writeElement(`${definition.name}.js`, definition.name);
  exports.push(`export { default as ${exportName} } from "./${definition.name}.js";`);
}

writeFileSync(new URL("index.js", outputDirectory), `${exports.join("\n")}\n`);

console.log(`Generated ${iconFiles.length} individually importable Lucide icons.`);
