/**
 * Build documentation/generated/api-reference.json from the public manifests
 * and component JSDoc. `--check` fails when the committed file is stale or a
 * public component is missing a complete reference.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(rootDir, "documentation/generated/api-reference.json");

const SOURCES = [
  { manifest: "custom-elements.json", packageRoot: rootDir, reactDir: "src/react/generated" },
  {
    manifest: "packages/icons/custom-elements.json",
    packageRoot: join(rootDir, "packages/icons"),
    reactDir: "packages/icons/src/react/generated",
  },
  {
    manifest: "packages/maplibre/custom-elements.json",
    packageRoot: join(rootDir, "packages/maplibre"),
    reactDir: "packages/maplibre/src/react/generated",
  },
];

const HIDDEN_FIELDS = new Set([
  "internals",
  "form",
  "validity",
  "validationMessage",
  "willValidate",
]);

const HIDDEN_METHODS = new Set([
  "constructor",
  "connectedCallback",
  "disconnectedCallback",
  "attributeChangedCallback",
  "adoptedCallback",
  "formAssociatedCallback",
  "formDisabledCallback",
  "formResetCallback",
  "formStateRestoreCallback",
  "setFormValue",
  "setValidity",
  "checkValidity",
  "reportValidity",
  "setCustomValidity",
  "render",
  "updated",
  "firstUpdated",
  "willUpdate",
]);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function kebab(name) {
  return String(name).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function titleFromTag(tagName) {
  return tagName
    .replace(/^rowan-/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function typeText(type) {
  if (!type) return "";
  if (typeof type === "string") return type.replace(/\s+/g, " ").trim();
  return String(type.text || "").replace(/\s+/g, " ").trim();
}

function eventPropName(eventName) {
  return `on${eventName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")}`;
}

function classJsdoc(source) {
  const match = source.match(/\/\*\*((?:(?!\/\*\*)[\s\S])*?)\*\/\s*export class /);
  return match ? match[1] : "";
}

function takeBraceType(body) {
  if (!body.startsWith("{")) return { type: "", rest: body };
  let depth = 0;
  for (let index = 0; index < body.length; index += 1) {
    if (body[index] === "{") depth += 1;
    else if (body[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        return {
          type: body.slice(1, index).replace(/\s+/g, " ").trim(),
          rest: body.slice(index + 1).trim(),
        };
      }
    }
  }
  return { type: "", rest: body };
}

function parseTypedMember(rest) {
  const braced = takeBraceType(rest.trim());
  let body = braced.rest;
  let type = braced.type;

  let description = "";
  const dash = body.indexOf(" - ");
  if (dash >= 0) {
    description = body.slice(dash + 3).trim();
    body = body.slice(0, dash).trim();
  }

  let name = body;
  let defaultValue = "";
  const bracket = body.match(/^\[([^\]]+)\]$/);
  if (bracket) {
    const inner = bracket[1];
    const eq = inner.indexOf("=");
    if (eq >= 0) {
      name = inner.slice(0, eq).trim();
      defaultValue = inner.slice(eq + 1).trim();
    } else {
      name = inner.trim();
    }
  }

  return { name, type, defaultValue, description };
}

function parseJsdoc(source) {
  const block = classJsdoc(source);
  const attributes = new Map();
  const properties = new Map();
  const slots = new Map();
  const parts = new Map();
  const cssProperties = new Map();
  const events = new Map();

  for (const line of block.split("\n")) {
    const match = line.match(/^\s*\*\s*@(attr|property|slot|csspart|cssprop|cssproperty|event)\s+(.+)$/);
    if (!match) continue;
    const kind = match[1] === "cssproperty" ? "cssprop" : match[1];
    const parsed = parseTypedMember(match[2]);
    if (!parsed.name && kind !== "slot") continue;
    const record = {
      name: parsed.name || "(default)",
      type: parsed.type,
      defaultValue: parsed.defaultValue,
      description: parsed.description,
    };
    if (kind === "attr") attributes.set(record.name, record);
    if (kind === "property") properties.set(record.name, record);
    if (kind === "slot") slots.set(record.name || "(default)", record);
    if (kind === "csspart") parts.set(record.name, record);
    if (kind === "cssprop") cssProperties.set(record.name, record);
    if (kind === "event") events.set(record.name, record);
  }

  return { attributes, properties, slots, parts, cssProperties, events };
}

function defaultsFromSource(source) {
  const defaults = new Map();
  for (const match of source.matchAll(/readString\(\s*"([^"]+)"\s*,\s*"([^"]*)"\s*\)/g)) {
    defaults.set(match[1], match[2]);
  }
  for (const match of source.matchAll(/readNumber\(\s*"([^"]+)"\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/g)) {
    defaults.set(match[1], match[2]);
  }
  for (const match of source.matchAll(/readBoolean\(\s*"([^"]+)"\s*\)/g)) {
    if (!defaults.has(match[1])) defaults.set(match[1], "false");
  }
  for (const match of source.matchAll(
    /reflectEnum\(\s*this\s*,\s*"([^"]+)"\s*,[\s\S]*?,\s*"([^"]+)"\s*\)/g,
  )) {
    defaults.set(match[1], match[2]);
  }
  return defaults;
}

function detailShape(description) {
  const match = String(description || "").match(/Detail:\s*(.+)$/i);
  return match ? match[1].trim() : "";
}

function usageExample(entry) {
  const attrs = [];
  for (const attribute of entry.attributes) {
    if (attrs.length >= 2) break;
    const type = attribute.type.toLowerCase();
    if (type.includes("boolean")) continue;
    if (attribute.type.includes("|")) {
      const first = attribute.type
        .split("|")[0]
        .replace(/["']/g, "")
        .trim();
      if (first && !first.includes(" ")) attrs.push(`${attribute.name}="${first}"`);
      continue;
    }
    if (attribute.name === "label") {
      attrs.push(`label="${entry.title}"`);
      continue;
    }
    if (attribute.name === "name" && entry.tagName === "rowan-icon") {
      attrs.push('name="check"');
    }
  }

  const open = attrs.length ? `<${entry.tagName} ${attrs.join(" ")}>` : `<${entry.tagName}>`;
  const hasDefaultSlot = entry.slots.some((slot) => slot.name === "(default)");
  if (!hasDefaultSlot) return `${open.replace(/>$/, "")}></${entry.tagName}>`.replace(" >", ">");
  return `${open}${entry.title}</${entry.tagName}>`;
}

function reactEvents(reactDir, slug, events) {
  const wrapperPath = join(rootDir, reactDir, `${slug}.js`);
  try {
    const source = readFileSync(wrapperPath, "utf8");
    const block = source.match(/events:\s*\{([\s\S]*?)\}/);
    if (block) {
      const found = [...block[1].matchAll(/(\w+)\s*:\s*"([^"]+)"/g)].map((match) => ({
        name: match[1],
        event: match[2],
      }));
      if (found.length > 0 || events.length === 0) return found.sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch {
    // Fall back to the manifest event list.
  }

  return events
    .map((event) => ({ name: eventPropName(event.name), event: event.name }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function publicProperties(declaration, jsdoc, defaults) {
  const byName = new Map();
  for (const member of declaration.members || []) {
    if (member.kind !== "field" || member.static) continue;
    if (member.privacy === "private" || member.privacy === "protected") continue;
    if (!member.name || member.name.startsWith("_") || member.name.startsWith("#")) continue;
    if (HIDDEN_FIELDS.has(member.name)) continue;
    const type = typeText(member.type) || typeText(member.return?.type);
    if (member.name === "labels" && !type.includes("string")) continue;
    byName.set(member.name, {
      name: member.name,
      type: type || jsdoc.properties.get(member.name)?.type || "",
      description: member.description || jsdoc.properties.get(member.name)?.description || "",
      readonly: Boolean(member.readonly),
      attribute: member.attribute || "",
    });
  }

  for (const [name, record] of jsdoc.properties) {
    if (HIDDEN_FIELDS.has(name) || byName.has(name)) {
      if (byName.has(name) && !byName.get(name).description && record.description) {
        byName.get(name).description = record.description;
      }
      continue;
    }
    byName.set(name, {
      name,
      type: record.type,
      description: record.description,
      readonly: false,
      attribute: "",
    });
  }

  const attributeNames = new Set((declaration.attributes || []).map((attribute) => attribute.name));
  for (const name of jsdoc.attributes.keys()) attributeNames.add(name);

  return [...byName.values()]
    .map((property) => {
      const attributeName = property.attribute || kebab(property.name);
      const reflects = attributeNames.has(attributeName) || attributeNames.has(property.name);
      const defaultValue =
        defaults.get(attributeName) ||
        defaults.get(property.name) ||
        jsdoc.properties.get(property.name)?.defaultValue ||
        jsdoc.attributes.get(attributeName)?.defaultValue ||
        "";
      return {
        name: property.name,
        type: property.type,
        default: defaultValue,
        reflects,
        readonly: property.readonly,
        description: property.description,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

function publicAttributes(declaration, jsdoc, defaults, properties) {
  const byName = new Map();
  for (const attribute of declaration.attributes || []) {
    if (!attribute.name || attribute.name.startsWith("aria-")) continue;
    byName.set(attribute.name, {
      name: attribute.name,
      type: typeText(attribute.type),
      description: attribute.description || "",
    });
  }
  for (const [name, record] of jsdoc.attributes) {
    const current = byName.get(name);
    if (!current) {
      byName.set(name, { name, type: record.type, description: record.description });
      continue;
    }
    if (!current.type) current.type = record.type;
    if (!current.description) current.description = record.description;
  }

  const reflecting = new Set(
    properties.filter((property) => property.reflects).flatMap((property) => [kebab(property.name), property.name]),
  );

  return [...byName.values()]
    .map((attribute) => ({
      name: attribute.name,
      type: attribute.type,
      default:
        defaults.get(attribute.name) ||
        jsdoc.attributes.get(attribute.name)?.defaultValue ||
        (attribute.type.replace(/\s/g, "") === "boolean" ? "false" : ""),
      reflects:
        reflecting.has(attribute.name) ||
        properties.some((property) => kebab(property.name) === attribute.name) ||
        attribute.type.replace(/\s/g, "") === "boolean",
      description: attribute.description,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function namedRecords(manifestItems, jsdocMap, emptyName = "(default)") {
  const byName = new Map();
  for (const item of manifestItems || []) {
    const name = (item.name || "").trim() || emptyName;
    byName.set(name, { name, description: item.description || "" });
  }
  for (const [name, record] of jsdocMap) {
    const key = name || emptyName;
    const current = byName.get(key);
    if (!current) byName.set(key, { name: key, description: record.description || "" });
    else if (!current.description) current.description = record.description || "";
  }
  return [...byName.values()].sort((left, right) => left.name.localeCompare(right.name));
}

function publicMethods(declaration) {
  return (declaration.members || [])
    .filter((member) => {
      if (member.kind !== "method" || member.static) return false;
      if (member.privacy === "private" || member.privacy === "protected") return false;
      if (!member.name || HIDDEN_METHODS.has(member.name)) return false;
      return true;
    })
    .map((member) => ({
      name: member.name,
      parameters: (member.parameters || []).map((parameter) => parameter.name).filter(Boolean),
      inherited: member.inheritedFrom?.name || "",
      description: member.description || "",
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function buildComponent(declaration, modulePath, packageRoot, reactDir) {
  const sourcePath = join(packageRoot, modulePath);
  let source = "";
  try {
    source = readFileSync(sourcePath, "utf8");
  } catch {
    source = "";
  }
  const jsdoc = parseJsdoc(source);
  const defaults = defaultsFromSource(source);
  const properties = publicProperties(declaration, jsdoc, defaults);
  const attributes = publicAttributes(declaration, jsdoc, defaults, properties);
  const events = namedRecords(declaration.events, jsdoc.events, "").map((event) => {
    const documented = jsdoc.events.get(event.name);
    const description = event.description || documented?.description || "";
    return {
      name: event.name,
      description,
      detail: detailShape(description) || detailShape(documented?.description || ""),
    };
  });
  const slots = namedRecords(declaration.slots, jsdoc.slots);
  const parts = namedRecords(declaration.cssParts, jsdoc.parts, "");
  const cssProperties = [
    ...namedRecords(declaration.cssProperties, jsdoc.cssProperties, ""),
    ...[...jsdoc.cssProperties.values()]
      .filter((record) => !(declaration.cssProperties || []).some((item) => item.name === record.name))
      .map((record) => ({ name: record.name, description: record.description })),
  ].sort((left, right) => left.name.localeCompare(right.name));

  const slug = declaration.tagName.replace(/^rowan-/, "");
  const entry = {
    tagName: declaration.tagName,
    className: declaration.name,
    title: titleFromTag(declaration.tagName),
    description: String(declaration.description || "").replace(/\s+/g, " ").trim(),
    modulePath: modulePath.replaceAll("\\", "/"),
    attributes,
    properties,
    events,
    slots,
    cssParts: parts,
    cssProperties,
    methods: publicMethods(declaration),
    react: {
      component: declaration.name,
      props: properties.filter((property) => !property.readonly).map((property) => property.name),
      eventProps: reactEvents(reactDir, slug, events),
    },
    usage: "",
  };
  entry.usage = usageExample(entry);
  return entry;
}

function collect() {
  const byTag = new Map();
  for (const source of SOURCES) {
    const manifest = readJson(join(rootDir, source.manifest));
    for (const moduleEntry of manifest.modules || []) {
      for (const declaration of moduleEntry.declarations || []) {
        if (declaration.customElement !== true) continue;
        if (!declaration.tagName?.startsWith("rowan-")) continue;
        if (byTag.has(declaration.tagName)) continue;
        byTag.set(
          declaration.tagName,
          buildComponent(declaration, moduleEntry.path, source.packageRoot, source.reactDir),
        );
      }
    }
  }
  return [...byTag.values()].sort((left, right) => left.tagName.localeCompare(right.tagName));
}

function assertComplete(components) {
  const problems = [];
  for (const component of components) {
    if (!component.tagName || !component.description || !component.usage) {
      problems.push(`${component.tagName || "(missing)"}: missing description or usage`);
    }
    for (const key of [
      "attributes",
      "properties",
      "events",
      "slots",
      "cssParts",
      "cssProperties",
      "methods",
    ]) {
      if (!Array.isArray(component[key])) problems.push(`${component.tagName}: ${key} is not a list`);
    }
    if (!component.react?.component || !Array.isArray(component.react.props) || !Array.isArray(component.react.eventProps)) {
      problems.push(`${component.tagName}: React wrapper section is incomplete`);
    }
  }
  return problems;
}

function serialize(components) {
  return `${JSON.stringify({ components }, null, 2)}\n`;
}

function main() {
  const check = process.argv.includes("--check");
  const components = collect();
  const problems = assertComplete(components);
  if (problems.length > 0) {
    console.error("API reference generation failed:");
    for (const problem of problems) console.error(`- ${problem}`);
    process.exit(1);
  }

  const next = serialize(components);
  if (check) {
    let current = "";
    try {
      current = readFileSync(outputPath, "utf8");
    } catch {
      current = "";
    }
    if (current !== next) {
      console.error("documentation/generated/api-reference.json is stale.");
      console.error("Run: node scripts/generate-api-reference.mjs");
      process.exit(1);
    }
    console.log(`API reference is current for ${components.length} components.`);
    return;
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, next);
  console.log(`Wrote ${components.length} component API references to documentation/generated/api-reference.json`);
}

main();
