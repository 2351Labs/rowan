/**
 * Focused dialog for confirming consequential actions.
 * @tag rowan-confirm-dialog
 * @attr {boolean} open
 * @attr {string} label
 * @attr {string} confirm-label
 * @attr {string} cancel-label
 * @attr {"primary"|"danger"} confirm-variant
 * @attr {boolean} confirm-disabled
 * @slot title
 * @slot - Supporting content
 * @slot actions - Additional actions placed before the default controls
 * @csspart dialog
 * @csspart actions
 * @csspart cancel
 * @csspart confirm
 * @cssprop --rowan-confirm-dialog-action-gap
 * @event rowan-confirm - Fired when the user confirms the action
 * @event rowan-cancel - Fired when the user cancels using the default control
 * @event rowan-close - Fired when the user passively dismisses the dialog
 */
export class RowanConfirmDialog extends BaseElement {
    set open(value: boolean);
    get open(): boolean;
    set label(value: string);
    get label(): string;
    set confirmLabel(value: string);
    get confirmLabel(): string;
    set cancelLabel(value: string);
    get cancelLabel(): string;
    /** @param {"primary" | "danger"} value */
    set confirmVariant(value: "danger" | "primary");
    /** @returns {"primary" | "danger"} */
    get confirmVariant(): "danger" | "primary";
    set confirmDisabled(value: boolean);
    get confirmDisabled(): boolean;
    show(): void;
    hide(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
