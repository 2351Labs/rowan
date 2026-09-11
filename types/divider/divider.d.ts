/**
 * Visual separator line.
 * @tag rowan-divider
 * @attr {"horizontal"|"vertical"} orientation
 * @csspart divider
 */
export class RowanDivider extends BaseElement {
    set orientation(value: string);
    get orientation(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
