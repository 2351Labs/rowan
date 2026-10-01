/** @typedef {string | { value: string, label?: string, disabled?: boolean }} RowanComboboxOption */
/**
 * @typedef {object} RowanComboboxMessages
 * @property {string} [noMatchingOptions]
 */
/**
 * Filterable text entry with a listbox of suggestions.
 * Focus stays in the input and the highlighted option is reported with
 * `aria-activedescendant`, matching the APG combobox pattern.
 * @tag rowan-combobox
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {string} locale
 * @attr {boolean} open
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @property {RowanComboboxOption[]} options - Available suggestions. Arrays are property-only.
 * @property {RowanComboboxMessages} messages - Property-only built-in message overrides.
 * @csspart control
 * @csspart label
 * @csspart input
 * @csspart panel
 * @csspart list
 * @csspart empty
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the user commits a changed value
 */
export class RowanCombobox extends BaseElement {
  static shadowRootOptions: {
    mode: string;
    delegatesFocus: boolean;
  };
  set open(value: boolean);
  get open(): boolean;
  /** @param {RowanComboboxOption[]} value */
  set options(value: RowanComboboxOption[]);
  /** @returns {RowanComboboxOption[]} */
  get options(): RowanComboboxOption[];
  set name(value: string);
  get name(): string;
  set value(value: string);
  get value(): string;
  set label(value: string);
  get label(): string;
  set placeholder(value: string);
  get placeholder(): string;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanComboboxMessages | null | undefined} value */
  set messages(value: RowanComboboxMessages | null | undefined);
  /** @returns {RowanComboboxMessages} */
  get messages(): RowanComboboxMessages;
  set disabled(value: boolean);
  get disabled(): boolean;
  set required(value: boolean);
  get required(): boolean;
  setFormValue(value?: string): void;
  setValidity(flags?: {}, message?: string, anchor?: null): void;
  formResetCallback(): void;
  formStateRestoreCallback(state: any): void;
  checkValidity(): any;
  reportValidity(): any;
  #private;
}
export type RowanComboboxOption =
  | string
  | {
      value: string;
      label?: string;
      disabled?: boolean;
    };
export type RowanComboboxMessages = {
  noMatchingOptions?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
