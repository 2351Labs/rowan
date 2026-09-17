/**
 * Application navigation controller for rowan-side-nav-item children.
 * @tag rowan-side-nav
 * @attr {string} label
 * @attr {string} value
 * @slot - rowan-side-nav-item and optional rowan-side-nav-section nodes
 * @csspart nav
 * @cssprop --rowan-side-nav-gap
 * @event rowan-change - Fired when a user activates a different navigation item. Cancelable when the item has an in-app href; preventDefault to block navigation.
 */
export class RowanSideNav extends BaseElement {
    set label(value: string);
    get label(): string;
    set value(value: string);
    get value(): string;
    /** @returns {RowanSideNavItem | null} */
    get activeItem(): any;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
