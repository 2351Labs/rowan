/**
 * Experimental waterfall. Signed deltas from a running total. Totals are
 * `{ type: "total" }` from zero; the host does not invent them. Null is no-data.
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
