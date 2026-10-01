/**
 * @typedef {object} RowanSplitPaneMessages
 * @property {string} [resizePanes]
 * @property {string | ((context: { value: string }) => string)} [valueText]
 */
/**
 * Resizable two-pane workspace layout.
 * @tag rowan-split-pane
 * @attr {"horizontal"|"vertical"} orientation
 * @attr {number} position
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {number} snap-threshold
 * @attr {boolean} disabled
 * @attr {string} locale
 * @property {number[]} snapPoints - Property-only percentage positions that attract nearby resize values.
 * @property {RowanSplitPaneMessages} messages - Property-only built-in message overrides.
 * @slot start - Start pane content.
 * @slot end - End pane content.
 * @csspart layout
 * @csspart start
 * @csspart separator
 * @csspart end
 * @cssprop --rowan-split-pane-gap
 * @cssprop --rowan-split-pane-separator-size
 * @cssprop --rowan-split-pane-separator-color
 * @event rowan-resize - Fired when a user resizes the pane with the separator.
 */
export class RowanSplitPane extends BaseElement {
  static shadowRootOptions: {
    mode: string;
    delegatesFocus: boolean;
  };
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  set orientation(value: "vertical" | "horizontal");
  get orientation(): "vertical" | "horizontal";
  /** @param {number} value */
  set position(value: number);
  /** @returns {number} */
  get position(): number;
  /** @param {number} value */
  set min(value: number);
  /** @returns {number} */
  get min(): number;
  /** @param {number} value */
  set max(value: number);
  /** @returns {number} */
  get max(): number;
  /** @param {number} value */
  set step(value: number);
  /** @returns {number} */
  get step(): number;
  /** @param {number} value */
  set snapThreshold(value: number);
  /** @returns {number} */
  get snapThreshold(): number;
  /** @param {number[]} value */
  set snapPoints(value: number[]);
  /** @returns {number[]} */
  get snapPoints(): number[];
  set disabled(value: boolean);
  get disabled(): boolean;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanSplitPaneMessages | null | undefined} value */
  set messages(value: RowanSplitPaneMessages | null | undefined);
  /** @returns {RowanSplitPaneMessages} */
  get messages(): RowanSplitPaneMessages;
  #private;
}
export type RowanSplitPaneMessages = {
  resizePanes?: string | undefined;
  valueText?: string | ((context: { value: string }) => string) | undefined;
};
import { BaseElement } from "../lib/base-element.js";
