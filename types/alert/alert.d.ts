/**
 * Status message surface with optional dismissal.
 * @tag rowan-alert
 * @attr {"info"|"success"|"warning"|"danger"} tone
 * @attr {boolean} dismissible
 * @slot - Alert message
 * @csspart alert
 * @csspart dismiss
 * @event rowan-dismiss - Fired when dismissed by user interaction
 */
export class RowanAlert extends BaseElement {
    /** @param {"info" | "success" | "warning" | "danger"} value */
    set tone(value: "info" | "success" | "warning" | "danger");
    /** @returns {"info" | "success" | "warning" | "danger"} */
    get tone(): "info" | "success" | "warning" | "danger";
    set dismissible(value: boolean);
    get dismissible(): boolean;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
