function isMessage(value) {
  return typeof value === "string" || typeof value === "function";
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Retains supported property-only message overrides without mutating the source object.
 * @param {unknown} value
 * @param {Record<string, string | ((context: Record<string, unknown>) => unknown)>} defaults
 * @returns {Record<string, string | ((context: Record<string, unknown>) => unknown)>}
 */
export function normalizeMessages(value, defaults) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const messages = {};
  for (const key of Object.keys(defaults)) {
    const message = value[key];
    if (isMessage(message)) messages[key] = message;
  }

  return messages;
}

/**
 * Resolves a message override with a default and `{placeholder}` interpolation.
 * Invalid or empty overrides fall back to the component's default string.
 * @param {Record<string, unknown>} messages
 * @param {Record<string, string | ((context: Record<string, unknown>) => unknown)>} defaults
 * @param {string} key
 * @param {Record<string, unknown>} [context]
 * @returns {string}
 */
export function resolveMessage(messages, defaults, key, context = {}) {
  const fallback = resolveValue(defaults[key], context);
  const candidate = resolveValue(messages[key], context);
  const template = isNonEmptyString(candidate) ? candidate : fallback;
  if (!isNonEmptyString(template)) return "";

  return template.replace(/\{([^{}]+)\}/g, (placeholder, name) => {
    const value = context[name];
    return value == null ? placeholder : String(value);
  });
}

function resolveValue(value, context) {
  if (typeof value !== "function") return value;

  try {
    return value(context);
  } catch {
    return "";
  }
}
