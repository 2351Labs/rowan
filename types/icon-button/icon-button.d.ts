/**
 * Icon-only action control.
 * @tag rowan-icon-button
 * @attr {string} label
 * @attr {"primary"|"secondary"|"ghost"|"danger"} variant
 * @attr {"sm"|"md"|"lg"} size
 * @attr {boolean} disabled
 * @attr {"button"|"submit"|"reset"} type
 * @slot - Icon glyph
 * @csspart button
 * @cssprop --rowan-button-bg
 * @cssprop --rowan-button-border-width
 * @cssprop --rowan-button-ghost-bg
 * @cssprop --rowan-button-focus-ring
 * @cssprop --rowan-button-radius
 * @event rowan-click - Fired on activation (not when disabled)
 */
export class RowanIconButton extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    static componentTokenPrefixes: string[];
    set label(value: string);
    get label(): string;
    set variant(value: string);
    get variant(): string;
    set size(value: string);
    get size(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    set type(value: string);
    get type(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
