export type RowanTrendChartPoint = import("../chart/model.js").RowanChartPoint;
export type RowanTrendChartSeries = import("../chart/model.js").RowanChartSeries;
export type RowanTrendChartFormatContext = import("../chart/model.js").RowanChartFormatContext;
export type RowanTrendChartValueFormatter = import("../chart/model.js").RowanChartValueFormatter;
/**
 * Frozen line-chart configuration for `rowan-trend-chart`. Other geometries
 * are separate hosts and must not change these keys.
 */
export type RowanTrendChartConfig = import("../chart/model.js").RowanChartConfig;
export type RowanNormalizedTrendPoint = import("../chart/model.js").RowanNormalizedChartPoint;
export type RowanNormalizedTrendSeries = import("../chart/model.js").RowanNormalizedChartSeries;
export { chartValueDomain as trendValueDomain, cloneChartSeries as cloneTrendSeries, normalizeChartLabels as normalizeTrendLabels, normalizeChartSeries as normalizeTrendSeries, resolveChartLabels as resolveTrendLabels } from "../chart/model.js";
