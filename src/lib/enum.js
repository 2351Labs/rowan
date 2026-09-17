/**
 * Canonicalize a documented string union.
 * @param {unknown} value
 * @param {ReadonlySet<string>} allowed
 * @param {string} fallback
 */
export function normalizeEnum(value, allowed, fallback) {
  const next = String(value ?? "")
    .trim()
    .toLowerCase();
  return allowed.has(next) ? next : fallback;
}

/**
 * Reflect a canonical enum, omitting the documented default.
 * @param {{ reflectString: (name: string, value: string | null) => void }} element
 * @param {string} attribute
 * @param {unknown} value
 * @param {ReadonlySet<string>} allowed
 * @param {string} fallback
 */
export function reflectEnum(element, attribute, value, allowed, fallback) {
  const next = normalizeEnum(value, allowed, fallback);
  element.reflectString(attribute, next === fallback ? null : next);
  return next;
}

/**
 * Rewrite an observed enum attribute to its canonical form.
 * @param {{ reflectString: (name: string, value: string | null) => void }} element
 * @param {string} name
 * @param {string | null} newValue
 * @param {ReadonlySet<string>} allowed
 * @param {string} fallback
 * @returns {boolean} whether the attribute was rewritten
 */
export function rewriteEnumAttribute(element, name, newValue, allowed, fallback) {
  const next = normalizeEnum(newValue, allowed, fallback);
  const attributeValue = next === fallback ? null : next;
  if (newValue === attributeValue) return false;
  element.reflectString(name, attributeValue);
  return true;
}
