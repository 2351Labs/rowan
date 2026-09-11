/**
 * Contextual bulk actions for selected rows in a Rowan data table.
 * @tag rowan-bulk-actions-bar
 * @attr {string} for-table
 * @attr {string} label
 * @attr {string} selection-label
 * @attr {string} clear-label
 * @attr {boolean} disabled
 * @slot label - Content before the selected-row status
 * @slot - Additional bulk action controls with data-bulk-action
 * @slot end - Trailing controls after the default clear action
 * @csspart bar
 * @csspart summary
 * @csspart selection-text
 * @csspart actions
 * @csspart configured-actions
 * @csspart end
 * @csspart clear-button
 * @cssprop --rowan-bulk-actions-bar-bg
 * @cssprop --rowan-bulk-actions-bar-border
 * @cssprop --rowan-bulk-actions-bar-selection-bg
 * @event rowan-bulk-action - Fired when a configured or marked bulk action activates
 * @event rowan-clear-selection - Fired when a user clears the current selection
 */
export class RowanBulkActionsBar extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set table(value: any);
    get table(): any;
    set forTable(value: string);
    get forTable(): string;
    set label(value: string);
    get label(): string;
    set selectionLabel(value: string);
    get selectionLabel(): string;
    set clearLabel(value: string);
    get clearLabel(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    set actions(value: any[]);
    get actions(): any[];
    get selected(): any[];
    get selectedRows(): any[];
    get selectedCount(): number;
    refresh(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
