/**
 * Primary action control.
 * @tag rowan-button
 * @attr {"primary"|"secondary"|"ghost"|"danger"} variant
 * @attr {"sm"|"md"|"lg"} size
 * @attr {boolean} disabled
 * @attr {boolean} loading
 * @attr {"button"|"submit"|"reset"} type
 * @slot - Label
 * @slot prefix
 * @slot suffix
 * @csspart button
 * @csspart prefix
 * @csspart suffix
 * @csspart spinner
 * @cssprop --rowan-button-bg
 * @cssprop --rowan-button-border-width
 * @cssprop --rowan-button-hover-bg
 * @cssprop --rowan-button-active-bg
 * @cssprop --rowan-button-secondary-bg
 * @cssprop --rowan-button-ghost-bg
 * @cssprop --rowan-button-danger-bg
 * @cssprop --rowan-button-focus-ring
 * @cssprop --rowan-button-radius
 * @cssprop --rowan-button-padding-inline
 * @event rowan-click - Fired on activation (not when disabled)
 */
export class RowanButton extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    static componentTokenPrefixes: string[];
    set variant(value: string);
    get variant(): string;
    set size(value: string);
    get size(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    set loading(value: boolean);
    get loading(): boolean;
    set type(value: string);
    get type(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
