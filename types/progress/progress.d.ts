/**
 * Determinate progress indicator.
 * @tag rowan-progress
 * @attr {number} value
 * @attr {number} max
 * @attr {string} label
 * @attr {boolean} hide-meta
 * @csspart progress
 * @csspart bar
 * @csspart meta
 */
export class RowanProgress extends BaseElement {
    set value(value: number);
    get value(): number;
    set max(value: number);
    get max(): number;
    set label(value: string);
    get label(): string;
    set hideMeta(value: boolean);
    get hideMeta(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
