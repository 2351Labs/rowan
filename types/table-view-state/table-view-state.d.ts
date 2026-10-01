/**
 * Normalizes a property-only table view state into a JSON-safe plain object.
 *
 * @param {Partial<RowanTableViewState> | null | undefined} value
 * @returns {RowanTableViewState}
 */
export function normalizeTableViewState(
  value: Partial<RowanTableViewState> | null | undefined,
): RowanTableViewState;
/**
 * Merges a partial saved view into a base view without mutating either input.
 *
 * @param {Partial<RowanTableViewState> | null | undefined} base
 * @param {Partial<RowanTableViewState> | null | undefined} patch
 * @returns {RowanTableViewState}
 */
export function mergeTableViewState(
  base: Partial<RowanTableViewState> | null | undefined,
  patch: Partial<RowanTableViewState> | null | undefined,
): RowanTableViewState;
/**
 * Creates a deterministic URI-component-safe representation of table view state.
 * The application owns writing it to a URL, storage, or a saved-view service.
 *
 * @param {Partial<RowanTableViewState> | null | undefined} value
 * @returns {string}
 */
export function serializeTableViewState(
  value: Partial<RowanTableViewState> | null | undefined,
): string;
/**
 * Restores a normalized view state from a serialized snapshot or plain object.
 * This function is pure: assigning its result to a table or filter builder is host-owned.
 *
 * @param {string | Partial<RowanTableViewState> | null | undefined} snapshot
 * @returns {RowanTableViewState}
 */
export function restoreTableViewState(
  snapshot: string | Partial<RowanTableViewState> | null | undefined,
): RowanTableViewState;
/** @typedef {{ id: string, dir: "asc" | "desc" }} RowanTableViewSort */
/** @typedef {{ index: number, size: number, total?: number }} RowanTableViewPage */
/** @typedef {{ id: string, subtotals: boolean, collapsed: boolean }} RowanTableViewGroupBy */
/** @typedef {{ id?: string, field: string, operator: string, value: string }} RowanTableViewFilter */
/**
 * Portable state for an operational table. All fields are property-only.
 * A null `visibleColumns` value preserves the application's source column visibility.
 * @typedef {object} RowanTableViewState
 * @property {number} version
 * @property {RowanTableViewSort | null} sort
 * @property {RowanTableViewPage | null} page
 * @property {RowanTableViewFilter[]} filters
 * @property {string[] | null} visibleColumns
 * @property {"sm" | "md" | "lg"} density
 * @property {RowanTableViewGroupBy | null} groupBy
 */
export const TABLE_VIEW_STATE_VERSION: 1;
export type RowanTableViewSort = {
  id: string;
  dir: "asc" | "desc";
};
export type RowanTableViewPage = {
  index: number;
  size: number;
  total?: number;
};
export type RowanTableViewGroupBy = {
  id: string;
  subtotals: boolean;
  collapsed: boolean;
};
export type RowanTableViewFilter = {
  id?: string;
  field: string;
  operator: string;
  value: string;
};
/**
 * Portable state for an operational table. All fields are property-only.
 * A null `visibleColumns` value preserves the application's source column visibility.
 */
export type RowanTableViewState = {
  version: number;
  sort: RowanTableViewSort | null;
  page: RowanTableViewPage | null;
  filters: RowanTableViewFilter[];
  visibleColumns: string[] | null;
  density: "sm" | "md" | "lg";
  groupBy: RowanTableViewGroupBy | null;
};
