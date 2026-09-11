/**
 * Compact label for status and metadata.
 * @tag rowan-badge
 * @attr {"info"|"success"|"warning"|"danger"} tone
 * @attr {"sm"|"md"|"lg"} size
 * @slot - Label text
 * @csspart badge
 */
export class RowanBadge extends BaseElement {
    set tone(value: string);
    get tone(): string;
    set size(value: string);
    get size(): string;
}
import { BaseElement } from "../lib/base-element.js";
