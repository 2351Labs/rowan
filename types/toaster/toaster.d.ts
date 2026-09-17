/** @typedef {"info" | "success" | "warning" | "danger"} RowanToastTone */
/**
 * @typedef {"top-start" | "top-end" | "bottom-start" | "bottom-end" | "bottom-center"} RowanToasterPlacement
 */
/**
 * @typedef {object} RowanToastInput
 * @property {string} message
 * @property {string} [id]
 * @property {string} [title]
 * @property {RowanToastTone} [tone]
 * @property {boolean} [dismissible]
 * @property {number} [duration]
 */
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
    /** @param {RowanToasterPlacement} value */
    set placement(value: RowanToasterPlacement);
    /** @returns {RowanToasterPlacement} */
    get placement(): RowanToasterPlacement;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set maxVisible(value: number);
    get maxVisible(): number;
    set duration(value: number);
    get duration(): number;
    /**
     * @param {string | RowanToastInput} input
     * @returns {string | null}
     */
    show(input: string | RowanToastInput): string | null;
    /**
     * @param {string} id
     * @param {string} [reason]
     * @returns {boolean}
     */
    dismiss(id: string, reason?: string | undefined): boolean;
    /** @param {string} [reason] */
    clear(reason?: string | undefined): void;
    #private;
}
export type RowanToastTone = "info" | "success" | "warning" | "danger";
export type RowanToasterPlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end" | "bottom-center";
export type RowanToastInput = {
    message: string;
    id?: string | undefined;
    title?: string | undefined;
    tone?: RowanToastTone | undefined;
    dismissible?: boolean | undefined;
    duration?: number | undefined;
};
import { BaseElement } from "../lib/base-element.js";
