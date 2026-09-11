/**
 * Calendar grid for date selection with keyboard navigation.
 * @tag rowan-calendar
 * @attr {string} name
 * @attr {string} name-start
 * @attr {string} name-end
 * @attr {string} value
 * @attr {string} month
 * @attr {string} label
 * @attr {string} locale
 * @attr {string} min
 * @attr {string} max
 * @attr {"single"|"range"} selection-mode
 * @attr {string} start
 * @attr {string} end
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @csspart calendar
 * @csspart header
 * @csspart month-label
 * @csspart grid
 * @csspart day
 * @event rowan-change - Fired when a user selects a day
 */
export class RowanCalendar extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set name(value: string);
    get name(): string;
    set nameStart(value: string);
    get nameStart(): string;
    set nameEnd(value: string);
    get nameEnd(): string;
    set value(value: string);
    get value(): string;
    set month(value: string);
    get month(): string;
    set label(value: string);
    get label(): string;
    set locale(value: string);
    get locale(): string;
    set min(value: string);
    get min(): string;
    set max(value: string);
    get max(): string;
    set selectionMode(value: string);
    get selectionMode(): string;
    set start(value: string);
    get start(): string;
    set end(value: string);
    get end(): string;
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
    checkValidity(): boolean;
    reportValidity(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
