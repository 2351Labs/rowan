export const BOOLEAN_ATTRIBUTES = new Set([
  "active",
  "alert",
  "animated",
  "caption-visually-hidden",
  "checked",
  "collapsed",
  "column-picker",
  "collapsible",
  "confirm-disabled",
  "disabled",
  "dismissible",
  "drag-active",
  "expanded",
  "external",
  "hidden",
  "hide-meta",
  "indeterminate",
  "interactive",
  "invalid",
  "loading",
  "multiple",
  "navigation-open",
  "open",
  "pulse",
  "range",
  "required",
  "selected",
  "sticky-header",
  "virtualized",
]);

export function isFalseBooleanAttributeValue(value) {
  return value === false || value === "false";
}

export function readBooleanAttribute(element, attributeName) {
  if (!element.hasAttribute(attributeName)) return false;
  if (element.getAttribute(attributeName) === "false") {
    element.removeAttribute(attributeName);
    return false;
  }
  return true;
}

export function reflectBooleanAttribute(element, attributeName, value) {
  if (isFalseBooleanAttributeValue(value) || !value) {
    element.removeAttribute(attributeName);
    return;
  }

  element.setAttribute(attributeName, "");
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
