/**
 * Toggle switch control with form association.
 * @tag rowan-switch
 * @attr {boolean} checked
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @slot - Label content
 * @csspart control
 * @csspart input
 * @cssprop --rowan-switch-track-bg - Track fill when off. Defaults to the border colour.
 * @cssprop --rowan-switch-track-checked-bg - Track fill when on. Defaults to the accent.
 * @cssprop --rowan-switch-thumb-bg - Thumb fill when off. Defaults to the muted colour.
 * @cssprop --rowan-switch-thumb-checked-bg - Thumb fill when on. Defaults to the accent contrast.
 * @event rowan-change - Fired when user toggles checked state
 */
export class RowanSwitch extends BaseElement {
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
    set name(value: string);
    get name(): string;
    set value(value: string);
    get value(): string;
    set label(value: string);
    get label(): string;
    setFormValue(value?: string | null): void;
    setValidity(flags?: {}, message?: string, anchor?: null): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): any;
    reportValidity(): any;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
