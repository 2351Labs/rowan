import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporaryDirectory = mkdtempSync(join(tmpdir(), "rowan-package-registration-"));
const packageDirectory = join(temporaryDirectory, "packages");
const consumerDirectory = join(temporaryDirectory, "consumer");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function packWorkspace(workspace) {
  const args = ["pack", "--json", "--pack-destination", packageDirectory];
  if (workspace) args.splice(1, 0, `--workspace=${workspace}`);

  const output = execFileSync(npmCommand, args, {
    cwd: repositoryRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const [packed] = JSON.parse(output);

  if (!packed?.filename) {
    throw new Error(`npm pack did not produce an archive for ${workspace ?? "@rowan-ui/core"}.`);
  }

  return join(packageDirectory, packed.filename);
}

function extractPackage(archivePath, packageName) {
  const extractionDirectory = mkdtempSync(join(temporaryDirectory, "extract-"));
  const destination = join(consumerDirectory, "node_modules", ...packageName.split("/"));

  execFileSync("tar", ["-xzf", archivePath, "-C", extractionDirectory], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  mkdirSync(dirname(destination), { recursive: true });
  renameSync(join(extractionDirectory, "package"), destination);
}

function installCustomElementRegistry() {
  const originalHTMLElement = globalThis.HTMLElement;
  const originalRegistry = globalThis.customElements;
  const definitions = new Map();

  globalThis.HTMLElement = class HTMLElement {};
  globalThis.customElements = {
    define(tagName, ElementClass) {
      if (definitions.has(tagName)) {
        throw new Error(`Duplicate custom-element registration for ${tagName}.`);
      }
      definitions.set(tagName, ElementClass);
    },
    get(tagName) {
      return definitions.get(tagName);
    },
  };

  return () => {
    if (originalHTMLElement === undefined) {
      delete globalThis.HTMLElement;
    } else {
      globalThis.HTMLElement = originalHTMLElement;
    }

    if (originalRegistry === undefined) {
      delete globalThis.customElements;
    } else {
      globalThis.customElements = originalRegistry;
    }
  };
}

async function assertRootImportRegisters(packageName, tagName) {
  const entryPath = join(consumerDirectory, `${tagName}-entry.js`);
  const outputPath = join(consumerDirectory, `${tagName}-bundle.mjs`);

  writeFileSync(entryPath, `import ${JSON.stringify(packageName)};\n`);
  await build({
    bundle: true,
    entryPoints: [entryPath],
    format: "esm",
    external: ["maplibre-gl"],
    logLevel: "silent",
    outfile: outputPath,
    platform: "browser",
    target: "es2022",
    treeShaking: true,
  });

  await import(pathToFileURL(outputPath).href);
  if (!globalThis.customElements.get(tagName)) {
    throw new Error(`Bare import of ${packageName} did not register ${tagName}.`);
  }
}

async function main() {
  mkdirSync(packageDirectory, { recursive: true });
  mkdirSync(consumerDirectory, { recursive: true });

  const coreArchive = packWorkspace();
  const maplibreArchive = packWorkspace("@rowan-ui/maplibre");
  extractPackage(coreArchive, "@rowan-ui/core");
  extractPackage(maplibreArchive, "@rowan-ui/maplibre");

  const restoreCustomElementRegistry = installCustomElementRegistry();
  try {
    await assertRootImportRegisters("@rowan-ui/core", "rowan-button");
    await assertRootImportRegisters("@rowan-ui/maplibre", "rowan-maplibre-map");
  } finally {
    restoreCustomElementRegistry();
  }
}

try {
  await main();
} finally {
  rmSync(temporaryDirectory, { force: true, recursive: true });
}
