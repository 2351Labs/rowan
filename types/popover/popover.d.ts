/**
 * @typedef {object} RowanPopoverMessages
 * @property {string} [label]
 */
/**
 * Inline popover surface.
 * @tag rowan-popover
 * @attr {boolean} open
 * @attr {string} label
 * @attr {"click"|"manual"} trigger
 * @property {RowanPopoverMessages} messages - Property-only built-in message overrides.
 * @slot trigger
 * @slot - Content
 * @csspart trigger
 * @csspart panel
 * @event rowan-change - Fired when a user toggles or dismisses the popover
 */
export class RowanPopover extends BaseElement {
  set open(value: boolean);
  get open(): boolean;
  set label(value: string);
  get label(): string;
  /** @param {RowanPopoverMessages | null | undefined} value */
  set messages(value: RowanPopoverMessages | null | undefined);
  /** @returns {RowanPopoverMessages} */
  get messages(): RowanPopoverMessages;
  /** @param {"click" | "manual"} value */
  set trigger(value: "click" | "manual");
  /** @returns {"click" | "manual"} */
  get trigger(): "click" | "manual";
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  #private;
}
export type RowanPopoverMessages = {
  label?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
