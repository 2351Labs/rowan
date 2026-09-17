/**
 * Controlled sequence of slotted content panels.
 * @tag rowan-carousel
 * @attr {number} active-index
 * @attr {string} label
 * @slot - Carousel panels
 * @csspart carousel
 * @csspart viewport
 * @csspart controls
 * @csspart previous-button
 * @csspart status
 * @csspart next-button
 * @cssprop --rowan-carousel-border
 * @cssprop --rowan-carousel-control-bg
 * @cssprop --rowan-carousel-control-fg
 * @cssprop --rowan-carousel-focus-ring
 * @event rowan-change - Fired when a user changes the active panel
 */
export class RowanCarousel extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set activeIndex(value: number);
    get activeIndex(): number;
    set label(value: string);
    get label(): string;
    previous(): void;
    next(): void;
    /**
     * Activates a panel without emitting `rowan-change`.
     * @param {number} index
     */
    goTo(index: number): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
