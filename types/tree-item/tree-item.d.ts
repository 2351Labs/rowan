/**
 * Individual node within a hierarchical tree.
 * @tag rowan-tree-item
 * @attr {string} value
 * @attr {boolean} expanded
 * @attr {boolean} selected
 * @attr {boolean} disabled
 * @attr {number} level
 * @slot - Item label
 * @slot prefix
 * @slot children - Nested rowan-tree-item nodes
 * @csspart item
 * @csspart toggle
 * @csspart label
 * @csspart children
 * @cssprop --rowan-tree-item-fg
 * @cssprop --rowan-tree-item-hover-bg
 * @cssprop --rowan-tree-item-selected-bg
 * @cssprop --rowan-tree-item-children-border
 */
export class RowanTreeItem extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    set value(value: string);
    get value(): string;
    set expanded(value: boolean);
    get expanded(): boolean;
    set selected(value: boolean);
    get selected(): boolean;
    set disabled(value: boolean);
    get disabled(): boolean;
    set level(value: number);
    get level(): number;
    get hasChildren(): boolean;
    focus(options: any): void;
    /** @internal */
    setRovingTabIndex(value: any, owner?: any): void;
    /** @internal */
    setTreePosition(position: any, setSize: any, owner?: any): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
