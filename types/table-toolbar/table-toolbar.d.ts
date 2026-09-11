/**
 * Table operations surface that tracks selection from a Rowan data table.
 * @tag rowan-table-toolbar
 * @attr {string} for-table
 * @attr {string} label
 * @attr {string} selection-label
 * @slot start - Leading filters or navigation controls
 * @slot selection - Additional content beside the selected-row status
 * @slot - Primary table controls
 * @slot end - Trailing table controls
 * @csspart toolbar
 * @csspart start
 * @csspart selection
 * @csspart selection-text
 * @csspart content
 * @csspart end
 * @cssprop --rowan-table-toolbar-bg
 * @cssprop --rowan-table-toolbar-border
 * @cssprop --rowan-table-toolbar-selection-bg
 */
export class RowanTableToolbar extends BaseElement {
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set table(value: any);
    get table(): any;
    set forTable(value: string);
    get forTable(): string;
    set label(value: string);
    get label(): string;
    set selectionLabel(value: string);
    get selectionLabel(): string;
    get selected(): any[];
    get selectedRows(): any[];
    get selectedCount(): number;
    refresh(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
