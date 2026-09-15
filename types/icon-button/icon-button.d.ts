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
    /** @param {"primary" | "secondary" | "ghost" | "danger"} value */
    set variant(value: "danger" | "primary" | "secondary" | "ghost");
    /** @returns {"primary" | "secondary" | "ghost" | "danger"} */
    get variant(): "danger" | "primary" | "secondary" | "ghost";
    /** @param {"sm" | "md" | "lg"} value */
    set size(value: "sm" | "md" | "lg");
    /** @returns {"sm" | "md" | "lg"} */
    get size(): "sm" | "md" | "lg";
    set disabled(value: boolean);
    get disabled(): boolean;
    /** @param {"button" | "submit" | "reset"} value */
    set type(value: "button" | "submit" | "reset");
    /** @returns {"button" | "submit" | "reset"} */
    get type(): "button" | "submit" | "reset";
    #private;
}
import { BaseElement } from "../lib/base-element.js";
