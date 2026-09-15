/**
 * Bounded form-associated rating input.
 * @tag rowan-rating
 * @attr {string} name
 * @attr {number} value
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {string} label
 * @attr {string} description
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @slot label - Replaces the label attribute.
 * @slot description - Replaces the description attribute.
 * @csspart control
 * @csspart label
 * @csspart description
 * @csspart rating
 * @csspart star
 * @csspart clear
 * @csspart value
 * @cssprop --rowan-rating-active
 * @cssprop --rowan-rating-inactive
 * @cssprop --rowan-rating-focus-ring
 * @event rowan-change - Fired when a user changes or clears the rating.
 */
export class RowanRating extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    static componentTokenPrefixes: string[];
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set name(value: string);
    get name(): string;
    /** @param {number | string} value */
    set min(value: number);
    /** @returns {number} */
    get min(): number;
    /** @param {number | string} value */
    set max(value: number);
    /** @returns {number} */
    get max(): number;
    /** @param {number | string} value */
    set step(value: number);
    /** @returns {number} */
    get step(): number;
    /** @param {number | string | null | undefined} value */
    set value(value: number | "" | null | undefined);
    /** @returns {number | ""} */
    get value(): number | "";
    set label(value: string);
    get label(): string;
    set description(value: string);
    get description(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    set required(value: boolean);
    get required(): boolean;
    set invalid(value: boolean);
    get invalid(): boolean;
    clear(): void;
    setFormValue(value?: string | null, state?: string | null): void;
    setValidity(flags?: {}, message?: string, anchor?: null): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
