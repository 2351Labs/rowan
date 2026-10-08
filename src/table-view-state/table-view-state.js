import { isFilterGroup } from "../filter-builder/apply-filters.js";

const DENSITIES = new Set(["sm", "md", "lg"]);
const SORT_DIRECTIONS = new Set(["asc", "desc"]);

/** @typedef {{ id: string, dir: "asc" | "desc" }} RowanTableViewSort */

/** @typedef {{ index: number, size: number, total?: number }} RowanTableViewPage */

/** @typedef {{ id: string, subtotals: boolean, collapsed: boolean }} RowanTableViewGroupBy */

/** @typedef {{ id?: string, field: string, operator: string, value: string }} RowanTableViewFilter */

/**
 * Experimental group. Frozen leaves stay `{ field, operator, value }`.
 * @typedef {{ id?: string, join: "and" | "or", filters: Array<RowanTableViewFilter | RowanTableViewFilterGroup> }} RowanTableViewFilterGroup
 */

/**
 * Portable state for an operational table. All fields are property-only.
 * A null `visibleColumns` value preserves the application's source column visibility.
 * @typedef {object} RowanTableViewState
 * @property {number} version
 * @property {RowanTableViewSort | null} sort
 * @property {RowanTableViewPage | null} page
 * @property {Array<RowanTableViewFilter | RowanTableViewFilterGroup>} filters
 * @property {string[] | null} visibleColumns
 * @property {"sm" | "md" | "lg"} density
 * @property {RowanTableViewGroupBy | null} groupBy
 */

export const TABLE_VIEW_STATE_VERSION = 1;

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function nonNegativeInteger(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return null;
  return Math.trunc(numeric);
}

function positiveInteger(value) {
  const numeric = nonNegativeInteger(value);
  return numeric && numeric > 0 ? numeric : null;
}

function normalizeSort(value) {
  if (!isRecord(value)) return null;

  const id = normalizeText(value.id);
  const dir = normalizeText(value.dir);
  if (!id || !SORT_DIRECTIONS.has(dir)) return null;

  return { id, dir };
}

function normalizePage(value) {
  if (!isRecord(value)) return null;

  const size = positiveInteger(value.size);
  if (size === null) return null;

  const page = {
    index: nonNegativeInteger(value.index) ?? 0,
    size,
  };
  const total = nonNegativeInteger(value.total);
  if (total !== null) page.total = total;
  return page;
}

function normalizeFilter(value) {
  if (!isRecord(value)) return null;

  const field = normalizeText(value.field);
  const operator = normalizeText(value.operator);
  if (!field || !operator) return null;

  const filter = {
    field,
    operator,
    value: value.value == null ? "" : String(value.value),
  };
  const id = normalizeText(value.id);
  if (id) filter.id = id;
  return filter;
}

function normalizeFilterNode(value) {
  if (isFilterGroup(value)) {
    const filters = value.filters.map(normalizeFilterNode).filter(Boolean);
    const node = {
      join: normalizeText(value.join) === "or" ? "or" : "and",
      filters,
    };
    const id = normalizeText(value.id);
    if (id) node.id = id;
    return node;
  }

  return normalizeFilter(value);
}

function normalizeFilters(value) {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeFilterNode).filter(Boolean);
}

function filterListHasGroup(nodes) {
  return nodes.some((node) => isFilterGroup(node));
}

function normalizeVisibleColumns(value) {
  if (!Array.isArray(value)) return null;

  return [...new Set(value.map(normalizeText).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function normalizeDensity(value) {
  const density = normalizeText(value);
  return DENSITIES.has(density) ? density : "md";
}

function normalizeGroupBy(value) {
  if (typeof value === "string") {
    const id = normalizeText(value);
    return id ? { id, subtotals: false, collapsed: false } : null;
  }

  if (!isRecord(value)) return null;
  const id = normalizeText(value.id);
  if (!id) return null;

  return {
    id,
    subtotals: Boolean(value.subtotals),
    collapsed: Boolean(value.collapsed),
  };
}

function stateKeys(value) {
  if (!isRecord(value)) return {};

  return {
    ...(Object.hasOwn(value, "sort") ? { sort: value.sort } : {}),
    ...(Object.hasOwn(value, "page") ? { page: value.page } : {}),
    ...(Object.hasOwn(value, "filters") ? { filters: value.filters } : {}),
    ...(Object.hasOwn(value, "visibleColumns") ? { visibleColumns: value.visibleColumns } : {}),
    ...(Object.hasOwn(value, "density") ? { density: value.density } : {}),
    ...(Object.hasOwn(value, "groupBy") ? { groupBy: value.groupBy } : {}),
  };
}

/**
 * Normalizes a property-only table view state into a JSON-safe plain object.
 *
 * @param {Partial<RowanTableViewState> | null | undefined} value
 * @returns {RowanTableViewState}
 */
export function normalizeTableViewState(value) {
  const source = isRecord(value) ? value : {};
  const filters = normalizeFilters(source.filters);

  return {
    version: filterListHasGroup(filters) ? 2 : TABLE_VIEW_STATE_VERSION,
    sort: normalizeSort(source.sort),
    page: normalizePage(source.page),
    filters,
    visibleColumns: normalizeVisibleColumns(source.visibleColumns),
    density: normalizeDensity(source.density),
    groupBy: normalizeGroupBy(source.groupBy),
  };
}

/**
 * Merges a partial saved view into a base view without mutating either input.
 *
 * @param {Partial<RowanTableViewState> | null | undefined} base
 * @param {Partial<RowanTableViewState> | null | undefined} patch
 * @returns {RowanTableViewState}
 */
export function mergeTableViewState(base, patch) {
  return normalizeTableViewState({
    ...normalizeTableViewState(base),
    ...stateKeys(patch),
  });
}

/**
 * Creates a deterministic URI-component-safe representation of table view state.
 * The application owns writing it to a URL, storage, or a saved-view service.
 *
 * @param {Partial<RowanTableViewState> | null | undefined} value
 * @returns {string}
 */
export function serializeTableViewState(value) {
  return encodeURIComponent(JSON.stringify(normalizeTableViewState(value)));
}

/**
 * Restores a normalized view state from a serialized snapshot or plain object.
 * This function is pure: assigning its result to a table or filter builder is host-owned.
 *
 * @param {string | Partial<RowanTableViewState> | null | undefined} snapshot
 * @returns {RowanTableViewState}
 */
export function restoreTableViewState(snapshot) {
  if (typeof snapshot !== "string") return normalizeTableViewState(snapshot);

  try {
    return normalizeTableViewState(JSON.parse(decodeURIComponent(snapshot)));
  } catch {
    return normalizeTableViewState();
  }
}
