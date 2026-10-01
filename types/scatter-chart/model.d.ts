/**
 * @param {unknown} value
 */
export function cloneScatterSeriesInput(value: unknown): any[];
/**
 * @param {unknown} value
 */
export function normalizeScatterSeries(value: unknown): {
    id: string;
    label: string;
    color: string;
    points: any;
}[];
export function cloneScatterSeries(value: any): any;
export function scatterDomains(series: any): {
    x: {
        min: number;
        max: number;
    };
    y: {
        min: number;
        max: number;
    };
    size: {
        min: number;
        max: number;
    } | null;
};
/**
 * Normalized scatter point passed to a value formatter.
 */
export type RowanScatterChartPoint = {
    x: number | null;
    y: number | null;
    size: number | null;
    label: string;
};
/**
 * Normalized scatter series passed to a value formatter.
 */
export type RowanScatterChartSeries = {
    id: string;
    label: string;
    color: string;
    points: RowanScatterChartPoint[];
};
export type RowanScatterChartFormatContext = {
    series?: RowanScatterChartSeries | undefined;
    index?: number | undefined;
    label?: string | undefined;
    tick?: boolean | undefined;
};
export type RowanScatterChartValueFormatter = (value: number, context: RowanScatterChartFormatContext) => string;
