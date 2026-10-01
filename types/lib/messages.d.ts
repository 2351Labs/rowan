/**
 * Retains supported property-only message overrides without mutating the source object.
 * @param {unknown} value
 * @param {Record<string, string | ((context: Record<string, unknown>) => unknown)>} defaults
 * @returns {Record<string, string | ((context: Record<string, unknown>) => unknown)>}
 */
export function normalizeMessages(
  value: unknown,
  defaults: Record<string, string | ((context: Record<string, unknown>) => unknown)>,
): Record<string, string | ((context: Record<string, unknown>) => unknown)>;
/**
 * Resolves a message override with a default and `{placeholder}` interpolation.
 * Invalid or empty overrides fall back to the component's default string.
 * @param {Record<string, unknown>} messages
 * @param {Record<string, string | ((context: Record<string, unknown>) => unknown)>} defaults
 * @param {string} key
 * @param {Record<string, unknown>} [context]
 * @returns {string}
 */
export function resolveMessage(
  messages: Record<string, unknown>,
  defaults: Record<string, string | ((context: Record<string, unknown>) => unknown)>,
  key: string,
  context?: Record<string, unknown> | undefined,
): string;
