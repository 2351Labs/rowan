/**
 * Labeled group of destinations inside rowan-side-nav.
 * @tag rowan-side-nav-section
 * @attr {string} label
 * @slot - rowan-side-nav-item children
 * @csspart section
 * @csspart label
 */
export class RowanSideNavSection extends BaseElement {
    set label(value: string);
    get label(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
