/**
 * @typedef {{
 *   series?: Array<object>,
 *   interactive?: boolean,
 *   valueFormatter?: import("./model.js").RowanScatterChartValueFormatter | null,
 * }} RowanScatterChartConfig
 */
/**
 * Experimental scatter / bubble chart. Bubble is a `size` encoding, not a
 * second tag. Null x or y is no-data.
 * @tag rowan-scatter-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<object>} series - Series of `{ id, label, color?, points: [{ x, y, size?, label? }] }`. Arrays are property-only.
 * @property {RowanScatterChartConfig} config - Replaces the complete chart configuration.
 * @property {import("./model.js").RowanScatterChartValueFormatter | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart point
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-scatter-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive point.
 */
export class RowanScatterChart extends BaseElement {
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
    set series(value: any);
    get series(): any;
    /** @param {RowanScatterChartConfig | null | undefined} value */
    set config(value: RowanScatterChartConfig);
    /** @returns {RowanScatterChartConfig} */
    get config(): RowanScatterChartConfig;
    /** @param {import("./model.js").RowanScatterChartValueFormatter | null} value */
    set valueFormatter(value: import("./model.js").RowanScatterChartValueFormatter | null);
    /** @returns {import("./model.js").RowanScatterChartValueFormatter | null} */
    get valueFormatter(): import("./model.js").RowanScatterChartValueFormatter | null;
    #private;
}
export type RowanScatterChartConfig = {
    series?: Array<object>;
    interactive?: boolean;
    valueFormatter?: import("./model.js").RowanScatterChartValueFormatter | null;
};
import { BaseElement } from "../lib/base-element.js";
