/**
 * @typedef {object} RowanStackedBarChartMessages
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
 *   stackMode?: "absolute" | "normalized",
 *   referenceLines?: import("../chart/model.js").RowanChartReferenceLine[],
 * }} RowanStackedBarChartConfig
 */
/**
 * Stacked categorical bar chart. Positive values stack from zero.
 * Null and negatives are no-data.
 * @tag rowan-stacked-bar-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {"vertical"|"horizontal"} orientation - Category axis. Default `vertical`.
 * @attr {"absolute"|"normalized"} stack-mode - `normalized` scales each category to 100. Default `absolute`.
 * @attr {string} locale
 * @property {Array<import("../chart/model.js").RowanChartSeries>} series - Chart series. Arrays are property-only.
 * @property {string[]} labels - Category labels. Arrays are property-only.
 * @property {RowanStackedBarChartConfig} config - Replaces the complete chart configuration. Omitted `orientation` / `stackMode` reset to vertical / absolute.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter - Formats chart and table values. Functions are property-only.
 * @property {import("../chart/model.js").RowanChartReferenceLine[]} referenceLines - Overlays on the value axis. Arrays are property-only. Normalized mode uses a 0–100 scale.
 * @property {RowanStackedBarChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart label
 * @csspart description
 * @csspart chart
 * @csspart plot
 * @csspart bar
 * @csspart legend
 * @csspart detail
 * @csspart hover
 * @csspart reference-line
 * @csspart summary
 * @csspart table
 * @cssprop --rowan-stacked-bar-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive bar.
 */
export class RowanStackedBarChart extends BaseElement {
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
  /** @param {RowanStackedBarChartMessages | null | undefined} value */
  set messages(value: RowanStackedBarChartMessages | null | undefined);
  /** @returns {RowanStackedBarChartMessages} */
  get messages(): RowanStackedBarChartMessages;
  set interactive(value: boolean);
  get interactive(): boolean;
  /** @param {"vertical" | "horizontal"} value */
  set orientation(value: "vertical" | "horizontal");
  /** @returns {"vertical" | "horizontal"} */
  get orientation(): "vertical" | "horizontal";
  /** @param {"absolute" | "normalized"} value */
  set stackMode(value: "absolute" | "normalized");
  /** @returns {"absolute" | "normalized"} */
  get stackMode(): "absolute" | "normalized";
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  /** @param {Array<import("../chart/model.js").RowanChartSeries>} value */
  set series(value: import("../chart/model.js").RowanChartSeries[]);
  /** @returns {Array<import("../chart/model.js").RowanChartSeries>} */
  get series(): import("../chart/model.js").RowanChartSeries[];
  /** @param {string[]} value */
  set labels(value: string[]);
  /** @returns {string[]} */
  get labels(): string[];
  /** @param {RowanStackedBarChartConfig | null | undefined} value */
  set config(value: import("../chart/model.js").RowanChartConfig | null | undefined);
  /** @returns {RowanStackedBarChartConfig} */
  get config(): RowanStackedBarChartConfig;
  /** @param {import("../chart/model.js").RowanChartValueFormatter | null} value */
  set valueFormatter(value: import("../chart/model.js").RowanChartValueFormatter | null);
  /** @returns {import("../chart/model.js").RowanChartValueFormatter | null} */
  get valueFormatter(): import("../chart/model.js").RowanChartValueFormatter | null;
  /** @param {import("../chart/model.js").RowanChartReferenceLine[]} value */
  set referenceLines(value: import("../chart/model.js").RowanChartReferenceLine[]);
  /** @returns {import("../chart/model.js").RowanChartReferenceLine[]} */
  get referenceLines(): import("../chart/model.js").RowanChartReferenceLine[];
  #private;
}
export type RowanStackedBarChartMessages = {
  chart?: string | undefined;
  dataTable?: string | undefined;
  dataTableCaption?: string | ((context: { chart: string }) => string) | undefined;
  metric?: string | undefined;
  noData?: string | undefined;
  point?: string | ((context: { index: string }) => string) | undefined;
  reference?: string | undefined;
  series?: string | undefined;
};
export type RowanStackedBarChartConfig = import("../chart/model.js").RowanChartConfig & {
  orientation?: "vertical" | "horizontal";
  stackMode?: "absolute" | "normalized";
  referenceLines?: import("../chart/model.js").RowanChartReferenceLine[];
};
import { BaseElement } from "../lib/base-element.js";
