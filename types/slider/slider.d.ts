/**
 * Numeric slider with single-value and ordered range modes.
 * @tag rowan-slider
 * @attr {string} name
 * @attr {string} name-start
 * @attr {string} name-end
 * @attr {number} value
 * @attr {number} start
 * @attr {number} end
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {string} label
 * @attr {boolean} range
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @csspart slider
 * @csspart track
 * @csspart range
 * @csspart input
 * @csspart start-input
 * @csspart end-input
 * @csspart value
 * @cssprop --rowan-slider-track-bg
 * @cssprop --rowan-slider-range-bg
 * @cssprop --rowan-slider-thumb-bg
 * @event rowan-change - Fired when a user changes a slider value
 */
export class RowanSlider extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    static componentTokenPrefixes: string[];
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set name(value: string);
    get name(): string;
    set nameStart(value: string);
    get nameStart(): string;
    set nameEnd(value: string);
    get nameEnd(): string;
    set min(value: any);
    get min(): any;
    set max(value: number);
    get max(): number;
    set step(value: any);
    get step(): any;
    set range(value: boolean);
    get range(): boolean;
    set value(value: number | {
        start: number;
        end: number;
    });
    get value(): number | {
        start: number;
        end: number;
    };
    set start(value: number);
    get start(): number;
    set end(value: number);
    get end(): number;
    set label(value: string);
    get label(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    set required(value: boolean);
    get required(): boolean;
    set invalid(value: boolean);
    get invalid(): boolean;
    set formatValue(value: any);
    get formatValue(): any;
    setFormValue(): void;
    setValidity(flags?: {}, message?: string, anchor?: any): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
