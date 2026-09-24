/**
 * Labeled group of destinations inside rowan-side-nav.
 * Opt-in `collapsible` adds a disclosure control. `collapsed` defaults false
 * (open). The parent nav still has one `value`; this host is not a destination.
 * @tag rowan-side-nav-section
 * @attr {string} label
 * @attr {boolean} collapsible
 * @attr {boolean} collapsed
 * @slot - rowan-side-nav-item children
 * @csspart section
 * @csspart label
 * @csspart trigger
 * @csspart items
 * @cssprop --rowan-side-nav-section-gap
 * @cssprop --rowan-side-nav-section-label-fg
 * @cssprop --rowan-side-nav-section-label-font-size
 * @cssprop --rowan-side-nav-section-label-padding
 * @event rowan-toggle - Fired when a user expands or collapses a collapsible section
 */
export class RowanSideNavSection extends BaseElement {
    set label(value: string);
    get label(): string;
    set collapsible(value: boolean);
    get collapsible(): boolean;
    set collapsed(value: boolean);
    get collapsed(): boolean;
    /** @returns {boolean} */
    get expanded(): boolean;
    focusTrigger(): void;
    toggleFromUser(collapsed?: boolean): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
