/**
 * @typedef {object} RowanScatterChartMessages
 * @property {string} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [noData]
 * @property {string} [point]
 * @property {string | ((context: { index: string }) => string)} [pointLabel]
 * @property {string} [series]
 * @property {string} [size]
 * @property {string} [sizeValue]
 * @property {string} [x]
 * @property {string} [xValue]
 * @property {string} [y]
 * @property {string} [yValue]
 */
/**
 * @typedef {{
 *   series?: Array<object>,
 *   interactive?: boolean,
 *   valueFormatter?: import("./model.js").RowanScatterChartValueFormatter | null,
 * }} RowanScatterChartConfig
 */
/**
 * Experimental scatter / bubble chart. Bubble is a `size` encoding, not a
 * second tag. Null x or y is no-data.
 * @tag rowan-scatter-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {string} locale
 * @property {Array<object>} series - Series of `{ id, label, color?, points: [{ x, y, size?, label? }] }`. Arrays are property-only.
 * @property {RowanScatterChartConfig} config - Replaces the complete chart configuration.
 * @property {import("./model.js").RowanScatterChartValueFormatter | null} valueFormatter - Formats table and hover values. Functions are property-only.
 * @property {RowanScatterChartMessages} messages - Property-only built-in message overrides.
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
  set locale(value: string);
  get locale(): string;
  /** @param {RowanScatterChartMessages | null | undefined} value */
  set messages(value: RowanScatterChartMessages | null | undefined);
  /** @returns {RowanScatterChartMessages} */
  get messages(): RowanScatterChartMessages;
  set interactive(value: boolean);
  get interactive(): boolean;
  set series(value: any);
  get series(): any;
  /** @param {RowanScatterChartConfig | null | undefined} value */
  set config(value: RowanScatterChartConfig);
  /** @returns {RowanScatterChartConfig} */
  get config(): RowanScatterChartConfig;
  /** @param {import("./model.js").RowanScatterChartValueFormatter | null} value */
  set valueFormatter(value: import("./model.js").RowanScatterChartValueFormatter | null);
  /** @returns {import("./model.js").RowanScatterChartValueFormatter | null} */
  get valueFormatter(): import("./model.js").RowanScatterChartValueFormatter | null;
  #private;
}
export type RowanScatterChartMessages = {
  chart?: string | undefined;
  dataTable?: string | undefined;
  dataTableCaption?: string | ((context: { chart: string }) => string) | undefined;
  noData?: string | undefined;
  point?: string | undefined;
  pointLabel?: string | ((context: { index: string }) => string) | undefined;
  series?: string | undefined;
  size?: string | undefined;
  sizeValue?: string | undefined;
  x?: string | undefined;
  xValue?: string | undefined;
  y?: string | undefined;
  yValue?: string | undefined;
};
export type RowanScatterChartConfig = {
  series?: Array<object>;
  interactive?: boolean;
  valueFormatter?: import("./model.js").RowanScatterChartValueFormatter | null;
};
import { BaseElement } from "../lib/base-element.js";
