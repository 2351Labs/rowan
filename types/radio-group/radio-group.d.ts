/**
 * Group controller for radio options.
 * @tag rowan-radio-group
 * @attr {string} value
 * @attr {string} name
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @slot - rowan-radio children
 * @csspart group
 * @event rowan-change - Fired when selected value changes
 */
export class RowanRadioGroup extends BaseElement {
    set value(value: string);
    get value(): string;
    set name(value: string);
    get name(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    set required(value: boolean);
    get required(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
