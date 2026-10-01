/**
 * Experimental categorical heatmap. Single-hue intensity via fill-opacity.
 * Null is empty / no-data. Accepts a matrix or `{ x, y, value }` points.
 * @tag rowan-heatmap-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {string} locale
 * @property {string[]} rows - Row labels. Arrays are property-only.
 * @property {string[]} columns - Column labels. Arrays are property-only.
 * @property {Array<Array<number | null>>} values - Matrix of cell values. Arrays are property-only.
 * @property {Array<object>} points - Optional `{ x, y, value }` or `{ column, row, value }` triples. Arrays are property-only.
 * @property {object} config - Replaces the complete chart configuration.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @property {RowanHeatmapChartMessages} messages - Property-only built-in message overrides.
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
  set locale(value: string);
  get locale(): string;
  /** @param {RowanHeatmapChartMessages | null | undefined} value */
  set messages(value: RowanHeatmapChartMessages | null | undefined);
  /** @returns {RowanHeatmapChartMessages} */
  get messages(): RowanHeatmapChartMessages;
  set interactive(value: boolean);
  get interactive(): boolean;
  set rows(value: any[]);
  get rows(): any[];
  set columns(value: any[]);
  get columns(): any[];
  set values(value: any);
  get values(): any;
  set points(value: any);
  get points(): any;
  set config(value: {
    rows: any[];
    columns: any[];
    values: any;
    points: any;
    interactive: boolean;
    valueFormatter: import("../chart/model.js").RowanChartValueFormatter | null;
  });
  get config(): {
    rows: any[];
    columns: any[];
    values: any;
    points: any;
    interactive: boolean;
    valueFormatter: import("../chart/model.js").RowanChartValueFormatter | null;
  };
  /** @param {import("../chart/model.js").RowanChartValueFormatter | null} value */
  set valueFormatter(value: import("../chart/model.js").RowanChartValueFormatter | null);
  /** @returns {import("../chart/model.js").RowanChartValueFormatter | null} */
  get valueFormatter(): import("../chart/model.js").RowanChartValueFormatter | null;
  #private;
}
export type RowanHeatmapChartMessages = {
  chart?: string | undefined;
  dataTable?: string | undefined;
  dataTableCaption?: string | ((context: { chart: string }) => string) | undefined;
  column?: string | ((context: { index: string }) => string) | undefined;
  noData?: string | undefined;
  row?: string | ((context: { index: string }) => string) | undefined;
};
import { BaseElement } from "../lib/base-element.js";
