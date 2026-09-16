import { readdirSync, readFileSync } from "node:fs";

const ICON_DIRECTORY = new URL("../src/icons/", import.meta.url);
const ELEMENT_DIRECTORY = new URL("../src/elements/", import.meta.url);
const EXPECTED_ICON_COUNT = 2098;
const REQUIRED_ICONS = ["a-arrow-down", "arrow-right", "circle-check", "download", "menu", "x"];

const iconFiles = readdirSync(ICON_DIRECTORY)
  .filter((fileName) => fileName.endsWith(".js") && fileName !== "index.js")
  .sort((left, right) => left.localeCompare(right));
const elementFiles = readdirSync(ELEMENT_DIRECTORY)
  .filter((fileName) => fileName.endsWith(".js"))
  .sort((left, right) => left.localeCompare(right));

if (iconFiles.length !== EXPECTED_ICON_COUNT) {
  throw new Error(
    `Expected ${EXPECTED_ICON_COUNT} generated icon modules but found ${iconFiles.length}. Run npm run generate.`,
  );
}

if (elementFiles.length !== EXPECTED_ICON_COUNT) {
  throw new Error(
    `Expected ${EXPECTED_ICON_COUNT} generated declarative icon modules but found ${elementFiles.length}. Run npm run generate.`,
  );
}

const indexSource = readFileSync(new URL("index.js", ICON_DIRECTORY), "utf8");
const indexExports = indexSource.split("\n").filter((line) => line.startsWith("export "));
if (indexExports.length !== EXPECTED_ICON_COUNT) {
  throw new Error(
    `Expected ${EXPECTED_ICON_COUNT} barrel exports but found ${indexExports.length}. Run npm run generate.`,
  );
}

for (const iconName of REQUIRED_ICONS) {
  const fileName = `${iconName}.js`;
  if (!iconFiles.includes(fileName)) {
    throw new Error(`Required generated icon ${fileName} is missing.`);
  }


const infinitySource = readFileSync(new URL("infinity.js", ICON_DIRECTORY), "utf8");
if (
  infinitySource.includes("export function Infinity(") ||
  !infinitySource.includes("export { createInfinity as Infinity };")
) {
  throw new Error("infinity.js must preserve its public export without a restricted binding.");
}
  const source = readFileSync(new URL(fileName, ICON_DIRECTORY), "utf8");
  if (!source.includes('import { createIcon } from "../icon.js";')) {
    throw new Error(`${fileName} does not use the shared SVG factory.`);
  }
  if (!source.includes(`name: "${iconName}"`)) {
    throw new Error(`${fileName} does not preserve its source icon name.`);
  }
}

for (const fileName of iconFiles) {
  if (!elementFiles.includes(fileName)) {
    throw new Error(`Missing declarative icon module for ${fileName}. Run npm run generate.`);
  }

  const iconName = fileName.slice(0, -3);
  const source = readFileSync(new URL(fileName, ELEMENT_DIRECTORY), "utf8");
  if (!source.includes('import { registerIcon } from "../element.js";')) {
    throw new Error(`${fileName} does not import the declarative icon registrar.`);
  }
  if (!source.includes(`import icon from "../icons/${fileName}";`)) {
    throw new Error(`${fileName} does not import its matching icon module.`);
  }
  if (!source.includes(`registerIcon("${iconName}", icon);`)) {
    throw new Error(`${fileName} does not register its matching icon name.`);
  }
}

console.log(`Verified ${iconFiles.length} individually importable Lucide icon modules.`);