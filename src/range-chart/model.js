import { finiteOrNull } from "../chart/model.js";

const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i;
const TOKEN_COLOR_PATTERN = /^var\(--rowan-[\w-]+\)$/;
const GENERATED_POINT_LABEL = Symbol("rowan.range-generated-point-label");

/**
 * Normalized range point passed to a value formatter.
 * @typedef {object} RowanRangeChartPoint
 * @property {number | null} low
 * @property {number | null} high
 * @property {string} label
 */

/**
 * Normalized range series passed to a value formatter.
 * @typedef {object} RowanRangeChartSeries
 * @property {string} id
 * @property {string} label
 * @property {string} color
 * @property {RowanRangeChartPoint[]} values
 */

/**
 * @typedef {object} RowanRangeChartFormatContext
 * @property {RowanRangeChartSeries} [series]
 * @property {number} [index]
 * @property {string} [label]
 * @property {boolean} [tick]
 */

/**
 * @typedef {(value: number, context: RowanRangeChartFormatContext) => string} RowanRangeChartValueFormatter
 */

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

function fallbackPointLabel(index, resolveFallback) {
  if (typeof resolveFallback === "function") {
    const resolved = normalizeText(resolveFallback(index));
    if (resolved) return resolved;
  }

  return `Point ${index + 1}`;
}

function generatedPointLabel(value) {
  return typeof value?.[GENERATED_POINT_LABEL] === "string" ? value[GENERATED_POINT_LABEL] : "";
}

function markGeneratedPointLabel(point) {
  Object.defineProperty(point, GENERATED_POINT_LABEL, { value: point.label });
  return point;
}

function copyGeneratedPointLabel(source, target) {
  const label = generatedPointLabel(source);
  if (label) Object.defineProperty(target, GENERATED_POINT_LABEL, { value: label });
  return target;
}

function normalizePoint(point, index, labels) {
  const configuredLabel = normalizeText(labels[index]);
  if (Array.isArray(point)) {
    const normalized = {
      low: finiteOrNull(point[0]),
      high: finiteOrNull(point[1]),
      label: configuredLabel || fallbackPointLabel(index),
    };
    if (!configuredLabel) {
      markGeneratedPointLabel(normalized);
    }
    return normalized;
  }
  const item = isObject(point) ? point : {};
  const sourceLabel = normalizeText(item.label);
  const authoredLabel = generatedPointLabel(item) === sourceLabel ? "" : sourceLabel;
  const normalized = {
    low: finiteOrNull(item.low),
    high: finiteOrNull(item.high),
    label: authoredLabel || configuredLabel || fallbackPointLabel(index),
  };
  if (!authoredLabel && !configuredLabel) {
    markGeneratedPointLabel(normalized);
  }
  return normalized;
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
                ? copyGeneratedPointLabel(point, {
                    low: point.low,
                    high: point.high,
                    label: point.label,
                  })
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
    values: series.values.map((point) => copyGeneratedPointLabel(point, { ...point })),
  }));
}

/**
 * @param {RowanRangeChartSeries[]} series
 * @param {string[]} labels
 * @param {(index: number) => string} [resolveFallbackLabel]
 * @returns {string[]}
 */
export function resolveRangeLabels(series, labels, resolveFallbackLabel) {
  const length = Math.max(labels.length, ...series.map((item) => item.values.length), 0);

  return Array.from({ length }, (_value, index) => {
    const configured = normalizeText(labels[index]);
    if (configured) return configured;

    const point = series[0]?.values[index];
    if (point?.[GENERATED_POINT_LABEL]) {
      return fallbackPointLabel(index, resolveFallbackLabel);
    }

    return point?.label || fallbackPointLabel(index, resolveFallbackLabel);
  });
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
