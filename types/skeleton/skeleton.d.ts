/**
 * Loading placeholder block.
 * @tag rowan-skeleton
 * @attr {"text"|"rect"|"circle"} shape
 * @attr {string} width
 * @attr {string} height
 * @attr {boolean} animated
 * @csspart skeleton
 */
export class RowanSkeleton extends BaseElement {
    set shape(value: string);
    get shape(): string;
    set width(value: string);
    get width(): string;
    set height(value: string);
    get height(): string;
    set animated(value: boolean);
    get animated(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
