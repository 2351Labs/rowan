/**
 * Triggered dropdown surface.
 * @tag rowan-dropdown
 * @attr {boolean} open
 * @attr {string} label
 * @slot - Dropdown content
 * @slot trigger - Optional custom trigger. The default secondary button is used when this slot is empty.
 * @csspart trigger
 * @csspart panel
 * @event rowan-change - Fired when a user toggles or dismisses the dropdown
 */
export class RowanDropdown extends BaseElement {
    set open(value: boolean);
    get open(): boolean;
    set label(value: string);
    get label(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
