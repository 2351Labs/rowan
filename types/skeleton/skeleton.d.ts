/**
 * Loading placeholder block.
 * @tag rowan-skeleton
 * @attr {"text"|"rect"|"circle"} shape
 * @attr {string} width
 * @attr {string} height
 * @attr {boolean} animated
 * @csspart skeleton
 * @cssprop --rowan-skeleton-base
 * @cssprop --rowan-skeleton-highlight
 * @cssprop --rowan-skeleton-shimmer-duration
 */
export class RowanSkeleton extends BaseElement {
    static componentTokenPrefixes: string[];
    /** @param {"text" | "rect" | "circle"} value */
    set shape(value: "circle" | "rect" | "text");
    /** @returns {"text" | "rect" | "circle"} */
    get shape(): "circle" | "rect" | "text";
    set width(value: string);
    get width(): string;
    set height(value: string);
    get height(): string;
    set animated(value: boolean);
    get animated(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
