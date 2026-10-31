export function createEditor(
  type: any,
  value: any,
  column: any,
  context: any,
  messages: any,
): Promise<any>;
export function startRowEditing(
  table: any,
  rowId: any,
  getRowFromElement: any,
  columns: any,
  isColumnEditable: any,
  resolveValue: any,
  createEditorFn: any,
  _messages: any,
): Promise<{
  rowId: any;
  row: any;
  rowIndex: any;
  cellEditors: {
    column: any;
    td: any;
    editor: any;
    originalContent: any;
  }[];
  originalValues: {};
} | null>;
export function commitRowEditing(rowEditState: any): {
  newValues: {};
  oldValues: {};
} | null;
export function stopRowEditing(rowEditState: any): void;
