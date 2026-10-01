/** @typedef {{ dismiss?: string, dismissLabel?: string }} RowanToastMessages */
/**
 * Compact status notification with optional dismiss control.
 * @tag rowan-toast
 * @attr {"info"|"success"|"warning"|"danger"} tone
 * @attr {boolean} dismissible
 * @property {RowanToastMessages} messages - Property-only built-in message overrides.
 * @slot title
 * @slot - Notification message
 * @slot actions
 * @csspart toast
 * @csspart close
 * @event rowan-dismiss - Fired when dismissed by user interaction
 */
export class RowanToast extends BaseElement {
  /** @param {"info" | "success" | "warning" | "danger"} value */
  set tone(value: "info" | "success" | "warning" | "danger");
  /** @returns {"info" | "success" | "warning" | "danger"} */
  get tone(): "info" | "success" | "warning" | "danger";
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  set dismissible(value: boolean);
  get dismissible(): boolean;
  /** @param {RowanToastMessages | null | undefined} value */
  set messages(value: RowanToastMessages | null | undefined);
  /** @returns {RowanToastMessages} */
  get messages(): RowanToastMessages;
  #private;
}
export type RowanToastMessages = {
  dismiss?: string;
  dismissLabel?: string;
};
import { BaseElement } from "../lib/base-element.js";
