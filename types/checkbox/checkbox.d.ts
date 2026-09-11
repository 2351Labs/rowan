/**
 * Checkbox control with form association.
 * @tag rowan-checkbox
 * @attr {boolean} checked
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} indeterminate
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @slot - Label content
 * @csspart control
 * @csspart input
 * @event rowan-change - Fired when user toggles checked state
 */
export class RowanCheckbox extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set checked(value: boolean);
    get checked(): boolean;
    set disabled(value: boolean);
    get disabled(): boolean;
    set required(value: boolean);
    get required(): boolean;
    set indeterminate(value: boolean);
    get indeterminate(): boolean;
    set name(value: string);
    get name(): string;
    set value(value: string);
    get value(): string;
    set label(value: string);
    get label(): string;
    setFormValue(value?: string): void;
    setValidity(flags?: {}, message?: string, anchor?: any): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): any;
    reportValidity(): any;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
