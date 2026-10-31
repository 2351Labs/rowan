export { createParetoData };
/**
 * Categorical combo: bars, lines, and areas on a shared category axis.
 * Optional `axis: "secondary"` for a second value scale (Pareto cumulative %).
 * Bar, area, and trend charts stay separate hosts.
 * @tag rowan-combo-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {string} locale
 * @property {Array<object>} series - Chart series with optional geometry (bar|line|area) and axis (primary|secondary). Arrays are property-only. Invalid geometry falls back to bar.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {object} config - Replaces the complete chart configuration.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter - Formats chart and table values. Functions are property-only.
 * @property {import("../chart/model.js").RowanChartReferenceLine[]} referenceLines - Horizontal overlays. Optional axis primary|secondary. Arrays are property-only.
 * @property {RowanComboChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart bar
 * @csspart line
 * @csspart area
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-combo-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive mark.
 
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
export class RowanComboChart extends BaseElement {
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
  /** @param {RowanComboChartMessages | null | undefined} value */
  set messages(value: RowanComboChartMessages | null | undefined);
  /** @returns {RowanComboChartMessages} */
  get messages(): RowanComboChartMessages;
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
    valueFormatter: import("../chart/model.js").RowanChartValueFormatter | null;
    referenceLines: any[];
  });
  get config(): {
    series: import("../chart/model.js").RowanNormalizedChartSeries[];
    labels: any[];
    interactive: boolean;
    valueFormatter: import("../chart/model.js").RowanChartValueFormatter | null;
    referenceLines: any[];
  };
  /** @param {import("../chart/model.js").RowanChartValueFormatter | null} value */
  set valueFormatter(value: import("../chart/model.js").RowanChartValueFormatter | null);
  /** @returns {import("../chart/model.js").RowanChartValueFormatter | null} */
  get valueFormatter(): import("../chart/model.js").RowanChartValueFormatter | null;
  set referenceLines(value: any[]);
  get referenceLines(): any[];
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
export type RowanComboChartMessages = {
  chart?: string | undefined;
  dataTable?: string | undefined;
  dataTableCaption?: string | ((context: { chart: string }) => string) | undefined;
  metric?: string | undefined;
  noData?: string | undefined;
  point?: string | ((context: { index: string }) => string) | undefined;
  reference?: string | undefined;
  series?: string | undefined;
};
import { createParetoData } from "./pareto.js";
import { BaseElement } from "../lib/base-element.js";
