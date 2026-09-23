/**
 * Frozen parts-of-a-whole chart. Uses the first series. Negative values
 * are treated as no-data, not slices.
 * @tag rowan-donut-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<import("../chart/model.js").RowanChartSeries>} series - First series is drawn. Arrays are property-only.
 * @property {string[]} labels - Slice labels. Arrays are property-only.
 * @property {import("../chart/model.js").RowanChartConfig} config
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter
 * @slot label
 * @slot description
 * @csspart control
 * @csspart label
 * @csspart plot
 * @csspart slice
 * @csspart total
 * @csspart legend
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-donut-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive slice.
 */
export class RowanDonutChart extends BaseElement {
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
    /** @param {Array<import("../chart/model.js").RowanChartSeries>} value */
    set series(value: import("../chart/model.js").RowanChartSeries[]);
    /** @returns {Array<import("../chart/model.js").RowanChartSeries>} */
    get series(): import("../chart/model.js").RowanChartSeries[];
    /** @param {string[]} value */
    set labels(value: string[]);
    /** @returns {string[]} */
    get labels(): string[];
    /** @param {import("../chart/model.js").RowanChartConfig | null | undefined} value */
    set config(value: import("../chart/model.js").RowanChartConfig);
    /** @returns {import("../chart/model.js").RowanChartConfig} */
    get config(): import("../chart/model.js").RowanChartConfig;
    /** @param {import("../chart/model.js").RowanChartValueFormatter | null} value */
    set valueFormatter(value: import("../chart/model.js").RowanChartValueFormatter | null);
    /** @returns {import("../chart/model.js").RowanChartValueFormatter | null} */
    get valueFormatter(): import("../chart/model.js").RowanChartValueFormatter | null;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
