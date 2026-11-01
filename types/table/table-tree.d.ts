export function buildClient(host: any): {
  entries: any;
  rows: any[];
  dataRows: any[];
  renderRows: any[];
  a11yRows: null;
  pageInfo: any;
  hasDuplicateRowIds: any;
};
export function augmentServer(
  host: any,
  view: any,
): {
  entries: any;
  rows: any[];
  dataRows: any[];
  renderRows: any[];
  a11yRows: null;
  pageInfo: any;
  hasDuplicateRowIds: any;
};
export function exportEntries(host: any): any[];
export function toggle(host: any, rowId: any): void;
export function onKey(host: any, key: any, rowId: any): void;
export function expandAll(host: any): void;
export function collapseAll(host: any): void;
export function retry(host: any, parentId: any): void;
export function decorate(tr: any, entry: any, host: any): void;
export function statusRow(entry: any, columns: any, host: any): HTMLTableRowElement;
