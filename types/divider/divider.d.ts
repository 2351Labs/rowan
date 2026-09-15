/**
 * Visual separator line.
 * @tag rowan-divider
 * @attr {"horizontal"|"vertical"} orientation
 * @csspart divider
 */
export class RowanDivider extends BaseElement {
    /** @param {"horizontal" | "vertical"} value */
    set orientation(value: "horizontal" | "vertical");
    /** @returns {"horizontal" | "vertical"} */
    get orientation(): "horizontal" | "vertical";
    #private;
}
import { BaseElement } from "../lib/base-element.js";
