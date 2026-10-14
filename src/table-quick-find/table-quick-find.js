function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeQuery(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function cellText(value) {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return null;
}

function matchesValue(value, needle) {
  const text = cellText(value);
  if (text == null) return false;
  return text.toLowerCase().includes(needle);
}

function normalizeKeys(keys) {
  if (keys == null) return null;
  if (!Array.isArray(keys)) return [];
  return keys.map((key) => String(key ?? "").trim()).filter(Boolean);
}

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
export function applyQuickFind(rows, query, keys) {
  if (!Array.isArray(rows)) return [];

  const needle = normalizeQuery(query);
  if (!needle) return [...rows];

  const keyList = normalizeKeys(keys);
  return rows.filter((row) => {
    if (!isRecord(row)) return false;
    const values = keyList ? keyList.map((key) => row[key]) : Object.values(row);
    return values.some((value) => matchesValue(value, needle));
  });
}
