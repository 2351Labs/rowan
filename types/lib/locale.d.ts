/**
 * Lowercases text with a requested locale and safely falls back to the browser default.
 * @param {unknown} value
 * @param {unknown} [locale]
 * @returns {string}
 */
export function lowerCaseForLocale(value: unknown, locale?: unknown): string;
/**
 * Uppercases text with a requested locale and safely falls back to the browser default.
 * @param {unknown} value
 * @param {unknown} [locale]
 * @returns {string}
 */
export function upperCaseForLocale(value: unknown, locale?: unknown): string;
/**
 * Resolves an explicit locale or the nearest inherited `lang` value.
 * @param {Element} element
 * @param {unknown} [locale]
 * @param {string} [fallback]
 * @returns {string}
 */
export function resolveLocale(
  element: Element,
  locale?: unknown,
  fallback?: string | undefined,
): string;
