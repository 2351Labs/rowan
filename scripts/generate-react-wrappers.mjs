import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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

function relativeFromGenerated(outDir, packageRoot, modulePath) {
  const from = join(outDir, "placeholder.js");
  const to = resolve(packageRoot, modulePath);
  const spec = relative(dirname(from), to).replaceAll("\\", "/");
  return spec.startsWith(".") ? spec : `./${spec}`;
}

function renderWrapper(element, { outDir, packageRoot, createWrapperImport }) {
  const importPath = relativeFromGenerated(outDir, packageRoot, element.modulePath);
  const eventEntries = element.events
    .map((name) => `    ${eventPropName(name)}: "${name}",`)
    .join("\n");
  const eventsBlock = eventEntries ? `{\n${eventEntries}\n  }` : "{}";

  return `/**
 * @generated from custom-elements.json
 */
import ${JSON.stringify(importPath)};
import { createRowanComponent } from ${JSON.stringify(createWrapperImport)};

export const ${element.className} = createRowanComponent({
  tagName: ${JSON.stringify(element.tagName)},
  displayName: ${JSON.stringify(element.className)},
  events: ${eventsBlock},
});
`;
}

function renderEventProps(events) {
  if (events.length === 0) return "{}";

  const fields = events
    .map((name) => `    ${eventPropName(name)}?: (event: CustomEvent) => void;`)
    .join("\n");
  return `{\n${fields}\n  }`;
}

function renderWrapperTypes(element, { outDir, packageRoot, wrapperPropsImport }) {
  const importPath = relativeFromGenerated(outDir, packageRoot, element.modulePath);

  return `import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { ${element.className} as ${element.className}Element } from ${JSON.stringify(importPath)};
import type { RowanWrapperProps } from ${JSON.stringify(wrapperPropsImport)};

export const ${element.className}: ForwardRefExoticComponent<
  RowanWrapperProps<${element.className}Element, ${renderEventProps(element.events)}> &
    RefAttributes<${element.className}Element>
>;
`;
}

function generatePackage(target) {
  const packageRoot = target.packageRoot;
  const outDir = target.outDir;
  const manifest = JSON.parse(readFileSync(resolve(packageRoot, "custom-elements.json"), "utf8"));
  const elements = collectElements(manifest);

  if (elements.length === 0) {
    throw new Error(`generate-react-wrappers: no custom elements in ${target.name}`);
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const barrelExports = [];
  const typeExports = [];

  for (const element of elements) {
    const fileName = fileNameForTag(element.tagName);
    writeFileSync(join(outDir, `${fileName}.js`), renderWrapper(element, target));
    writeFileSync(join(outDir, `${fileName}.d.ts`), renderWrapperTypes(element, target));
    barrelExports.push(`export { ${element.className} } from "./${fileName}.js";`);
    typeExports.push(`export { ${element.className} } from "./${fileName}.js";`);
  }

  writeFileSync(join(outDir, "index.js"), `${barrelExports.join("\n")}\n`);
  writeFileSync(join(outDir, "index.d.ts"), `${typeExports.join("\n")}\n`);

  execFileSync(resolve(root, "node_modules/.bin/prettier"), ["--write", outDir], {
    cwd: root,
    stdio: "inherit",
  });

  for (const check of target.checks) {
    const source = readFileSync(join(outDir, check.file), "utf8");
    for (const needle of check.needles) {
      if (!source.includes(needle)) {
        throw new Error(`generate-react-wrappers: ${target.name} ${check.file} missing ${needle}`);
      }
    }
  }

  console.log(`Generated ${elements.length} React wrappers for ${target.name}.`);
}

const packages = [
  {
    name: "core",
    packageRoot: root,
    outDir: join(root, "src/react/generated"),
    createWrapperImport: "../create-wrapper.js",
    wrapperPropsImport: "../wrapper-props.js",
    checks: [
      { file: "button.js", needles: ['tagName: "rowan-button"', "onRowanClick"] },
      { file: "table.js", needles: ["../../table/table.js", "onRowanSelect"] },
    ],
  },
  {
    name: "icons",
    packageRoot: join(root, "packages/icons"),
    outDir: join(root, "packages/icons/src/react/generated"),
    createWrapperImport: "@rowan-ui/core/react",
    wrapperPropsImport: "@rowan-ui/core/react/wrapper-props",
    checks: [{ file: "icon.js", needles: ['tagName: "rowan-icon"', "../../element.js"] }],
  },
  {
    name: "maplibre",
    packageRoot: join(root, "packages/maplibre"),
    outDir: join(root, "packages/maplibre/src/react/generated"),
    createWrapperImport: "@rowan-ui/core/react",
    wrapperPropsImport: "@rowan-ui/core/react/wrapper-props",
    checks: [
      {
        file: "maplibre-map.js",
        needles: ['tagName: "rowan-maplibre-map"', "onRowanLocationActivate", "../../map/map.js"],
      },
    ],
  },
];

for (const target of packages) {
  generatePackage(target);
}
