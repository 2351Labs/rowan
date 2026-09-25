/**
 * Table operations surface for filters and density. Selection count hides when a bulk-actions-bar is on the same table.
 * @tag rowan-table-toolbar
 * @attr {string} for-table
 * @attr {string} label
 * @attr {string} selection-label
 * @attr {boolean} column-picker
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
 * @csspart column-picker
 * @csspart column-picker-menu
 * @cssprop --rowan-table-toolbar-bg
 * @cssprop --rowan-table-toolbar-border
 * @cssprop --rowan-table-toolbar-selection-bg
 */
export class RowanTableToolbar extends BaseElement {
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set table(value: null);
    get table(): null;
    set forTable(value: string);
    get forTable(): string;
    set label(value: string);
    get label(): string;
    set selectionLabel(value: string);
    get selectionLabel(): string;
    set columnPicker(value: boolean);
    get columnPicker(): boolean;
    get selected(): any[];
    get selectedRows(): any[];
    get selectedCount(): number;
    refresh(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
