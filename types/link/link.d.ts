/**
 * Text navigation link.
 * @tag rowan-link
 * @attr {string} href
 * @attr {string} target
 * @attr {boolean} external
 * @attr {boolean} disabled
 * @slot - Link text
 * @csspart link
 * @event rowan-click - Fired when activated (not when disabled)
 */
export class RowanLink extends BaseElement {
    set href(value: string);
    get href(): string;
    set target(value: string);
    get target(): string;
    set external(value: boolean);
    get external(): boolean;
    set disabled(value: boolean);
    get disabled(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
