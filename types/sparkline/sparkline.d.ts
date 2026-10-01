/**
 * @typedef {object} RowanSparklineMessages
 * @property {string} [chart]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [point]
 */
/**
 * Frozen compact one-series line for KPI tiles. Not a density of
 * `rowan-trend-chart`.
 * @tag rowan-sparkline
 * @attr {string} label
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} tone
 * @attr {string} locale
 * @property {Array<number | null>} values - One series. Arrays are property-only. Null is a gap.
 * @property {string[]} labels - Optional point labels for the accessible table. Arrays are property-only.
 * @property {RowanSparklineMessages} messages - Property-only built-in message overrides.
 * @csspart chart
 * @csspart plot
 * @csspart line
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-sparkline-stroke
 * @cssprop --rowan-sparkline-success
 * @cssprop --rowan-sparkline-danger
 */
export class RowanSparkline extends BaseElement {
  set label(value: string);
  get label(): string;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanSparklineMessages | null | undefined} value */
  set messages(value: RowanSparklineMessages | null | undefined);
  /** @returns {RowanSparklineMessages} */
  get messages(): RowanSparklineMessages;
  /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
  set tone(value: "info" | "success" | "warning" | "danger" | "neutral");
  /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
  get tone(): "info" | "success" | "warning" | "danger" | "neutral";
  /** @param {Array<number | null>} value */
  set values(value: (number | null)[]);
  /** @returns {Array<number | null>} */
  get values(): (number | null)[];
  /** @param {string[]} value */
  set labels(value: string[]);
  /** @returns {string[]} */
  get labels(): string[];
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  #private;
}
export type RowanSparklineMessages = {
  chart?: string | undefined;
  noData?: string | undefined;
  point?: string | ((context: { index: string }) => string) | undefined;
};
import { BaseElement } from "../lib/base-element.js";
