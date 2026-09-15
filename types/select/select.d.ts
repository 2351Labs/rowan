/** @typedef {string | { value: string, label?: string, disabled?: boolean }} RowanSelectOption */
/**
 * Select control with form association.
 * @tag rowan-select
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @property {RowanSelectOption[]} options - Available options. Arrays are property-only.
 * @csspart select
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the selected value changes
 */
export class RowanSelect extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    /** @param {RowanSelectOption[]} value */
    set options(value: RowanSelectOption[]);
    /** @returns {RowanSelectOption[]} */
    get options(): RowanSelectOption[];
    set name(value: string);
    get name(): string;
    set value(value: string);
    get value(): string;
    set label(value: string);
    get label(): string;
    set placeholder(value: string);
    get placeholder(): string;
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
export type RowanSelectOption = string | {
    value: string;
    label?: string;
    disabled?: boolean;
};
import { BaseElement } from "../lib/base-element.js";
