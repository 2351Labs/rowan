/**
 * Side-panel detail view for a selected Rowan data-table row.
 * @tag rowan-row-details-panel
 * @attr {boolean} open
 * @attr {"start"|"end"} side
 * @attr {"sm"|"md"|"lg"} size
 * @attr {string} for-table
 * @attr {string} row-id
 * @attr {string} label
 * @attr {string} close-label
 * @property {string[]} rowIds - Queue of row ids for previous/next. Arrays are property-only.
 * @slot title - Custom panel title
 * @slot empty - Content shown when no row is available
 * @slot pager - Replaces the default previous/next controls
 * @slot - Supplemental detail content
 * @slot actions - Panel actions
 * @csspart overlay
 * @csspart panel
 * @csspart header
 * @csspart title
 * @csspart close
 * @csspart pager
 * @csspart body
 * @csspart fields
 * @csspart field
 * @csspart empty
 * @csspart actions
 * @cssprop --rowan-row-details-panel-bg
 * @cssprop --rowan-row-details-panel-border
 * @cssprop --rowan-row-details-panel-width
 * @event rowan-close - Fired when the user dismisses the panel
 * @event rowan-navigate - Fired when the user moves to another queued row
 */
export class RowanRowDetailsPanel extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set table(value: null);
    get table(): null;
    set forTable(value: string);
    get forTable(): string;
    set row(value: null);
    get row(): null;
    set rowId(value: string);
    get rowId(): string;
    /** @param {string[]} value */
    set rowIds(value: string[]);
    /** @returns {string[]} */
    get rowIds(): string[];
    /** @param {"sm" | "md" | "lg"} value */
    set size(value: "sm" | "md" | "lg");
    /** @returns {"sm" | "md" | "lg"} */
    get size(): "sm" | "md" | "lg";
    set fields(value: any[]);
    get fields(): any[];
    set open(value: boolean);
    get open(): boolean;
    set side(value: "start" | "end");
    get side(): "start" | "end";
    set label(value: string);
    get label(): string;
    set closeLabel(value: string);
    get closeLabel(): string;
    show(row?: null, rowId?: string): void;
    hide(): void;
    refresh(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
