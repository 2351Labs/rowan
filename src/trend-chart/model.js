const HEX_COLOR_PATTERN = /^#[\da-f]{3,8}$/i;
const TOKEN_COLOR_PATTERN = /^var\(--rowan-[\w-]+\)$/;

/**
 * @typedef {object} RowanTrendChartPoint
 * @property {number | null} value
 * @property {string} [label]
 */

/**
 * @typedef {object} RowanTrendChartSeries
 * @property {string} id
 * @property {string} label
 * @property {Array<number | null | RowanTrendChartPoint>} values
 * @property {string} [color]
 */

/**
 * @typedef {object} RowanTrendChartFormatContext
 * @property {RowanNormalizedTrendSeries} [series]
 * @property {number} [index]
 * @property {string} [label]
 * @property {boolean} [tick]
 */

/**
 * @typedef {(value: number, context: RowanTrendChartFormatContext) => string} RowanTrendChartValueFormatter
 */

/**
 * @typedef {object} RowanTrendChartConfig
 * @property {RowanTrendChartSeries[]} [series]
 * @property {string[]} [labels]
 * @property {boolean} [interactive]
 * @property {RowanTrendChartValueFormatter | null} [valueFormatter]
 */

/**
 * @typedef {object} RowanNormalizedTrendPoint
 * @property {number | null} value
 * @property {string} label
 */

/**
 * @typedef {object} RowanNormalizedTrendSeries
 * @property {string} id
 * @property {string} label
 * @property {RowanNormalizedTrendPoint[]} values
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
export function normalizeTrendLabels(value) {
  return Array.isArray(value) ? value.map((label) => normalizeText(label)) : [];
}

/**
 * @param {unknown} value
 * @param {string[]} labels
 * @returns {RowanNormalizedTrendSeries[]}
 */
export function normalizeTrendSeries(value, labels = []) {
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
 * @param {RowanNormalizedTrendSeries[]} value
 * @returns {RowanNormalizedTrendSeries[]}
 */
export function cloneTrendSeries(value) {
  return value.map((series) => ({
    ...series,
    values: series.values.map((point) => ({ ...point })),
  }));
}

/**
 * @param {RowanNormalizedTrendSeries[]} series
 * @param {string[]} labels
 * @returns {string[]}
 */
export function resolveTrendLabels(series, labels) {
  const length = Math.max(labels.length, ...series.map((item) => item.values.length), 0);

  return Array.from({ length }, (_value, index) => {
    const configured = labels[index];
    if (configured) return configured;

    const point = series.map((item) => item.values[index]).find(Boolean);
    return point?.label || `Point ${index + 1}`;
  });
}

/**
 * @param {RowanNormalizedTrendSeries[]} series
 * @returns {{ min: number, max: number }}
 */
export function trendValueDomain(series) {
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
