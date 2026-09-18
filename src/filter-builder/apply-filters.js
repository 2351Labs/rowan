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

/**
 * Applies a frozen flat AND filter list to rows. Unknown operators do not match.
 * @param {object[]} rows
 * @param {Array<{ field: string, operator: string, value?: unknown }>} filters
 * @param {Array<{ id: string, type?: string, accessor?: string | ((row: object) => unknown) }>} [fields]
 * @returns {object[]}
 */
export function applyFilters(rows, filters, fields = []) {
  if (!Array.isArray(rows)) return [];

  const list = Array.isArray(filters) ? filters : [];
  if (list.length === 0) return [...rows];

  const fieldList = Array.isArray(fields) ? fields : [];
  return rows.filter((row) =>
    list.every((filter) => matchesFilter(row, filter, fieldFor(fieldList, filter.field))),
  );
}
