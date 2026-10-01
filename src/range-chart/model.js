import { finiteOrNull } from "../chart/model.js";

const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i;
const TOKEN_COLOR_PATTERN = /^var\(--rowan-[\w-]+\)$/;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeColor(value) {
  const color = normalizeText(value);
  return HEX_COLOR_PATTERN.test(color) || TOKEN_COLOR_PATTERN.test(color) ? color : "";
}

function padDomain(values) {
  if (!values.length) return { min: 0, max: 1 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min !== max) return { min, max };
  const padding = Math.max(1, Math.abs(min) * 0.1);
  return { min: min - padding, max: max + padding };
}

function normalizePoint(point, index, labels) {
  if (Array.isArray(point)) {
    return {
      low: finiteOrNull(point[0]),
      high: finiteOrNull(point[1]),
      label: labels[index] || `Point ${index + 1}`,
    };
  }
  const item = isObject(point) ? point : {};
  return {
    low: finiteOrNull(item.low),
    high: finiteOrNull(item.high),
    label: normalizeText(item.label) || labels[index] || `Point ${index + 1}`,
  };
}

/**
 * @param {unknown} value
 */
export function cloneRangeSeriesInput(value) {
  if (!Array.isArray(value)) return [];
  return value.map((series) => {
    if (!isObject(series)) return series;
    return {
      id: series.id,
      label: series.label,
      color: series.color,
      values: Array.isArray(series.values)
        ? series.values.map((point) =>
            Array.isArray(point)
              ? [...point]
              : isObject(point)
                ? { low: point.low, high: point.high, label: point.label }
                : point,
          )
        : series.values,
    };
  });
}

/**
 * Own `{ low, high }` series model — not frozen categorical `series.values`.
 * @param {unknown} value
 * @param {string[]} labels
 */
export function normalizeRangeSeries(value, labels = []) {
  const source = Array.isArray(value) ? value : [];
  const ids = new Set();

  return source.flatMap((item, seriesIndex) => {
    if (!isObject(item)) return [];
    const baseId = normalizeText(item.id) || `series-${seriesIndex + 1}`;
    let id = baseId;
    let suffix = 2;
    while (ids.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    ids.add(id);
    const inputValues = Array.isArray(item.values) ? item.values : [];
    return [
      {
        id,
        label: normalizeText(item.label) || id,
        color: normalizeColor(item.color),
        values: inputValues.map((point, index) => normalizePoint(point, index, labels)),
      },
    ];
  });
}

export function cloneRangeSeries(value) {
  return value.map((series) => ({
    ...series,
    values: series.values.map((point) => ({ ...point })),
  }));
}

export function rangePointIncluded(point) {
  return point.low !== null && point.high !== null && point.low <= point.high;
}

export function rangeDomain(series) {
  const numbers = [];
  for (const item of series) {
    for (const point of item.values) {
      if (!rangePointIncluded(point)) continue;
      numbers.push(point.low, point.high);
    }
  }
  return padDomain(numbers);
}
