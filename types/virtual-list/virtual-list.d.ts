/**
 * Virtualized, keyed collection for large property-driven item sets.
 * @tag rowan-virtual-list
 * @attr {number} item-size
 * @attr {number} overscan
 * @property {Array<unknown>} items - Property-only item data.
 * @property {string | ((item: unknown, index: number) => string | number)} itemKey - Stable item key accessor.
 * @property {((item: unknown, index: number, itemEl: HTMLElement) => Node | string | void) | null} renderItem - Renders a visible item.
 * @csspart viewport
 * @csspart content
 * @csspart items
 * @csspart item
 * @cssprop --rowan-virtual-list-height
 * @cssprop --rowan-virtual-list-bg
 * @cssprop --rowan-virtual-list-border-color
 * @cssprop --rowan-virtual-list-radius
 * @cssprop --rowan-virtual-list-fg
 */
export class RowanVirtualList extends BaseElement {
    static componentTokenPrefixes: string[];
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    /** @param {unknown[]} value */
    set items(value: unknown[]);
    /** @returns {unknown[]} */
    get items(): unknown[];
    /** @param {string | ((item: unknown, index: number) => string | number) | null} value */
    set itemKey(value: string | ((item: unknown, index: number) => string | number));
    /** @returns {string | ((item: unknown, index: number) => string | number) | null} */
    get itemKey(): string | ((item: unknown, index: number) => string | number);
    /** @param {((item: unknown, index: number, itemEl: HTMLElement) => Node | string | void) | null} value */
    set renderItem(value: (item: unknown, index: number, itemEl: HTMLElement) => Node | string | void);
    /** @returns {((item: unknown, index: number, itemEl: HTMLElement) => Node | string | void) | null} */
    get renderItem(): (item: unknown, index: number, itemEl: HTMLElement) => Node | string | void;
    /** @param {number} value */
    set itemSize(value: number);
    /** @returns {number} */
    get itemSize(): number;
    /** @param {number} value */
    set overscan(value: number);
    /** @returns {number} */
    get overscan(): number;
    /**
     * Scrolls an item into the list's rendered window.
     * @param {number} index
     * @param {{ align?: "auto" | "start" | "center" | "end" }} [options]
     */
    scrollToIndex(index: number, options?: {
        align?: "auto" | "start" | "center" | "end";
    }): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
