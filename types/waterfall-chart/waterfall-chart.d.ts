/**
 * Waterfall. Signed deltas from a running total. Totals are `{ type: "total" }`
 * from zero; the host does not invent them. Null is no-data.
 * @tag rowan-waterfall-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {string} locale
 * @property {Array<object>} series - First series of `{ value, type?: "total" }`. Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {object} config - Replaces the complete chart configuration.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @property {RowanWaterfallChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart bar
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-waterfall-chart-bg
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
  set locale(value: string);
  get locale(): string;
  /** @param {RowanWaterfallChartMessages | null | undefined} value */
  set messages(value: RowanWaterfallChartMessages | null | undefined);
  /** @returns {RowanWaterfallChartMessages} */
  get messages(): RowanWaterfallChartMessages;
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
    valueFormatter: import("../chart/model.js").RowanChartValueFormatter | null;
  });
  get config(): {
    series: any;
    labels: any[];
    interactive: boolean;
    valueFormatter: import("../chart/model.js").RowanChartValueFormatter | null;
  };
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
export type RowanWaterfallChartMessages = {
  category?: string | undefined;
  chart?: string | undefined;
  dataTable?: string | undefined;
  dataTableCaption?: string | ((context: { chart: string }) => string) | undefined;
  decrease?: string | undefined;
  deltaValue?: string | undefined;
  encodings?: string | undefined;
  increase?: string | undefined;
  noData?: string | undefined;
  point?: string | ((context: { index: string }) => string) | undefined;
  total?: string | undefined;
  totalValue?: string | undefined;
  type?: string | undefined;
  value?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
