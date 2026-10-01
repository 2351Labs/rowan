/**
 * @typedef {string | { value: string, label?: string, disabled?: boolean }} RowanMultiSelectComboboxOption
 */
/**
 * @typedef {object} RowanMultiSelectComboboxMessages
 * @property {string} [noMatchingOptions]
 * @property {string | ((context: { label: string }) => string)} [optionsForLabel]
 * @property {string} [optionsLabel]
 * @property {string} [placeholder]
 * @property {string | ((context: { label: string }) => string)} [removeOption]
 */
/**
 * Filterable multi-select control with removable selected values.
 * @tag rowan-multi-select-combobox
 * @attr {string} name
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {string} query
 * @attr {string} locale
 * @attr {boolean} open
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @property {Array<string | { value: string, label?: string, disabled?: boolean }>} options - Available options. Arrays are property-only.
 * @property {string[]} selected - Selected option values. Arrays are property-only.
 * @property {RowanMultiSelectComboboxMessages} messages - Property-only built-in message overrides.
 * @csspart control
 * @csspart chips
 * @csspart chip
 * @csspart input
 * @csspart listbox
 * @csspart empty
 * @cssprop --rowan-multi-select-combobox-bg
 * @cssprop --rowan-multi-select-combobox-border
 * @event rowan-change - Fired when a user adds or removes a selected value
 */
export class RowanMultiSelectCombobox extends BaseElement {
  static shadowRootOptions: {
    mode: string;
    delegatesFocus: boolean;
  };
  /** @param {RowanMultiSelectComboboxOption[]} value */
  set options(value: RowanMultiSelectComboboxOption[]);
  /** @returns {RowanMultiSelectComboboxOption[]} */
  get options(): RowanMultiSelectComboboxOption[];
  /** @param {string[]} value */
  set selected(value: string[]);
  /** @returns {string[]} */
  get selected(): string[];
  get selectedOptions(): {
    value: string;
    label: string;
    disabled: boolean;
  }[];
  set name(value: string);
  get name(): string;
  set label(value: string);
  get label(): string;
  set placeholder(value: string);
  get placeholder(): string;
  set query(value: string);
  get query(): string;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanMultiSelectComboboxMessages | null | undefined} value */
  set messages(value: RowanMultiSelectComboboxMessages | null | undefined);
  /** @returns {RowanMultiSelectComboboxMessages} */
  get messages(): RowanMultiSelectComboboxMessages;
  set open(value: boolean);
  get open(): boolean;
  set disabled(value: boolean);
  get disabled(): boolean;
  set required(value: boolean);
  get required(): boolean;
  setFormValue(value?: null, state?: undefined): void;
  setValidity(flags?: {}, message?: string, anchor?: null): void;
  formResetCallback(): void;
  formStateRestoreCallback(state: any): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  #private;
}
export type RowanMultiSelectComboboxOption =
  | string
  | {
      value: string;
      label?: string;
      disabled?: boolean;
    };
export type RowanMultiSelectComboboxMessages = {
  noMatchingOptions?: string | undefined;
  optionsForLabel?: string | ((context: { label: string }) => string) | undefined;
  optionsLabel?: string | undefined;
  placeholder?: string | undefined;
  removeOption?: string | ((context: { label: string }) => string) | undefined;
};
import { BaseElement } from "../lib/base-element.js";
