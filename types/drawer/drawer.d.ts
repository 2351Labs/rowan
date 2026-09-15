/**
 * Side panel drawer.
 * @tag rowan-drawer
 * @attr {boolean} open
 * @attr {"start"|"end"} side
 * @slot - Drawer content
 * @slot title
 * @csspart overlay
 * @csspart panel
 * @csspart title
 * @csspart close
 * @event rowan-change - Fired when the user closes the drawer
 */
export class RowanDrawer extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set open(value: boolean);
    get open(): boolean;
    /** @param {"start" | "end"} value */
    set side(value: "start" | "end");
    /** @returns {"start" | "end"} */
    get side(): "start" | "end";
    #private;
}
import { BaseElement } from "../lib/base-element.js";
