/**
 * @param {string} text
 * @returns {string[][]}
 */
export function parseTsv(text: string): string[][];
/**
 * @param {object} column
 * @param {string} text
 * @param {Record<string, unknown>} messages
 */
export function parsePasteValue(
  column: object,
  text: string,
  messages: Record<string, unknown>,
): {
  ok: boolean;
  value: any;
  message: string;
};
/**
 * @param {object} host
 * @param {string} text
 */
export function pasteTable(
  host: object,
  text: string,
): Promise<
  | {
      pasted: boolean;
      applied: never[];
      rejected: never[];
      ignored: number;
    }
  | {
      rowId: any;
      columnId: any;
      matrix: string[][];
      targets: {
        rowId: any;
        columnId: any;
        rowIndex: any;
        row: any;
        column: any;
        text: any;
        value: any;
        invalid: boolean;
        message: string;
      }[];
      ignored: number;
      pasted: boolean;
      applied: never[];
      rejected: never[];
    }
  | {
      rowId: any;
      columnId: any;
      matrix: string[][];
      targets: {
        rowId: any;
        columnId: any;
        rowIndex: any;
        row: any;
        column: any;
        text: any;
        value: any;
        invalid: boolean;
        message: string;
      }[];
      ignored: number;
      pasted: boolean;
      prevented: boolean;
      applied: never[];
      rejected: never[];
    }
  | {
      rowId: any;
      columnId: any;
      applied: {
        rowId: any;
        columnId: any;
        value: any;
      }[];
      rejected: (
        | {
            rowId: any;
            columnId: any;
            value: any;
            message: string;
          }
        | {
            message: string;
            cancelled: boolean;
            rowId: any;
            columnId: any;
            value: any;
          }
      )[];
      ignored: number;
      pasted: boolean;
    }
>;
/**
 * @param {object} host
 */
export function pasteFromClipboard(host: object): Promise<
  | {
      pasted: boolean;
      applied: never[];
      rejected: never[];
      ignored: number;
    }
  | {
      rowId: any;
      columnId: any;
      applied: {
        rowId: any;
        columnId: any;
        value: any;
      }[];
      rejected: (
        | {
            rowId: any;
            columnId: any;
            value: any;
            message: string;
          }
        | {
            message: string;
            cancelled: boolean;
            rowId: any;
            columnId: any;
            value: any;
          }
      )[];
      ignored: number;
      pasted: boolean;
    }
  | {
      pasted: boolean;
      error: any;
      applied: never[];
      rejected: never[];
    }
>;
