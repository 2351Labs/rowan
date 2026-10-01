/**
 * @typedef {object} RowanDateRangePickerMessages
 * @property {string} [clear]
 * @property {string} [end]
 * @property {string | ((context: { endpoint: string, label: string }) => string)} [rangeEndpoint]
 * @property {string} [separator]
 * @property {string} [start]
 */
/**
 * Date range input with form association and ordered range validation.
 * @tag rowan-date-range-picker
 * @attr {string} name
 * @attr {string} name-start
 * @attr {string} name-end
 * @attr {string} start
 * @attr {string} end
 * @attr {string} label
 * @attr {string} min
 * @attr {string} max
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @property {RowanDateRangePickerMessages} messages - Property-only built-in message overrides.
 * @csspart control
 * @csspart start-input
 * @csspart end-input
 * @csspart clear-button
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the user commits or clears a date range
 */
export class RowanDateRangePicker extends BaseElement {
  static shadowRootOptions: {
    mode: string;
    delegatesFocus: boolean;
  };
  set name(value: string);
  get name(): string;
  set nameStart(value: string);
  get nameStart(): string;
  set nameEnd(value: string);
  get nameEnd(): string;
  set start(value: string);
  get start(): string;
  set end(value: string);
  get end(): string;
  set value(value: { start: string; end: string });
  get value(): {
    start: string;
    end: string;
  };
  set label(value: string);
  get label(): string;
  set min(value: string);
  get min(): string;
  set max(value: string);
  get max(): string;
  set disabled(value: boolean);
  get disabled(): boolean;
  set required(value: boolean);
  get required(): boolean;
  set invalid(value: boolean);
  get invalid(): boolean;
  /** @param {RowanDateRangePickerMessages | null | undefined} value */
  set messages(value: RowanDateRangePickerMessages | null | undefined);
  /** @returns {RowanDateRangePickerMessages} */
  get messages(): RowanDateRangePickerMessages;
  clear(): void;
  setFormValue(): void;
  setValidity(flags?: {}, message?: string, anchor?: null): void;
  formResetCallback(): void;
  formStateRestoreCallback(state: any): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  #private;
}
export type RowanDateRangePickerMessages = {
  clear?: string | undefined;
  end?: string | undefined;
  rangeEndpoint?: string | ((context: { endpoint: string; label: string }) => string) | undefined;
  separator?: string | undefined;
  start?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
