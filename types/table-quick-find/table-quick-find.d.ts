/**
 * Filters rows by a host-owned quick-find query. Empty or whitespace query
 * returns a shallow copy of the list. Matching is case-insensitive contains
 * on string, number, and boolean cells. Nested objects and arrays are skipped.
 * This is not a filter-builder type and is not stored in table-view-state.
 *
 * @param {object[]} rows
 * @param {unknown} query
 * @param {string[]} [keys]
 * @returns {object[]}
 */
export function applyQuickFind(
  rows: object[],
  query: unknown,
  keys?: string[] | undefined,
): object[];
