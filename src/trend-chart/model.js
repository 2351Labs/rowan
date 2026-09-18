export {
  chartValueDomain as trendValueDomain,
  cloneChartSeries as cloneTrendSeries,
  normalizeChartLabels as normalizeTrendLabels,
  normalizeChartSeries as normalizeTrendSeries,
  resolveChartLabels as resolveTrendLabels,
} from "../chart/model.js";

/**
 * @typedef {import("../chart/model.js").RowanChartPoint} RowanTrendChartPoint
 */

/**
 * @typedef {import("../chart/model.js").RowanChartSeries} RowanTrendChartSeries
 */

/**
 * @typedef {import("../chart/model.js").RowanChartFormatContext} RowanTrendChartFormatContext
 */

/**
 * @typedef {import("../chart/model.js").RowanChartValueFormatter} RowanTrendChartValueFormatter
 */

/**
 * Frozen line-chart configuration for `rowan-trend-chart`. Other geometries
 * are separate hosts and must not change these keys.
 * @typedef {import("../chart/model.js").RowanChartConfig} RowanTrendChartConfig
 */

/**
 * @typedef {import("../chart/model.js").RowanNormalizedChartPoint} RowanNormalizedTrendPoint
 */

/**
 * @typedef {import("../chart/model.js").RowanNormalizedChartSeries} RowanNormalizedTrendSeries
 */
