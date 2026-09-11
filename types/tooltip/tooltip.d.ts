/**
 * Lightweight tooltip text.
 * @tag rowan-tooltip
 * @attr {string} text
 * @attr {boolean} open
 * @slot - Trigger element
 * @csspart trigger
 * @csspart tooltip
 */
export class RowanTooltip extends BaseElement {
    set text(value: string);
    get text(): string;
    set open(value: boolean);
    get open(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
