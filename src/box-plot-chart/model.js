import { finiteOrNull } from "../chart/model.js";

const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i;
const TOKEN_COLOR_PATTERN = /^var\(--rowan-[\w-]+\)$/;
const GENERATED_POINT_LABEL = Symbol("rowan.box-plot-generated-point-label");

/**
 * Normalized five-number summary passed to a value formatter.
 * @typedef {object} RowanBoxPlotChartPoint
 * @property {number | null} min
 * @property {number | null} q1
 * @property {number | null} median
 * @property {number | null} q3
 * @property {number | null} max
 * @property {number[]} outliers
 * @property {string} label
 */

/**
 * Normalized box-plot series passed to a value formatter.
 * @typedef {object} RowanBoxPlotChartSeries
 * @property {string} id
 * @property {string} label
 * @property {string} color
 * @property {RowanBoxPlotChartPoint[]} values
 */

/**
 * @typedef {object} RowanBoxPlotChartFormatContext
 * @property {RowanBoxPlotChartSeries} [series]
 * @property {number} [index]
 * @property {string} [label]
 * @property {boolean} [tick]
 */

/**
 * @typedef {(value: number, context: RowanBoxPlotChartFormatContext) => string} RowanBoxPlotChartValueFormatter
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

function normalizeOutliers(value) {
  if (!Array.isArray(value)) return [];
  return value.map(finiteOrNull).filter((item) => item !== null);
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

/**
 * @param {unknown} value
 */
export function cloneBoxPlotSeriesInput(value) {
  if (!Array.isArray(value)) return [];
  return value.map((series) => {
    if (!isObject(series)) return series;
    return {
      id: series.id,
      label: series.label,
      color: series.color,
      values: Array.isArray(series.values)
        ? series.values.map((point) =>
            isObject(point)
              ? copyGeneratedPointLabel(point, {
                  min: point.min,
                  q1: point.q1,
                  median: point.median,
                  q3: point.q3,
                  max: point.max,
                  outliers: Array.isArray(point.outliers) ? [...point.outliers] : point.outliers,
                  label: point.label,
                })
              : point,
          )
        : series.values,
    };
  });
}

/**
 * Five-number summaries are authored. The host does not compute quartiles.
 * @param {unknown} value
 * @param {string[]} labels
 */
export function normalizeBoxPlotSeries(value, labels = []) {
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
        values: inputValues.map((point, index) => {
          const itemPoint = isObject(point) ? point : {};
          const sourceLabel = normalizeText(itemPoint.label);
          const authoredLabel = generatedPointLabel(itemPoint) === sourceLabel ? "" : sourceLabel;
          const configuredLabel = normalizeText(labels[index]);
          const normalized = {
            min: finiteOrNull(itemPoint.min),
            q1: finiteOrNull(itemPoint.q1),
            median: finiteOrNull(itemPoint.median),
            q3: finiteOrNull(itemPoint.q3),
            max: finiteOrNull(itemPoint.max),
            outliers: normalizeOutliers(itemPoint.outliers),
            label: authoredLabel || configuredLabel || fallbackPointLabel(index),
          };
          if (!authoredLabel && !configuredLabel) {
            markGeneratedPointLabel(normalized);
          }
          return normalized;
        }),
      },
    ];
  });
}

export function cloneBoxPlotSeries(value) {
  return value.map((series) => ({
    ...series,
    values: series.values.map((point) =>
      copyGeneratedPointLabel(point, {
        ...point,
        outliers: [...point.outliers],
      }),
    ),
  }));
}

/**
 * @param {RowanBoxPlotChartSeries[]} series
 * @param {string[]} labels
 * @param {(index: number) => string} [resolveFallbackLabel]
 * @returns {string[]}
 */
export function resolveBoxPlotLabels(series, labels, resolveFallbackLabel) {
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

export function boxPlotIncluded(point) {
  const { min, q1, median, q3, max } = point;
  return (
    [min, q1, median, q3, max].every((value) => value !== null) &&
    min <= q1 &&
    q1 <= median &&
    median <= q3 &&
    q3 <= max
  );
}

export function boxPlotDomain(series) {
  const numbers = [];
  for (const item of series) {
    for (const point of item.values) {
      if (!boxPlotIncluded(point)) continue;
      numbers.push(point.min, point.q1, point.median, point.q3, point.max, ...point.outliers);
    }
  }
  return padDomain(numbers);
}
