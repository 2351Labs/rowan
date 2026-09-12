/**
 * Compact mutually exclusive mode control.
 * @tag rowan-segmented-control
 * @attr {string} name
 * @attr {string} value
 * @attr {string} label
 * @attr {"sm"|"md"|"lg"} size
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @property {Array<string | { value: string, label?: string, disabled?: boolean }>} options - Available modes. Arrays are property-only.
 * @csspart control
 * @csspart button
 * @csspart label
 * @cssprop --rowan-segmented-control-bg
 * @cssprop --rowan-segmented-control-active-bg
 * @event rowan-change - Fired when a user chooses a different mode
 */
export class RowanSegmentedControl extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    static componentTokenPrefixes: string[];
    set options(value: any[]);
    get options(): any[];
    set name(value: string);
    get name(): string;
    set value(value: string);
    get value(): string;
    set label(value: string);
    get label(): string;
    set size(value: string);
    get size(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    set required(value: boolean);
    get required(): boolean;
    get selectedOption(): {
        value: string;
        label: string;
        disabled: boolean;
    };
    setFormValue(value?: any, state?: any): void;
    setValidity(flags?: {}, message?: string, anchor?: any): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
