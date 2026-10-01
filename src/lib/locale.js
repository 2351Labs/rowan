function normalizedLanguage(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
}

/**
 * Lowercases text with a requested locale and safely falls back to the browser default.
 * @param {unknown} value
 * @param {unknown} [locale]
 * @returns {string}
 */
export function lowerCaseForLocale(value, locale) {
  const text = String(value ?? "");

  try {
    return text.toLocaleLowerCase(typeof locale === "string" ? locale : undefined);
  } catch {
    return text.toLocaleLowerCase();
  }
}

/**
 * Uppercases text with a requested locale and safely falls back to the browser default.
 * @param {unknown} value
 * @param {unknown} [locale]
 * @returns {string}
 */
export function upperCaseForLocale(value, locale) {
  const text = String(value ?? "");

  try {
    return text.toLocaleUpperCase(typeof locale === "string" ? locale : undefined);
  } catch {
    return text.toLocaleUpperCase();
  }
}

/**
 * Resolves an explicit locale or the nearest inherited `lang` value.
 * @param {Element} element
 * @param {unknown} [locale]
 * @param {string} [fallback]
 * @returns {string}
 */
export function resolveLocale(element, locale, fallback = "en-US") {
  const configured = normalizedLanguage(locale);
  if (configured) return configured;

  let current = element;
  const visited = new Set();

  while (current instanceof Element && !visited.has(current)) {
    visited.add(current);

    const language = normalizedLanguage(current.getAttribute("lang"));
    if (language) return language;

    if (current.parentElement) {
      current = current.parentElement;
      continue;
    }

    const root = current.getRootNode();
    current = root instanceof ShadowRoot ? root.host : null;
  }

  const browserLanguage =
    typeof navigator === "undefined" ? "" : normalizedLanguage(navigator.language);
  return browserLanguage || fallback;
}
