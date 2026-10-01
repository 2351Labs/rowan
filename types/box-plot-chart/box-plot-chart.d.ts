/**
 * @typedef {{
 *   labels?: string[],
 *   series?: Array<object>,
 *   interactive?: boolean,
 *   valueFormatter?: import("../chart/model.js").RowanChartValueFormatter | null,
 * }} RowanBoxPlotChartConfig
 */
/**
 * Experimental box plot. Per-category `{ min, q1, median, q3, max, outliers? }`.
 * The host does not compute quartiles. Null in the five-number summary is
 * no-data. Own series model — not frozen categorical `series.values`.
 * @tag rowan-box-plot-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<object>} series - Series of `{ id, label, color?, values: [{ min, q1, median, q3, max, outliers? }] }`. Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {RowanBoxPlotChartConfig} config - Replaces the complete chart configuration.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart box
 * @csspart whisker
 * @csspart median
 * @csspart outlier
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-box-plot-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive box. Detail includes min, q1, median, q3, and max.
 */
export class RowanBoxPlotChart extends BaseElement {
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
    /** @param {Array<object>} value */
    set series(value: any[]);
    /** @returns {Array<object>} */
    get series(): any[];
    /** @param {string[]} value */
    set labels(value: string[]);
    /** @returns {string[]} */
    get labels(): string[];
    /** @param {RowanBoxPlotChartConfig | null | undefined} value */
    set config(value: RowanBoxPlotChartConfig | null | undefined);
    /** @returns {RowanBoxPlotChartConfig} */
    get config(): RowanBoxPlotChartConfig;
    /** @param {import("../chart/model.js").RowanChartValueFormatter | null} value */
    set valueFormatter(value: import("../chart/model.js").RowanChartValueFormatter | null);
    /** @returns {import("../chart/model.js").RowanChartValueFormatter | null} */
    get valueFormatter(): import("../chart/model.js").RowanChartValueFormatter | null;
    #private;
}
export type RowanBoxPlotChartConfig = {
    labels?: string[];
    series?: Array<object>;
    interactive?: boolean;
    valueFormatter?: import("../chart/model.js").RowanChartValueFormatter | null;
};
import { BaseElement } from "../lib/base-element.js";
