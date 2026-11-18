/**
 * Normalizes a property-only table view state into a JSON-safe version 2 object.
 * Version 1 input is migrated. Any other explicit version is rejected and
 * becomes the empty version 2 state. Filter groups deeper than the stable
 * limit, and nodes past the node cap, are dropped.
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
 * The value is safe to place in a query string. `writeTableViewStateSearch`
 * builds that query. Named saved views live in `@rowan-ui/core/saved-views`.
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
/**
 * Writes a version 2 snapshot into a query string. Existing params are kept.
 * The snapshot is raw JSON; `URLSearchParams` encodes it once.
 *
 * @param {Partial<RowanTableViewState> | null | undefined} value
 * @param {{ param?: string, search?: string }} [options]
 * @returns {string}
 */
export function writeTableViewStateSearch(
  value: Partial<RowanTableViewState> | null | undefined,
  options?:
    | {
        param?: string | undefined;
        search?: string | undefined;
      }
    | undefined,
): string;
/**
 * Reads a version 2 snapshot from a query string. Version 1 is migrated.
 * A missing param, malformed JSON, or an unknown version returns `ok: false`
 * and the empty state so a bad link does not wipe a table.
 *
 * @param {string | null | undefined} search
 * @param {string} [param]
 * @returns {{ ok: boolean, state: RowanTableViewState }}
 */
export function readTableViewStateSearch(
  search: string | null | undefined,
  param?: string | undefined,
): {
  ok: boolean;
  state: RowanTableViewState;
};
/** @typedef {{ id: string, dir: "asc" | "desc" }} RowanTableViewSort */
/** @typedef {{ index: number, size: number, total?: number }} RowanTableViewPage */
/** @typedef {{ id: string, subtotals: boolean, collapsed: boolean }} RowanTableViewGroupBy */
/** @typedef {{ id?: string, field: string, operator: string, value: string }} RowanTableViewFilter */
/**
 * Stable group. Leaves stay `{ field, operator, value }`. Groups nest at most
 * four levels. A node with `field` is always a leaf.
 * @typedef {{ id?: string, join: "and" | "or", filters: Array<RowanTableViewFilter | RowanTableViewFilterGroup> }} RowanTableViewFilterGroup
 */
/**
 * Portable state for an operational table. All fields are property-only.
 * A null `visibleColumns` value preserves the application's source column visibility.
 * @typedef {object} RowanTableViewState
 * @property {2} version Stable snapshot version. Input version `1` is migrated.
 * @property {RowanTableViewSort | RowanTableViewSort[] | null} sort
 * @property {RowanTableViewPage | null} page
 * @property {Array<RowanTableViewFilter | RowanTableViewFilterGroup>} filters
 * @property {string[] | null} visibleColumns
 * @property {Record<string, string> | null} columnWidths
 * @property {string[] | null} columnOrder
 * @property {"sm" | "md" | "lg"} density
 * @property {RowanTableViewGroupBy | null} groupBy
 */
/** Stable table view snapshot. Version 1 input is migrated to this shape. */
export const TABLE_VIEW_STATE_VERSION: 2;
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
 * Stable group. Leaves stay `{ field, operator, value }`. Groups nest at most
 * four levels. A node with `field` is always a leaf.
 */
export type RowanTableViewFilterGroup = {
  id?: string;
  join: "and" | "or";
  filters: Array<RowanTableViewFilter | RowanTableViewFilterGroup>;
};
/**
 * Portable state for an operational table. All fields are property-only.
 * A null `visibleColumns` value preserves the application's source column visibility.
 */
export type RowanTableViewState = {
  /**
   * Stable snapshot version. Input version `1` is migrated.
   */
  version: 2;
  sort: RowanTableViewSort | RowanTableViewSort[] | null;
  page: RowanTableViewPage | null;
  filters: Array<RowanTableViewFilter | RowanTableViewFilterGroup>;
  visibleColumns: string[] | null;
  columnWidths: Record<string, string> | null;
  columnOrder: string[] | null;
  density: "sm" | "md" | "lg";
  groupBy: RowanTableViewGroupBy | null;
};
