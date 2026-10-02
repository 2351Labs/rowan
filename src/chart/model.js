const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i;
const TOKEN_COLOR_PATTERN = /^var\(--rowan-[\w-]+\)$/;
const GENERATED_POINT_LABEL = Symbol("rowan.generated-point-label");

/**
 * Shared series/point model for Rowan charts. `rowan-trend-chart` keeps its
 * frozen `RowanTrendChart*` aliases.
 * @typedef {object} RowanChartPoint
 * @property {number | null} value
 * @property {string} [label]
 */

/**
 * @typedef {object} RowanChartSeries
 * @property {string} id
 * @property {string} label
 * @property {Array<number | null | RowanChartPoint>} values
 * @property {string} [color]
 */

/**
 * @typedef {object} RowanChartFormatContext
 * @property {RowanNormalizedChartSeries} [series]
 * @property {number} [index]
 * @property {string} [label]
 * @property {boolean} [tick]
 */

/**
 * @typedef {(value: number, context: RowanChartFormatContext) => string} RowanChartValueFormatter
 */

/**
 * @typedef {object} RowanChartConfig
 * @property {RowanChartSeries[]} [series]
 * @property {string[]} [labels]
 * @property {boolean} [interactive]
 * @property {RowanChartValueFormatter | null} [valueFormatter]
 */

/**
 * @typedef {object} RowanChartReferenceLine
 * @property {number} value
 * @property {string} [label]
 * @property {"neutral" | "info" | "success" | "warning" | "danger"} [tone]
 */

/**
 * @typedef {object} RowanNormalizedChartPoint
 * @property {number | null} value
 * @property {string} label
 */

/**
 * @typedef {object} RowanNormalizedChartSeries
 * @property {string} id
 * @property {string} label
 * @property {RowanNormalizedChartPoint[]} values
 * @property {string} color
 */

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

/**
 * Blank strings are no-data. `"0"` and `0` stay zero.
 * @param {unknown} value
 * @returns {number | null}
 */
export function finiteOrNull(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) ? numeric : null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
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

function normalizePoint(value, configuredLabel, fallbackLabel) {
  const source = isObject(value) ? value : { value };
  const sourceLabel = normalizeText(source.label);
  const authoredLabel = generatedPointLabel(source) === sourceLabel ? "" : sourceLabel;
  const label = authoredLabel || configuredLabel || fallbackLabel;
  const point = {
    value: finiteOrNull(source.value),
    label,
  };
  if (!authoredLabel && !configuredLabel) {
    markGeneratedPointLabel(point);
  }

  return point;
}

function normalizeColor(value) {
  const color = normalizeText(value);
  return HEX_COLOR_PATTERN.test(color) || TOKEN_COLOR_PATTERN.test(color) ? color : "";
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function normalizeChartLabels(value) {
  return Array.isArray(value) ? value.map((label) => normalizeText(label)) : [];
}

/**
 * @param {unknown} value
 * @param {string[]} labels
 * @param {(index: number) => string} [resolveFallbackLabel]
 * @returns {RowanNormalizedChartSeries[]}
 */
export function normalizeChartSeries(value, labels = [], resolveFallbackLabel) {
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
        values: inputValues.map((point, pointIndex) => {
          const configuredLabel = normalizeText(labels[pointIndex]);
          return normalizePoint(
            point,
            configuredLabel,
            fallbackPointLabel(pointIndex, resolveFallbackLabel),
          );
        }),
      },
    ];
  });
}

/**
 * @param {unknown} value
 */
export function cloneChartSeriesInput(value) {
  if (!Array.isArray(value)) return [];

  return value.map((series) => {
    if (!isObject(series)) return series;

    return {
      id: series.id,
      label: series.label,
      color: series.color,
      values: Array.isArray(series.values)
        ? series.values.map((point) => {
            if (!isObject(point)) return point;
            return copyGeneratedPointLabel(point, { label: point.label, value: point.value });
          })
        : series.values,
    };
  });
}

/**
 * @param {RowanNormalizedChartSeries[]} value
 * @returns {RowanNormalizedChartSeries[]}
 */
export function cloneChartSeries(value) {
  return value.map((series) => ({
    ...series,
    values: series.values.map((point) => copyGeneratedPointLabel(point, { ...point })),
  }));
}

/**
 * @param {RowanNormalizedChartSeries[]} series
 * @param {string[]} labels
 * @param {(index: number) => string} [resolveFallbackLabel]
 * @returns {string[]}
 */
export function resolveChartLabels(series, labels, resolveFallbackLabel) {
  const length = Math.max(labels.length, ...series.map((item) => item.values.length), 0);

  return Array.from({ length }, (_value, index) => {
    const configured = normalizeText(labels[index]);
    if (configured) return configured;

    const point = series.map((item) => item.values[index]).find(Boolean);
    if (point?.[GENERATED_POINT_LABEL]) {
      return fallbackPointLabel(index, resolveFallbackLabel);
    }

    return point?.label || fallbackPointLabel(index, resolveFallbackLabel);
  });
}

/**
 * @param {RowanNormalizedChartSeries[]} series
 * @returns {{ min: number, max: number }}
 */
export function chartValueDomain(series) {
  const values = series.flatMap((item) =>
    item.values.map((point) => point.value).filter((point) => point !== null),
  );

  if (values.length === 0) return { min: 0, max: 1 };

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  if (minimum !== maximum) return { min: minimum, max: maximum };

  const padding = Math.max(1, Math.abs(minimum) * 0.1);
  return { min: minimum - padding, max: maximum + padding };
}

/**
 * Bar charts include a zero baseline.
 * @param {RowanNormalizedChartSeries[]} series
 */
export function barValueDomain(series) {
  const domain = chartValueDomain(series);
  if (domain.min >= 0) return { min: 0, max: domain.max || 1 };
  if (domain.max <= 0) return { min: domain.min, max: 0 };
  return domain;
}

/**
 * Stacked bars use the per-category sum of positive values. Null and negatives
 * are no-data and do not contribute.
 * @param {RowanNormalizedChartSeries[]} series
 */
export function stackedBarValueDomain(series) {
  const length = Math.max(0, ...series.map((item) => item.values.length));
  let max = 0;

  for (let index = 0; index < length; index += 1) {
    let sum = 0;
    for (const item of series) {
      const value = item.values[index]?.value;
      if (value !== null && value > 0) sum += value;
    }
    max = Math.max(max, sum);
  }

  return { min: 0, max: max || 1 };
}

/**
 * Positive contribution at one category. Null and negatives are no-data.
 * @param {RowanNormalizedChartSeries[]} series
 * @param {number} index
 */
export function stackedBarCategoryTotal(series, index) {
  let sum = 0;
  for (const item of series) {
    const value = item.values[index]?.value;
    if (value !== null && value > 0) sum += value;
  }
  return sum;
}

/**
 * Absolute stacks use the category sum. Normalized stacks always plot 0–100.
 * @param {RowanNormalizedChartSeries[]} series
 * @param {"absolute" | "normalized"} [stackMode]
 */
export function stackedBarPlotDomain(series, stackMode = "absolute") {
  if (stackMode === "normalized") return { min: 0, max: 100 };
  return stackedBarValueDomain(series);
}

/**
 * @typedef {object} RowanCategoricalPlotBox
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */

/**
 * Rectangle for a categorical bar or stack segment. `from`/`to` are values on
 * the domain; grouped bars use `from: 0`.
 * @param {{
 *   orientation?: "vertical" | "horizontal",
 *   from?: number,
 *   to: number,
 *   domain: { min: number, max: number },
 *   groupStart: number,
 *   offset?: number,
 *   thickness: number,
 *   plot: RowanCategoricalPlotBox,
 * }} options
 */
export function categoricalBarRect({
  orientation = "vertical",
  from = 0,
  to,
  domain,
  groupStart,
  offset = 0,
  thickness,
  plot,
}) {
  const range = domain.max - domain.min || 1;
  if (orientation === "horizontal") {
    const xStart = plot.left + ((from - domain.min) / range) * plot.width;
    const xEnd = plot.left + ((to - domain.min) / range) * plot.width;
    return {
      x: Math.min(xStart, xEnd),
      y: groupStart + offset,
      width: Math.abs(xEnd - xStart),
      height: thickness,
    };
  }

  const yStart = plot.top + ((domain.max - from) / range) * plot.height;
  const yEnd = plot.top + ((domain.max - to) / range) * plot.height;
  return {
    x: groupStart + offset,
    y: Math.min(yStart, yEnd),
    width: thickness,
    height: Math.abs(yEnd - yStart),
  };
}

/**
 * Zero baseline for a categorical plot.
 * @param {"vertical" | "horizontal"} orientation
 * @param {{ min: number, max: number }} domain
 * @param {RowanCategoricalPlotBox} plot
 */
export function categoricalBaseline(orientation, domain, plot) {
  const range = domain.max - domain.min || 1;
  if (orientation === "horizontal") {
    const x = plot.left + ((0 - domain.min) / range) * plot.width;
    return { x1: x, x2: x, y1: plot.top, y2: plot.top + plot.height };
  }

  const y = plot.top + ((domain.max - 0) / range) * plot.height;
  return { x1: plot.left, x2: plot.left + plot.width, y1: y, y2: y };
}

/**
 * X for a category index. Spans the plot like the area chart: first and last
 * sit on the plot edges when there are two or more categories.
 * @param {number} index
 * @param {number} categoryCount
 * @param {RowanCategoricalPlotBox} plot
 */
export function categoricalPointX(index, categoryCount, plot) {
  if (categoryCount <= 1) return plot.left + plot.width / 2;
  return plot.left + (index / (categoryCount - 1)) * plot.width;
}

/**
 * Y for a value on a vertical domain (max at the top).
 * @param {number} value
 * @param {{ min: number, max: number }} domain
 * @param {RowanCategoricalPlotBox} plot
 */
export function categoricalValueY(value, domain, plot) {
  const range = domain.max - domain.min || 1;
  return plot.top + ((domain.max - value) / range) * plot.height;
}

/**
 * Per-category stacked contributions. Null and negatives are no-data and do
 * not contribute; other series still stack at that category.
 * @param {RowanNormalizedChartSeries[]} series
 * @param {"absolute" | "normalized"} [stackMode]
 * @returns {Array<{
 *   index: number,
 *   seriesIndex: number,
 *   from: number,
 *   to: number,
 *   value: number,
 *   plotValue: number,
 * }>}
 */
export function stackedAreaStacks(series, stackMode = "absolute") {
  const length = Math.max(0, ...series.map((item) => item.values.length));
  const stacks = [];

  for (let index = 0; index < length; index += 1) {
    let stack = 0;
    const categoryTotal = stackedBarCategoryTotal(series, index);

    series.forEach((_item, seriesIndex) => {
      const value = series[seriesIndex].values[index]?.value;
      if (value === null || value === undefined || value <= 0) return;

      const plotValue =
        stackMode === "normalized" && categoryTotal > 0 ? (value / categoryTotal) * 100 : value;
      stacks.push({
        index,
        seriesIndex,
        from: stack,
        to: stack + plotValue,
        value,
        plotValue,
      });
      stack += plotValue;
    });
  }

  return stacks;
}

/**
 * Closed fill for consecutive points. Gaps in `index` break the band.
 * @param {Array<{ x: number, yTop: number, yBottom: number, index: number }>} points
 */
export function areaBandPath(points) {
  const segments = [];
  let current = [];

  for (const point of points) {
    if (current.length > 0 && point.index !== current.at(-1).index + 1) {
      segments.push(current);
      current = [];
    }
    current.push(point);
  }
  if (current.length) segments.push(current);

  return segments
    .map((segment) => {
      const top = segment
        .map((point, index) => {
          const command = index === 0 ? "M" : "L";
          return `${command}${point.x.toFixed(2)},${point.yTop.toFixed(2)}`;
        })
        .join(" ");
      const bottom = [...segment]
        .reverse()
        .map((point) => `L${point.x.toFixed(2)},${point.yBottom.toFixed(2)}`)
        .join(" ");
      return `${top} ${bottom} Z`;
    })
    .join(" ");
}

/**
 * Stroke along consecutive tops. Gaps in `index` break the line.
 * @param {Array<{ x: number, yTop: number, index: number }>} points
 */
export function areaLinePath(points) {
  let hasPrevious = false;
  let previousIndex = -1;

  return points
    .map((point) => {
      const command = hasPrevious && point.index === previousIndex + 1 ? "L" : "M";
      hasPrevious = true;
      previousIndex = point.index;
      return `${command}${point.x.toFixed(2)},${point.yTop.toFixed(2)}`;
    })
    .join(" ");
}

/**
 * Donut slices skip null and negative values. Negatives become no-data.
 * @param {RowanNormalizedChartSeries | undefined} series
 */
export function donutSlices(series) {
  if (!series) return [];

  return series.values.map((point, index) => {
    const usable = point.value !== null && point.value > 0;
    return {
      index,
      label: point.label,
      value: usable ? point.value : null,
      included: usable,
    };
  });
}

export const CHART_SERIES_COLORS = [
  "var(--rowan-chart-series-1, var(--rowan-chart-info, var(--rowan-color-accent)))",
  "var(--rowan-chart-series-2, var(--rowan-chart-success, var(--rowan-color-success)))",
  "var(--rowan-chart-series-3, var(--rowan-chart-warning, var(--rowan-color-warning)))",
  "var(--rowan-chart-series-4, var(--rowan-chart-danger, var(--rowan-color-danger)))",
];

/**
 * @param {RowanNormalizedChartSeries} series
 * @param {number} index
 */
export function chartSeriesColor(series, index) {
  return series.color || CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length];
}

/**
 * @template Context
 * @param {((value: number, context: Context) => string) | null} formatter
 * @param {number} value
 * @param {Context} context
 */
export function formatChartValue(formatter, value, context) {
  if (!formatter) return String(value);

  try {
    return String(formatter(value, context));
  } catch (_error) {
    return String(value);
  }
}

const REFERENCE_TONES = new Set(["neutral", "info", "success", "warning", "danger"]);

export function normalizeReferenceLines(value) {
  if (!Array.isArray(value)) return [];

  const lines = [];
  for (const item of value) {
    if (!isObject(item)) continue;
    const numeric = finiteOrNull(item.value);
    if (numeric === null) continue;
    const tone = normalizeText(item.tone).toLowerCase();
    lines.push({
      value: numeric,
      label: normalizeText(item.label),
      tone: REFERENCE_TONES.has(tone) ? tone : "neutral",
    });
  }
  return lines;
}

export function expandDomainWithReferenceLines(domain, lines) {
  let min = domain.min;
  let max = domain.max;
  for (const line of lines) {
    if (line.value < min) min = line.value;
    if (line.value > max) max = line.value;
  }
  return { min, max };
}
