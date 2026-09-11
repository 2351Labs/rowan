/**
 * Triggered dropdown surface.
 * @tag rowan-dropdown
 * @attr {boolean} open
 * @attr {string} label
 * @slot - Dropdown content
 * @csspart trigger
 * @csspart panel
 * @event rowan-change - Fired when open state changes
 */
export class RowanDropdown extends BaseElement {
    set open(value: boolean);
    get open(): boolean;
    set label(value: string);
    get label(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
