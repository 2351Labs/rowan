/**
 * Visual separator line.
 * @tag rowan-divider
 * @attr {"horizontal"|"vertical"} orientation
 * @csspart divider
 */
export class RowanDivider extends BaseElement {
    /** @param {"horizontal" | "vertical"} value */
    set orientation(value: "vertical" | "horizontal");
    /** @returns {"horizontal" | "vertical"} */
    get orientation(): "vertical" | "horizontal";
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
