/**
 * Modal dialog surface.
 * @tag rowan-dialog
 * @attr {boolean} open
 * @slot title
 * @slot - Content
 * @slot actions
 * @csspart overlay
 * @csspart backdrop
 * @csspart panel
 * @csspart close
 * @event rowan-close - Fired when the user dismisses the dialog
 */
export class RowanDialog extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set open(value: boolean);
    get open(): boolean;
    show(): void;
    hide(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
