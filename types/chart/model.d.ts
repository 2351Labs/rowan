/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function normalizeChartLabels(value: unknown): string[];
/**
 * @param {unknown} value
 * @param {string[]} labels
 * @returns {RowanNormalizedChartSeries[]}
 */
export function normalizeChartSeries(value: unknown, labels?: string[]): RowanNormalizedChartSeries[];
/**
 * @param {unknown} value
 */
export function cloneChartSeriesInput(value: unknown): any[];
/**
 * @param {RowanNormalizedChartSeries[]} value
 * @returns {RowanNormalizedChartSeries[]}
 */
export function cloneChartSeries(value: RowanNormalizedChartSeries[]): RowanNormalizedChartSeries[];
/**
 * @param {RowanNormalizedChartSeries[]} series
 * @param {string[]} labels
 * @returns {string[]}
 */
export function resolveChartLabels(series: RowanNormalizedChartSeries[], labels: string[]): string[];
/**
 * @param {RowanNormalizedChartSeries[]} series
 * @returns {{ min: number, max: number }}
 */
export function chartValueDomain(series: RowanNormalizedChartSeries[]): {
    min: number;
    max: number;
};
/**
 * Bar charts include a zero baseline.
 * @param {RowanNormalizedChartSeries[]} series
 */
export function barValueDomain(series: RowanNormalizedChartSeries[]): {
    min: number;
    max: number;
};
/**
 * Stacked bars use the per-category sum of positive values. Null and negatives
 * are no-data and do not contribute.
 * @param {RowanNormalizedChartSeries[]} series
 */
export function stackedBarValueDomain(series: RowanNormalizedChartSeries[]): {
    min: number;
    max: number;
};
/**
 * Donut slices skip null and negative values. Negatives become no-data.
 * @param {RowanNormalizedChartSeries | undefined} series
 */
export function donutSlices(series: RowanNormalizedChartSeries | undefined): {
    index: number;
    label: string;
    value: number | null;
    included: boolean;
}[];
/**
 * @param {RowanNormalizedChartSeries} series
 * @param {number} index
 */
export function chartSeriesColor(series: RowanNormalizedChartSeries, index: number): string;
/**
 * @param {RowanChartValueFormatter | null} formatter
 * @param {number} value
 * @param {RowanChartFormatContext} context
 */
export function formatChartValue(formatter: RowanChartValueFormatter | null, value: number, context: RowanChartFormatContext): string;
export function normalizeReferenceLines(value: any): {
    value: number;
    label: string;
    tone: string;
}[];
export function expandDomainWithReferenceLines(domain: any, lines: any): {
    min: any;
    max: any;
};
export const CHART_SERIES_COLORS: string[];
/**
 * Shared series/point model for Rowan charts. `rowan-trend-chart` keeps its
 * frozen `RowanTrendChart*` aliases.
 */
export type RowanChartPoint = {
    value: number | null;
    label?: string | undefined;
};
export type RowanChartSeries = {
    id: string;
    label: string;
    values: Array<number | null | RowanChartPoint>;
    color?: string | undefined;
};
export type RowanChartFormatContext = {
    series?: RowanNormalizedChartSeries | undefined;
    index?: number | undefined;
    label?: string | undefined;
    tick?: boolean | undefined;
};
export type RowanChartValueFormatter = (value: number, context: RowanChartFormatContext) => string;
export type RowanChartConfig = {
    series?: RowanChartSeries[] | undefined;
    labels?: string[] | undefined;
    interactive?: boolean | undefined;
    valueFormatter?: RowanChartValueFormatter | null | undefined;
};
export type RowanChartReferenceLine = {
    value: number;
    label?: string | undefined;
    tone?: "info" | "success" | "warning" | "danger" | "neutral" | undefined;
};
export type RowanNormalizedChartPoint = {
    value: number | null;
    label: string;
};
export type RowanNormalizedChartSeries = {
    id: string;
    label: string;
    values: RowanNormalizedChartPoint[];
    color: string;
};
