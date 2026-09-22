/**
 * Compact qualitative comparison: ranges, actual, and target. Experimental.
 * Separate host from sparkline and bar chart.
 * @tag rowan-bullet-chart
 * @attr {string} label
 * @property {number | null} value - Actual measure. Property-only. Null is no-data.
 * @property {number | null} target - Target marker. Property-only. Null hides the marker.
 * @property {RowanBulletChartRange[]} ranges - Qualitative bands. Arrays are property-only.
 * @csspart chart
 * @csspart plot
 * @csspart range
 * @csspart actual
 * @csspart target
 * @csspart table
 * @cssprop --rowan-bullet-chart-actual
 * @cssprop --rowan-bullet-chart-target
 * @cssprop --rowan-bullet-chart-range
 */
export class RowanBulletChart extends BaseElement {
    set label(value: string);
    get label(): string;
    /** @param {number | null} value */
    set value(value: number | null);
    /** @returns {number | null} */
    get value(): number | null;
    /** @param {number | null} value */
    set target(value: number | null);
    /** @returns {number | null} */
    get target(): number | null;
    /** @param {RowanBulletChartRange[]} value */
    set ranges(value: RowanBulletChartRange[]);
    /** @returns {RowanBulletChartRange[]} */
    get ranges(): RowanBulletChartRange[];
    #private;
}
export type RowanBulletChartRange = {
    from: number;
    to: number;
    label?: string | undefined;
    tone?: "info" | "success" | "warning" | "danger" | "neutral" | undefined;
};
import { BaseElement } from "../lib/base-element.js";
