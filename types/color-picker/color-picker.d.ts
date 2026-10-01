/**
 * Accessible semantic color selection with approved swatches and alpha-enabled custom entry.
 * @tag rowan-color-picker
 * @attr {string} name
 * @attr {string} value - A normalized #rrggbb or #rrggbbaa color.
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @property {Array<string | RowanColorPickerPaletteEntry>} palette - Approved palette entries. Arrays are property-only.
 * @property {RowanColorPickerMessages} messages - Property-only built-in message overrides.
 * @slot label - Replaces the label attribute.
 * @slot description - Replaces the description attribute.
 * @csspart control
 * @csspart label
 * @csspart description
 * @csspart swatches
 * @csspart swatch
 * @csspart swatch-color
 * @csspart custom-color
 * @csspart color-input
 * @csspart alpha-input
 * @csspart alpha-value
 * @cssprop --rowan-color-picker-bg
 * @cssprop --rowan-color-picker-border
 * @cssprop --rowan-color-picker-swatch-size
 * @event rowan-change - Fired when a user selects or enters a color.
 */
export class RowanColorPicker extends BaseElement {
  static shadowRootOptions: {
    mode: string;
    delegatesFocus: boolean;
  };
  /** @param {Array<string | RowanColorPickerPaletteEntry>} value */
  set palette(value: (string | RowanColorPickerPaletteEntry)[]);
  /** @returns {Array<string | RowanColorPickerPaletteEntry>} */
  get palette(): (string | RowanColorPickerPaletteEntry)[];
  /** @param {RowanColorPickerMessages | null | undefined} value */
  set messages(value: RowanColorPickerMessages | null | undefined);
  /** @returns {RowanColorPickerMessages} */
  get messages(): RowanColorPickerMessages;
  set name(value: string);
  get name(): string;
  set value(value: string);
  get value(): string;
  set label(value: string);
  get label(): string;
  set description(value: string);
  get description(): string;
  set disabled(value: boolean);
  get disabled(): boolean;
  set required(value: boolean);
  get required(): boolean;
  set invalid(value: boolean);
  get invalid(): boolean;
  setFormValue(value?: string | null, state?: string | null): void;
  setValidity(flags?: {}, message?: string, anchor?: null): void;
  formResetCallback(): void;
  formStateRestoreCallback(state: any): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  #private;
}
export type RowanColorPickerPaletteEntry = {
  value: string;
  label?: string | undefined;
  disabled?: boolean | undefined;
};
export type RowanColorPickerMessages = {
  customColor?: string | undefined;
  customColorLabel?: string | ((context: { label: string }) => string) | undefined;
  opacity?: string | undefined;
  opacityLabel?: string | ((context: { label: string }) => string) | undefined;
  paletteLabel?: string | ((context: { label: string }) => string) | undefined;
  pickerLabel?: string | undefined;
  swatchLabel?: string | ((context: { label: string; value: string }) => string) | undefined;
};
import { BaseElement } from "../lib/base-element.js";
