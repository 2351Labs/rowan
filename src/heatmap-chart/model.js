import { finiteOrNull } from "../chart/model.js";

const GENERATED_ROWS = Symbol("rowan.heatmap-generated-rows");
const GENERATED_COLUMNS = Symbol("rowan.heatmap-generated-columns");

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
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

function fallbackLabel(index, resolveFallback, prefix) {
  if (typeof resolveFallback === "function") {
    const resolved = normalizeText(resolveFallback(index));
    if (resolved) return resolved;
  }

  return `${prefix} ${index + 1}`;
}

function withGeneratedLabels(value, rows, columns) {
  Object.defineProperties(value, {
    [GENERATED_ROWS]: { value: rows },
    [GENERATED_COLUMNS]: { value: columns },
  });
  return value;
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
    return withGeneratedLabels(
      { rows, columns, values },
      rows.map(() => false),
      columns.map(() => false),
    );
  }

  const rows = Array.isArray(input.rows) ? input.rows : [];
  const columns = Array.isArray(input.columns) ? input.columns : [];
  const source = isMatrix(input.values) ? input.values : [];
  const rowCount = Math.max(rows.length, source.length);
  const columnCount = Math.max(
    columns.length,
    ...source.map((row) => (Array.isArray(row) ? row.length : 0)),
    0,
  );
  const generatedRows = [];
  const rowLabels = Array.from({ length: rowCount }, (_value, index) => {
    const label = normalizeText(rows[index]);
    generatedRows[index] = !label;
    return label || fallbackLabel(index, undefined, "Row");
  });
  const generatedColumns = [];
  const columnLabels = Array.from({ length: columnCount }, (_value, index) => {
    const label = normalizeText(columns[index]);
    generatedColumns[index] = !label;
    return label || fallbackLabel(index, undefined, "Column");
  });
  const values = rowLabels.map((_row, rowIndex) =>
    columnLabels.map((_column, columnIndex) => {
      const row = Array.isArray(source[rowIndex]) ? source[rowIndex] : [];
      return finiteOrNull(row[columnIndex]);
    }),
  );
  return withGeneratedLabels(
    { rows: rowLabels, columns: columnLabels, values },
    generatedRows,
    generatedColumns,
  );
}

/**
 * @param {{ rows: string[], columns: string[] }} value
 * @param {(index: number) => string} [resolveRowFallback]
 * @param {(index: number) => string} [resolveColumnFallback]
 */
export function resolveHeatmapLabels(value, resolveRowFallback, resolveColumnFallback) {
  const generatedRows = value[GENERATED_ROWS] ?? [];
  const generatedColumns = value[GENERATED_COLUMNS] ?? [];
  return {
    rows: value.rows.map((label, index) =>
      generatedRows[index] ? fallbackLabel(index, resolveRowFallback, "Row") : label,
    ),
    columns: value.columns.map((label, index) =>
      generatedColumns[index] ? fallbackLabel(index, resolveColumnFallback, "Column") : label,
    ),
  };
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
