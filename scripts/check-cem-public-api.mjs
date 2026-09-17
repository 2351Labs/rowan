import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { isPublicApiMember } from "./cem-public-api-plugin.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const manifests = [
  "custom-elements.json",
  "packages/icons/custom-elements.json",
  "packages/maplibre/custom-elements.json",
];

const errors = [];

for (const relativePath of manifests) {
  const manifest = JSON.parse(readFileSync(resolve(root, relativePath), "utf8"));
  let customElements = 0;

  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.kind !== "class" || !declaration.tagName) continue;
      customElements += 1;

      if (!declaration.tagName.startsWith("rowan-")) {
        errors.push(`${relativePath}: ${declaration.name} tagName "${declaration.tagName}"`);
      }

      for (const member of declaration.members ?? []) {
        if (!isPublicApiMember(member)) {
          errors.push(
            `${relativePath}: ${declaration.tagName} leaked ${member.kind} ${member.name}`,
          );
        }
      }
    }
  }

  if (customElements === 0) {
    errors.push(`${relativePath}: no custom elements`);
  }
}

if (errors.length > 0) {
  throw new Error(`Published CEM is not a public contract:\n${errors.join("\n")}`);
}

console.log("Published CEM public API check passed.");
