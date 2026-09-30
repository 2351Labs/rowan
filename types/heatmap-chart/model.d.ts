/**
 * @param {{
 *   rows?: unknown,
 *   columns?: unknown,
 *   values?: unknown,
 *   points?: unknown,
 * }} [input]
 */
export function normalizeHeatmap(input?: {
    rows?: unknown;
    columns?: unknown;
    values?: unknown;
    points?: unknown;
} | undefined): {
    rows: string[];
    columns: string[];
    values: (number | null)[][];
};
export function heatmapValueDomain(values: any): {
    min: number;
    max: number;
};
export function cloneHeatmapValues(values: any): any;
export function cloneHeatmapInput(value?: {}): {
    rows: any[];
    columns: any[];
    values: any;
    points: any;
};
export function cloneHeatmap(value: any): {
    rows: any[];
    columns: any[];
    values: any;
};
