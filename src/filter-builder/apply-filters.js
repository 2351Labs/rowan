const FIELD_TYPES = new Set(["text", "number", "date", "boolean", "select"]);
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function fieldFor(fields, id) {
  const match = fields.find((field) => field.id === id);
  if (match) return match;
  return { id, type: "text" };
}

function cellValue(row, field) {
  if (!isRecord(row)) return undefined;

  try {
    if (typeof field.accessor === "function") return field.accessor(row);
    if (typeof field.accessor === "string" && field.accessor) return row[field.accessor];
    return row[field.id];
  } catch {
    return undefined;
  }
}

function isEmptyValue(value) {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function asText(value) {
  return normalizeText(value).toLowerCase();
}

function asNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.getTime();
  const numeric = Number(normalizeText(value));
  return Number.isFinite(numeric) ? numeric : Number.NaN;
}

function asDate(value) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const timestamp = Date.parse(normalizeText(value));
  return Number.isNaN(timestamp) ? Number.NaN : timestamp;
}

function asBoolean(value) {
  if (typeof value === "boolean") return value;
  const text = normalizeText(value).toLowerCase();
  if (text === "true" || text === "1") return true;
  if (text === "false" || text === "0" || text === "") return false;
  return Boolean(value);
}

function compareByType(type, left, right) {
  if (type === "number") {
    const leftNumber = asNumber(left);
    const rightNumber = asNumber(right);
    if (Number.isNaN(leftNumber) || Number.isNaN(rightNumber)) return null;
    return leftNumber === rightNumber ? 0 : leftNumber > rightNumber ? 1 : -1;
  }

  if (type === "date") {
    const leftDate = asDate(left);
    const rightDate = asDate(right);
    if (Number.isNaN(leftDate) || Number.isNaN(rightDate)) return null;
    return leftDate === rightDate ? 0 : leftDate > rightDate ? 1 : -1;
  }

  if (type === "boolean") {
    const leftBoolean = asBoolean(left);
    const rightBoolean = asBoolean(right);
    return leftBoolean === rightBoolean ? 0 : leftBoolean ? 1 : -1;
  }

  const leftText = asText(left);
  const rightText = asText(right);
  if (leftText === rightText) return 0;
  return leftText > rightText ? 1 : -1;
}

function matchesFilter(row, filter, field) {
  const operator = normalizeText(filter?.operator);
  const type = FIELD_TYPES.has(field.type) ? field.type : "text";
  const raw = cellValue(row, field);
  const query = filter?.value;

  if (operator === "is-empty") return isEmptyValue(raw);
  if (operator === "is-not-empty") return !isEmptyValue(raw);

  if (operator === "contains") return asText(raw).includes(asText(query));
  if (operator === "starts-with") return asText(raw).startsWith(asText(query));
  if (operator === "ends-with") return asText(raw).endsWith(asText(query));

  const comparison = compareByType(type, raw, query);
  if (comparison == null) return false;
  if (operator === "equals") return comparison === 0;
  if (operator === "not-equals") return comparison !== 0;
  if (operator === "greater-than") return comparison > 0;
  if (operator === "greater-than-or-equal") return comparison >= 0;
  if (operator === "less-than") return comparison < 0;
  if (operator === "less-than-or-equal") return comparison <= 0;

  return false;
}

/** A group in the top-level list is depth 1. Deeper groups are rejected. */
export const FILTER_GROUP_MAX_DEPTH = 4;

/** Leaves and groups share one cap so a payload cannot grow without bound. */
export const FILTER_MAX_NODES = 40;

const BUILTIN_OPERATORS = {
  text: [
    "contains",
    "equals",
    "not-equals",
    "starts-with",
    "ends-with",
    "is-empty",
    "is-not-empty",
  ],
  number: [
    "equals",
    "not-equals",
    "greater-than",
    "greater-than-or-equal",
    "less-than",
    "less-than-or-equal",
    "is-empty",
    "is-not-empty",
  ],
  date: [
    "equals",
    "not-equals",
    "greater-than",
    "greater-than-or-equal",
    "less-than",
    "less-than-or-equal",
    "is-empty",
    "is-not-empty",
  ],
  boolean: ["equals", "not-equals"],
  select: ["equals", "not-equals", "is-empty", "is-not-empty"],
};

/**
 * Stable group node. Requires `join` of `and` or `or` and a `filters` array.
 * A leaf has `field` and is never a group, even if it also has a `filters`
 * array. Objects with a `filters` array but no `and`/`or` join stay leaves.
 * @param {unknown} value
 * @returns {value is { join: "and" | "or", filters: object[], id?: string }}
 */
export function isFilterGroup(value) {
  if (!isRecord(value) || !Array.isArray(value.filters) || normalizeText(value.field)) {
    return false;
  }

  const join = normalizeText(value.join);
  return join === "and" || join === "or";
}

/**
 * @typedef {object} RowanFilterIssue
 * @property {string} path
 * @property {"invalid-node" | "invalid-join" | "missing-field" | "missing-operator" | "unknown-field" | "unknown-operator" | "max-depth" | "max-nodes"} code
 * @property {string} message
 */

function issue(path, code, message) {
  return { path, code, message };
}

function fieldIndex(fields) {
  if (!Array.isArray(fields)) return null;
  const map = new Map();
  for (const field of fields) {
    if (!isRecord(field)) continue;
    const id = normalizeText(field.id);
    if (id) map.set(id, field);
  }
  return map;
}

function operatorsForField(field) {
  if (Array.isArray(field?.operators) && field.operators.length > 0) {
    return field.operators.map(normalizeText).filter(Boolean);
  }
  const type = FIELD_TYPES.has(field?.type) ? field.type : "text";
  return BUILTIN_OPERATORS[type];
}

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
export function validateFilters(filters, fields) {
  const issues = [];
  const known = fieldIndex(fields);
  let count = 0;

  const visit = (node, path, depth) => {
    count += 1;
    if (count > FILTER_MAX_NODES) {
      issues.push(
        issue(path, "max-nodes", `Filter trees accept at most ${FILTER_MAX_NODES} nodes.`),
      );
      return;
    }

    if (!isRecord(node)) {
      issues.push(issue(path, "invalid-node", "A filter node must be an object."));
      return;
    }

    if (isFilterGroup(node)) {
      if (depth > FILTER_GROUP_MAX_DEPTH) {
        issues.push(
          issue(path, "max-depth", `Filter groups nest at most ${FILTER_GROUP_MAX_DEPTH} levels.`),
        );
        return;
      }
      node.filters.forEach((child, index) => visit(child, `${path}.filters[${index}]`, depth + 1));
      return;
    }

    if (Array.isArray(node.filters) && !normalizeText(node.field)) {
      issues.push(issue(path, "invalid-join", 'A group join must be "and" or "or".'));
      return;
    }

    const fieldId = normalizeText(node.field);
    const operator = normalizeText(node.operator);
    if (!fieldId) issues.push(issue(path, "missing-field", "A filter leaf needs a field."));
    if (!operator) issues.push(issue(path, "missing-operator", "A filter leaf needs an operator."));

    if (!known || !fieldId) return;
    const field = known.get(fieldId);
    if (!field) {
      issues.push(issue(path, "unknown-field", `Unknown field "${fieldId}".`));
      return;
    }
    if (operator && !operatorsForField(field).includes(operator)) {
      issues.push(issue(path, "unknown-operator", `Unknown operator "${operator}".`));
    }
  };

  if (!Array.isArray(filters)) {
    issues.push(issue("", "invalid-node", "Filters must be an array."));
    return { valid: false, issues };
  }

  filters.forEach((node, index) => visit(node, `[${index}]`, isFilterGroup(node) ? 1 : 0));
  return { valid: issues.length === 0, issues };
}

/**
 * Deep-clones a leaf or group. Does not validate or enforce depth.
 * @param {object} node
 * @returns {object}
 */
export function cloneFilterNode(node) {
  if (isFilterGroup(node)) {
    const clone = {
      join: node.join === "or" ? "or" : "and",
      filters: node.filters.map(cloneFilterNode),
    };
    if (normalizeText(node.id)) clone.id = normalizeText(node.id);
    return clone;
  }

  return { ...node };
}

function overflowEntry(depth) {
  return { node: null, index: FILTER_MAX_NODES + 1, depth, children: null, overflow: true };
}

function descendantCount(group) {
  let size = 0;
  const stack = Array.isArray(group.filters) ? [...group.filters] : [];
  const limit = FILTER_MAX_NODES + 1;
  while (stack.length > 0 && size < limit) {
    const current = stack.pop();
    size += 1;
    if (isFilterGroup(current)) {
      for (let index = current.filters.length - 1; index >= 0; index -= 1) {
        stack.push(current.filters[index]);
      }
    }
  }
  return size;
}

function indexFilterTree(list) {
  let count = 0;
  const visit = (node, depth) => {
    if (count >= FILTER_MAX_NODES) return overflowEntry(depth);
    count += 1;
    const indexed = {
      node,
      index: count,
      depth,
      children: null,
      overflow: false,
      overflowTail: false,
    };
    if (!isFilterGroup(node)) return indexed;

    if (depth > FILTER_GROUP_MAX_DEPTH) {
      const extra = descendantCount(node);
      const room = FILTER_MAX_NODES - count;
      count += Math.min(extra, room);
      indexed.overflowTail = extra > room;
      return indexed;
    }

    const children = [];
    for (const child of node.filters) {
      if (count >= FILTER_MAX_NODES) {
        children.push(overflowEntry(depth + 1));
        break;
      }
      const next = visit(child, depth + 1);
      children.push(next);
      if (next.overflow || next.overflowTail) break;
    }
    indexed.children = children;
    return indexed;
  };

  const indexed = [];
  for (const node of list) {
    if (count >= FILTER_MAX_NODES) {
      indexed.push(overflowEntry(1));
      break;
    }
    const next = visit(node, isFilterGroup(node) ? 1 : 0);
    indexed.push(next);
    if (next.overflow) break;
  }
  return indexed;
}

function matchesIndexed(row, indexed, fields) {
  if (indexed.overflow || indexed.index > FILTER_MAX_NODES) return false;

  if (isFilterGroup(indexed.node)) {
    if (indexed.depth > FILTER_GROUP_MAX_DEPTH) return false;
    const children = indexed.children;
    if (children.length === 0) return indexed.node.join !== "or";

    return indexed.node.join === "or"
      ? children.some((child) => matchesIndexed(row, child, fields))
      : children.every((child) => matchesIndexed(row, child, fields));
  }

  return matchesFilter(row, indexed.node, fieldFor(fields, indexed.node.field));
}

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
export function applyFilters(rows, filters, fields = []) {
  if (!Array.isArray(rows)) return [];

  const list = Array.isArray(filters) ? filters : [];
  if (list.length === 0) return [...rows];

  const fieldList = Array.isArray(fields) ? fields : [];
  const indexed = indexFilterTree(list);
  return rows.filter((row) => indexed.every((node) => matchesIndexed(row, node, fieldList)));
}
