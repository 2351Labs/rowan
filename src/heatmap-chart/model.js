function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function finiteOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function uniqueLabels(values) {
  const labels = [];
  const seen = new Set();
  for (const value of values) {
    const label = normalizeText(value) || String(value ?? "");
    if (!label || seen.has(label)) continue;
    seen.add(label);
    labels.push(label);
  }
  return labels;
}

function isMatrix(value) {
  return Array.isArray(value) && value.some((row) => Array.isArray(row));
}

/**
 * @param {{
 *   rows?: unknown,
 *   columns?: unknown,
 *   values?: unknown,
 *   points?: unknown,
 * }} [input]
 */
export function normalizeHeatmap(input = {}) {
  const points = Array.isArray(input.points) ? input.points : [];
  if (points.length && !isMatrix(input.values)) {
    const rows = uniqueLabels(
      points.map((point) => (isObject(point) ? (point.y ?? point.row) : "")),
    );
    const columns = uniqueLabels(
      points.map((point) => (isObject(point) ? (point.x ?? point.column) : "")),
    );
    const values = rows.map((row) =>
      columns.map((column) => {
        const match = points.find((point) => {
          if (!isObject(point)) return false;
          const rowKey = normalizeText(point.y ?? point.row);
          const columnKey = normalizeText(point.x ?? point.column);
          return rowKey === row && columnKey === column;
        });
        return finiteOrNull(isObject(match) ? match.value : null);
      }),
    );
    return { rows, columns, values };
  }

  const rows = Array.isArray(input.rows)
    ? input.rows.map((label, index) => normalizeText(label) || `Row ${index + 1}`)
    : [];
  const columns = Array.isArray(input.columns)
    ? input.columns.map((label, index) => normalizeText(label) || `Column ${index + 1}`)
    : [];
  const source = isMatrix(input.values) ? input.values : [];
  const rowCount = Math.max(rows.length, source.length);
  const columnCount = Math.max(
    columns.length,
    ...source.map((row) => (Array.isArray(row) ? row.length : 0)),
    0,
  );
  const rowLabels = Array.from(
    { length: rowCount },
    (_value, index) => rows[index] || `Row ${index + 1}`,
  );
  const columnLabels = Array.from(
    { length: columnCount },
    (_value, index) => columns[index] || `Column ${index + 1}`,
  );
  const values = rowLabels.map((_row, rowIndex) =>
    columnLabels.map((_column, columnIndex) => {
      const row = Array.isArray(source[rowIndex]) ? source[rowIndex] : [];
      return finiteOrNull(row[columnIndex]);
    }),
  );
  return { rows: rowLabels, columns: columnLabels, values };
}

export function heatmapValueDomain(values) {
  const numbers = values.flat().filter((value) => value !== null);
  if (!numbers.length) return { min: 0, max: 1 };
  return { min: Math.min(...numbers), max: Math.max(...numbers) };
}

export function cloneHeatmapValues(values) {
  return values.map((row) => [...row]);
}

export function cloneHeatmapInput(value = {}) {
  const source = isObject(value) ? value : {};
  return {
    rows: Array.isArray(source.rows) ? [...source.rows] : [],
    columns: Array.isArray(source.columns) ? [...source.columns] : [],
    values: isMatrix(source.values) ? cloneHeatmapValues(source.values) : [],
    points: Array.isArray(source.points)
      ? source.points.map((point) =>
          isObject(point)
            ? {
                x: point.x,
                y: point.y,
                row: point.row,
                column: point.column,
                value: point.value,
              }
            : point,
        )
      : [],
  };
}

export function cloneHeatmap(value) {
  return {
    rows: [...value.rows],
    columns: [...value.columns],
    values: cloneHeatmapValues(value.values),
  };
}
