/**
 * Config-driven data table.
 * @tag rowan-table
 * @attr {"none"|"single"|"multiple"} selectable
 * @attr {"sm"|"md"|"lg"} density
 * @attr {boolean} sticky-header
 * @attr {boolean} loading
 * @attr {string} caption
 * @attr {boolean} caption-visually-hidden
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
 * @event rowan-cell-action - Fired when a link or button cell activates. Cancelable; preventDefault on a link action to block navigation.
 * @event rowan-cell-bind - Fired once for each cloned custom slot cell
 * @event rowan-page-change - Fired when pagination changes. `detail.index` is 0-based; `detail.page` is 1-based.
 * @event rowan-row-activate - Fired on row activation by keyboard or double click
 */
export class RowanTable extends BaseElement {
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    /** @param {RowanTableConfig | null | undefined} value */
    set config(value: RowanTableConfig | null | undefined);
    /** @returns {RowanTableConfig} */
    get config(): RowanTableConfig;
    set caption(value: string);
    get caption(): string;
    set captionVisuallyHidden(value: boolean);
    get captionVisuallyHidden(): boolean;
    /** @param {RowanTableDensity} value */
    set density(value: RowanTableDensity);
    /** @returns {RowanTableDensity} */
    get density(): RowanTableDensity;
    /** @param {RowanTableSelectable} value */
    set selectable(value: RowanTableSelectable);
    /** @returns {RowanTableSelectable} */
    get selectable(): RowanTableSelectable;
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
    set sort(value: RowanTableSort | null);
    /** @returns {RowanTableSort | null} */
    get sort(): RowanTableSort | null;
    /** @param {RowanTablePage | null} value */
    set page(value: RowanTablePage | null);
    /** @returns {RowanTablePage | null} */
    get page(): RowanTablePage | null;
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
        emitEvent?: boolean | undefined;
    } | undefined): void;
    #private;
}
export type RowanTableCellType = "text" | "number" | "date" | "badge" | "link" | "checkbox" | "switch" | "button" | "icon-button" | "avatar" | "chip" | "progress" | "sparkline" | "custom";
export type RowanTableRow = Record<string, unknown>;
export type RowanTableCellContext = {
    value: unknown;
    row: RowanTableRow;
    rowIndex: number;
    column: RowanTableColumn;
    cellEl: HTMLElement;
};
export type RowanTableCellConfig = {
    type?: RowanTableCellType | undefined;
    href?: string | ((value: unknown, row: RowanTableRow) => string) | undefined;
    target?: string | undefined;
    label?: string | ((value: unknown, row: RowanTableRow) => string) | undefined;
    variant?: string | undefined;
    tone?: string | ((value: unknown, row: RowanTableRow) => string) | undefined;
    disabled?: boolean | ((value: unknown, row: RowanTableRow) => boolean) | undefined;
    checked?: boolean | ((value: unknown, row: RowanTableRow) => boolean) | undefined;
    indeterminate?: boolean | ((value: unknown, row: RowanTableRow) => boolean) | undefined;
    title?: string | ((value: unknown, row: RowanTableRow) => string) | undefined;
    icon?: string | undefined;
    slot?: string | undefined;
    render?: ((context: RowanTableCellContext) => Node | string | void) | undefined;
};
export type RowanTableColumn = {
    id: string;
    header?: string | undefined;
    type?: RowanTableCellType | undefined;
    width?: string | undefined;
    minWidth?: string | undefined;
    align?: "center" | "start" | "end" | undefined;
    sortable?: boolean | undefined;
    sortDir?: "desc" | "asc" | null | undefined;
    sticky?: "start" | "end" | undefined;
    hidden?: boolean | undefined;
    accessor?: string | ((row: RowanTableRow, rowIndex: number) => unknown) | undefined;
    format?: ((value: unknown, row: RowanTableRow, rowIndex: number) => string) | undefined;
    cell?: RowanTableCellConfig | undefined;
    headerCell?: {
        tooltip?: string | undefined;
    } | undefined;
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
    columns?: RowanTableColumn[] | undefined;
    rows?: Record<string, unknown>[] | undefined;
    rowId?: string | ((row: RowanTableRow, rowIndex: number) => string) | undefined;
    selectable?: "none" | "single" | "multiple" | undefined;
    selected?: string[] | undefined;
    sort?: RowanTableSort | null | undefined;
    caption?: string | undefined;
    captionVisuallyHidden?: boolean | undefined;
    density?: "sm" | "md" | "lg" | undefined;
    stickyHeader?: boolean | undefined;
    loading?: boolean | undefined;
    page?: RowanTablePage | null | undefined;
    virtualized?: boolean | undefined;
    virtualItemSize?: number | undefined;
    virtualOverscan?: number | undefined;
};
export type RowanTableDensity = "sm" | "md" | "lg";
export type RowanTableSelectable = "none" | "single" | "multiple";
import { BaseElement } from "../lib/base-element.js";
