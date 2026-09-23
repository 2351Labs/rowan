/**
 * Registers an icon factory for declarative `<rowan-icon>` use.
 *
 * Individual `@rowan-ui/icons/elements/<name>` imports call this for exactly
 * one icon, preserving the direct-import bundle boundary.
 *
 * @param {string} name
 * @param {(options?: import("./icon.js").IconOptions) => SVGSVGElement} factory
 */
export function registerIcon(name: string, factory: (options?: import("./icon.js").IconOptions) => SVGSVGElement): void;
/**
 * Declarative SVG icon registered by an individual `@rowan-ui/icons/elements/*` import.
 * @tag rowan-icon
 * @attr {string} name
 * @attr {string} size
 * @attr {string} stroke-width
 * @attr {string} label
 * @attr {"none"|"info"|"success"|"warning"|"danger"} tone
 * @csspart icon
 */
export class RowanIcon extends HTMLElement {
    static observedAttributes: string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set name(value: string);
    get name(): string;
    set size(value: string);
    get size(): string;
    set strokeWidth(value: string);
    get strokeWidth(): string;
    set label(value: string);
    get label(): string;
    /** @param {"none" | "info" | "success" | "warning" | "danger"} value */
    set tone(value: "none" | "info" | "success" | "warning" | "danger");
    /** @returns {"none" | "info" | "success" | "warning" | "danger"} */
    get tone(): "none" | "info" | "success" | "warning" | "danger";
    #private;
}
