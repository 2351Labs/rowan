/**
 * Frozen parts-of-a-whole chart. Uses the first series. Negative values
 * are treated as no-data, not slices.
 * @tag rowan-donut-chart
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} interactive
 * @attr {"donut"|"pie"} variant - `pie` fills the hole. Default `donut`. Total stays in the matching table.
 * @attr {string} locale
 * @property {Array<import("../chart/model.js").RowanChartSeries>} series - First series is drawn. Arrays are property-only.
 * @property {string[]} labels - Slice labels. Arrays are property-only.
 * @property {RowanDonutChartConfig} config - Replaces the complete chart configuration. Omitted `variant` resets to donut.
 * @property {import("../chart/model.js").RowanChartValueFormatter | null} valueFormatter
 * @property {RowanDonutChartMessages} messages - Property-only built-in message overrides.
 * @slot label
 * @slot description
 * @csspart control
 * @csspart label
 * @csspart plot
 * @csspart slice
 * @csspart total
 * @csspart legend
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-donut-chart-bg
 * @event rowan-point-activate - Fired when a user activates an interactive slice.
 */
export class RowanDonutChart extends BaseElement {
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
  /** @param {RowanDonutChartMessages | null | undefined} value */
  set messages(value: RowanDonutChartMessages | null | undefined);
  /** @returns {RowanDonutChartMessages} */
  get messages(): RowanDonutChartMessages;
  set interactive(value: boolean);
  get interactive(): boolean;
  /** @param {"donut" | "pie"} value */
  set variant(value: "donut" | "pie");
  /** @returns {"donut" | "pie"} */
  get variant(): "donut" | "pie";
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  /** @param {Array<import("../chart/model.js").RowanChartSeries>} value */
  set series(value: import("../chart/model.js").RowanChartSeries[]);
  /** @returns {Array<import("../chart/model.js").RowanChartSeries>} */
  get series(): import("../chart/model.js").RowanChartSeries[];
  /** @param {string[]} value */
  set labels(value: string[]);
  /** @returns {string[]} */
  get labels(): string[];
  /** @param {RowanDonutChartConfig | null | undefined} value */
  set config(value: RowanDonutChartConfig);
  /** @returns {RowanDonutChartConfig} */
  get config(): RowanDonutChartConfig;
  /** @param {import("../chart/model.js").RowanChartValueFormatter | null} value */
  set valueFormatter(value: import("../chart/model.js").RowanChartValueFormatter | null);
  /** @returns {import("../chart/model.js").RowanChartValueFormatter | null} */
  get valueFormatter(): import("../chart/model.js").RowanChartValueFormatter | null;
  #private;
}
export type RowanDonutChartMessages = {
  chart?: string | ((context: { variant: "donut" | "pie" }) => string) | undefined;
  dataTable?: string | undefined;
  dataTableCaption?: string | ((context: { chart: string }) => string) | undefined;
  metric?: string | undefined;
  noData?: string | undefined;
  point?: string | ((context: { index: string }) => string) | undefined;
  reference?: string | undefined;
  slices?: string | undefined;
  total?: string | undefined;
};
export type RowanDonutChartConfig = import("../chart/model.js").RowanChartConfig & {
  variant?: "donut" | "pie";
};
import { BaseElement } from "../lib/base-element.js";
