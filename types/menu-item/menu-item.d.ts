/**
 * Selectable menu item.
 * @tag rowan-menu-item
 * @attr {string} value
 * @attr {boolean} disabled
 * @slot - Item label
 * @csspart item
 */
export class RowanMenuItem extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set value(value: string);
    get value(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
