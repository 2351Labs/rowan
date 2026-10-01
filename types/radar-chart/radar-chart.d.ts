/**
 * @typedef {object} RowanRadarChartMessages
 * @property {string | ((context: { geometry: "line" | "area" }) => string)} [chart]
 * @property {string} [dataTable]
 * @property {string | ((context: { chart: string }) => string)} [dataTableCaption]
 * @property {string} [metric]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [series]
 */
/**
 * @typedef {import("../chart/model.js").RowanChartConfig & {
 *   geometry?: "line" | "area",
 * }} RowanRadarChartConfig
 */
/**
 * Experimental polar comparison. Categories are axes around the ring.
 * `geometry` is `line` (default) or `area`. Null is no-data and breaks the
 * ring; the host does not treat a gap as zero. Frozen categorical `series`.
 * Nightingale and radial bars are not this host.
 * @tag rowan-radar-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {"line"|"area"} geometry - Default `line`.
 * @attr {string} locale
 * @property {Array<import("../chart/model.js").RowanChartSeries>} series - Chart series. Arrays are property-only.
 * @property {string[]} labels - Axis labels around the ring. Arrays are property-only.
 * @property {RowanRadarChartConfig} config - Replaces the complete chart configuration. Omitted `geometry` resets to line.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter
 * @property {RowanRadarChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart plot
 * @csspart line
 * @csspart area
 * @csspart point
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-radar-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive vertex.
 */
export class RowanRadarChart extends BaseElement {
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
  /** @param {RowanRadarChartMessages | null | undefined} value */
  set messages(value: RowanRadarChartMessages | null | undefined);
  /** @returns {RowanRadarChartMessages} */
  get messages(): RowanRadarChartMessages;
  set interactive(value: boolean);
  get interactive(): boolean;
  /** @param {"line" | "area"} value */
  set geometry(value: "area" | "line");
  /** @returns {"line" | "area"} */
  get geometry(): "area" | "line";
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  /** @param {Array<import("../chart/model.js").RowanChartSeries>} value */
  set series(value: import("../chart/model.js").RowanChartSeries[]);
  /** @returns {Array<import("../chart/model.js").RowanChartSeries>} */
  get series(): import("../chart/model.js").RowanChartSeries[];
  /** @param {string[]} value */
  set labels(value: string[]);
  /** @returns {string[]} */
  get labels(): string[];
  /** @param {RowanRadarChartConfig | null | undefined} value */
  set config(value: RowanRadarChartConfig | null | undefined);
  /** @returns {RowanRadarChartConfig} */
  get config(): RowanRadarChartConfig;
  /** @param {import("../chart/model.js").RowanChartValueFormatter | null} value */
  set valueFormatter(value: import("../chart/model.js").RowanChartValueFormatter | null);
  /** @returns {import("../chart/model.js").RowanChartValueFormatter | null} */
  get valueFormatter(): import("../chart/model.js").RowanChartValueFormatter | null;
  #private;
}
export type RowanRadarChartMessages = {
  chart?: string | ((context: { geometry: "line" | "area" }) => string) | undefined;
  dataTable?: string | undefined;
  dataTableCaption?: string | ((context: { chart: string }) => string) | undefined;
  metric?: string | undefined;
  noData?: string | undefined;
  point?: string | ((context: { index: string }) => string) | undefined;
  series?: string | undefined;
};
export type RowanRadarChartConfig = import("../chart/model.js").RowanChartConfig & {
  geometry?: "line" | "area";
};
import { BaseElement } from "../lib/base-element.js";
