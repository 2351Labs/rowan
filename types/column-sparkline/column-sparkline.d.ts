/**
 * @typedef {object} RowanColumnSparklineMessages
 * @property {string} [chart]
 * @property {string} [noData]
 * @property {string | ((context: { index: string }) => string)} [point]
 * @property {string} [target]
 */
/**
 * Experimental compact one-series columns for KPI tiles. Not a density of
 * `rowan-bar-chart`. Not a `variant` of `rowan-sparkline`.
 * @tag rowan-column-sparkline
 * @attr {string} label
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} tone
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} [above-tone=warning] - Fill above target. Used when `target` is set.
 * @attr {"neutral"|"info"|"success"|"warning"|"danger"} [below-tone=success] - Fill at or below target. Used when `target` is set.
 * @attr {string} locale
 * @property {Array<number | null>} values - One series. Arrays are property-only. Null is a gap.
 * @property {string[]} labels - Optional point labels for the accessible table. Arrays are property-only.
 * @property {number | null} target - Target value. Property-only. Null hides the split and the dashed line.
 * @property {RowanColumnSparklineMessages} messages - Property-only built-in message overrides.
 * @csspart chart
 * @csspart plot
 * @csspart column
 * @csspart target
 * @csspart hover
 * @csspart table
 * @cssprop --rowan-column-sparkline-height
 * @cssprop --rowan-column-sparkline-fill
 * @cssprop --rowan-column-sparkline-info
 * @cssprop --rowan-column-sparkline-success
 * @cssprop --rowan-column-sparkline-warning
 * @cssprop --rowan-column-sparkline-danger
 * @cssprop --rowan-column-sparkline-target
 * @cssprop --rowan-column-sparkline-target-width
 */
export class RowanColumnSparkline extends BaseElement {
  set label(value: string);
  get label(): string;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanColumnSparklineMessages | null | undefined} value */
  set messages(value: RowanColumnSparklineMessages | null | undefined);
  /** @returns {RowanColumnSparklineMessages} */
  get messages(): RowanColumnSparklineMessages;
  /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
  set tone(value: "info" | "success" | "warning" | "danger" | "neutral");
  /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
  get tone(): "info" | "success" | "warning" | "danger" | "neutral";
  /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
  set aboveTone(value: "info" | "success" | "warning" | "danger" | "neutral");
  /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
  get aboveTone(): "info" | "success" | "warning" | "danger" | "neutral";
  /** @param {"neutral" | "info" | "success" | "warning" | "danger"} value */
  set belowTone(value: "info" | "success" | "warning" | "danger" | "neutral");
  /** @returns {"neutral" | "info" | "success" | "warning" | "danger"} */
  get belowTone(): "info" | "success" | "warning" | "danger" | "neutral";
  /** @param {Array<number | null>} value */
  set values(value: (number | null)[]);
  /** @returns {Array<number | null>} */
  get values(): (number | null)[];
  /** @param {string[]} value */
  set labels(value: string[]);
  /** @returns {string[]} */
  get labels(): string[];
  /** @param {number | null} value */
  set target(value: number | null);
  /** @returns {number | null} */
  get target(): number | null;
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  #private;
}
export type RowanColumnSparklineMessages = {
  chart?: string | undefined;
  noData?: string | undefined;
  point?: string | ((context: { index: string }) => string) | undefined;
  target?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
