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
