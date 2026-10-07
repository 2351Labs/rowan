/**
 * Experimental categorical heatmap. Single-hue intensity via fill-opacity.
 * Null is empty / no-data. Accepts a matrix or `{ x, y, value }` / `{ row, column, value }` points.
 * @tag rowan-heatmap-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {string} locale
 * @property {string[]} rows - Row labels. Arrays are property-only.
 * @property {string[]} columns - Column labels. Arrays are property-only.
 * @property {Array<Array<number | null>>} values - Matrix of cell values. Arrays are property-only.
 * @property {RowanHeatmapChartPoint[]} points - Optional `{ x, y, value }` or `{ column, row, value }` triples. Arrays are property-only.
 * @property {RowanHeatmapChartConfig} config - Replaces the complete chart configuration. Reads return the active matrix or points data form.
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
  /** @param {string[]} value */
  set rows(value: string[]);
  /** @returns {string[]} */
  get rows(): string[];
  /** @param {string[]} value */
  set columns(value: string[]);
  /** @returns {string[]} */
  get columns(): string[];
  set values(value: (number | null)[][]);
  get values(): (number | null)[][];
  /** @param {RowanHeatmapChartPoint[]} value */
  set points(value: RowanHeatmapChartPoint[]);
  /** @returns {RowanHeatmapChartPoint[]} */
  get points(): RowanHeatmapChartPoint[];
  /** @param {RowanHeatmapChartConfig | null | undefined} value */
  set config(value: RowanHeatmapChartConfig | null | undefined);
  /** @returns {RowanHeatmapChartConfig} */
  get config(): RowanHeatmapChartConfig;
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
export type RowanHeatmapChartXYPoint = {
  x: string;
  y: string;
  value: number | null;
};
export type RowanHeatmapChartRowColumnPoint = {
  row: string;
  column: string;
  value: number | null;
};
export type RowanHeatmapChartPoint = RowanHeatmapChartXYPoint | RowanHeatmapChartRowColumnPoint;
/**
 * Uses either matrix data (`rows`, `columns`, and `values`) or `points`.
 */
export type RowanHeatmapChartConfig = {
  rows?: string[];
  columns?: string[];
  values?: Array<Array<number | null>>;
  points?: RowanHeatmapChartPoint[];
  interactive?: boolean;
  valueFormatter?: import("../chart/model.js").RowanChartValueFormatter | null;
};
import { BaseElement } from "../lib/base-element.js";
