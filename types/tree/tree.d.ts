/**
 * Hierarchical navigation controller for rowan-tree-item nodes.
 * @tag rowan-tree
 * @attr {string} label
 * @attr {"none"|"single"|"multiple"} selection
 * @property {string[]} selected - Selected item values. Arrays are property-only.
 * @slot - Direct rowan-tree-item nodes
 * @csspart tree
 * @cssprop --rowan-tree-fg
 * @event rowan-change - Fired when a user changes the selection
 * @event rowan-toggle - Fired when a user expands or collapses an item
 */
export class RowanTree extends BaseElement {
    set label(value: string);
    get label(): string;
    /** @param {RowanTreeSelection} value */
    set selection(value: RowanTreeSelection);
    /** @returns {RowanTreeSelection} */
    get selection(): RowanTreeSelection;
    /** @param {string[]} value */
    set selected(value: string[]);
    /** @returns {string[]} */
    get selected(): string[];
    /** @returns {HTMLElement[]} */
    get selectedItems(): HTMLElement[];
    clearSelection(): void;
    #private;
}
export type RowanTreeSelection = "none" | "single" | "multiple";
import { BaseElement } from "../lib/base-element.js";
