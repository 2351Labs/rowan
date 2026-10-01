/**
 * @typedef {object} RowanFunnelChartMessages
 * @property {string | ((context: { variant: "funnel" | "cone" | "pyramid" }) => string)} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [metric]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [stages]
 */
/**
 * @typedef {import("../chart/model.js").RowanChartConfig & {
 *   variant?: "funnel" | "cone" | "pyramid",
 * }} RowanFunnelChartConfig
 */
/**
 * Experimental one-series stage chart. Does not auto-sort. Negatives and
 * null are no-data. `pyramid` puts stage 0 at the bottom; `cone` tapers
 * the last stage to a point.
 * @tag rowan-funnel-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {"funnel"|"cone"|"pyramid"} variant - Default `funnel`.
 * @attr {string} locale
 * @property {Array<import("../chart/model.js").RowanChartSeries>} series - First series is drawn. Arrays are property-only.
 * @property {string[]} labels - Stage labels. Arrays are property-only.
 * @property {RowanFunnelChartConfig} config - Replaces the complete chart configuration. Omitted `variant` resets to funnel.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter
 * @property {RowanFunnelChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart stage
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-funnel-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive stage.
 */
export class RowanFunnelChart extends BaseElement {
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
  /** @param {RowanFunnelChartMessages | null | undefined} value */
  set messages(value: RowanFunnelChartMessages | null | undefined);
  /** @returns {RowanFunnelChartMessages} */
  get messages(): RowanFunnelChartMessages;
  set interactive(value: boolean);
  get interactive(): boolean;
  /** @param {"funnel" | "cone" | "pyramid"} value */
  set variant(value: "funnel" | "cone" | "pyramid");
  /** @returns {"funnel" | "cone" | "pyramid"} */
  get variant(): "funnel" | "cone" | "pyramid";
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  /** @param {Array<import("../chart/model.js").RowanChartSeries>} value */
  set series(value: import("../chart/model.js").RowanChartSeries[]);
  /** @returns {Array<import("../chart/model.js").RowanChartSeries>} */
  get series(): import("../chart/model.js").RowanChartSeries[];
  /** @param {string[]} value */
  set labels(value: string[]);
  /** @returns {string[]} */
  get labels(): string[];
  /** @param {RowanFunnelChartConfig | null | undefined} value */
  set config(value: RowanFunnelChartConfig | null | undefined);
  /** @returns {RowanFunnelChartConfig} */
  get config(): RowanFunnelChartConfig;
  /** @param {import("../chart/model.js").RowanChartValueFormatter | null} value */
  set valueFormatter(value: import("../chart/model.js").RowanChartValueFormatter | null);
  /** @returns {import("../chart/model.js").RowanChartValueFormatter | null} */
  get valueFormatter(): import("../chart/model.js").RowanChartValueFormatter | null;
  #private;
}
export type RowanFunnelChartMessages = {
  chart?: string | ((context: { variant: "funnel" | "cone" | "pyramid" }) => string) | undefined;
  dataTable?: string | undefined;
  dataTableCaption?: string | ((context: { chart: string }) => string) | undefined;
  metric?: string | undefined;
  noData?: string | undefined;
  point?: string | ((context: { index: string }) => string) | undefined;
  stages?: string | undefined;
};
export type RowanFunnelChartConfig = import("../chart/model.js").RowanChartConfig & {
  variant?: "funnel" | "cone" | "pyramid";
};
import { BaseElement } from "../lib/base-element.js";
