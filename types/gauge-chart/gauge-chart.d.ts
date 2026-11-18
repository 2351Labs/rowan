/**
 * Compact speedometer gauge: ranges, min/max, actual, and optional target.
 * Separate host from bullet and donut charts.
 * @tag rowan-gauge-chart
 * @attr {string} label
 * @attr {number} min
 * @attr {number} max
 * @attr {string} locale
 * @property {number | null} value - Actual measure. Property-only. Null is no-data.
 * @property {number | null} target - Target tick. Property-only. Null hides the tick.
 * @property {RowanGaugeChartRange[]} ranges - Qualitative bands. Arrays are property-only.
 * @property {RowanGaugeChartMessages} messages - Property-only built-in message overrides.
 * @csspart chart
 * @csspart plot
 * @csspart track
 * @csspart range
 * @csspart needle
 * @csspart hub
 * @csspart target
 * @csspart readout
 * @csspart tick-label
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-gauge-chart-needle
 * @cssprop --rowan-gauge-chart-track
 * @cssprop --rowan-gauge-chart-range
 * @cssprop --rowan-gauge-chart-target
 
 * @attr {string} hidden-series - Space-separated series or slice ids hidden from the plot.
 * @attr {boolean} no-motion - Disables chart motion, including under prefers-reduced-motion.
 * @property {string[]} hiddenSeries - `needle` hides the needle, `target` hides the target tick, and a range tone hides that band. The data table still lists them.
 * @property {((context: { text: string, event: Event, host: HTMLElement }) => string) | null} tooltipFormatter - Custom tooltip text. Property-only.
 * @slot tooltip - Custom tooltip content, used when tooltipFormatter is unset.
 * @event rowan-point-click - Cancelable. Detail: series, index, datum, value.
 * @event rowan-selection-change - Cancelable. Follows rowan-point-click when that event is not canceled.
 * @event rowan-series-toggle - Cancelable. Legend visibility toggle. Detail: seriesId, hiddenSeries.
 
 * @attr {string} sync-group - Name of a crosshair group. Charts with the same name, including across shadow roots, show a crosshair and tooltip at the matching x. Hover, keyboard focus, and syncHover(index) move the group. rowan-sync detail is group, index, and label. Only the focused chart announces through its live region.
 * @attr {boolean} brush - Drag, or Shift+Arrow, to select an x range. Escape clears it.
 * @attr {string} large-series - Drawn-point budget. A number is the maximum marks to draw. off draws every point. When omitted, the chart keeps about two points per pixel. Tooltips and the data table use the real values. A long table is paged.
 * @event rowan-sync - Shared crosshair. Detail: group, index, label.
 * @event rowan-brush - Selected range. Detail: startIndex, endIndex, startLabel, endLabel, or cleared.
*/
export class RowanGaugeChart extends BaseElement {
  static styles: string;
  set label(value: string);
  get label(): string;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanGaugeChartMessages | null | undefined} value */
  set messages(value: RowanGaugeChartMessages | null | undefined);
  /** @returns {RowanGaugeChartMessages} */
  get messages(): RowanGaugeChartMessages;
  set min(value: number);
  get min(): number;
  set max(value: number);
  get max(): number;
  /** @param {number | null} value */
  set value(value: number | null);
  /** @returns {number | null} */
  get value(): number | null;
  /** @param {number | null} value */
  set target(value: number | null);
  /** @returns {number | null} */
  get target(): number | null;
  /** @param {RowanGaugeChartRange[]} value */
  set ranges(value: RowanGaugeChartRange[]);
  /** @returns {RowanGaugeChartRange[]} */
  get ranges(): RowanGaugeChartRange[];
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
export type RowanGaugeChartRange = {
  from: number;
  to: number;
  label?: string | undefined;
  tone?: "info" | "success" | "warning" | "danger" | "neutral" | undefined;
};
export type RowanGaugeChartMessages = {
  actual?: string | undefined;
  chart?: string | undefined;
  maximum?: string | undefined;
  minimum?: string | undefined;
  noData?: string | undefined;
  range?: string | ((context: { index: string }) => string) | undefined;
  target?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
