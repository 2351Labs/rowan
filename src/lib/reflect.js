export function readBooleanAttribute(element, attributeName) {
  return element.hasAttribute(attributeName);
}

export function reflectBooleanAttribute(element, attributeName, value) {
  if (value) {
    element.setAttribute(attributeName, "");
    return;
  }

  element.removeAttribute(attributeName);
}

export function readStringAttribute(element, attributeName, fallback = "") {
  return element.getAttribute(attributeName) ?? fallback;
}

/**
 * Reflects a string to an attribute. An empty string removes the attribute, so
 * "explicitly empty" and "absent" are the same state; every Rowan getter defaults
 * to `""`, so the property round-trips. Pass `value || null` when a call site
 * wants that collapse to be explicit.
 */
export function reflectStringAttribute(element, attributeName, value) {
  if (value == null || value === "") {
    element.removeAttribute(attributeName);
    return;
  }

  element.setAttribute(attributeName, String(value));
}

export function readNumberAttribute(element, attributeName, fallback = 0) {
  const rawValue = element.getAttribute(attributeName);
  if (rawValue == null) return fallback;

  const numberValue = Number(rawValue);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function reflectNumberAttribute(element, attributeName, value) {
  if (value == null || !Number.isFinite(value)) {
    element.removeAttribute(attributeName);
    return;
  }

  element.setAttribute(attributeName, String(value));
}
