/**
 * @typedef {object} RowanBoxPlotChartMessages
 * @property {string} [category]
 * @property {string} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [max]
 * @property {string} [maxValue]
 * @property {string} [median]
 * @property {string} [medianValue]
 * @property {string} [min]
 * @property {string} [minValue]
 * @property {string} [noData]
 * @property {string} [outliers]
 * @property {string} [q1]
 * @property {string} [q1Value]
 * @property {string} [q3]
 * @property {string} [q3Value]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [series]
 */
/**
 * @typedef {{
 *   labels?: string[],
 *   series?: Array<object>,
 *   interactive?: boolean,
 *   valueFormatter?: import("./model.js").RowanBoxPlotChartValueFormatter | null,
 * }} RowanBoxPlotChartConfig
 */
/**
 * Experimental box plot. Per-category `{ min, q1, median, q3, max, outliers? }`.
 * The host does not compute quartiles. Null in the five-number summary is
 * no-data. Own series model — not frozen categorical `series.values`.
 * @tag rowan-box-plot-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {string} locale
 * @property {Array<object>} series - Series of `{ id, label, color?, values: [{ min, q1, median, q3, max, outliers? }] }`. Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {RowanBoxPlotChartConfig} config - Replaces the complete chart configuration.
 * @property {import("./model.js").RowanBoxPlotChartValueFormatter | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @property {RowanBoxPlotChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart box
 * @csspart whisker
 * @csspart median
 * @csspart outlier
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-box-plot-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive box. Detail includes min, q1, median, q3, and max.
 */
export class RowanBoxPlotChart extends BaseElement {
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
  /** @param {RowanBoxPlotChartMessages | null | undefined} value */
  set messages(value: RowanBoxPlotChartMessages | null | undefined);
  /** @returns {RowanBoxPlotChartMessages} */
  get messages(): RowanBoxPlotChartMessages;
  set interactive(value: boolean);
  get interactive(): boolean;
  /** @param {Array<object>} value */
  set series(value: any[]);
  /** @returns {Array<object>} */
  get series(): any[];
  /** @param {string[]} value */
  set labels(value: string[]);
  /** @returns {string[]} */
  get labels(): string[];
  /** @param {RowanBoxPlotChartConfig | null | undefined} value */
  set config(value: RowanBoxPlotChartConfig | null | undefined);
  /** @returns {RowanBoxPlotChartConfig} */
  get config(): RowanBoxPlotChartConfig;
  /** @param {import("./model.js").RowanBoxPlotChartValueFormatter | null} value */
  set valueFormatter(value: import("./model.js").RowanBoxPlotChartValueFormatter | null);
  /** @returns {import("./model.js").RowanBoxPlotChartValueFormatter | null} */
  get valueFormatter(): import("./model.js").RowanBoxPlotChartValueFormatter | null;
  #private;
}
export type RowanBoxPlotChartMessages = {
  category?: string | undefined;
  chart?: string | undefined;
  dataTable?: string | undefined;
  dataTableCaption?: string | ((context: { chart: string }) => string) | undefined;
  max?: string | undefined;
  maxValue?: string | undefined;
  median?: string | undefined;
  medianValue?: string | undefined;
  min?: string | undefined;
  minValue?: string | undefined;
  noData?: string | undefined;
  outliers?: string | undefined;
  q1?: string | undefined;
  q1Value?: string | undefined;
  q3?: string | undefined;
  q3Value?: string | undefined;
  point?: string | ((context: { index: string }) => string) | undefined;
  series?: string | undefined;
};
export type RowanBoxPlotChartConfig = {
  labels?: string[];
  series?: Array<object>;
  interactive?: boolean;
  valueFormatter?: import("./model.js").RowanBoxPlotChartValueFormatter | null;
};
import { BaseElement } from "../lib/base-element.js";
