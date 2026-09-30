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
