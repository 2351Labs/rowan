/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function normalizeTrendLabels(value: unknown): string[];
/**
 * @param {unknown} value
 * @param {string[]} labels
 * @returns {RowanNormalizedTrendSeries[]}
 */
export function normalizeTrendSeries(value: unknown, labels?: string[]): RowanNormalizedTrendSeries[];
/**
 * @param {RowanNormalizedTrendSeries[]} value
 * @returns {RowanNormalizedTrendSeries[]}
 */
export function cloneTrendSeries(value: RowanNormalizedTrendSeries[]): RowanNormalizedTrendSeries[];
/**
 * @param {RowanNormalizedTrendSeries[]} series
 * @param {string[]} labels
 * @returns {string[]}
 */
export function resolveTrendLabels(series: RowanNormalizedTrendSeries[], labels: string[]): string[];
/**
 * @param {RowanNormalizedTrendSeries[]} series
 * @returns {{ min: number, max: number }}
 */
export function trendValueDomain(series: RowanNormalizedTrendSeries[]): {
    min: number;
    max: number;
};
export type RowanTrendChartPoint = {
    value: number | null;
    label?: string;
};
export type RowanTrendChartSeries = {
    id: string;
    label: string;
    values: Array<number | null | RowanTrendChartPoint>;
    color?: string;
};
export type RowanTrendChartFormatContext = {
    series?: RowanNormalizedTrendSeries;
    index?: number;
    label?: string;
    tick?: boolean;
};
export type RowanTrendChartValueFormatter = (value: number, context: RowanTrendChartFormatContext) => string;
export type RowanTrendChartConfig = {
    series?: RowanTrendChartSeries[];
    labels?: string[];
    interactive?: boolean;
    valueFormatter?: RowanTrendChartValueFormatter | null;
};
export type RowanNormalizedTrendPoint = {
    value: number | null;
    label: string;
};
export type RowanNormalizedTrendSeries = {
    id: string;
    label: string;
    values: RowanNormalizedTrendPoint[];
    color: string;
};
