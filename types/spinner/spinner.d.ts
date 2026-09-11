/**
 * Inline loading indicator.
 * @tag rowan-spinner
 * @attr {"sm"|"md"|"lg"} size
 * @attr {string} label
 * @csspart spinner
 */
export class RowanSpinner extends BaseElement {
    set size(value: string);
    get size(): string;
    set label(value: string);
    get label(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
