import {
  FILTER_GROUP_MAX_DEPTH,
  FILTER_MAX_NODES,
  isFilterGroup,
} from "../filter-builder/apply-filters.js";

const DENSITIES = new Set(["sm", "md", "lg"]);
const SORT_DIRECTIONS = new Set(["asc", "desc"]);

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

/**
 * Input accepted by the snapshot helpers. `version` may be 1 or 2.
 * Version 1 is migrated. The value written back is always version 2.
 * @typedef {object} RowanTableViewStateInput
 * @property {1 | 2} [version]
 * @property {RowanTableViewSort | RowanTableViewSort[] | null} [sort]
 * @property {RowanTableViewPage | null} [page]
 * @property {Array<RowanTableViewFilter | RowanTableViewFilterGroup>} [filters]
 * @property {string[] | null} [visibleColumns]
 * @property {Record<string, string> | null} [columnWidths]
 * @property {string[] | null} [columnOrder]
 * @property {"sm" | "md" | "lg"} [density]
 * @property {RowanTableViewGroupBy | string | null} [groupBy]
 */

/** Stable table view snapshot. Version 1 input is migrated to this shape. */
export const TABLE_VIEW_STATE_VERSION = 2;

const KNOWN_VERSIONS = new Set([1, TABLE_VIEW_STATE_VERSION]);

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

function normalizeSortItem(value) {
  if (!isRecord(value)) return null;

  const id = normalizeText(value.id);
  const dir = normalizeText(value.dir);
  if (!id || !SORT_DIRECTIONS.has(dir)) return null;

  return { id, dir };
}

function normalizeSort(value) {
  if (!Array.isArray(value)) return normalizeSortItem(value);

  const seen = new Set();
  const sort = [];
  for (const item of value) {
    const normalized = normalizeSortItem(item);
    if (!normalized || seen.has(normalized.id)) continue;
    seen.add(normalized.id);
    sort.push(normalized);
  }

  if (sort.length === 0) return null;
  if (sort.length === 1) return sort[0];
  return sort;
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

function normalizeFilterNode(value, depth, budget) {
  if (budget.n >= FILTER_MAX_NODES) return null;

  if (isFilterGroup(value)) {
    if (depth > FILTER_GROUP_MAX_DEPTH) return null;
    budget.n += 1;
    const filters = [];
    for (const child of value.filters) {
      const node = normalizeFilterNode(child, depth + 1, budget);
      if (node) filters.push(node);
    }
    const node = {
      join: normalizeText(value.join) === "or" ? "or" : "and",
      filters,
    };
    const id = normalizeText(value.id);
    if (id) node.id = id;
    return node;
  }

  const filter = normalizeFilter(value);
  if (!filter) return null;
  budget.n += 1;
  return filter;
}

function normalizeFilters(value) {
  if (!Array.isArray(value)) return [];
  const budget = { n: 0 };
  const filters = [];
  for (const item of value) {
    const node = normalizeFilterNode(item, isFilterGroup(item) ? 1 : 0, budget);
    if (node) filters.push(node);
  }
  return filters;
}

function emptyTableViewState() {
  return {
    version: TABLE_VIEW_STATE_VERSION,
    sort: null,
    page: null,
    filters: [],
    visibleColumns: null,
    columnWidths: null,
    columnOrder: null,
    density: "md",
    groupBy: null,
  };
}

function parseSnapshotText(snapshot) {
  const text = snapshot.trim();
  if (text.startsWith("{")) return JSON.parse(text);
  return JSON.parse(decodeURIComponent(text));
}

function normalizeVisibleColumns(value) {
  if (!Array.isArray(value)) return null;

  return [...new Set(value.map(normalizeText).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  );
}

function normalizeColumnWidths(value) {
  if (!isRecord(value)) return null;

  const widths = {};
  for (const [key, val] of Object.entries(value)) {
    const columnId = normalizeText(key);
    const width = normalizeText(val);
    if (columnId && width) {
      widths[columnId] = width;
    }
  }

  return Object.keys(widths).length > 0 ? widths : null;
}

function normalizeColumnOrder(value) {
  if (!Array.isArray(value)) return null;

  const order = value.map(normalizeText).filter(Boolean);
  return order.length > 0 ? order : null;
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
    ...(Object.hasOwn(value, "columnWidths") ? { columnWidths: value.columnWidths } : {}),
    ...(Object.hasOwn(value, "columnOrder") ? { columnOrder: value.columnOrder } : {}),
    ...(Object.hasOwn(value, "density") ? { density: value.density } : {}),
    ...(Object.hasOwn(value, "groupBy") ? { groupBy: value.groupBy } : {}),
  };
}

/**
 * Normalizes a property-only table view state into a JSON-safe version 2 object.
 * Version 1 input is migrated. Any other explicit version is rejected and
 * becomes the empty version 2 state. Filter groups deeper than the stable
 * limit, and nodes past the node cap, are dropped.
 *
 * @param {RowanTableViewStateInput | null | undefined} value
 * @returns {RowanTableViewState}
 */
export function normalizeTableViewState(value) {
  const source = isRecord(value) ? value : {};
  if (Object.hasOwn(source, "version") && !KNOWN_VERSIONS.has(source.version)) {
    return emptyTableViewState();
  }

  return {
    version: TABLE_VIEW_STATE_VERSION,
    sort: normalizeSort(source.sort),
    page: normalizePage(source.page),
    filters: normalizeFilters(source.filters),
    visibleColumns: normalizeVisibleColumns(source.visibleColumns),
    columnWidths: normalizeColumnWidths(source.columnWidths),
    columnOrder: normalizeColumnOrder(source.columnOrder),
    density: normalizeDensity(source.density),
    groupBy: normalizeGroupBy(source.groupBy),
  };
}

/**
 * Merges a partial saved view into a base view without mutating either input.
 *
 * @param {RowanTableViewStateInput | null | undefined} base
 * @param {RowanTableViewStateInput | null | undefined} patch
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
 * The value is safe to place in a query string. `writeTableViewStateSearch`
 * builds that query. Named saved views live in `@rowan-ui/core/saved-views`.
 *
 * @param {RowanTableViewStateInput | null | undefined} value
 * @returns {string}
 */
export function serializeTableViewState(value) {
  return encodeURIComponent(JSON.stringify(normalizeTableViewState(value)));
}

/**
 * Restores a normalized view state from a serialized snapshot or plain object.
 * This function is pure: assigning its result to a table or filter builder is host-owned.
 *
 * @param {string | RowanTableViewStateInput | null | undefined} snapshot
 * @returns {RowanTableViewState}
 */
export function restoreTableViewState(snapshot) {
  if (typeof snapshot !== "string") return normalizeTableViewState(snapshot);

  try {
    return normalizeTableViewState(parseSnapshotText(snapshot));
  } catch {
    return emptyTableViewState();
  }
}

/**
 * Writes a version 2 snapshot into a query string. Existing params are kept.
 * The snapshot is raw JSON; `URLSearchParams` encodes it once.
 *
 * @param {RowanTableViewStateInput | null | undefined} value
 * @param {{ param?: string, search?: string }} [options]
 * @returns {string}
 */
export function writeTableViewStateSearch(value, options = {}) {
  const param = normalizeText(options?.param) || "view";
  const search = typeof options?.search === "string" ? options.search : "";
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  params.set(param, JSON.stringify(normalizeTableViewState(value)));
  const text = params.toString();
  return text ? `?${text}` : "";
}

/**
 * Reads a version 2 snapshot from a query string. Version 1 is migrated.
 * A missing param, malformed JSON, or an unknown version returns `ok: false`
 * and the empty state so a bad link does not wipe a table.
 *
 * @param {string | null | undefined} search
 * @param {string} [param]
 * @returns {{ ok: boolean, state: RowanTableViewState }}
 */
export function readTableViewStateSearch(search, param = "view") {
  const key = normalizeText(param) || "view";
  const params = new URLSearchParams(String(search ?? "").replace(/^\?/, ""));
  const empty = emptyTableViewState();
  if (!params.has(key)) return { ok: false, state: empty };

  const raw = params.get(key);
  if (raw == null || raw.trim() === "") return { ok: false, state: empty };

  let parsed;
  try {
    parsed = parseSnapshotText(raw);
  } catch {
    return { ok: false, state: empty };
  }

  if (
    !isRecord(parsed) ||
    (Object.hasOwn(parsed, "version") && !KNOWN_VERSIONS.has(parsed.version))
  ) {
    return { ok: false, state: empty };
  }

  return { ok: true, state: normalizeTableViewState(parsed) };
}
