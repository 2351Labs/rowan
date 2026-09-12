/**
 * Application navigation controller for rowan-side-nav-item children.
 * @tag rowan-side-nav
 * @attr {string} label
 * @attr {string} value
 * @slot - rowan-side-nav-item nodes
 * @csspart nav
 * @cssprop --rowan-side-nav-gap
 * @event rowan-change - Fired when a user activates a different navigation item.
 */
export class RowanSideNav extends BaseElement {
    static componentTokenPrefixes: string[];
    set label(value: string);
    get label(): string;
    set value(value: string);
    get value(): string;
    /** @returns {RowanSideNavItem | null} */
    get activeItem(): any;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
