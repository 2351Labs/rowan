import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "custom-elements.json"), "utf8"));
const outDir = resolve(root, "src/react/generated");

function eventPropName(eventName) {
  return `on${eventName
    .split("-")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join("")}`;
}

function fileNameForTag(tagName) {
  return tagName.replace(/^rowan-/, "");
}

function collectElements(customElementsManifest) {
  const elements = [];

  for (const module of customElementsManifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.kind !== "class" || !declaration.tagName) continue;
      elements.push({
        className: declaration.name,
        tagName: declaration.tagName,
        modulePath: module.path,
        events: (declaration.events ?? []).map((event) => event.name).filter(Boolean),
      });
    }
  }

  return elements.sort((left, right) => left.tagName.localeCompare(right.tagName));
}

function relativeFromGenerated(modulePath) {
  const from = join(outDir, "placeholder.js");
  const to = resolve(root, modulePath);
  const spec = relative(dirname(from), to).replaceAll("\\", "/");
  return spec.startsWith(".") ? spec : `./${spec}`;
}

function renderWrapper({ className, tagName, modulePath, events }) {
  const importPath = relativeFromGenerated(modulePath);
  const eventEntries = events.map((name) => `    ${eventPropName(name)}: "${name}",`).join("\n");
  const eventsBlock = eventEntries ? `{\n${eventEntries}\n  }` : "{}";

  return `/**
 * @generated from custom-elements.json
 */
import ${JSON.stringify(importPath)};
import { createRowanComponent } from "../create-wrapper.js";

export const ${className} = createRowanComponent({
  tagName: ${JSON.stringify(tagName)},
  displayName: ${JSON.stringify(className)},
  events: ${eventsBlock},
});
`;
}

function renderWrapperTypes({ className, modulePath }) {
  const importPath = relativeFromGenerated(modulePath);

  return `import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { ${className} as ${className}Element } from ${JSON.stringify(importPath)};

export const ${className}: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<${className}Element>
>;
`;
}

const elements = collectElements(manifest);
if (elements.length === 0) {
  throw new Error("generate-react-wrappers: no custom elements in custom-elements.json");
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const barrelExports = [];
const typeExports = [];

for (const element of elements) {
  const fileName = fileNameForTag(element.tagName);
  writeFileSync(join(outDir, `${fileName}.js`), renderWrapper(element));
  writeFileSync(join(outDir, `${fileName}.d.ts`), renderWrapperTypes(element));
  barrelExports.push(`export { ${element.className} } from "./${fileName}.js";`);
  typeExports.push(`export { ${element.className} } from "./${fileName}.js";`);
}

writeFileSync(join(outDir, "index.js"), `${barrelExports.join("\n")}\n`);
writeFileSync(join(outDir, "index.d.ts"), `${typeExports.join("\n")}\n`);

const buttonSource = readFileSync(join(outDir, "button.js"), "utf8");
if (!buttonSource.includes('tagName: "rowan-button"') || !buttonSource.includes("onRowanClick")) {
  throw new Error("generate-react-wrappers: rowan-button wrapper is missing its public contract");
}

const tableSource = readFileSync(join(outDir, "table.js"), "utf8");
if (!tableSource.includes("../../table/table.js") || !tableSource.includes("onRowanSelect")) {
  throw new Error("generate-react-wrappers: rowan-table wrapper is missing its public contract");
}

console.log(`Generated ${elements.length} React wrappers in src/react/generated.`);
