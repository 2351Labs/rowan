const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i;
const TOKEN_COLOR_PATTERN = /^var\(--rowan-[\w-]+\)$/;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeCoordinate(value, minimum, maximum) {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) && coordinate >= minimum && coordinate <= maximum
    ? coordinate
    : null;
}

function normalizeColor(value) {
  const color = normalizeText(value);
  return HEX_COLOR_PATTERN.test(color) || TOKEN_COLOR_PATTERN.test(color) ? color : "";
}

function normalizeUrl(value) {
  const source = normalizeText(value);
  if (!source) return "";

  try {
    const url = new URL(source, globalThis.location?.href ?? "https://rowan.invalid/");
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch (_error) {
    return "";
  }
}

function cloneStructuredValue(value, seen = new WeakMap()) {
  if (value === null || ["string", "number", "boolean"].includes(typeof value)) {
    return value;
  }

  if (typeof value !== "object") return undefined;
  if (seen.has(value)) return seen.get(value);

  if (Array.isArray(value)) {
    const copy = [];
    seen.set(value, copy);
    for (const item of value) {
      const clonedItem = cloneStructuredValue(item, seen);
      if (clonedItem !== undefined) copy.push(clonedItem);
    }
    return copy;
  }

  const copy = {};
  seen.set(value, copy);
  for (const [key, item] of Object.entries(value)) {
    const clonedItem = cloneStructuredValue(item, seen);
    if (clonedItem !== undefined) copy[key] = clonedItem;
  }
  return copy;
}

/**
 * @typedef {object} RowanMapLocation
 * @property {string} id
 * @property {string} label
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} [description]
 * @property {string} [layerId]
 * @property {string} [status]
 */

/**
 * @typedef {object} RowanMapLayer
 * @property {string} id
 * @property {string} label
 * @property {string} [color]
 * @property {boolean} [visible]
 */

/**
 * @typedef {object} RowanMapAttribution
 * @property {string} label
 * @property {string} [href]
 */

/**
 * @typedef {RowanMapAttribution | Array<RowanMapAttribution | string> | string | null | undefined} RowanMapAttributionInput
 */

/**
 * @typedef {object} RowanNormalizedMapLocation
 * @property {string} id
 * @property {string} label
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} description
 * @property {string} layerId
 * @property {string} status
 */

/**
 * @typedef {object} RowanNormalizedMapLayer
 * @property {string} id
 * @property {string} label
 * @property {string} color
 * @property {boolean} visible
 */

/**
 * @typedef {object} RowanNormalizedMapAttribution
 * @property {string} label
 * @property {string} href
 */

/**
 * Normalizes a property-only location collection and omits invalid coordinates.
 * @param {unknown} value
 * @returns {RowanNormalizedMapLocation[]}
 */
export function normalizeMapLocations(value) {
  if (!Array.isArray(value)) return [];

  const ids = new Set();
  return value.flatMap((item, index) => {
    if (!isObject(item)) return [];

    const latitude = normalizeCoordinate(item.latitude, -90, 90);
    const longitude = normalizeCoordinate(item.longitude, -180, 180);
    if (latitude === null || longitude === null) return [];

    const baseId = normalizeText(item.id) || `location-${index + 1}`;
    let id = baseId;
    let suffix = 2;
    while (ids.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    ids.add(id);

    return [
      {
        id,
        label: normalizeText(item.label) || id,
        latitude,
        longitude,
        description: normalizeText(item.description),
        layerId: normalizeText(item.layerId),
        status: normalizeText(item.status),
      },
    ];
  });
}

/**
 * Normalizes optional marker layer metadata without interpreting source or tile data.
 * @param {unknown} value
 * @returns {RowanNormalizedMapLayer[]}
 */
export function normalizeMapLayers(value) {
  if (!Array.isArray(value)) return [];

  const ids = new Set();
  return value.flatMap((item, index) => {
    if (!isObject(item)) return [];

    const baseId = normalizeText(item.id) || `layer-${index + 1}`;
    let id = baseId;
    let suffix = 2;
    while (ids.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    ids.add(id);

    return [
      {
        id,
        label: normalizeText(item.label) || id,
        color: normalizeColor(item.color),
        visible: item.visible !== false,
      },
    ];
  });
}

/**
 * Normalizes attribution into text and safe HTTP(S) links for map and fallback views.
 * @param {RowanMapAttributionInput} value
 * @returns {RowanNormalizedMapAttribution[]}
 */
export function normalizeMapAttribution(value) {
  const entries = Array.isArray(value) ? value : [value];

  return entries.flatMap((item) => {
    if (typeof item === "string") {
      const label = normalizeText(item);
      return label ? [{ label, href: "" }] : [];
    }
    if (!isObject(item)) return [];

    const label = normalizeText(item.label);
    return label ? [{ label, href: normalizeUrl(item.href) }] : [];
  });
}

/**
 * Takes a detached snapshot of an application-owned MapLibre style.
 * @param {unknown} value
 * @returns {string | Record<string, unknown> | null}
 */
export function cloneMapStyle(value) {
  if (typeof value === "string") {
    return normalizeUrl(value) || null;
  }

  if (!isObject(value)) return null;
  const clone = cloneStructuredValue(value);
  return isObject(clone) ? clone : null;
}

/**
 * @param {RowanNormalizedMapLocation[]} locations
 * @returns {RowanNormalizedMapLocation[]}
 */
export function cloneMapLocations(locations) {
  return locations.map((location) => ({ ...location }));
}

/**
 * @param {RowanNormalizedMapLayer[]} layers
 * @returns {RowanNormalizedMapLayer[]}
 */
export function cloneMapLayers(layers) {
  return layers.map((layer) => ({ ...layer }));
}

/**
 * @param {RowanNormalizedMapAttribution[]} attribution
 * @returns {RowanNormalizedMapAttribution[]}
 */
export function cloneMapAttribution(attribution) {
  return attribution.map((item) => ({ ...item }));
}
