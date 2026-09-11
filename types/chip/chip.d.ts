/**
 * Compact pill for lightweight metadata.
 * @tag rowan-chip
 * @attr {"info"|"success"|"warning"|"danger"} tone
 * @attr {"sm"|"md"|"lg"} size
 * @slot - Label text
 * @slot prefix
 * @slot suffix
 * @csspart chip
 */
export class RowanChip extends BaseElement {
    set tone(value: string);
    get tone(): string;
    set size(value: string);
    get size(): string;
}
import { BaseElement } from "../lib/base-element.js";
