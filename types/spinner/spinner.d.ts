/**
 * @typedef {object} RowanSpinnerMessages
 * @property {string} [loading]
 */
/**
 * Inline loading indicator.
 * @tag rowan-spinner
 * @attr {"sm"|"md"|"lg"} size
 * @attr {string} label
 * @property {RowanSpinnerMessages} messages - Property-only built-in message overrides.
 * @csspart spinner
 */
export class RowanSpinner extends BaseElement {
  /** @param {"sm" | "md" | "lg"} value */
  set size(value: "sm" | "md" | "lg");
  /** @returns {"sm" | "md" | "lg"} */
  get size(): "sm" | "md" | "lg";
  set label(value: string);
  get label(): string;
  /** @param {RowanSpinnerMessages | null | undefined} value */
  set messages(value: RowanSpinnerMessages | null | undefined);
  /** @returns {RowanSpinnerMessages} */
  get messages(): RowanSpinnerMessages;
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  #private;
}
export type RowanSpinnerMessages = {
  loading?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
