/**
 * Toast queue manager with mobile-first placement and auto-dismiss handling.
 * @tag rowan-toaster
 * @attr {"top-start"|"top-end"|"bottom-start"|"bottom-end"|"bottom-center"} placement
 * @attr {number} max-visible
 * @attr {number} duration
 * @csspart stack
 * @event rowan-toast-show - Fired when a toast is shown
 * @event rowan-toast-dismiss - Fired when a toast is dismissed
 */
export class RowanToaster extends BaseElement {
    set placement(value: string);
    get placement(): string;
    set maxVisible(value: number);
    get maxVisible(): number;
    set duration(value: number);
    get duration(): number;
    show(input: any): any;
    dismiss(id: any, reason?: string): boolean;
    clear(reason?: string): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
