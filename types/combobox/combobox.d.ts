/**
 * Filterable text entry with suggestions.
 * @tag rowan-combobox
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @csspart input
 * @csspart list
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the committed value changes
 */
export class RowanCombobox extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set options(value: any[]);
    get options(): any[];
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
    setValidity(flags?: {}, message?: string, anchor?: any): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): any;
    reportValidity(): any;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
