const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

/**
 * @typedef {[tagName: string, attributes: Record<string, string>, children?: IconNode[]]} IconNode
 */

/**
 * @typedef {object} IconDefinition
 * @property {string} name
 * @property {IconNode[]} nodes
 */

/**
 * @typedef {object} IconOptions
 * @property {string} [className]
 * @property {string} [label]
 * @property {number|string} [size]
 * @property {number|string} [strokeWidth]
 */

function appendNode(parent, node) {
  const [tagName, attributes, children = []] = node;
  const element = document.createElementNS(SVG_NAMESPACE, tagName);

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }

  for (const child of children) {
    appendNode(element, child);
  }

  parent.append(element);
}

function normalizeLength(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return String(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return fallback;
}

function normalizeStrokeWidth(value) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return String(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return "2";
}

/**
 * Creates an SVG icon from a static icon definition.
 *
 * Icons are decorative by default. Pass `label` only when the icon itself
 * communicates information not already supplied by nearby text or control labels.
 *
 * @param {IconDefinition} definition
 * @param {IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function createIcon(definition, options = {}) {
  if (
    !definition ||
    typeof definition.name !== "string" ||
    definition.name.trim().length === 0 ||
    !Array.isArray(definition.nodes)
  ) {
    throw new TypeError("An icon definition with a name and nodes is required.");
  }

  const svg = /** @type {SVGSVGElement} */ (document.createElementNS(SVG_NAMESPACE, "svg"));
  const label = typeof options.label === "string" ? options.label.trim() : "";

  svg.setAttribute("xmlns", SVG_NAMESPACE);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", normalizeLength(options.size, "1em"));
  svg.setAttribute("height", normalizeLength(options.size, "1em"));
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", normalizeStrokeWidth(options.strokeWidth));
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("focusable", "false");
  svg.dataset.icon = definition.name;

  if (options.className) {
    svg.setAttribute("class", options.className);
  }

  if (label) {
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", label);
  } else {
    svg.setAttribute("aria-hidden", "true");
  }

  for (const node of definition.nodes) {
    appendNode(svg, node);
  }

  return svg;
}