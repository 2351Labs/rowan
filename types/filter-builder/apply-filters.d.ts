/**
 * Experimental group node. Requires `join` of `and` or `or` and a `filters`
 * array. A frozen leaf has `field` and is never a group, even if it also has
 * a `filters` array. Unofficial combinator objects without `join` stay leaves.
 * @param {unknown} value
 * @returns {value is { join: "and" | "or", filters: object[], id?: string }}
 */
export function isFilterGroup(value: unknown): value is {
  join: "and" | "or";
  filters: object[];
  id?: string | undefined;
};
/**
 * Deep-clones a leaf or experimental group. Does not validate.
 * @param {object} node
 * @returns {object}
 */
export function cloneFilterNode(node: object): object;
/**
 * Applies filters to rows. Top-level conjunction is AND (frozen). Group nodes
 * `{ join: "and" | "or", filters: [...] }` are experimental. Unknown operators
 * do not match. An empty AND group matches; an empty OR group does not.
 * @param {object[]} rows
 * @param {Array<object>} filters
 * @param {Array<{ id: string, type?: string, accessor?: string | ((row: object) => unknown) }>} [fields]
 * @returns {object[]}
 */
export function applyFilters(
  rows: object[],
  filters: Array<object>,
  fields?:
    | {
        id: string;
        type?: string | undefined;
        accessor?: string | ((row: object) => unknown) | undefined;
      }[]
    | undefined,
): object[];
