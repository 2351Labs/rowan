/**
 * @typedef {object} RowanNumberFieldMessages
 * @property {string} [decreaseValue]
 * @property {string} [increaseValue]
 */
/**
 * Numeric input with form association, range validation, and step controls.
 * @tag rowan-number-field
 * @attr {string} name
 * @attr {string} value
 * @attr {string} placeholder
 * @attr {string} label
 * @attr {string} min
 * @attr {string} max
 * @attr {number} step
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @property {RowanNumberFieldMessages} messages - Property-only built-in message overrides.
 * @csspart control
 * @csspart input
 * @csspart decrement-button
 * @csspart increment-button
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the user commits a changed value
 */
export class RowanNumberField extends BaseElement {
  static shadowRootOptions: {
    mode: string;
    delegatesFocus: boolean;
  };
  set name(value: string);
  get name(): string;
  set value(value: string);
  get value(): string;
  set placeholder(value: string);
  get placeholder(): string;
  set label(value: string);
  get label(): string;
  set min(value: string);
  get min(): string;
  set max(value: string);
  get max(): string;
  set step(value: number);
  get step(): number;
  set disabled(value: boolean);
  get disabled(): boolean;
  set required(value: boolean);
  get required(): boolean;
  set invalid(value: boolean);
  get invalid(): boolean;
  /** @param {RowanNumberFieldMessages | null | undefined} value */
  set messages(value: RowanNumberFieldMessages | null | undefined);
  /** @returns {RowanNumberFieldMessages} */
  get messages(): RowanNumberFieldMessages;
  setFormValue(value?: string): void;
  setValidity(flags?: {}, message?: string, anchor?: null): void;
  formResetCallback(): void;
  formStateRestoreCallback(state: any): void;
  checkValidity(): any;
  reportValidity(): any;
  #private;
}
export type RowanNumberFieldMessages = {
  decreaseValue?: string | undefined;
  increaseValue?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
