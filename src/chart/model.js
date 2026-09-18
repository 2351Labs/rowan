const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i;
const TOKEN_COLOR_PATTERN = /^var\(--rowan-[\w-]+\)$/;

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

function normalizePoint(value, label) {
  const source = isObject(value) ? value : { value };
  if (source.value === null) {
    return {
      value: null,
      label: normalizeText(source.label) || label,
    };
  }

  const numeric = Number(source.value);

  return {
    value: Number.isFinite(numeric) ? numeric : null,
    label: normalizeText(source.label) || label,
  };
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
 * @returns {RowanNormalizedChartSeries[]}
 */
export function normalizeChartSeries(value, labels = []) {
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
        values: inputValues.map((point, pointIndex) =>
          normalizePoint(point, labels[pointIndex] || `Point ${pointIndex + 1}`),
        ),
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
        ? series.values.map((point) =>
            isObject(point) ? { label: point.label, value: point.value } : point,
          )
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
    values: series.values.map((point) => ({ ...point })),
  }));
}

/**
 * @param {RowanNormalizedChartSeries[]} series
 * @param {string[]} labels
 * @returns {string[]}
 */
export function resolveChartLabels(series, labels) {
  const length = Math.max(labels.length, ...series.map((item) => item.values.length), 0);

  return Array.from({ length }, (_value, index) => {
    const configured = labels[index];
    if (configured) return configured;

    const point = series.map((item) => item.values[index]).find(Boolean);
    return point?.label || `Point ${index + 1}`;
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
  "var(--rowan-chart-series-1, var(--rowan-color-accent))",
  "var(--rowan-chart-series-2, var(--rowan-color-success))",
  "var(--rowan-chart-series-3, var(--rowan-color-warning))",
  "var(--rowan-chart-series-4, var(--rowan-color-danger))",
];

/**
 * @param {RowanNormalizedChartSeries} series
 * @param {number} index
 */
export function chartSeriesColor(series, index) {
  return series.color || CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length];
}

/**
 * @param {RowanChartValueFormatter | null} formatter
 * @param {number} value
 * @param {RowanChartFormatContext} context
 */
export function formatChartValue(formatter, value, context) {
  if (!formatter) return String(value);

  try {
    return String(formatter(value, context));
  } catch (_error) {
    return String(value);
  }
}
