/**
 * Compact speedometer gauge: ranges, min/max, actual, and optional target.
 * Separate host from bullet and donut charts.
 * @tag rowan-gauge-chart
 * @attr {string} label
 * @attr {number} min
 * @attr {number} max
 * @property {number | null} value - Actual measure. Property-only. Null is no-data.
 * @property {number | null} target - Target tick. Property-only. Null hides the tick.
 * @property {RowanGaugeChartRange[]} ranges - Qualitative bands. Arrays are property-only.
 * @csspart chart
 * @csspart plot
 * @csspart track
 * @csspart range
 * @csspart needle
 * @csspart hub
 * @csspart target
 * @csspart readout
 * @csspart tick-label
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-gauge-chart-needle
 * @cssprop --rowan-gauge-chart-track
 * @cssprop --rowan-gauge-chart-range
 * @cssprop --rowan-gauge-chart-target
 */
export class RowanGaugeChart extends BaseElement {
    set label(value: string);
    get label(): string;
    set min(value: number);
    get min(): number;
    set max(value: number);
    get max(): number;
    /** @param {number | null} value */
    set value(value: number | null);
    /** @returns {number | null} */
    get value(): number | null;
    /** @param {number | null} value */
    set target(value: number | null);
    /** @returns {number | null} */
    get target(): number | null;
    /** @param {RowanGaugeChartRange[]} value */
    set ranges(value: RowanGaugeChartRange[]);
    /** @returns {RowanGaugeChartRange[]} */
    get ranges(): RowanGaugeChartRange[];
    #private;
}
export type RowanGaugeChartRange = {
    from: number;
    to: number;
    label?: string | undefined;
    tone?: "info" | "success" | "warning" | "danger" | "neutral" | undefined;
};
import { BaseElement } from "../lib/base-element.js";
