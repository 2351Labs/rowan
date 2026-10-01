import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const typesDirectory = fileURLToPath(new URL("../types/", import.meta.url));
const sourceDirectory = fileURLToPath(new URL("../src/", import.meta.url));

async function declarationFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await declarationFiles(path)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".d.ts")) files.push(path);
  }

  return files;
}

function messageTypes(declaration) {
  return [...declaration.matchAll(/^export type (Rowan[A-Za-z0-9]+Messages) =/gm)].map(
    ([, type]) => type,
  );
}

function moduleSpecifier(from, to) {
  const path = relative(dirname(from), to)
    .replaceAll(sep, "/")
    .replace(/\.d\.ts$/, ".js");
  return path.startsWith(".") ? path : `./${path}`;
}

async function addTypeExports(file, target, types) {
  const declaration = await readFile(file, "utf8");
  const missing = types.filter((type) => !new RegExp(`\\b${type}\\b`).test(declaration));
  if (missing.length === 0) return;

  const specifier = moduleSpecifier(file, target);
  const additions = missing
    .map((type) => `export type { ${type} } from "${specifier}";`)
    .join("\n");
  await writeFile(file, `${declaration.trimEnd()}\n${additions}\n`);
}

const rootTypes = [];
for (const typeFile of await declarationFiles(typesDirectory)) {
  const declaration = await readFile(typeFile, "utf8");
  const types = messageTypes(declaration);
  if (types.length === 0) continue;

  const sourceFile = join(sourceDirectory, relative(typesDirectory, typeFile));
  await addTypeExports(sourceFile, typeFile, types);
  rootTypes.push({ typeFile, types });
}

const rootDeclaration = join(sourceDirectory, "index.d.ts");
for (const { typeFile, types } of rootTypes) {
  await addTypeExports(rootDeclaration, typeFile, types);
}