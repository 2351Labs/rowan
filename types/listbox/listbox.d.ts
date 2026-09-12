/**
 * Accessible single- or multi-selection list control.
 * @tag rowan-listbox
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @attr {"single"|"multiple"} selection
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @property {string[]} selected - Selected option values. Arrays are property-only.
 * @slot - rowan-option children
 * @csspart listbox
 * @cssprop --rowan-listbox-bg
 * @cssprop --rowan-listbox-border
 * @event rowan-change - Fired when user interaction changes selection
 */
export class RowanListbox extends BaseElement {
    static componentTokenPrefixes: string[];
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set name(value: string);
    get name(): string;
    set value(value: string);
    get value(): string;
    set label(value: string);
    get label(): string;
    set selection(value: string);
    get selection(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    set required(value: boolean);
    get required(): boolean;
    /** @param {string[]} value */
    set selected(value: string[]);
    /** @returns {string[]} */
    get selected(): string[];
    /** @returns {RowanOption[]} */
    get selectedOptions(): RowanOption[];
    setFormValue(value?: any, state?: any): void;
    setValidity(flags?: {}, message?: string, anchor?: any): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    clearSelection(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
