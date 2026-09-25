/**
 * Filled multi-series area chart. Same data contract as the line
 * chart. Null values break both the line and the fill.
 * @tag rowan-area-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<import("../trend-chart/model.js").RowanTrendChartSeries>} series - Chart series. Arrays are property-only.
 * @property {string[]} labels - Point labels shared across series. Arrays are property-only.
 * @property {import("../trend-chart/model.js").RowanTrendChartConfig} config - Replaces the complete chart configuration.
 * @property {import("../trend-chart/model.js").RowanTrendChartValueFormatter | null} valueFormatter - Formats chart and table values. Its context includes tick for compact axis labels. Functions are property-only.
 * @property {import("../chart/model.js").RowanChartReferenceLine[]} referenceLines - Horizontal overlays. Arrays are property-only.
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
 * @csspart area
 * @csspart line
 * @csspart hover
 * @csspart reference-line
 * @cssprop --rowan-area-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive data point.
 */
export class RowanAreaChart extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set label(value: string);
    get label(): string;
    set description(value: string);
    get description(): string;
    set interactive(value: boolean);
    get interactive(): boolean;
    /** @param {Array<import("../trend-chart/model.js").RowanTrendChartSeries>} value */
    set series(value: import("../chart/model.js").RowanChartSeries[]);
    /** @returns {Array<import("../trend-chart/model.js").RowanTrendChartSeries>} */
    get series(): import("../chart/model.js").RowanChartSeries[];
    /** @param {string[]} value */
    set labels(value: string[]);
    /** @returns {string[]} */
    get labels(): string[];
    /** @param {import("../trend-chart/model.js").RowanTrendChartConfig | null | undefined} value */
    set config(value: import("../trend-chart/model.js").RowanTrendChartConfig | null | undefined);
    /** @returns {import("../trend-chart/model.js").RowanTrendChartConfig} */
    get config(): import("../chart/model.js").RowanChartConfig;
    /** @param {import("../trend-chart/model.js").RowanTrendChartValueFormatter | null} value */
    set valueFormatter(value: import("../chart/model.js").RowanChartValueFormatter | null);
    /** @returns {import("../trend-chart/model.js").RowanTrendChartValueFormatter | null} */
    get valueFormatter(): import("../chart/model.js").RowanChartValueFormatter | null;
    /** @param {import("../chart/model.js").RowanChartReferenceLine[]} value */
    set referenceLines(value: import("../chart/model.js").RowanChartReferenceLine[]);
    /** @returns {import("../chart/model.js").RowanChartReferenceLine[]} */
    get referenceLines(): import("../chart/model.js").RowanChartReferenceLine[];
    #private;
}
import { BaseElement } from "../lib/base-element.js";
