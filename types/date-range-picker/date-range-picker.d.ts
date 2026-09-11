/**
 * Date range input with form association and ordered range validation.
 * @tag rowan-date-range-picker
 * @attr {string} name
 * @attr {string} name-start
 * @attr {string} name-end
 * @attr {string} start
 * @attr {string} end
 * @attr {string} label
 * @attr {string} min
 * @attr {string} max
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @csspart control
 * @csspart start-input
 * @csspart end-input
 * @csspart clear-button
 * @cssprop --rowan-field-bg
 * @event rowan-change - Fired when the user commits or clears a date range
 */
export class RowanDateRangePicker extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set name(value: string);
    get name(): string;
    set nameStart(value: string);
    get nameStart(): string;
    set nameEnd(value: string);
    get nameEnd(): string;
    set start(value: string);
    get start(): string;
    set end(value: string);
    get end(): string;
    set value(value: {
        start: string;
        end: string;
    });
    get value(): {
        start: string;
        end: string;
    };
    set label(value: string);
    get label(): string;
    set min(value: string);
    get min(): string;
    set max(value: string);
    get max(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    set required(value: boolean);
    get required(): boolean;
    set invalid(value: boolean);
    get invalid(): boolean;
    clear(): void;
    setFormValue(): void;
    setValidity(flags?: {}, message?: string, anchor?: any): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
