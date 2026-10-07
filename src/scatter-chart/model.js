import { finiteOrNull } from "../chart/model.js";

const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i;
const TOKEN_COLOR_PATTERN = /^var\(--rowan-[\w-]+\)$/;
const GENERATED_POINT_LABEL = Symbol("rowan.scatter-generated-point-label");

/**
 * Normalized scatter point passed to a value formatter.
 * @typedef {object} RowanScatterChartPoint
 * @property {number | null} x
 * @property {number | null} y
 * @property {number | null} size
 * @property {string} label
 */

/**
 * Normalized scatter series passed to a value formatter.
 * @typedef {object} RowanScatterChartSeries
 * @property {string} id
 * @property {string} label
 * @property {string} color
 * @property {RowanScatterChartPoint[]} points
 */

/**
 * @typedef {object} RowanScatterChartFormatContext
 * @property {RowanScatterChartSeries} [series]
 * @property {number} [index]
 * @property {string} [label]
 * @property {boolean} [tick]
 */

/**
 * @typedef {(value: number, context: RowanScatterChartFormatContext) => string} RowanScatterChartValueFormatter
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

/**
 * @param {unknown} value
 */
export function cloneScatterSeriesInput(value) {
  if (!Array.isArray(value)) return [];
  return value.map((series) => {
    if (!isObject(series)) return series;
    return {
      id: series.id,
      label: series.label,
      color: series.color,
      points: Array.isArray(series.points)
        ? series.points.map((point) => {
            if (!isObject(point)) return point;
            return copyGeneratedPointLabel(point, {
              x: point.x,
              y: point.y,
              size: point.size,
              label: point.label,
            });
          })
        : series.points,
    };
  });
}

/**
 * @param {unknown} value
 */
export function normalizeScatterSeries(value) {
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

    const points = Array.isArray(item.points) ? item.points : [];
    return [
      {
        id,
        label: normalizeText(item.label) || id,
        color: normalizeColor(item.color),
        points: points.map((point, pointIndex) => {
          const sourcePoint = isObject(point) ? point : {};
          const sourceLabel = normalizeText(sourcePoint.label);
          const authoredLabel = generatedPointLabel(sourcePoint) === sourceLabel ? "" : sourceLabel;
          const normalized = {
            x: finiteOrNull(sourcePoint.x),
            y: finiteOrNull(sourcePoint.y),
            size: finiteOrNull(sourcePoint.size),
            label: authoredLabel || fallbackPointLabel(pointIndex),
          };
          if (!authoredLabel) {
            markGeneratedPointLabel(normalized);
          }
          return normalized;
        }),
      },
    ];
  });
}

export function cloneScatterSeries(value) {
  return value.map((series) => ({
    ...series,
    points: series.points.map((point) => copyGeneratedPointLabel(point, { ...point })),
  }));
}

/**
 * @param {RowanScatterChartPoint} point
 * @param {number} index
 * @param {(index: number) => string} [resolveFallbackLabel]
 */
export function resolveScatterPointLabel(point, index, resolveFallbackLabel) {
  if (point?.[GENERATED_POINT_LABEL]) {
    return fallbackPointLabel(index, resolveFallbackLabel);
  }

  return point?.label || fallbackPointLabel(index, resolveFallbackLabel);
}

export function scatterDomains(series) {
  const xs = [];
  const ys = [];
  const sizes = [];
  for (const item of series) {
    for (const point of item.points) {
      if (point.x === null || point.y === null) continue;
      xs.push(point.x);
      ys.push(point.y);
      if (point.size !== null) sizes.push(point.size);
    }
  }
  return {
    x: padDomain(xs),
    y: padDomain(ys),
    size: sizes.length ? padDomain(sizes) : null,
  };
}
