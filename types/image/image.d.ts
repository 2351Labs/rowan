/**
 * Experimental image display. Overlay and caption are slots. Optional href is a
 * real link around the image, not around overlay actions.
 * @tag rowan-image
 * @attr {string} src
 * @attr {string} alt
 * @attr {string} href
 * @attr {"cover"|"contain"} fit
 * @attr {"lazy"|"eager"} loading
 * @slot overlay - Actions and badges on top of the image. Not inside the link.
 * @slot caption
 * @slot fallback - Shown when src is missing or the image fails.
 * @csspart control
 * @csspart frame
 * @csspart image
 * @csspart overlay
 * @csspart caption
 * @csspart fallback
 * @cssprop --rowan-image-bg
 * @cssprop --rowan-image-radius
 * @cssprop --rowan-image-aspect
 */
export class RowanImage extends BaseElement {
    set src(value: string);
    get src(): string;
    set alt(value: string);
    get alt(): string;
    set href(value: string);
    get href(): string;
    /** @param {"cover" | "contain"} value */
    set fit(value: "cover" | "contain");
    /** @returns {"cover" | "contain"} */
    get fit(): "cover" | "contain";
    /** @param {"lazy" | "eager"} value */
    set loading(value: "lazy" | "eager");
    /** @returns {"lazy" | "eager"} */
    get loading(): "lazy" | "eager";
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
