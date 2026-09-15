/**
 * Compact label for status and metadata.
 * @tag rowan-badge
 * @attr {"info"|"success"|"warning"|"danger"} tone
 * @attr {"sm"|"md"|"lg"} size
 * @slot - Label text
 * @csspart badge
 */
export class RowanBadge extends BaseElement {
    /** @param {"info" | "success" | "warning" | "danger"} value */
    set tone(value: "info" | "success" | "warning" | "danger");
    /** @returns {"info" | "success" | "warning" | "danger"} */
    get tone(): "info" | "success" | "warning" | "danger";
    /** @param {"sm" | "md" | "lg"} value */
    set size(value: "sm" | "md" | "lg");
    /** @returns {"sm" | "md" | "lg"} */
    get size(): "sm" | "md" | "lg";
}
import { BaseElement } from "../lib/base-element.js";
