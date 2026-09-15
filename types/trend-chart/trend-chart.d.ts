/**
 * Accessible multi-series trend visualization for small operational data sets.
 * @tag rowan-trend-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<import("./model.js").RowanTrendChartSeries>} series - Chart series. Arrays are property-only.
 * @property {string[]} labels - Point labels shared across series. Arrays are property-only.
 * @property {import("./model.js").RowanTrendChartConfig} config - Replaces the complete chart configuration.
 * @property {import("./model.js").RowanTrendChartValueFormatter | null} valueFormatter - Formats chart and table values. Its context includes tick for compact axis labels. Functions are property-only.
 * @slot label - Replaces the label attribute.
 * @slot description - Replaces the description attribute.
 * @csspart control
 * @csspart label
 * @csspart description
 * @csspart chart
 * @csspart plot
 * @csspart legend
 * @csspart legend-item
 * @csspart legend-swatch
 * @csspart point
 * @csspart detail
 * @csspart summary
 * @csspart table
 * @cssprop --rowan-trend-chart-bg
 * @cssprop --rowan-trend-chart-series-1
 * @cssprop --rowan-trend-chart-series-2
 * @event rowan-point-activate - Fired when a user activates an interactive data point.
 */
export class RowanTrendChart extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    static componentTokenPrefixes: string[];
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set label(value: string);
    get label(): string;
    set description(value: string);
    get description(): string;
    set interactive(value: boolean);
    get interactive(): boolean;
    /** @param {Array<import("./model.js").RowanTrendChartSeries>} value */
    set series(value: import("./model.js").RowanTrendChartSeries[]);
    /** @returns {Array<import("./model.js").RowanTrendChartSeries>} */
    get series(): import("./model.js").RowanTrendChartSeries[];
    /** @param {string[]} value */
    set labels(value: string[]);
    /** @returns {string[]} */
    get labels(): string[];
    /** @param {import("./model.js").RowanTrendChartConfig | null | undefined} value */
    set config(value: import("./model.js").RowanTrendChartConfig | null | undefined);
    /** @returns {import("./model.js").RowanTrendChartConfig} */
    get config(): import("./model.js").RowanTrendChartConfig;
    /** @param {import("./model.js").RowanTrendChartValueFormatter | null} value */
    set valueFormatter(value: import("./model.js").RowanTrendChartValueFormatter | null);
    /** @returns {import("./model.js").RowanTrendChartValueFormatter | null} */
    get valueFormatter(): import("./model.js").RowanTrendChartValueFormatter | null;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
