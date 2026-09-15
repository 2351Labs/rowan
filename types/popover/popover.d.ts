/**
 * Inline popover surface.
 * @tag rowan-popover
 * @attr {boolean} open
 * @attr {string} label
 * @slot trigger
 * @slot - Content
 * @csspart trigger
 * @csspart panel
 * @event rowan-change - Fired when a user toggles or dismisses the popover
 */
export class RowanPopover extends BaseElement {
    set open(value: boolean);
    get open(): boolean;
    set label(value: string);
    get label(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
