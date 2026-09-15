export function isRowanTable(value: any): boolean;
export function resolveRowanTable(host: any, table: any, tableId: any): any;
export function observeTableAvailability(host: any, tableId: any, onAvailable: any): () => void;
export function readTableSelection(table: any): {
    selected: any;
    selectedRows: any[];
};
export function observeTableSelection(table: any, onChange: any): () => void;
