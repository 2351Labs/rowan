/**
 * @typedef {object} RowanKpiCardMessages
 * @property {string | ((context: { label: string, value: string }) => string)} [deltaWithLabel]
 * @property {string} [kpi]
 * @property {string} [noData]
 */
/**
 * Frozen dashboard stat tile. Value and delta stay property-only.
 * Inline-size container: compact below 10rem, roomy from 22rem. A slotted
 * gauge sits immediately beside the metrics except below 10rem. Does not
 * change chart kind or reformat the value.
 * @tag rowan-kpi-card
 * @attr {string} label
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} tone
 * @attr {string} delta-label
 * @attr {boolean} loading
 * @attr {string} locale
 * @property {number | string | null} value - Displayed metric. Property-only.
 * @property {number | null} delta - Signed change. Property-only. Null hides the delta.
 * @property {RowanKpiCardMessages} messages - Property-only built-in message overrides.
 * @slot icon - Optional leading icon
 * @slot - Description or extra copy
 * @slot chart - Optional compact chart
 * @csspart card
 * @csspart icon
 * @csspart body
 * @csspart label
 * @csspart value
 * @csspart delta
 * @csspart description
 * @csspart chart
 * @cssprop --rowan-kpi-card-bg
 * @cssprop --rowan-kpi-card-border
 * @cssprop --rowan-kpi-card-fg
 * @cssprop --rowan-kpi-card-min-inline-size
 * @cssprop --rowan-kpi-card-padding
 * @cssprop --rowan-kpi-card-gap
 * @cssprop --rowan-kpi-card-value-size
 * @cssprop --rowan-kpi-card-chart-height
 
 * @attr {string} hidden-series - Space-separated series or slice ids hidden from the plot.
 * @attr {boolean} no-motion - Disables chart motion, including under prefers-reduced-motion.
 * @property {string[]} hiddenSeries - Ids hidden from the plot. The data table still lists them.
 * @property {((context: { text: string, event: Event, host: HTMLElement }) => string) | null} tooltipFormatter - Custom tooltip text. Property-only.
 * @slot tooltip - Custom tooltip content, used when tooltipFormatter is unset.
 * @event rowan-point-click - Cancelable. Detail: series, index, datum, value.
 * @event rowan-selection-change - Cancelable. Follows rowan-point-click when that event is not canceled.
 * @event rowan-series-toggle - Cancelable. Legend visibility toggle. Detail: seriesId, hiddenSeries.
 */
export class RowanKpiCard extends BaseElement {
  /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
  set tone(value: "info" | "success" | "warning" | "danger" | "neutral");
  /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
  get tone(): "info" | "success" | "warning" | "danger" | "neutral";
  set label(value: string);
  get label(): string;
  set deltaLabel(value: string);
  get deltaLabel(): string;
  set loading(value: boolean);
  get loading(): boolean;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanKpiCardMessages | null | undefined} value */
  set messages(value: RowanKpiCardMessages | null | undefined);
  /** @returns {RowanKpiCardMessages} */
  get messages(): RowanKpiCardMessages;
  /** @param {number | string | null} value */
  set value(value: string | number | null);
  /** @returns {number | string | null} */
  get value(): string | number | null;
  /** @param {number | null} value */
  set delta(value: number | null);
  /** @returns {number | null} */
  get delta(): number | null;
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
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
export type RowanKpiCardMessages = {
  deltaWithLabel?: string | ((context: { label: string; value: string }) => string) | undefined;
  kpi?: string | undefined;
  noData?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
