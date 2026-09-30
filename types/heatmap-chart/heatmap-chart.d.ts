/**
 * Experimental categorical heatmap. Single-hue intensity via fill-opacity.
 * Null is empty / no-data. Accepts a matrix or `{ x, y, value }` points.
 * @tag rowan-heatmap-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @property {string[]} rows - Row labels. Arrays are property-only.
 * @property {string[]} columns - Column labels. Arrays are property-only.
 * @property {Array<Array<number | null>>} values - Matrix of cell values. Arrays are property-only.
 * @property {Array<object>} points - Optional `{ x, y, value }` or `{ column, row, value }` triples. Arrays are property-only.
 * @property {object} config - Replaces the complete chart configuration.
 * @property {Function | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart cell
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-heatmap-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive cell.
 */
export class RowanHeatmapChart extends BaseElement {
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
    set rows(value: string[]);
    get rows(): string[];
    set columns(value: string[]);
    get columns(): string[];
    set values(value: any);
    get values(): any;
    set points(value: {
        x: string;
        y: string;
        value: number | null;
    }[]);
    get points(): {
        x: string;
        y: string;
        value: number | null;
    }[];
    set config(value: {
        rows: string[];
        columns: string[];
        values: any;
        points: {
            x: string;
            y: string;
            value: number | null;
        }[];
        interactive: boolean;
        valueFormatter: null;
    });
    get config(): {
        rows: string[];
        columns: string[];
        values: any;
        points: {
            x: string;
            y: string;
            value: number | null;
        }[];
        interactive: boolean;
        valueFormatter: null;
    };
    set valueFormatter(value: null);
    get valueFormatter(): null;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
