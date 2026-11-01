/**
 * @typedef {object} RowanAreaChartMessages
 * @property {string} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [metric]
 * @property {string} [noData]
 * @property {string} [noMetricData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [reference]
 * @property {string} [series]
 */
/**
 * Filled multi-series area chart. Same data contract as the line
 * chart. Null values break both the line and the fill.
 * @tag rowan-area-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {string} locale
 * @property {Array<import("../trend-chart/model.js").RowanTrendChartSeries>} series - Chart series. Arrays are property-only.
 * @property {string[]} labels - Point labels shared across series. Arrays are property-only.
 * @property {import("../trend-chart/model.js").RowanTrendChartConfig} config - Replaces the complete chart configuration.
 * @property {import("../trend-chart/model.js").RowanTrendChartValueFormatter | null} valueFormatter - Formats chart and table values. Its context includes tick for compact axis labels. Functions are property-only.
 * @property {import("../chart/model.js").RowanChartReferenceLine[]} referenceLines - Horizontal overlays. Arrays are property-only.
 * @property {RowanAreaChartMessages} messages - Property-only built-in message overrides.
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
  set locale(value: string);
  get locale(): string;
  /** @param {RowanAreaChartMessages | null | undefined} value */
  set messages(value: RowanAreaChartMessages | null | undefined);
  /** @returns {RowanAreaChartMessages} */
  get messages(): RowanAreaChartMessages;
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
export type RowanAreaChartMessages = {
  chart?: string | undefined;
  dataTable?: string | undefined;
  dataTableCaption?: string | ((context: { chart: string }) => string) | undefined;
  metric?: string | undefined;
  noData?: string | undefined;
  noMetricData?: string | undefined;
  point?: string | ((context: { index: string }) => string) | undefined;
  reference?: string | undefined;
  series?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
