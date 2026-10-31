export function createEditor(
  type: any,
  value: any,
  column: any,
  context: any,
  messages: any,
): Promise<any>;
export function beginCellEdit(
  ctx: any,
  editing: any,
  rowEditing: any,
  rowId: any,
  columnId: any,
  initialValue: any,
): Promise<void> | undefined;
export function beginRowEdit(
  ctx: any,
  editing: any,
  rowEditing: any,
  rowId: any,
): Promise<void> | undefined;
