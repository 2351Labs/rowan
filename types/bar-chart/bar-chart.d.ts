/**
 * @typedef {object} RowanBarChartMessages
 * @property {string} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [metric]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [reference]
 * @property {string} [series]
 */
/**
 * @typedef {import("../chart/model.js").RowanChartConfig & {
 *   orientation?: "vertical" | "horizontal",
 * }} RowanBarChartConfig
 */
/**
 * Frozen small categorical bar chart. Native SVG, no animation.
 * @tag rowan-bar-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {"vertical"|"horizontal"} orientation - Category axis. Default `vertical`.
 * @attr {string} locale
 * @property {Array<import("../chart/model.js").RowanChartSeries>} series - Chart series. Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {RowanBarChartConfig} config - Replaces the complete chart configuration. Omitted `orientation` resets to vertical.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter - Formats chart and table values. Functions are property-only.
 * @property {RowanBarChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart label
 * @csspart description
 * @csspart chart
 * @csspart plot
 * @csspart bar
 * @csspart legend
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-bar-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive bar.
 
 * @attr {string} hidden-series - Space-separated series or slice ids hidden from the plot.
 * @attr {boolean} no-motion - Disables chart motion, including under prefers-reduced-motion.
 * @property {string[]} hiddenSeries - Ids hidden from the plot. The data table still lists them.
 * @property {((context: { text: string, event: Event, host: HTMLElement }) => string) | null} tooltipFormatter - Custom tooltip text. Property-only.
 * @slot tooltip - Custom tooltip content, used when tooltipFormatter is unset.
 * @event rowan-point-click - Cancelable. Detail: series, index, datum, value.
 * @event rowan-selection-change - Cancelable. Follows rowan-point-click when that event is not canceled.
 * @event rowan-series-toggle - Cancelable. Legend visibility toggle. Detail: seriesId, hiddenSeries.
 
 * @attr {boolean} zoom - Opt-in plot zoom and pan.
 * @event rowan-zoom - Fired when the zoom window changes. Detail: x, y, width, height.
 
 * @attr {string} sync-group - Share the axis pointer with charts that use the same group name.
 * @attr {boolean} brush - Drag, or Shift+Arrow, to select an x range. Escape clears it.
 * @attr {number} large-series - Downsample drawn marks above this count. The data table keeps every row.
 * @event rowan-sync - Shared hover. Detail: group, index, label.
 * @event rowan-brush - Selected range. Detail: startIndex, endIndex, startLabel, endLabel, or cleared.
*/
export class RowanBarChart extends BaseElement {
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
  /** @param {RowanBarChartMessages | null | undefined} value */
  set messages(value: RowanBarChartMessages | null | undefined);
  /** @returns {RowanBarChartMessages} */
  get messages(): RowanBarChartMessages;
  set interactive(value: boolean);
  get interactive(): boolean;
  /** @param {"vertical" | "horizontal"} value */
  set orientation(value: "vertical" | "horizontal");
  /** @returns {"vertical" | "horizontal"} */
  get orientation(): "vertical" | "horizontal";
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  /** @param {Array<import("../chart/model.js").RowanChartSeries>} value */
  set series(value: import("../chart/model.js").RowanChartSeries[]);
  /** @returns {Array<import("../chart/model.js").RowanChartSeries>} */
  get series(): import("../chart/model.js").RowanChartSeries[];
  /** @param {string[]} value */
  set labels(value: string[]);
  /** @returns {string[]} */
  get labels(): string[];
  /** @param {RowanBarChartConfig | null | undefined} value */
  set config(value: RowanBarChartConfig);
  /** @returns {RowanBarChartConfig} */
  get config(): RowanBarChartConfig;
  /** @param {import("../chart/model.js").RowanChartValueFormatter | null} value */
  set valueFormatter(value: import("../chart/model.js").RowanChartValueFormatter | null);
  /** @returns {import("../chart/model.js").RowanChartValueFormatter | null} */
  get valueFormatter(): import("../chart/model.js").RowanChartValueFormatter | null;
  /** @param {string[] | string | null | undefined} value */
  set hiddenSeries(value: string[]);
  /** @returns {string[]} */
  get hiddenSeries(): string[];
  set tooltipFormatter(value: any);
  get tooltipFormatter(): any;
  set noMotion(value: boolean);
  get noMotion(): boolean;
  #private;
}
export type RowanBarChartMessages = {
  chart?: string | undefined;
  dataTable?: string | undefined;
  dataTableCaption?: string | ((context: { chart: string }) => string) | undefined;
  metric?: string | undefined;
  noData?: string | undefined;
  point?: string | ((context: { index: string }) => string) | undefined;
  reference?: string | undefined;
  series?: string | undefined;
};
export type RowanBarChartConfig = import("../chart/model.js").RowanChartConfig & {
  orientation?: "vertical" | "horizontal";
};
import { BaseElement } from "../lib/base-element.js";
