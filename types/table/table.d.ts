/**
 * Config-driven data table.
 * @tag rowan-table
 * @attr {"none"|"single"|"multiple"} selectable
 * @attr {"sm"|"md"|"lg"} density
 * @attr {boolean} sticky-header
 * @attr {boolean} loading
 * @attr {string} caption
 * @attr {boolean} virtualized
 * @attr {number} virtual-item-size
 * @attr {number} virtual-overscan
 * @property {object} config - Replaces the complete table configuration.
 * @property {Array<object>} columns - Updates columns without replacing other configuration.
 * @property {Array<object>} rows - Updates rows without replacing other configuration.
 * @property {Array<string>} selected - Updates selected row IDs without replacing other configuration.
 * @property {boolean} virtualized - Renders a measured, bounded row window inside the table viewport.
 * @property {number} virtualItemSize - Estimated row height used before a row is measured.
 * @property {number} virtualOverscan - Extra rows mounted before and after the visible window.
 * @slot toolbar
 * @slot caption
 * @slot empty
 * @slot footer
 * @csspart table
 * @csspart thead
 * @csspart tbody
 * @csspart tr
 * @csspart th
 * @csspart td
 * @csspart caption
 * @csspart toolbar
 * @csspart viewport
 * @csspart spacer
 * @cssprop --rowan-table-virtual-height
 * @event rowan-sort - Fired when a sortable header changes direction
 * @event rowan-select - Fired when row selection changes
 * @event rowan-cell-change - Fired when checkbox cell value changes
 * @event rowan-cell-action - Fired when link or button cell activates
 * @event rowan-page-change - Fired when pagination changes
 * @event rowan-row-activate - Fired on row activation by keyboard or double click
 */
export class RowanTable extends BaseElement {
    static componentTokenPrefixes: string[];
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    /** @param {RowanTableConfig | null | undefined} value */
    set config(value: RowanTableConfig);
    /** @returns {RowanTableConfig} */
    get config(): RowanTableConfig;
    set caption(value: string);
    get caption(): string;
    set density(value: string);
    get density(): string;
    set selectable(value: string);
    get selectable(): string;
    set stickyHeader(value: boolean);
    get stickyHeader(): boolean;
    set loading(value: boolean);
    get loading(): boolean;
    /** @param {boolean} value */
    set virtualized(value: boolean);
    /** @returns {boolean} */
    get virtualized(): boolean;
    /** @param {number} value */
    set virtualItemSize(value: number);
    /** @returns {number} */
    get virtualItemSize(): number;
    /** @param {number} value */
    set virtualOverscan(value: number);
    /** @returns {number} */
    get virtualOverscan(): number;
    /** @param {RowanTableColumn[]} value */
    set columns(value: RowanTableColumn[]);
    /** @returns {RowanTableColumn[]} */
    get columns(): RowanTableColumn[];
    /** @param {RowanTableRow[]} value */
    set rows(value: Record<string, unknown>[]);
    /** @returns {RowanTableRow[]} */
    get rows(): Record<string, unknown>[];
    /** @param {string[]} value */
    set selected(value: string[]);
    /** @returns {string[]} */
    get selected(): string[];
    /** @param {RowanTableSort | null} value */
    set sort(value: RowanTableSort);
    /** @returns {RowanTableSort | null} */
    get sort(): RowanTableSort;
    /** @param {RowanTablePage | null} value */
    set page(value: RowanTablePage);
    /** @returns {RowanTablePage | null} */
    get page(): RowanTablePage;
    /** @returns {RowanTableRow[]} */
    get selectedRows(): Record<string, unknown>[];
    selectAll(): void;
    clearSelection(): void;
    /**
     * @param {string} id
     * @param {"asc" | "desc"} dir
     * @param {{ emitEvent?: boolean }} [options]
     */
    sortBy(id: string, dir: "asc" | "desc", options?: {
        emitEvent?: boolean;
    }): void;
    #private;
}
export type RowanTableCellType = "text" | "number" | "date" | "badge" | "link" | "checkbox" | "switch" | "button" | "icon-button" | "avatar" | "chip" | "progress" | "custom";
export type RowanTableRow = Record<string, unknown>;
export type RowanTableCellContext = {
    value: unknown;
    row: RowanTableRow;
    rowIndex: number;
    column: RowanTableColumn;
    cellEl: HTMLElement;
};
export type RowanTableCellConfig = {
    type?: RowanTableCellType;
    href?: string | ((value: unknown, row: RowanTableRow) => string);
    target?: string;
    label?: string | ((value: unknown, row: RowanTableRow) => string);
    variant?: string;
    tone?: string | ((value: unknown, row: RowanTableRow) => string);
    disabled?: boolean | ((value: unknown, row: RowanTableRow) => boolean);
    checked?: boolean | ((value: unknown, row: RowanTableRow) => boolean);
    indeterminate?: boolean | ((value: unknown, row: RowanTableRow) => boolean);
    title?: string | ((value: unknown, row: RowanTableRow) => string);
    icon?: string;
    slot?: string;
    render?: (context: RowanTableCellContext) => Node | string | void;
};
export type RowanTableColumn = {
    id: string;
    header?: string;
    type?: RowanTableCellType;
    width?: string;
    minWidth?: string;
    align?: "start" | "center" | "end";
    sortable?: boolean;
    sortDir?: "asc" | "desc" | null;
    sticky?: "start" | "end";
    hidden?: boolean;
    accessor?: string | ((row: RowanTableRow, rowIndex: number) => unknown);
    format?: (value: unknown, row: RowanTableRow, rowIndex: number) => string;
    cell?: RowanTableCellConfig;
    headerCell?: {
        tooltip?: string;
    };
};
export type RowanTableSort = {
    id: string;
    dir: "asc" | "desc";
};
export type RowanTablePage = {
    index: number;
    size: number;
    total?: number;
};
export type RowanTableConfig = {
    columns?: RowanTableColumn[];
    rows?: RowanTableRow[];
    rowId?: string | ((row: RowanTableRow, rowIndex: number) => string);
    selectable?: "none" | "single" | "multiple";
    selected?: string[];
    sort?: RowanTableSort | null;
    caption?: string;
    density?: "sm" | "md" | "lg";
    stickyHeader?: boolean;
    loading?: boolean;
    page?: RowanTablePage | null;
    virtualized?: boolean;
    virtualItemSize?: number;
    virtualOverscan?: number;
};
import { BaseElement } from "../lib/base-element.js";
