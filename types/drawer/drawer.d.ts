/**
 * Side panel drawer.
 * @tag rowan-drawer
 * @attr {boolean} open
 * @attr {"start"|"end"} side
 * @slot - Drawer content
 * @slot title
 * @csspart backdrop
 * @csspart panel
 * @event rowan-change - Fired when open changes
 */
export class RowanDrawer extends BaseElement {
    set open(value: boolean);
    get open(): boolean;
    set side(value: string);
    get side(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
