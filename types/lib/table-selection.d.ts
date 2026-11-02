export function isRowanTable(value: any): boolean;
export function resolveRowanTable(host: any, table: any, tableId: any): any;
export function observeTableAvailability(host: any, tableId: any, onAvailable: any): () => void;
export function readTableSelection(table: any): {
  selected: any;
  selectedRows: any[];
};
/**
 * Notifies when `columns` is assigned or replaced.
 * Before `rowan-table` is defined, assignments are trapped.
 * After upgrade, the prototype setter reports later replacements,
 * including column-menu hide and show.
 */
export function observeTableColumns(table: any, onChange: any): () => void;
export function observeTableSelection(table: any, onChange: any): () => void;
