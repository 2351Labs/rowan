/**
 * @typedef {object} RowanBulletChartMessages
 * @property {string} [actual]
 * @property {string} [chart]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [range]
 * @property {string} [target]
 */
/**
 * Compact qualitative comparison after Stephen Few's bullet graph spec.
 * @tag rowan-bullet-chart
 * @attr {string} label
 * @attr {boolean} scale - Show quantitative ticks. Default true.
 * @attr {"higher"|"lower"} intent - Dark bands encode poor performance.
 * @attr {"ink"|"accent"|"status"|"tone"} encoding - Range fill. `ink` grayscale (default). `accent` one theme hue. `status` poor→good mix. `tone` per-range hues.
 * @attr {string} locale
 * @property {number | null} value
 * @property {number | null} target
 * @property {RowanBulletChartRange[]} ranges
 * @property {RowanBulletChartMessages} messages - Property-only built-in message overrides.
 * @csspart chart
 * @csspart plot
 * @csspart range
 * @csspart actual
 * @csspart target
 * @csspart tick
 * @csspart hover
 * @csspart table
 
 * @attr {string} hidden-series - Space-separated series or slice ids hidden from the plot.
 * @attr {boolean} no-motion - Disables chart motion, including under prefers-reduced-motion.
 * @property {string[]} hiddenSeries - Ids hidden from the plot. The data table still lists them.
 * @property {((context: { text: string, event: Event, host: HTMLElement }) => string) | null} tooltipFormatter - Custom tooltip text. Property-only.
 * @slot tooltip - Custom tooltip content, used when tooltipFormatter is unset.
 * @event rowan-point-click - Cancelable. Detail: series, index, datum, value.
 * @event rowan-selection-change - Cancelable. Follows rowan-point-click when that event is not canceled.
 * @event rowan-series-toggle - Cancelable. Legend visibility toggle. Detail: seriesId, hiddenSeries.
 */
export class RowanBulletChart extends BaseElement {
  set label(value: string);
  get label(): string;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanBulletChartMessages | null | undefined} value */
  set messages(value: RowanBulletChartMessages | null | undefined);
  /** @returns {RowanBulletChartMessages} */
  get messages(): RowanBulletChartMessages;
  set scale(value: boolean);
  get scale(): boolean;
  set intent(value: "higher" | "lower");
  /** @returns {"higher" | "lower"} */
  get intent(): "higher" | "lower";
  /** @param {"ink" | "accent" | "status" | "tone"} value */
  set encoding(value: "tone" | "status" | "ink" | "accent");
  /** @returns {"ink" | "accent" | "status" | "tone"} */
  get encoding(): "tone" | "status" | "ink" | "accent";
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  /** @param {number | null} value */
  set value(value: number | null);
  /** @returns {number | null} */
  get value(): number | null;
  /** @param {number | null} value */
  set target(value: number | null);
  /** @returns {number | null} */
  get target(): number | null;
  /** @param {RowanBulletChartRange[]} value */
  set ranges(value: RowanBulletChartRange[]);
  /** @returns {RowanBulletChartRange[]} */
  get ranges(): RowanBulletChartRange[];
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
export type RowanBulletChartRange = {
  from: number;
  to: number;
  label?: string | undefined;
  tone?: "info" | "success" | "warning" | "danger" | "neutral" | undefined;
};
export type RowanBulletChartMessages = {
  actual?: string | undefined;
  chart?: string | undefined;
  noData?: string | undefined;
  range?: string | ((context: { index: string }) => string) | undefined;
  target?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
