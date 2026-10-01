/**
 * @param {unknown} value
 */
export function cloneBoxPlotSeriesInput(value: unknown): any[];
/**
 * Five-number summaries are authored. The host does not compute quartiles.
 * @param {unknown} value
 * @param {string[]} labels
 */
export function normalizeBoxPlotSeries(value: unknown, labels?: string[]): {
    id: string;
    label: string;
    color: string;
    values: any;
}[];
export function cloneBoxPlotSeries(value: any): any;
export function boxPlotIncluded(point: any): boolean;
export function boxPlotDomain(series: any): {
    min: number;
    max: number;
};
/**
 * Normalized five-number summary passed to a value formatter.
 */
export type RowanBoxPlotChartPoint = {
    min: number | null;
    q1: number | null;
    median: number | null;
    q3: number | null;
    max: number | null;
    outliers: number[];
    label: string;
};
/**
 * Normalized box-plot series passed to a value formatter.
 */
export type RowanBoxPlotChartSeries = {
    id: string;
    label: string;
    color: string;
    values: RowanBoxPlotChartPoint[];
};
export type RowanBoxPlotChartFormatContext = {
    series?: RowanBoxPlotChartSeries | undefined;
    index?: number | undefined;
    label?: string | undefined;
    tick?: boolean | undefined;
};
export type RowanBoxPlotChartValueFormatter = (value: number, context: RowanBoxPlotChartFormatContext) => string;
