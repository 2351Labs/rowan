/**
 * Experimental scatter / bubble chart. Bubble is a `size` encoding, not a
 * second tag. Null x or y is no-data.
 * @tag rowan-scatter-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {Array<object>} series - Series of `{ id, label, color?, points: [{ x, y, size?, label? }] }`. Arrays are property-only.
 * @property {object} config - Replaces the complete chart configuration.
 * @property {Function | null} valueFormatter - Formats table and hover values. Functions are property-only.
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
    set config(value: {
        series: any;
        interactive: boolean;
        valueFormatter: null;
    });
    get config(): {
        series: any;
        interactive: boolean;
        valueFormatter: null;
    };
    set valueFormatter(value: null);
    get valueFormatter(): null;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
