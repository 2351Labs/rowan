/**
 * Compact qualitative comparison after Stephen Few's bullet graph spec.
 * @tag rowan-bullet-chart
 * @attr {string} label
 * @attr {boolean} scale - Show quantitative ticks. Default true.
 * @attr {"higher"|"lower"} intent - Dark bands encode poor performance.
 * @attr {"ink"|"accent"|"status"|"tone"} encoding - Range fill. `ink` grayscale (default). `accent` one theme hue. `status` poor→good mix. `tone` per-range hues.
 * @property {number | null} value
 * @property {number | null} target
 * @property {RowanBulletChartRange[]} ranges
 * @csspart chart
 * @csspart plot
 * @csspart range
 * @csspart actual
 * @csspart target
 * @csspart tick
 * @csspart hover
 * @csspart table
 */
export class RowanBulletChart extends BaseElement {
    set label(value: string);
    get label(): string;
    set scale(value: boolean);
    get scale(): boolean;
    set intent(value: "higher" | "lower");
    /** @returns {"higher" | "lower"} */
    get intent(): "higher" | "lower";
    /** @param {"ink" | "accent" | "status" | "tone"} value */
    set encoding(value: "tone" | "status" | "ink" | "accent");
    /** @returns {"ink" | "accent" | "status" | "tone"} */
    get encoding(): "tone" | "status" | "ink" | "accent";
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
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
