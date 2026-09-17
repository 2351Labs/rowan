/**
 * Compact pill for lightweight metadata.
 * @tag rowan-chip
 * @attr {"info"|"success"|"warning"|"danger"} tone
 * @attr {"sm"|"md"|"lg"} size
 * @slot - Label text
 * @slot prefix
 * @slot suffix
 * @csspart chip
 * @cssprop --rowan-chip-bg
 * @cssprop --rowan-chip-border
 * @cssprop --rowan-chip-fg
 * @cssprop --rowan-chip-success-bg
 * @cssprop --rowan-chip-warning-bg
 * @cssprop --rowan-chip-danger-bg
 */
export class RowanChip extends BaseElement {
    /** @param {"info" | "success" | "warning" | "danger"} value */
    set tone(value: "info" | "success" | "warning" | "danger");
    /** @returns {"info" | "success" | "warning" | "danger"} */
    get tone(): "info" | "success" | "warning" | "danger";
    /** @param {"sm" | "md" | "lg"} value */
    set size(value: "sm" | "md" | "lg");
    /** @returns {"sm" | "md" | "lg"} */
    get size(): "sm" | "md" | "lg";
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
}
import { BaseElement } from "../lib/base-element.js";
