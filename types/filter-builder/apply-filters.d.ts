/**
 * Stable group node. Requires `join` of `and` or `or` and a `filters` array.
 * A leaf has `field` and is never a group, even if it also has a `filters`
 * array. Objects with a `filters` array but no `and`/`or` join stay leaves.
 * @param {unknown} value
 * @returns {value is { join: "and" | "or", filters: object[], id?: string }}
 */
export function isFilterGroup(value: unknown): value is {
  join: "and" | "or";
  filters: object[];
  id?: string | undefined;
};
/**
 * Checks a filter tree against the stable group contract.
 * Pass `fields` to also reject unknown field ids and operators. An empty
 * catalog rejects every field. Omitting `fields` checks shape only. Custom
 * operators are valid when that field lists them. This does not run the
 * predicates: `applyFilters` only implements the built-in operators.
 * A non-array `filters` value is invalid here. `applyFilters` treats that
 * same value as no filters.
 * @param {unknown} filters
 * @param {Array<{ id: string, type?: string, operators?: string[] }>} [fields]
 * @returns {{ valid: boolean, issues: RowanFilterIssue[] }}
 */
export function validateFilters(
  filters: unknown,
  fields?:
    | {
        id: string;
        type?: string | undefined;
        operators?: string[] | undefined;
      }[]
    | undefined,
): {
  valid: boolean;
  issues: RowanFilterIssue[];
};
/**
 * Deep-clones a leaf or group. Does not validate or enforce depth.
 * @param {object} node
 * @returns {object}
 */
export function cloneFilterNode(node: object): object;
/**
 * Applies filters to rows. The top-level list is an implicit AND.
 * Group nodes `{ join: "and" | "or", filters: [...] }` are stable.
 * Groups nest at most {@link FILTER_GROUP_MAX_DEPTH} levels, and the tree
 * holds at most {@link FILTER_MAX_NODES} nodes. Positions are numbered before
 * any row is tested, so a short-circuit does not let a later node through.
 * A deeper group does not match. Nodes past the cap do not match, so an
 * over-large AND fails closed.
 * Unknown operators do not match. An empty AND group matches; an empty OR
 * group does not. A non-array filter list applies no filtering.
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
/** A group in the top-level list is depth 1. Deeper groups are rejected. */
export const FILTER_GROUP_MAX_DEPTH: 4;
/** Leaves and groups share one cap so a payload cannot grow without bound. */
export const FILTER_MAX_NODES: 40;
export type RowanFilterIssue = {
  path: string;
  code:
    | "invalid-node"
    | "invalid-join"
    | "missing-field"
    | "missing-operator"
    | "unknown-field"
    | "unknown-operator"
    | "max-depth"
    | "max-nodes";
  message: string;
};
