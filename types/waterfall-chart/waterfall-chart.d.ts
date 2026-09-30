/**
 * Experimental waterfall. Signed deltas from a running total. Totals are
 * `{ type: "total" }` from zero; the host does not invent them. Null is no-data.
 * @tag rowan-waterfall-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<object>} series - First series of `{ value, type?: "total" }`. Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {object} config - Replaces the complete chart configuration.
 * @property {Function | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart bar
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-waterfall-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive bar.
 */
export class RowanWaterfallChart extends BaseElement {
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
    set labels(value: any[]);
    get labels(): any[];
    set config(value: {
        series: any;
        labels: any[];
        interactive: boolean;
        valueFormatter: null;
    });
    get config(): {
        series: any;
        labels: any[];
        interactive: boolean;
        valueFormatter: null;
    };
    set valueFormatter(value: null);
    get valueFormatter(): null;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
