/**
 * Circular user avatar with image fallback.
 * @tag rowan-avatar
 * @attr {string} name
 * @attr {string} src
 * @attr {string} alt
 * @attr {"sm"|"md"|"lg"} size
 * @csspart avatar
 * @csspart image
 * @csspart initials
 */
export class RowanAvatar extends BaseElement {
    set name(value: string);
    get name(): string;
    set src(value: string);
    get src(): string;
    set alt(value: string);
    get alt(): string;
    /** @param {"sm" | "md" | "lg"} value */
    set size(value: "sm" | "md" | "lg");
    /** @returns {"sm" | "md" | "lg"} */
    get size(): "sm" | "md" | "lg";
    #private;
}
import { BaseElement } from "../lib/base-element.js";
