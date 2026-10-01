/**
 * Blank strings are no-data. `"0"` and `0` stay zero.
 * @param {unknown} value
 * @returns {number | null}
 */
export function finiteOrNull(value: unknown): number | null;
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
 * Positive contribution at one category. Null and negatives are no-data.
 * @param {RowanNormalizedChartSeries[]} series
 * @param {number} index
 */
export function stackedBarCategoryTotal(series: RowanNormalizedChartSeries[], index: number): number;
/**
 * Absolute stacks use the category sum. Normalized stacks always plot 0–100.
 * @param {RowanNormalizedChartSeries[]} series
 * @param {"absolute" | "normalized"} [stackMode]
 */
export function stackedBarPlotDomain(series: RowanNormalizedChartSeries[], stackMode?: "absolute" | "normalized" | undefined): {
    min: number;
    max: number;
};
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
export function categoricalBarRect({ orientation, from, to, domain, groupStart, offset, thickness, plot, }: {
    orientation?: "vertical" | "horizontal";
    from?: number;
    to: number;
    domain: {
        min: number;
        max: number;
    };
    groupStart: number;
    offset?: number;
    thickness: number;
    plot: RowanCategoricalPlotBox;
}): {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * Zero baseline for a categorical plot.
 * @param {"vertical" | "horizontal"} orientation
 * @param {{ min: number, max: number }} domain
 * @param {RowanCategoricalPlotBox} plot
 */
export function categoricalBaseline(orientation: "vertical" | "horizontal", domain: {
    min: number;
    max: number;
}, plot: RowanCategoricalPlotBox): {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};
/**
 * X for a category index. Spans the plot like the area chart: first and last
 * sit on the plot edges when there are two or more categories.
 * @param {number} index
 * @param {number} categoryCount
 * @param {RowanCategoricalPlotBox} plot
 */
export function categoricalPointX(index: number, categoryCount: number, plot: RowanCategoricalPlotBox): number;
/**
 * Y for a value on a vertical domain (max at the top).
 * @param {number} value
 * @param {{ min: number, max: number }} domain
 * @param {RowanCategoricalPlotBox} plot
 */
export function categoricalValueY(value: number, domain: {
    min: number;
    max: number;
}, plot: RowanCategoricalPlotBox): number;
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
export function stackedAreaStacks(series: RowanNormalizedChartSeries[], stackMode?: "absolute" | "normalized" | undefined): Array<{
    index: number;
    seriesIndex: number;
    from: number;
    to: number;
    value: number;
    plotValue: number;
}>;
/**
 * Closed fill for consecutive points. Gaps in `index` break the band.
 * @param {Array<{ x: number, yTop: number, yBottom: number, index: number }>} points
 */
export function areaBandPath(points: Array<{
    x: number;
    yTop: number;
    yBottom: number;
    index: number;
}>): string;
/**
 * Stroke along consecutive tops. Gaps in `index` break the line.
 * @param {Array<{ x: number, yTop: number, index: number }>} points
 */
export function areaLinePath(points: Array<{
    x: number;
    yTop: number;
    index: number;
}>): string;
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
 * @template Context
 * @param {((value: number, context: Context) => string) | null} formatter
 * @param {number} value
 * @param {Context} context
 */
export function formatChartValue<Context>(formatter: ((value: number, context: Context) => string) | null, value: number, context: Context): string;
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
export type RowanCategoricalPlotBox = {
    left: number;
    top: number;
    width: number;
    height: number;
};
