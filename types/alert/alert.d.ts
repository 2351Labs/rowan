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
    set tone(value: string);
    get tone(): string;
    set dismissible(value: boolean);
    get dismissible(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
