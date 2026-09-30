/**
 * @param {unknown} value
 */
export function cloneWaterfallSeriesInput(value: unknown): any[];
/**
 * First series only. Point `type: "total"` is preserved; other points are deltas.
 * @param {unknown} value
 * @param {string[]} labels
 */
export function normalizeWaterfallSeries(value: unknown, labels?: string[]): {
    id: string;
    label: string;
    color: string;
    values: any;
}[];
export function cloneWaterfallSeries(value: any): any;
/**
 * Waterfall does not invent totals. `type: "total"` is an absolute bar from
 * zero; other finite values are signed deltas from the running total. Null
 * is no-data.
 * @param {{ values: Array<{ value: number | null, label: string, type: "delta" | "total" }> } | undefined} series
 * @param {string[]} labels
 */
export function waterfallEntries(series: {
    values: Array<{
        value: number | null;
        label: string;
        type: "delta" | "total";
    }>;
} | undefined, labels: string[]): ({
    index: number;
    label: string;
    value: null;
    type: string;
    from: number;
    to: number;
} | {
    index: number;
    label: string;
    value: number;
    type: string;
    from: number;
    to: number;
})[];
export function waterfallDomain(entries: any): {
    min: number;
    max: number;
};
