export { createParetoData };
/**
 * Categorical combo chart: bars and lines on a shared category axis.
 * Optional `axis: "secondary"` for a second value scale (Pareto cumulative %).
 * @tag rowan-combo-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<object>} series - Chart series with optional geometry (bar|line) and axis (primary|secondary). Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {object} config - Replaces the complete chart configuration.
 * @property {Function | null} valueFormatter - Formats chart and table values. Functions are property-only.
 * @property {import("../chart/model.js").RowanChartReferenceLine[]} referenceLines - Horizontal overlays. Optional axis primary|secondary. Arrays are property-only.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart bar
 * @csspart line
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-combo-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive mark.
 */
export class RowanComboChart extends BaseElement {
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
    set series(value: import("../chart/model.js").RowanNormalizedChartSeries[]);
    get series(): import("../chart/model.js").RowanNormalizedChartSeries[];
    set labels(value: any[]);
    get labels(): any[];
    set config(value: {
        series: import("../chart/model.js").RowanNormalizedChartSeries[];
        labels: any[];
        interactive: boolean;
        valueFormatter: null;
        referenceLines: any[];
    });
    get config(): {
        series: import("../chart/model.js").RowanNormalizedChartSeries[];
        labels: any[];
        interactive: boolean;
        valueFormatter: null;
        referenceLines: any[];
    };
    set valueFormatter(value: null);
    get valueFormatter(): null;
    set referenceLines(value: any[]);
    get referenceLines(): any[];
    #private;
}
import { createParetoData } from "./pareto.js";
import { BaseElement } from "../lib/base-element.js";
