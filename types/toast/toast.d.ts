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
    /** @param {"info" | "success" | "warning" | "danger"} value */
    set tone(value: "info" | "success" | "warning" | "danger");
    /** @returns {"info" | "success" | "warning" | "danger"} */
    get tone(): "info" | "success" | "warning" | "danger";
    set dismissible(value: boolean);
    get dismissible(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
