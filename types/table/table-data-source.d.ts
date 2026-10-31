/**
 * Server-mode session. Loaded only when `data-mode="server"`.
 * Owns paging math, the error row, the status text, and the fetch lifecycle.
 * @param {object} host
 */
export function attachServerTable(host: object): {
  rows: () => never[];
  isBusy: () => boolean;
  hasError: () => boolean;
  markUnloaded(): void;
  cancel: () => void;
  queue: (debounce: any) => void;
  onSort(): void;
  onFilters(): void;
  changePage(nextIndex: any): void;
  retainSelection(ordered: any, selection: any): any;
  syncStatus(status: any): void;
  renderError(tbody: any): void;
  buildView(): {
    entries: {
      row: never;
      rowIndex: number;
      rowId: any;
    }[];
    rows: {
      visibleIndex: number;
      kind: string;
      row: never;
      rowIndex: number;
      rowId: any;
    }[];
    dataRows: {
      visibleIndex: number;
      kind: string;
      row: never;
      rowIndex: number;
      rowId: any;
    }[];
    renderRows: {
      kind: string;
      row: never;
      rowIndex: number;
      rowId: any;
    }[];
    a11yRows: null;
    pageInfo: {
      index: number;
      size: number;
      total: number;
      totalPages: number;
      start: number;
      end: number;
    };
    hasDuplicateRowIds: any;
  };
};
