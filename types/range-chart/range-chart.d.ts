/**
 * @typedef {{
 *   labels?: string[],
 *   series?: Array<object>,
 *   interactive?: boolean,
 *   variant?: "bar" | "area",
 *   valueFormatter?: Function | null,
 * }} RowanRangeChartConfig
 */
/**
 * Experimental categorical range. Per-category `{ low, high }`. `variant` is
 * `bar` (default) or `area`. Null low or high is no-data. Own series model —
 * not frozen categorical `series.values`.
 * @tag rowan-range-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {"bar"|"area"} variant - Default `bar`.
 * @property {Array<object>} series - Series of `{ id, label, color?, values: [{ low, high }] }`. Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {RowanRangeChartConfig} config - Replaces the complete chart configuration. Omitted `variant` resets to bar.
 * @property {Function | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart bar
 * @csspart area
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-range-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive range. Detail includes `low` and `high`.
 */
export class RowanRangeChart extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set label(value: string);
    get label(): string;
    set description(value: string);
    get description(): string;
    set interactive(value: boolean);
    get interactive(): boolean;
    /** @param {"bar" | "area"} value */
    set variant(value: "area" | "bar");
    /** @returns {"bar" | "area"} */
    get variant(): "area" | "bar";
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    /** @param {Array<object>} value */
    set series(value: any[]);
    /** @returns {Array<object>} */
    get series(): any[];
    /** @param {string[]} value */
    set labels(value: string[]);
    /** @returns {string[]} */
    get labels(): string[];
    /** @param {RowanRangeChartConfig | null | undefined} value */
    set config(value: RowanRangeChartConfig | null | undefined);
    /** @returns {RowanRangeChartConfig} */
    get config(): RowanRangeChartConfig;
    set valueFormatter(value: null);
    get valueFormatter(): null;
    #private;
}
export type RowanRangeChartConfig = {
    labels?: string[];
    series?: Array<object>;
    interactive?: boolean;
    variant?: "bar" | "area";
    valueFormatter?: Function | null;
};
import { BaseElement } from "../lib/base-element.js";
