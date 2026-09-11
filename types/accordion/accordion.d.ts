/**
 * Expandable disclosure section.
 * @tag rowan-accordion
 * @attr {boolean} open
 * @attr {string} summary
 * @slot - Body content
 * @slot summary
 * @csspart trigger
 * @csspart panel
 * @event rowan-change - Fired when open state changes
 */
export class RowanAccordion extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set open(value: boolean);
    get open(): boolean;
    set summary(value: string);
    get summary(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
