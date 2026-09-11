/**
 * Compact status notification with optional dismiss control.
 * @tag rowan-toast
 * @attr {"info"|"success"|"warning"|"danger"} tone
 * @attr {boolean} dismissible
 * @slot title
 * @slot - Notification message
 * @slot actions
 * @csspart toast
 * @csspart close
 * @event rowan-dismiss - Fired when dismissed by user interaction
 */
export class RowanToast extends BaseElement {
    set tone(value: string);
    get tone(): string;
    set dismissible(value: boolean);
    get dismissible(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
