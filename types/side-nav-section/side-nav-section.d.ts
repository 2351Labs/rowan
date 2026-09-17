/**
 * Labeled group of destinations inside rowan-side-nav.
 * @tag rowan-side-nav-section
 * @attr {string} label
 * @slot - rowan-side-nav-item children
 * @csspart section
 * @csspart label
 * @cssprop --rowan-side-nav-section-gap
 * @cssprop --rowan-side-nav-section-label-fg
 * @cssprop --rowan-side-nav-section-label-font-size
 * @cssprop --rowan-side-nav-section-label-padding
 */
export class RowanSideNavSection extends BaseElement {
    set label(value: string);
    get label(): string;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
