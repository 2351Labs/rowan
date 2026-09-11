/**
 * Configurable filter editor that composes with a Rowan data table.
 * @tag rowan-filter-builder
 * @attr {string} for-table
 * @attr {string} label
 * @attr {string} add-label
 * @attr {string} clear-label
 * @attr {boolean} disabled
 * @slot actions - Controls displayed beside the filter actions
 * @csspart builder
 * @csspart header
 * @csspart filters
 * @csspart filter
 * @csspart field-select
 * @csspart operator-select
 * @csspart value-control
 * @csspart add-button
 * @csspart clear-button
 * @cssprop --rowan-filter-builder-bg
 * @cssprop --rowan-filter-builder-border
 * @cssprop --rowan-filter-builder-control-bg
 * @event rowan-filter-change - Fired when the user adds, updates, removes, or clears a filter
 */
export class RowanFilterBuilder extends BaseElement {
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set table(value: any);
    get table(): any;
    set forTable(value: string);
    get forTable(): string;
    set fields(value: any[]);
    get fields(): any[];
    set filters(value: any[]);
    get filters(): any[];
    set label(value: string);
    get label(): string;
    set addLabel(value: string);
    get addLabel(): string;
    set clearLabel(value: string);
    get clearLabel(): string;
    set disabled(value: boolean);
    get disabled(): boolean;
    addFilter(value?: {}): any;
    removeFilter(id: any): boolean;
    clearFilters(): boolean;
    refresh(): void;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
