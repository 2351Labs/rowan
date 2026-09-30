/**
 * @param {unknown} value
 */
export function cloneRangeSeriesInput(value: unknown): any[];
/**
 * Own `{ low, high }` series model — not frozen categorical `series.values`.
 * @param {unknown} value
 * @param {string[]} labels
 */
export function normalizeRangeSeries(value: unknown, labels?: string[]): {
    id: string;
    label: string;
    color: string;
    values: any;
}[];
export function cloneRangeSeries(value: any): any;
export function rangePointIncluded(point: any): boolean;
export function rangeDomain(series: any): {
    min: number;
    max: number;
};
