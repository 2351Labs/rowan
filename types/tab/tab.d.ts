/**
 * Single tab button.
 * @tag rowan-tab
 * @attr {string} value
 * @attr {boolean} active
 * @slot - Label
 * @csspart tab
 */
export class RowanTab extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set value(value: string);
    get value(): string;
    set active(value: boolean);
    get active(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
