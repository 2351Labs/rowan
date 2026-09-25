function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeId(value) {
  return String(value ?? "").trim();
}

function hiddenIdSet(hiddenIds) {
  if (hiddenIds instanceof Set) return hiddenIds;
  if (!Array.isArray(hiddenIds)) return null;
  return new Set(hiddenIds.map((id) => normalizeId(id)).filter(Boolean));
}

/**
 * Columns that should render or export. Pass `hiddenIds` to override
 * `column.hidden`; otherwise `column.hidden` is the source of truth.
 *
 * @param {Array<{ id?: string, hidden?: boolean } | null | undefined>} [columns]
 * @param {Iterable<string> | null} [hiddenIds]
 * @returns {object[]}
 */
export function visibleColumns(columns, hiddenIds) {
  const hidden = hiddenIdSet(hiddenIds);
  const list = Array.isArray(columns) ? columns : [];

  return list.filter((column) => {
    if (!isRecord(column)) return false;
    const id = normalizeId(column.id);
    if (!id) return false;
    if (hidden) return !hidden.has(id);
    return !column.hidden;
  });
}

function cellValue(row, column, rowIndex) {
  let value;
  try {
    if (typeof column.accessor === "function") value = column.accessor(row, rowIndex);
    else if (typeof column.accessor === "string" && column.accessor) {
      value = isRecord(row) ? row[column.accessor] : undefined;
    } else {
      value = isRecord(row) ? row[column.id] : undefined;
    }
  } catch {
    value = undefined;
  }

  if (typeof column.format === "function") {
    try {
      return column.format(value, row, rowIndex);
    } catch {
      return "";
    }
  }

  return value;
}

function csvCell(value) {
  if (value == null) return "";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) {
    return csvEscape(value.map((item) => (item == null ? "" : String(item))).join(" "));
  }
  if (typeof value === "object") {
    if ("value" in value && value.value != null) return csvEscape(String(value.value));
    return "";
  }
  return csvEscape(String(value));
}

function csvEscape(text) {
  if (/[",\r\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

/**
 * RFC 4180 CSV text for table columns and rows. Hidden columns are omitted
 * unless `includeHidden` is true. The app owns download / Blob / URL writes.
 *
 * @param {object[]} [columns]
 * @param {object[]} [rows]
 * @param {{ includeHidden?: boolean }} [options]
 * @returns {string}
 */
export function createTableCsv(columns, rows, options = {}) {
  const cols = options.includeHidden ? visibleColumns(columns, []) : visibleColumns(columns);
  const header = cols.map((column) => csvEscape(String(column.header || column.id))).join(",");
  const list = Array.isArray(rows) ? rows : [];
  const lines = [header];

  list.forEach((row, rowIndex) => {
    lines.push(cols.map((column) => csvCell(cellValue(row, column, rowIndex))).join(","));
  });

  return lines.join("\r\n");
}
