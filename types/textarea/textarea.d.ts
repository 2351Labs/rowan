/**
 * Multi-line text input with form association.
 * @tag rowan-textarea
 * @attr {string} name
 * @attr {string} value
 * @attr {string} placeholder
 * @attr {string} label
 * @attr {number} rows
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @csspart input
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the user commits a changed value
 */
export class RowanTextarea extends BaseElement {
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
    set rows(value: number);
    get rows(): number;
    set disabled(value: boolean);
    get disabled(): boolean;
    set required(value: boolean);
    get required(): boolean;
    set invalid(value: boolean);
    get invalid(): boolean;
    setFormValue(value?: string): void;
    setValidity(flags?: {}, message?: string, anchor?: any): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): any;
    reportValidity(): any;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
