/**
 * Side-panel detail view for a selected Rowan data-table row.
 * @tag rowan-row-details-panel
 * @attr {boolean} open
 * @attr {"start"|"end"} side
 * @attr {string} for-table
 * @attr {string} row-id
 * @attr {string} label
 * @attr {string} close-label
 * @slot title - Custom panel title
 * @slot empty - Content shown when no row is available
 * @slot - Supplemental detail content
 * @slot actions - Panel actions
 * @csspart overlay
 * @csspart backdrop
 * @csspart panel
 * @csspart header
 * @csspart title
 * @csspart close
 * @csspart body
 * @csspart fields
 * @csspart field
 * @csspart empty
 * @csspart actions
 * @cssprop --rowan-row-details-panel-bg
 * @cssprop --rowan-row-details-panel-border
 * @event rowan-close - Fired when the user dismisses the panel
 */
export class RowanRowDetailsPanel extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set table(value: any);
    get table(): any;
    set forTable(value: string);
    get forTable(): string;
    set row(value: any);
    get row(): any;
    set rowId(value: string);
    get rowId(): string;
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
    show(row?: any, rowId?: string): void;
    hide(): void;
    refresh(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
