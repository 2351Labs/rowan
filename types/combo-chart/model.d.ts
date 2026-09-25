/**
 * @param {unknown} value
 */
export function cloneComboSeriesInput(value: unknown): any[];
/**
 * @param {unknown} value
 * @param {string[]} labels
 */
export function normalizeComboSeries(value: unknown, labels?: string[]): {
    geometry: any;
    axis: any;
    id: string;
    label: string;
    values: import("../chart/model.js").RowanNormalizedChartPoint[];
    color: string;
}[];
/**
 * @param {Array<{ axis?: string, values: Array<{ value: number | null }> }>} series
 * @param {"primary" | "secondary"} axis
 */
export function comboAxisDomain(series: Array<{
    axis?: string;
    values: Array<{
        value: number | null;
    }>;
}>, axis: "primary" | "secondary"): {
    min: number;
    max: number;
};
export { normalizeChartLabels };
import { normalizeChartLabels } from "../chart/model.js";
