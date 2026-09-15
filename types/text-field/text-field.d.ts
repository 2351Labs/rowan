/**
 * Single-line text input with form association.
 * @tag rowan-text-field
 * @attr {string} name
 * @attr {string} value - Not reflected when type is "password", so the secret never enters the DOM.
 * @attr {string} placeholder
 * @attr {string} label
 * @attr {"text"|"email"|"password"|"search"|"url"|"tel"} type
 * @attr {string} pattern
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @csspart input
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the user commits a changed value
 */
export class RowanTextField extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set name(value: string);
    get name(): string;
    set value(value: string);
    get value(): string;
    set placeholder(value: string);
    get placeholder(): string;
    set label(value: string);
    get label(): string;
    /** @param {"text" | "email" | "password" | "search" | "url" | "tel"} value */
    set type(value: "search" | "text" | "email" | "tel" | "password" | "url");
    /** @returns {"text" | "email" | "password" | "search" | "url" | "tel"} */
    get type(): "search" | "text" | "email" | "tel" | "password" | "url";
    set pattern(value: string);
    get pattern(): string;
    set autocomplete(value: string);
    get autocomplete(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    set required(value: boolean);
    get required(): boolean;
    set invalid(value: boolean);
    get invalid(): boolean;
    setFormValue(value?: string): void;
    setValidity(flags?: {}, message?: string, anchor?: null): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): any;
    reportValidity(): any;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
