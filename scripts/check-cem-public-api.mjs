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

/** Pins that wrapper generation depends on. Fail if analyze drops them. */
const REQUIRED_CONTRACTS = {
  "custom-elements.json": {
    "rowan-button": {
      members: ["variant", "disabled"],
      events: ["rowan-click"],
    },
    "rowan-table": {
      members: ["config", "selected"],
      events: ["rowan-select"],
      notAttributes: ["config", "selected"],
    },
    "rowan-radio-group": {
      members: ["name", "required", "value"],
      events: ["rowan-change"],
    },
  },
  "packages/icons/custom-elements.json": {
    "rowan-icon": {
      members: ["name"],
    },
  },
  "packages/maplibre/custom-elements.json": {
    "rowan-maplibre-map": {
      members: ["locations", "mapStyle"],
      events: ["rowan-location-activate"],
    },
  },
};

const errors = [];

function names(items) {
  return new Set((items ?? []).map((item) => item.name).filter(Boolean));
}

function collectCustomElements(manifest, sourcePath) {
  const byTag = new Map();

  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.kind !== "class") continue;

      for (const member of declaration.members ?? []) {
        if (!isPublicApiMember(member)) {
          const where = declaration.tagName ?? declaration.name;
          errors.push(`${sourcePath}: ${where} leaked ${member.kind} ${member.name}`);
        }
      }

      if (declaration.name.startsWith("Rowan") && !declaration.tagName) {
        errors.push(`${sourcePath}: ${declaration.name} is missing tagName`);
        continue;
      }

      if (!declaration.tagName) continue;
      byTag.set(declaration.tagName, declaration);
    }
  }

  return byTag;
}

for (const relativePath of manifests) {
  const manifest = JSON.parse(readFileSync(resolve(root, relativePath), "utf8"));
  const byTag = collectCustomElements(manifest, relativePath);

  if (byTag.size === 0) {
    errors.push(`${relativePath}: no custom elements`);
    continue;
  }

  for (const [tagName, declaration] of byTag) {
    if (!tagName.startsWith("rowan-")) {
      errors.push(`${relativePath}: ${declaration.name} tagName "${tagName}"`);
    }
  }

  const required = REQUIRED_CONTRACTS[relativePath] ?? {};
  for (const [tagName, contract] of Object.entries(required)) {
    const declaration = byTag.get(tagName);
    if (!declaration) {
      errors.push(`${relativePath}: missing ${tagName}`);
      continue;
    }

    const memberNames = names(declaration.members);
    const eventNames = names(declaration.events);
    const attributeNames = names(declaration.attributes);

    for (const member of contract.members ?? []) {
      if (!memberNames.has(member)) {
        errors.push(`${relativePath}: ${tagName} missing member ${member}`);
      }
    }

    for (const event of contract.events ?? []) {
      if (!eventNames.has(event)) {
        errors.push(`${relativePath}: ${tagName} missing event ${event}`);
      }
    }

    for (const attribute of contract.notAttributes ?? []) {
      if (attributeNames.has(attribute)) {
        errors.push(`${relativePath}: ${tagName} must not reflect ${attribute} as an attribute`);
      }
    }
  }
}

if (errors.length > 0) {
  throw new Error(`Published CEM is not a public contract:\n${errors.join("\n")}`);
}

console.log("Published CEM public API check passed.");
