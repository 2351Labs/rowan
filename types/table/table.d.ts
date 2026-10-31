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
 * @attr {boolean} resizable-columns
 * @attr {boolean} reorderable-columns
 * @attr {"cell"|"row"} edit-mode - `cell` edits one cell. `row` edits every editable cell in the row.
 * @attr {"client"|"server"} data-mode - `client` pages, sorts, and groups local rows. `server` asks `dataSource.getRows` instead. Default `client`.
 * @attr {string} locale
 * @property {object} config - Replaces the complete table configuration.
 * @property {Array<object>} columns - Updates columns without replacing other configuration.
 * @property {Array<object>} rows - Updates rows without replacing other configuration.
 * @property {Array<string>} selected - Updates selected row IDs without replacing other configuration.
 * @property {boolean} virtualized - Renders a measured, bounded row window inside the table viewport.
 * @property {number} virtualItemSize - Estimated row height used before a row is measured.
 * @property {number} virtualOverscan - Extra rows mounted before and after the visible window.
 * @property {RowanTableMessages} messages - Property-only built-in message overrides.
 * @property {object | null} dataSource - Server reads. `getRows({ page, pageSize, sort, filters, signal })` returns `{ rows, total }`. Optional `debounce` replaces the 200ms filter delay. Ignored when `data-mode` is `client`.
 * @property {Array<{ id: string, value: string }>} filters - Column filters sent to `dataSource`. Assigning them resets to the first page and is debounced. Client mode ignores them.
 * @slot toolbar - View controls. Shares the table's outer chrome; nested cards drop their own border.
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
 * @event rowan-row-activate - Fired on row activation by keyboard or double click. Not fired from interactive cells, and not fired when `rowActivate` is `none`.
 * @event rowan-group-toggle - Fired when a group header is expanded or collapsed by the user
 * @event rowan-column-resize - Fired when a column is resized. `detail` contains columnId, width, and columns array.
 * @event rowan-column-reorder - Fired when columns are reordered. `detail` contains fromIndex, toIndex, and columns array.
 * @event rowan-edit-start - Fired before a cell editor opens. Cancelable.
 * @event rowan-edit-validate - Fired before a cell or row commit, after `required` and `validate`. Cancelable. `preventDefault()` keeps the editor open. Not part of the commit event, so a rejected value is never delivered to commit listeners. `detail.message` is the error text; listeners may replace it.
 * @event rowan-edit-commit - Fired when a cell value is accepted. Cancelable.
 * @event rowan-edit-cancel - Fired when a cell edit is discarded.
 * @event rowan-row-edit-commit - Fired when every editable cell in a row is valid. Cancelable. `detail.values` and `detail.oldValues` are keyed by column id.
 * @event rowan-row-edit-cancel - Fired when a row edit is discarded.
 * @event rowan-data-request - Fired before a server read. Cancelable. `detail` is `{ page, pageSize, sort, filters }`. `preventDefault()` skips the request.
 * @event rowan-data-load - Fired after `getRows` resolves. `detail` includes `rows`, `total`, and the query.
 * @event rowan-data-error - Fired when `getRows` rejects. `detail.error` is the Error. The error row offers retry.
 * @event rowan-copy - Fired before a clipboard write. Cancelable. `detail.text` is TSV and `detail.html` is an HTML table. Listeners may replace either, or `detail.rows`.
 * @event rowan-export - Fired before a CSV or Excel download. Cancelable. `detail` includes `format`, `filename`, `header`, `rows`, and `truncated`. Listeners may replace `filename` or `rows`.
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
  set resizableColumns(value: boolean);
  get resizableColumns(): boolean;
  set reorderableColumns(value: boolean);
  get reorderableColumns(): boolean;
  set dataMode(value: string | null);
  get dataMode(): string | null;
  set dataSource(value: null);
  get dataSource(): null;
  set filters(value: any[]);
  get filters(): any[];
  set editMode(value: string | null);
  get editMode(): string | null;
  set locale(value: string);
  get locale(): string;
  /** @param {RowanTableMessages | null | undefined} value */
  set messages(value: RowanTableMessages | null | undefined);
  /** @returns {RowanTableMessages} */
  get messages(): RowanTableMessages;
  /** @param {string | RowanTableGroupBy | null | undefined} value */
  set groupBy(value: RowanTableGroupBy | null);
  /** @returns {RowanTableGroupBy | null} */
  get groupBy(): RowanTableGroupBy | null;
  /** @param {"dblclick" | "none"} value */
  set rowActivate(value: "dblclick" | "none");
  /** @returns {"dblclick" | "none"} */
  get rowActivate(): "dblclick" | "none";
  /** @returns {RowanTableRow[]} */
  get selectedRows(): Record<string, unknown>[];
  selectAll(): void;
  clearSelection(): void;
  /**
   * @param {string} id
   * @param {"asc" | "desc"} dir
   * @param {{ emitEvent?: boolean }} [options]
   */
  sortBy(
    id: string,
    dir: "asc" | "desc",
    options?:
      | {
          emitEvent?: boolean | undefined;
        }
      | undefined,
  ): void;
  /**
   * Copy selected rows, or the focused cell when nothing is selected, as TSV and an HTML table.
   * @param {{ includeHeaders?: boolean, columns?: string[], scope?: "selected" | "page" | "all" | "cell", formatValues?: boolean, guardFormulas?: boolean }} [options]
   */
  copyToClipboard(
    options?:
      | {
          includeHeaders?: boolean | undefined;
          columns?: string[] | undefined;
          scope?: "selected" | "cell" | "page" | "all" | undefined;
          formatValues?: boolean | undefined;
          guardFormulas?: boolean | undefined;
        }
      | undefined,
  ): Promise<
    | {
        copied: boolean;
        prevented: boolean;
        text: string;
        html: string;
        header: any;
        rows: any;
        columns: any;
        includeHeaders: any;
        scope: any;
      }
    | {
        copied: boolean;
        text: string;
        html: string;
        header: any;
        rows: any;
        columns: any;
        includeHeaders: any;
        scope: any;
      }
    | {
        copied: boolean;
        error: any;
        text: string;
        html: string;
        header: any;
        rows: any;
        columns: any;
        includeHeaders: any;
        scope: any;
      }
  >;
  /**
   * Download a CSV file. In server mode the loaded page is exported unless `getRows` supplies the full set.
   * @param {{ filename?: string, columns?: string[], scope?: "all" | "selected" | "page", includeHeaders?: boolean, formatValues?: boolean, guardFormulas?: boolean, getRows?: () => Promise<RowanTableRow[] | { rows: RowanTableRow[] }> }} [options]
   */
  exportCsv(
    options?:
      | {
          filename?: string | undefined;
          columns?: string[] | undefined;
          scope?: "selected" | "page" | "all" | undefined;
          includeHeaders?: boolean | undefined;
          formatValues?: boolean | undefined;
          guardFormulas?: boolean | undefined;
          getRows?:
            | (() => Promise<
                | RowanTableRow[]
                | {
                    rows: RowanTableRow[];
                  }
              >)
            | undefined;
        }
      | undefined,
  ): Promise<
    | {
        exported: boolean;
        format: "csv" | "xlsx";
        error?: undefined;
      }
    | {
        exported: boolean;
        prevented: boolean;
        format: "csv" | "xlsx";
        filename: any;
        scope: any;
        includeHeaders: any;
        columns: any;
        header: any;
        rows: any;
        cells: any;
        truncated: any;
        error?: undefined;
      }
    | {
        csv: string;
        blob: Blob;
        exported: boolean;
        format: "csv" | "xlsx";
        filename: any;
        scope: any;
        includeHeaders: any;
        columns: any;
        header: any;
        rows: any;
        cells: any;
        truncated: any;
        error?: undefined;
      }
    | {
        bytes: Uint8Array;
        blob: Blob;
        exported: boolean;
        format: "csv" | "xlsx";
        filename: any;
        scope: any;
        includeHeaders: any;
        columns: any;
        header: any;
        rows: any;
        cells: any;
        truncated: any;
        error?: undefined;
      }
    | {
        exported: boolean;
        format: "csv" | "xlsx";
        error: any;
      }
  >;
  /**
   * Download a real .xlsx workbook. Options match `exportCsv`.
   * @param {{ filename?: string, columns?: string[], scope?: "all" | "selected" | "page", includeHeaders?: boolean, formatValues?: boolean, guardFormulas?: boolean, getRows?: () => Promise<RowanTableRow[] | { rows: RowanTableRow[] }> }} [options]
   */
  exportExcel(
    options?:
      | {
          filename?: string | undefined;
          columns?: string[] | undefined;
          scope?: "selected" | "page" | "all" | undefined;
          includeHeaders?: boolean | undefined;
          formatValues?: boolean | undefined;
          guardFormulas?: boolean | undefined;
          getRows?:
            | (() => Promise<
                | RowanTableRow[]
                | {
                    rows: RowanTableRow[];
                  }
              >)
            | undefined;
        }
      | undefined,
  ): Promise<
    | {
        exported: boolean;
        format: "csv" | "xlsx";
        error?: undefined;
      }
    | {
        exported: boolean;
        prevented: boolean;
        format: "csv" | "xlsx";
        filename: any;
        scope: any;
        includeHeaders: any;
        columns: any;
        header: any;
        rows: any;
        cells: any;
        truncated: any;
        error?: undefined;
      }
    | {
        csv: string;
        blob: Blob;
        exported: boolean;
        format: "csv" | "xlsx";
        filename: any;
        scope: any;
        includeHeaders: any;
        columns: any;
        header: any;
        rows: any;
        cells: any;
        truncated: any;
        error?: undefined;
      }
    | {
        bytes: Uint8Array;
        blob: Blob;
        exported: boolean;
        format: "csv" | "xlsx";
        filename: any;
        scope: any;
        includeHeaders: any;
        columns: any;
        header: any;
        rows: any;
        cells: any;
        truncated: any;
        error?: undefined;
      }
    | {
        exported: boolean;
        format: "csv" | "xlsx";
        error: any;
      }
  >;
  #private;
}
export type RowanTableCellType =
  | "text"
  | "number"
  | "date"
  | "badge"
  | "link"
  | "checkbox"
  | "switch"
  | "button"
  | "icon-button"
  | "avatar"
  | "chip"
  | "progress"
  | "sparkline"
  | "bullet"
  | "custom";
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
  interactive?: boolean | undefined;
  ranges?: unknown[] | ((value: unknown, row: RowanTableRow) => unknown[]) | undefined;
  slot?: string | undefined;
  render?: ((context: RowanTableCellContext) => Node | string | void) | undefined;
};
export type RowanTableColumnEditor = {
  type?: "number" | "select" | "text" | "date" | "checkbox" | "custom" | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  options?:
    | {
        value: unknown;
        label: string;
      }[]
    | undefined;
  render?: ((context: RowanTableEditContext) => HTMLElement) | undefined;
};
export type RowanTableEditContext = {
  value: unknown;
  row: RowanTableRow;
  rowIndex: number;
  column: RowanTableColumn;
  cellEl: HTMLElement;
  commit: () => void;
  cancel: () => void;
};
export type RowanTableColumn = {
  id: string;
  header?: string | undefined;
  type?: RowanTableCellType | undefined;
  width?: string | undefined;
  minWidth?: string | undefined;
  align?: "center" | "start" | "end" | undefined;
  verticalAlign?: "center" | "start" | "end" | undefined;
  sortable?: boolean | undefined;
  sortDir?: "desc" | "asc" | null | undefined;
  sticky?: "start" | "end" | undefined;
  hidden?: boolean | undefined;
  accessor?: string | ((row: RowanTableRow, rowIndex: number) => unknown) | undefined;
  format?: ((value: unknown, row: RowanTableRow, rowIndex: number) => string) | undefined;
  cell?: RowanTableCellConfig | undefined;
  headerCell?:
    | {
        tooltip?: string | undefined;
      }
    | undefined;
  editable?: boolean | ((row: RowanTableRow, rowIndex: number) => boolean) | undefined;
  /**
   * - Empty values cannot commit. Checkbox columns must be checked.
   */
  required?: boolean | undefined;
  /**
   * - Return true to accept a value, or an error message to keep the editor open.
   */
  validate?: ((value: unknown, row: RowanTableRow) => true | string | false) | undefined;
  editor?: RowanTableColumnEditor | undefined;
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
  groupBy?: string | RowanTableGroupBy | null | undefined;
  rowActivate?: "dblclick" | "none" | undefined;
};
export type RowanTableGroupBy = {
  id: string;
  subtotals?: boolean | undefined;
  collapsed?: boolean | undefined;
};
export type RowanTableDensity = "sm" | "md" | "lg";
export type RowanTableSelectable = "none" | "single" | "multiple";
export type RowanTableMessages = {
  action?: string | undefined;
  checkbox?: string | undefined;
  empty?: string | undefined;
  emptyGroup?: string | undefined;
  groupLabel?: string | ((context: { label: string; count: number }) => string) | undefined;
  loading?: string | undefined;
  nextPage?: string | undefined;
  paginationEmpty?: string | undefined;
  paginationLabel?: string | undefined;
  paginationStatus?:
    string | ((context: { from: number; to: number; total: number }) => string) | undefined;
  previousPage?: string | undefined;
  resizeColumn?: string | ((context: { header: string }) => string) | undefined;
  selectAllRows?: string | undefined;
  selectRow?: string | ((context: { rowId: string }) => string) | undefined;
  subtotal?: string | undefined;
  switch?: string | undefined;
  editCell?: string | undefined;
  cancelEdit?: string | undefined;
  commitEdit?: string | undefined;
  required?: string | undefined;
  invalidValue?: string | undefined;
  loadError?: string | undefined;
  loadingRows?: string | undefined;
  retry?: string | undefined;
  rowsLoaded?: string | ((context: { count: number }) => string) | undefined;
  rowsFailed?: string | undefined;
  copiedRows?: string | ((context: { count: number }) => string) | undefined;
  copiedCell?: string | undefined;
  nothingToCopy?: string | undefined;
  copyFailed?: string | undefined;
  exportedFile?: string | ((context: { filename: string }) => string) | undefined;
  exportFailed?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
