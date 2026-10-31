export function createEditor(
  type: any,
  value: any,
  column: any,
  context: any,
  messages: any,
): Promise<any>;
/**
 * Apply a value that did not come from an open editor. Uses the same validation
 * and `rowan-edit-commit` path as a cell edit. Does not paint an error; the caller does.
 * @param {object} ctx
 * @param {{ rowId: string, rowIndex: number, row: object, column: object, value: unknown }} target
 */
export function commitExternalCell(
  ctx: object,
  target: {
    rowId: string;
    rowIndex: number;
    row: object;
    column: object;
    value: unknown;
  },
):
  | {
      ok: boolean;
      message: string;
      cancelled?: undefined;
    }
  | {
      ok: boolean;
      cancelled: boolean;
      message: string;
    };
/** @param {HTMLElement | null} td @param {string} message */
export function paintCellError(td: HTMLElement | null, message: string): void;
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
