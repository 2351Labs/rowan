/**
 * Filterable multi-select control with removable selected values.
 * @tag rowan-multi-select-combobox
 * @attr {string} name
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {string} query
 * @attr {boolean} open
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @property {Array<string | { value: string, label?: string, disabled?: boolean }>} options - Available options. Arrays are property-only.
 * @property {string[]} selected - Selected option values. Arrays are property-only.
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
    static componentTokenPrefixes: string[];
    set options(value: any[]);
    get options(): any[];
    set selected(value: any[]);
    get selected(): any[];
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
    set open(value: boolean);
    get open(): boolean;
    set disabled(value: boolean);
    get disabled(): boolean;
    set required(value: boolean);
    get required(): boolean;
    setFormValue(value?: any, state?: any): void;
    setValidity(flags?: {}, message?: string, anchor?: any): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
