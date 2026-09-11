/**
 * Inline popover surface.
 * @tag rowan-popover
 * @attr {boolean} open
 * @slot trigger
 * @slot - Content
 * @csspart trigger
 * @csspart panel
 */
export class RowanPopover extends BaseElement {
    set open(value: boolean);
    get open(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
